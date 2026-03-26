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

// nosemgrep: javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
// CSRF not applicable: stateless JSON API authenticated via X-API-Key header, not cookies/sessions
const app = express(); // nosemgrep
app.use(express.json());

// API key auth — all routes require X-API-Key header matching RENDER_API_SECRET env var
const API_SECRET = process.env.RENDER_API_SECRET;
app.use((req, res, next) => {
  if (req.path === "/health") return next();
  if (!API_SECRET) {
    console.warn("WARNING: RENDER_API_SECRET not set — server is unprotected");
    return next();
  }
  if (req.headers["x-api-key"] !== API_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

const OUTPUT_DIR = path.join(__dirname, "output");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// --- Multer config: diskStorage to avoid OOM on large uploads ---
const upload = multer({
  storage: multer.diskStorage({
    destination: "/tmp",
    filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
  }),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

// --- In-memory job store ---
// jobId → { status, step, createdAt, videoPath, wavPath, transcriptPath, outputPath, talkingHeadPublicPath, error }
const jobs = new Map();

// TTL cleanup: delete temp files on /status poll after 1hr
function maybeCleanup(job, jobId) {
  if (job.createdAt && Date.now() - job.createdAt > 60 * 60 * 1000) {
    const files = [
      job.wavPath,
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
async function runPipeline(jobId, videoPath) {
  try {
    // Step 1: Preprocess — trim long silences (>4s) from the video
    jobs.set(jobId, { ...jobs.get(jobId), status: "preprocessing", step: "preprocessing" });
    console.log(`[${jobId}] preprocessing (trimming silences)...`);
    const trimmedPath = `/tmp/${jobId}_trimmed.mp4`;
    const preprocessResult = await preprocessVideo(videoPath, trimmedPath);
    const effectiveVideoPath = preprocessResult.trimmed ? trimmedPath : videoPath;
    if (preprocessResult.trimmed) {
      jobs.set(jobId, { ...jobs.get(jobId), trimmedVideoPath: trimmedPath });
      console.log(`[${jobId}] trimmed ${preprocessResult.originalDuration.toFixed(0)}s → ${preprocessResult.trimmedDuration.toFixed(0)}s (removed ${preprocessResult.silencesFound} silences)`);
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
      wavPath: transcript._wavPath,
      transcriptPath: transcript._transcriptPath,
    });
    console.log(`[${jobId}] generating slides (theme selection + content)...`);
    const { compositionId, themeId, slides, transitionFrames } = await generateSlides(transcript);

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

  const jobId = uuidv4();
  const videoPath = req.file.path;

  jobs.set(jobId, {
    status: "uploading",
    step: "uploading",
    createdAt: Date.now(),
    videoPath,
  });

  // Fire-and-forget
  runPipeline(jobId, videoPath);

  res.json({ jobId });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Remotion render server listening on :${PORT}`));
