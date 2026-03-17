const express = require("express");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

// nosemgrep: javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
// CSRF not applicable: this is a stateless JSON API authenticated via X-API-Key header, not cookies/sessions
const app = express(); // nosemgrep
app.use(express.json());

// API key auth — all routes require X-API-Key header matching RENDER_API_SECRET env var
const API_SECRET = process.env.RENDER_API_SECRET;
app.use((req, res, next) => {
  if (req.path === "/health") return next(); // health check is public
  if (!API_SECRET) {
    console.warn("WARNING: RENDER_API_SECRET not set — server is unprotected");
    return next();
  }
  if (req.headers["x-api-key"] !== API_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

const OUTPUT_DIR = "/tmp/renders";
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// POST /render — trigger a render job
app.post("/render", (req, res) => {
  const { compositionId = "Presentation", filename = "output.mp4" } = req.body;

  const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9_\-\.]/g, "_");
  const outputPath = path.join(OUTPUT_DIR, safeFilename);

  console.log(`[render] Starting: ${compositionId} → ${outputPath}`);

  const remotionBin = path.join(__dirname, "node_modules", ".bin", "remotion");

  execFile(
    remotionBin,
    ["render", compositionId, outputPath],
    { cwd: __dirname, timeout: 30 * 60 * 1000 }, // 30 min timeout
    (err, stdout, stderr) => {
      if (err) {
        console.error("[render] Failed:", stderr);
        return res.status(500).json({ error: "Render failed", details: stderr });
      }
      console.log("[render] Done:", outputPath);
      res.json({ success: true, file: safeFilename, path: outputPath });
    }
  );
});

// GET /download/:filename — download a rendered file
app.get("/download/:filename", (req, res) => {
  const safeFilename = path.basename(req.params.filename).replace(/[^a-zA-Z0-9_\-\.]/g, "_");
  const filePath = path.join(OUTPUT_DIR, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.download(filePath);
});

// GET /health
app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Remotion render server listening on :${PORT}`));
