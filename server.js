require("dotenv").config({ path: require("path").join(__dirname, ".env.local") });
const express = require("express");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { transcribe } = require("./pipeline/transcribe");
const { generateSlides } = require("./pipeline/generateSlides");
const { syncTalkingHead } = require("./pipeline/syncTalkingHead");
const { preprocessVideo } = require("./pipeline/preprocess");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createWatchdog } = require("./pipeline/watchdog");

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
  if (o === "https://presto-lake.vercel.app") {
    res.setHeader("Access-Control-Allow-Origin", "https://presto-lake.vercel.app");
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

function validateUploadToken(header, secret) {
  if (!header || !secret) return false;
  const parts = header.split(":");
  if (parts.length !== 3) return false;
  const [expiresAt, nonce, sig] = parts;
  if (Date.now() > Number(expiresAt)) return false; // expired
  const payload = `${expiresAt}:${nonce}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

app.use((req, res, next) => {
  if (req.path === "/health") return next();
  if (!API_SECRET) {
    console.warn("WARNING: RENDER_API_SECRET not set — server is unprotected");
    return next();
  }
  const apiKey = req.headers["x-api-key"];
  const uploadToken = req.headers["x-upload-token"];
  if (apiKey === API_SECRET) return next();
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

// --- In-memory job store ---
// jobId → { status, step, createdAt, videoPath, wavPath, transcriptPath, outputPath, talkingHeadPublicPath, error, originalName, mimeType }
const jobs = new Map();

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

function renderVideo(compositionId, inputProps) {
  return new Promise((resolve, reject) => {
    const safeCompositionId = compositionId.replace(/[^a-zA-Z0-9_\-]/g, "_");
    const filename = `${safeCompositionId}_${uuidv4()}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, filename);
    execFile(
      remotionBin,
      [
        "render",
        compositionId,
        outputPath,
        "--props",
        JSON.stringify(inputProps),
        "--concurrency=1",
      ],
      { cwd: __dirname, timeout: 30 * 60 * 1000 },
      (err, _stdout, stderr) => {
        if (err) return reject(new Error(`Remotion render failed: ${stderr}`));
        resolve(filename); // return filename only, not full path
      }
    );
  });
}

// --- Pipeline orchestrator ---
async function runPipeline(jobId, videoPath, themeOverride = null) {
  try {
    // Step 1: Preprocess — validate, trim silences (>4s → 2s), compress if needed
    jobs.set(jobId, { ...jobs.get(jobId), status: "preprocessing", step: "preprocessing" });
    console.log(`[${jobId}] preprocessing...`);
    const preprocessResult = await preprocessVideo(videoPath, "/tmp");
    const effectiveVideoPath = preprocessResult.outputPath;
    if (preprocessResult.trimmed || preprocessResult.compressed) {
      jobs.set(jobId, { ...jobs.get(jobId), trimmedVideoPath: preprocessResult.outputPath });
      console.log(`[${jobId}] preprocessed: ${preprocessResult.originalDuration.toFixed(0)}s → ${preprocessResult.trimmedDuration.toFixed(0)}s, ${preprocessResult.silencesFound} silences removed, compressed=${preprocessResult.compressed}`);
    }

    // Step 2: Transcribe the (trimmed) video
    jobs.set(jobId, { ...jobs.get(jobId), status: "transcribing", step: "transcribing" });
    console.log(`[${jobId}] transcribing...`);
    const transcript = await transcribe(effectiveVideoPath, jobId);

    // Step 3: Generate slides from transcript
    jobs.set(jobId, {
      ...jobs.get(jobId),
      status: "generating_slides",
      step: "generating_slides",
      mp3Path: transcript._mp3Path,
      transcriptPath: transcript._transcriptPath,
    });
    console.log(`[${jobId}] generating slides (theme selection + content)...`);
    const { compositionId, themeId, slides, transitionFrames } = await generateSlides(transcript, themeOverride);

    // Step 4: Sync talking head + face tracking
    jobs.set(jobId, { ...jobs.get(jobId), status: "syncing", step: "syncing" });
    console.log(`[${jobId}] syncing talking head (themeId=${themeId}, compositionId=${compositionId}, transitionFrames=${transitionFrames})...`);
    const { inputProps, talkingHeadPublicPath } = await syncTalkingHead({
      slides,
      videoPath: effectiveVideoPath,
      compositionId,
      jobId,
      transitionFrames,
    });
    jobs.set(jobId, { ...jobs.get(jobId), talkingHeadPublicPath });

    // Step 5: Render with Remotion
    jobs.set(jobId, { ...jobs.get(jobId), status: "rendering", step: "rendering" });
    console.log(`[${jobId}] rendering with Remotion (${compositionId})...`);
    const outputPath = await renderVideo(compositionId, inputProps);

    jobs.set(jobId, { ...jobs.get(jobId), status: "done", step: "done", outputFilename: outputPath });
    console.log("[pipeline done]", "jobId=" + jobId);
  } catch (e) {
    console.error("[pipeline error]", "jobId=" + jobId, e.message);
    jobs.set(jobId, { ...jobs.get(jobId), status: "error", error: e.message });

    // Clean up temp files on failure
    const job = jobs.get(jobId);
    const tempFiles = [
      job.videoPath,
      job.trimmedVideoPath,
      job.wavPath,
      job.transcriptPath,
      job.talkingHeadPublicPath,
    ].filter(Boolean);
    tempFiles.forEach((f) => fs.unlink(f, () => {}));
  }
}

// --- Routes ---

// POST /pipeline/start — upload video, start async pipeline
app.post("/pipeline/start", upload.single("video"), (req, res) => {
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

  // Disk space check
  execFile("df", ["-B1", "--output=avail", "/tmp"], (err, stdout) => {
    if (err) {
      fs.unlink(req.file.path, () => {});
      return res.status(500).json({ error: "Failed to check disk space" });
    }
    const avail = parseInt(stdout.trim().split("\n").pop(), 10);
    if (avail < 2 * 1024 * 1024 * 1024) {
      fs.unlink(req.file.path, () => {});
      return res.status(507).json({ error: "Insufficient disk space" });
    }

    const jobId = uuidv4();
    const videoPath = req.file.path;

    jobs.set(jobId, {
      status: "uploading",
      step: "uploading",
      createdAt: Date.now(),
      videoPath,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
    });

    // Fire-and-forget
    runPipeline(jobId, videoPath, themeOverride);

    res.json({ jobId });
  });
});

// GET /pipeline/:jobId/status
app.get("/pipeline/:jobId/status", (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);
  if (!job) return res.status(404).json({ error: "Job not found" });

  maybeCleanup(job, jobId);

  // Return safe subset (no internal paths)
  res.json({
    jobId,
    status: job.status,
    step: job.step,
    ...(job.error ? { error: job.error } : {}),
  });
});

// GET /pipeline/:jobId/download — serve MP4 when done
app.get("/pipeline/:jobId/download", (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);
  if (!job) return res.status(404).json({ error: "Job not found" });
  if (job.status !== "done") return res.status(409).json({ error: "Job not done" });
  if (!job.outputFilename) return res.status(404).json({ error: "Output file not found" });
  // Use directory listing as allowlist — path comes from filesystem, not from stored/user data
  const found = fs.readdirSync(OUTPUT_DIR).find((f) => f === job.outputFilename);
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
        console.error("[render] Failed:", stderr);
        return res.status(500).json({ error: "Render failed", details: stderr });
      }
      console.log("[render] Done:", outputPath);
      res.json({ success: true, file: safeFilename, path: outputPath });
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

setInterval(() => {
  const now = Date.now();
  let swept = 0;

  for (const [jobId, job] of jobs) {
    if (job.createdAt && now - job.createdAt > JOB_TTL) {
      const files = [
        job.videoPath,
        job.wavPath,
        job.transcriptPath,
        job.outputPath,
        job.talkingHeadPublicPath,
        job.trimmedVideoPath,
      ].filter(Boolean);
      files.forEach((f) => fs.unlink(f, () => {}));
      jobs.delete(jobId);
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

  if (swept > 0) console.log(`[sweep] Cleaned up ${swept} stale jobs/files`);
}, SWEEP_INTERVAL);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Remotion render server listening on :${PORT}`));
