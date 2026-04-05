require("dotenv").config({ path: require("path").join(__dirname, ".env.local") });
const express = require("express");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { createClient } = require("@supabase/supabase-js");
const { transcribe } = require("./pipeline/transcribe");
const { generateSlides } = require("./pipeline/generateSlides");
const { syncTalkingHead } = require("./pipeline/syncTalkingHead");
const { preprocessVideo } = require("./pipeline/preprocess");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createWatchdog } = require("./pipeline/watchdog");
const { renderMediaOnLambda } = require("@remotion/lambda-client");

// Supabase client initialized with service role key for backend writes
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// nosemgrep: javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
// CSRF not applicable: stateless JSON API authenticated via X-API-Key header, not cookies/sessions
const app = express(); // nosemgrep
app.use(helmet());
// Request logging — skip /health to avoid noise
app.use(morgan("combined", {
  skip: (req) => req.path === "/health",
}));
app.use(express.json());

// CORS: allow browser direct uploads from Vercel frontend and local dev
// Explicit literals only — never reflect user-supplied Origin header (CWE-346)
app.use((req, res, next) => {
  const o = req.headers.origin;
  if (o === "https://prestashot.vercel.app") {
    res.setHeader("Access-Control-Allow-Origin", "https://prestashot.vercel.app");
  } else if (o === "http://localhost:3000") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  } else if (o === "http://localhost:3001") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  } else if (o === "http://localhost:3002") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3002");
  } else if (o === "http://localhost:3003") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3003");
  }
  if (res.getHeader("Access-Control-Allow-Origin")) {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "x-api-key, x-upload-token, content-type");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// API key auth — all routes require X-API-Key header matching RENDER_API_SECRET env var
// OR a short-lived HMAC upload token (x-upload-token) for large direct uploads from clients
const API_SECRET = process.env.RENDER_API_SECRET;
const { createHmac, timingSafeEqual } = require("crypto");

// Nonce tracking: nonce → expiresAt (ms). Prevents upload token replay within TTL window.
// NOTE: in-memory only — replay protection does not survive restarts or span multiple instances.
// For multi-instance deployments, replace with a shared TTL store (Redis / DynamoDB conditional put).
const usedNonces = new Map();

function validateUploadToken(header, secret) {
  if (!header || !secret) return false;
  const parts = header.split(":");
  if (parts.length !== 3) return false;
  const [expiresAt, nonce, sig] = parts;
  const expiresAtMs = Number(expiresAt);
  if (Date.now() > expiresAtMs) return false; // expired
  if (usedNonces.has(nonce)) return false;    // already used (replay attack)
  const payload = `${expiresAt}:${nonce}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    if (!timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return false;
  } catch {
    return false;
  }
  usedNonces.set(nonce, expiresAtMs); // mark as used
  return true;
}

app.use((req, res, next) => {
  if (req.path === "/health") return next();
  if (!API_SECRET) {
    if (process.env.NODE_ENV === "production") {
      console.error("FATAL: RENDER_API_SECRET is not set in production — refusing to start");
      process.exit(1);
    }
    console.warn("WARNING: RENDER_API_SECRET not set — server is unprotected (dev mode)");
    return next();
  }
  const apiKey = req.headers["x-api-key"];
  const uploadToken = req.headers["x-upload-token"];
  if (apiKey && apiKey.length === API_SECRET.length) {
    try {
      if (timingSafeEqual(Buffer.from(apiKey), Buffer.from(API_SECRET))) return next();
    } catch { /* length mismatch or encoding error — fall through to 401 */ }
  }
  if (validateUploadToken(uploadToken, API_SECRET)) return next();
  return res.status(401).json({ error: "Unauthorized" });
});

const OUTPUT_DIR = path.join(__dirname, "output");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// --- Multer config: diskStorage to avoid OOM on large uploads ---
const upload = multer({
  storage: multer.diskStorage({
    destination: "/tmp",
    filename: (req, file, cb) => {
      // Extract extension safely — strip path components, allow only simple extensions
      const rawExt = path.extname(file.originalname).toLowerCase();
      const safeExt = /^\.[a-z0-9]{1,8}$/.test(rawExt) ? rawExt : "";
      cb(null, `${uuidv4()}${safeExt}`);
    },
  }),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

// --- Job helper functions (Supabase-backed) ---
async function getJob(jobId) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("job_id", jobId)
    .single();
  if (error) return null;
  return data;
}

async function upsertJob(jobId, updates) {
  const timestamp = Date.now();
  const { error } = await supabase
    .from("jobs")
    .upsert({
      job_id: jobId,
      last_progress_at: timestamp,
      ...updates,
    }, { onConflict: "job_id" });
  if (error) console.error(`[upsertJob] error: ${error.message}`);
  return !error;
}

// Fallback in-memory jobs Map for watchdog compatibility (jobs are also in Supabase)
const jobs = new Map();
const watchdog = createWatchdog(jobs, { stallMs: 30 * 60 * 1000 });

const MAX_CONCURRENT_JOBS = 10;

const ALLOWED_MIME_TYPES = new Set([
  "video/mp4", "video/quicktime", "video/webm", "video/x-msvideo", "video/x-matroska",
  "audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a", "audio/ogg", "audio/webm",
]);

// TTL cleanup: delete temp files on /status poll after 24hr
function maybeCleanup(job, jobId) {
  if (job.createdAt && Date.now() - job.createdAt > 24 * 60 * 60 * 1000) {
    const files = [
      job.mp3Path,
      job.transcriptPath,
      job.outputPath,
      job.talkingHeadPublicPath,
      job.trimmedVideoPath,
    ].filter(Boolean);
    files.forEach((f) => fs.unlink(f, () => {}));
    jobs.delete(jobId);
  }
}

// --- Remotion render helper ---
const remotionBin = path.join(__dirname, "node_modules", ".bin", "remotion");

async function renderVideo(compositionId, inputProps) {
  const safeCompositionId = compositionId.replace(/[^a-zA-Z0-9_\-]/g, "_");
  const filename = `${safeCompositionId}_${uuidv4()}.mp4`;

  try {
    const { renderId, bucketName } = await renderMediaOnLambda({
      region: process.env.AWS_REGION || "us-east-1",
      functionName: process.env.REMOTION_FUNCTION_NAME,
      serveUrl: process.env.REMOTION_SERVE_URL,
      composition: compositionId,
      inputProps,
      codec: "h264",
      framesPerLambda: 20,
      webhook: {
        url: `${process.env.SUPABASE_URL}/functions/v1/render-webhook`,
        secret: process.env.REMOTION_WEBHOOK_SECRET,
      },
    });

    // Return the renderId and bucket for later polling
    return { renderId, bucketName, filename };
  } catch (err) {
    throw new Error(`Remotion Lambda render failed: ${err.message}`);
  }
}

// --- Pipeline orchestrator ---
const PIPELINE_TIMEOUT_MS = 60 * 60 * 1000; // 60 minutes

async function runPipeline(jobId, videoPath, themeOverride = null) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PIPELINE_TIMEOUT_MS);

  try {
    // Step 1: Preprocess — validate, trim silences (>4s → 2s), compress if needed
    await upsertJob(jobId, { status: "preprocessing", step: "preprocessing" });
    console.log(`[${jobId}] preprocessing...`);
    const preprocessResult = await preprocessVideo(videoPath, "/tmp");
    const effectiveVideoPath = preprocessResult.outputPath;
    if (!fs.existsSync(effectiveVideoPath)) {
      throw new Error(`Preprocess produced no output file at ${path.basename(effectiveVideoPath)}`);
    }
    if (preprocessResult.trimmed || preprocessResult.compressed) {
      await upsertJob(jobId, { trimmed_video_path: preprocessResult.outputPath });
      console.log(`[${jobId}] preprocessed: ${preprocessResult.originalDuration.toFixed(0)}s → ${preprocessResult.trimmedDuration.toFixed(0)}s, ${preprocessResult.silencesFound} silences removed, compressed=${preprocessResult.compressed}`);
    }

    // Step 2: Transcribe the (trimmed) video
    await upsertJob(jobId, { status: "transcribing", step: "transcribing" });
    console.log(`[${jobId}] transcribing...`);
    const transcript = await transcribe(effectiveVideoPath, jobId);
    // Persist temp paths immediately so catch-block cleanup can delete them
    // even if the segments guard below throws.
    await upsertJob(jobId, {
      mp3_path: transcript._mp3Path,
      transcript_path: transcript._transcriptPath,
    });
    if (!transcript.segments || transcript.segments.length === 0) {
      throw new Error("Transcription returned no speech segments — video may be silent or too short");
    }

    // Step 3: Generate slides from transcript
    await upsertJob(jobId, {
      status: "generating_slides",
      step: "generating_slides",
    });
    console.log(`[${jobId}] generating slides (theme selection + content)...`);
    const { compositionId, themeId, slides, transitionFrames } = await generateSlides(transcript, themeOverride);
    if (!slides || slides.length === 0) {
      throw new Error("Slide generation returned no slides");
    }

    // Step 4: Sync talking head + face tracking
    await upsertJob(jobId, { status: "syncing", step: "syncing" });
    console.log(`[${jobId}] syncing talking head (themeId=${themeId}, compositionId=${compositionId}, transitionFrames=${transitionFrames})...`);
    const { inputProps, talkingHeadPublicPath } = await syncTalkingHead({
      slides,
      videoPath: effectiveVideoPath,
      compositionId,
      jobId,
      transitionFrames,
    });
    await upsertJob(jobId, { talking_head_public_path: talkingHeadPublicPath });

    // Step 5: Render with Remotion
    await upsertJob(jobId, { status: "rendering", step: "rendering" });
    console.log(`[${jobId}] rendering with Remotion (${compositionId})...`);
    const outputPath = await renderVideo(compositionId, inputProps);

    clearTimeout(timeoutId);
    await upsertJob(jobId, { status: "done", step: "done", output_filename: outputPath });
    console.log("[pipeline done]", "jobId=" + jobId);

    // Clean up intermediate files now that the render is complete.
    const job = await getJob(jobId);
    [job.video_path, job.trimmed_video_path, job.mp3_path, job.transcript_path]
      .filter(Boolean)
      .forEach((f) => fs.unlink(f, () => {}));
  } catch (e) {
    clearTimeout(timeoutId);
    const reason = controller.signal.aborted ? "Pipeline timed out after 60 minutes" : e.message;
    console.error("[pipeline error]", "jobId=" + jobId, reason);
    await upsertJob(jobId, { status: "error", error: reason });

    // Clean up temp files on failure
    const job = await getJob(jobId);
    const tempFiles = [
      job?.video_path,
      job?.trimmed_video_path,
      job?.mp3_path,
      job?.transcript_path,
      job?.talking_head_public_path,
    ].filter(Boolean);
    tempFiles.forEach((f) => fs.unlink(f, () => {}));
  }
}

// --- Routes ---

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute window
  max: 10,               // 10 uploads per IP per minute
  standardHeaders: true, // return RateLimit-* headers
  legacyHeaders: false,
  message: { error: "Too many upload requests, please try again in a minute" },
});

// POST /pipeline/start — upload video, start async pipeline
app.post("/pipeline/start", uploadLimiter, upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No video file uploaded" });

  // MIME type validation
  if (!ALLOWED_MIME_TYPES.has(req.file.mimetype)) {
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: "Unsupported file type" });
  }

  const themeOverride = req.body.themeOverride || null;

  // Max concurrent jobs check
  let activeCount = 0;
  for (const job of jobs.values()) {
    if (!["done", "error"].includes(job.status)) activeCount++;
  }
  if (activeCount >= MAX_CONCURRENT_JOBS) {
    fs.unlink(req.file.path, () => {});
    return res.status(429).json({ error: "Too many concurrent jobs, try again later" });
  }

  // Hard cap on total tracked jobs to prevent unbounded memory growth
  if (jobs.size >= 10_000) {
    fs.unlink(req.file.path, () => {});
    return res.status(503).json({ error: "Server at capacity, try again later" });
  }

  // Disk space check
  return new Promise((resolve) => {
    execFile("df", ["-B1", "--output=avail", "/tmp"], async (err, stdout) => {
      if (err) {
        fs.unlink(req.file.path, () => {});
        return resolve(res.status(500).json({ error: "Failed to check disk space" }));
      }
      const avail = parseInt(stdout.trim().split("\n").pop(), 10);
      if (avail < 2 * 1024 * 1024 * 1024) {
        fs.unlink(req.file.path, () => {});
        return resolve(res.status(507).json({ error: "Insufficient disk space" }));
      }

      const jobId = uuidv4();
      const videoPath = req.file.path;
      const createdAt = Date.now();

      // Insert job into Supabase
      const { error } = await supabase.from("jobs").insert({
        job_id: jobId,
        status: "uploading",
        step: "uploading",
        created_at: createdAt,
        video_path: videoPath,
        original_name: req.file.originalname,
        mime_type: req.file.mimetype,
        theme_override: themeOverride,
      });

      if (error) {
        fs.unlink(req.file.path, () => {});
        return resolve(res.status(500).json({ error: "Failed to create job" }));
      }

      // Also track in-memory for watchdog
      jobs.set(jobId, {
        status: "uploading",
        step: "uploading",
        createdAt,
        videoPath,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
      });

      // Fire-and-forget
      runPipeline(jobId, videoPath, themeOverride);

      resolve(res.json({ jobId }));
    });
  });
});

// GET /pipeline/:jobId/status
app.get("/pipeline/:jobId/status", async (req, res) => {
  const { jobId } = req.params;
  const job = await getJob(jobId);
  if (!job) return res.status(404).json({ error: "Job not found" });

  // TTL cleanup: delete job and temp files after 24hr
  if (job.created_at && Date.now() - job.created_at > 24 * 60 * 60 * 1000) {
    const files = [
      job.video_path,
      job.mp3_path,
      job.transcript_path,
      job.output_path,
      job.talking_head_public_path,
      job.trimmed_video_path,
    ].filter(Boolean);
    files.forEach((f) => fs.unlink(f, () => {}));
    await supabase.from("jobs").delete().eq("job_id", jobId);
    return res.status(404).json({ error: "Job not found" });
  }

  // Return safe subset (no internal paths)
  res.json({
    jobId,
    status: job.status,
    step: job.step,
    ...(job.error ? { error: job.error } : {}),
  });
});

// GET /pipeline/:jobId/download — serve MP4 when done
app.get("/pipeline/:jobId/download", async (req, res) => {
  const { jobId } = req.params;
  const job = await getJob(jobId);
  if (!job) return res.status(404).json({ error: "Job not found" });
  if (job.status !== "done") return res.status(409).json({ error: "Job not done" });
  if (!job.output_filename) return res.status(404).json({ error: "Output file not found" });
  // Use directory listing as allowlist — path comes from filesystem, not from stored/user data
  const found = fs.readdirSync(OUTPUT_DIR).find((f) => f === job.output_filename);
  if (!found) return res.status(404).json({ error: "Output file not found" });
  res.download(OUTPUT_DIR + path.sep + found);
});

// POST /render — original synchronous render (kept for backwards compat)
app.post("/render", (req, res) => {
  const { compositionId = "Presentation", filename = "output.mp4" } = req.body;
  const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9_\-\.]/g, "_");
  const outputPath = path.join(OUTPUT_DIR, safeFilename);

  console.log(`[render] Starting: ${compositionId} → ${outputPath}`);
  execFile(
    remotionBin,
    ["render", compositionId, outputPath, "--concurrency=1"],
    { cwd: __dirname, timeout: 30 * 60 * 1000 },
    (err, _stdout, stderr) => {
      if (err) {
        console.error("[render] Failed:", stderr); // log internally, never send to client
        return res.status(500).json({ error: "Render failed" });
      }
      console.log("[render] Done:", outputPath);
      res.json({ success: true, file: safeFilename }); // path removed — internal detail
    }
  );
});

// GET /download/:filename — download a rendered file (original route)
app.get("/download/:filename", (req, res) => {
  const safeFilename = path.basename(req.params.filename).replace(/[^a-zA-Z0-9_\-\.]/g, "_");
  // Use directory listing as allowlist — path built from filesystem entry, not user input
  const found = fs.readdirSync(OUTPUT_DIR).find((f) => f === safeFilename);
  if (!found) return res.status(404).json({ error: "File not found" });
  res.download(OUTPUT_DIR + path.sep + found);
});

// GET /health
app.get("/health", (_, res) => res.json({ status: "ok" }));

// --- Periodic sweep: clean up stale jobs and old output files every hour ---
const SWEEP_INTERVAL = 60 * 60 * 1000; // 1 hour
const JOB_TTL = 24 * 60 * 60 * 1000; // 24 hours

setInterval(async () => {
  const now = Date.now();
  let swept = 0;

  // Clean up stale jobs from Supabase
  const { data: staleJobs, error: queryError } = await supabase
    .from("jobs")
    .select("*")
    .lt("created_at", now - JOB_TTL);

  if (!queryError && staleJobs) {
    for (const job of staleJobs) {
      const files = [
        job.video_path,
        job.mp3_path,
        job.transcript_path,
        job.output_path,
        job.talking_head_public_path,
        job.trimmed_video_path,
      ].filter(Boolean);
      files.forEach((f) => fs.unlink(f, () => {}));
      await supabase.from("jobs").delete().eq("job_id", job.job_id);
      swept++;
    }
  }

  // Clean up old files in OUTPUT_DIR
  try {
    const outputFiles = fs.readdirSync(OUTPUT_DIR);
    for (const file of outputFiles) {
      const filePath = path.join(OUTPUT_DIR, file);
      try {
        const stat = fs.statSync(filePath);
        if (now - stat.mtimeMs > JOB_TTL) {
          fs.unlink(filePath, () => {});
          swept++;
        }
      } catch (_) { /* ignore stat errors */ }
    }
  } catch (_) { /* ignore readdir errors */ }

  // Sweep expired nonces (upload tokens are short-lived, typically 5 min TTL)
  for (const [nonce, expiresAt] of usedNonces) {
    if (now > expiresAt) usedNonces.delete(nonce);
  }

  if (swept > 0) console.log(`[sweep] Cleaned up ${swept} stale jobs/files`);
}, SWEEP_INTERVAL);

// Dead job watchdog: every 5 minutes, mark stalled jobs as error
watchdog.start(5 * 60 * 1000);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Remotion render server listening on :${PORT}`));

// Graceful shutdown: stop accepting new requests, wait up to 30s for in-flight to finish
const SHUTDOWN_TIMEOUT_MS = 30_000;

function gracefulShutdown(signal) {
  console.log(`[shutdown] Received ${signal} — stopping server`);
  server.close(() => {
    console.log("[shutdown] HTTP server closed. Exiting.");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("[shutdown] Timeout — forcing exit");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT",  () => gracefulShutdown("SIGINT"));
