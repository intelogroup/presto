#!/usr/bin/env node
/**
 * rerender.js — regenerate slides and re-render without re-running Whisper.
 *
 * Usage:
 *   node scripts/rerender.js \
 *     --transcript output/transcripts/<jobId>.json \
 *     --video      public/<jobId>_talkinghead.mp4 \
 *     [--out       output/my_rerender.mp4]
 *
 * The transcript JSON must be a Whisper verbose_json response (has .text and .segments).
 * These are saved automatically by the server at output/transcripts/<jobId>.json.
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });

const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");
const { generateSlides } = require("../pipeline/generateSlides");
const { syncTalkingHead } = require("../pipeline/syncTalkingHead");

// --- CLI arg parsing ---
const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

const transcriptArg = flag("--transcript");
const videoArg = flag("--video");
const outArg = flag("--out") || "output/rerender.mp4";

if (!transcriptArg || !videoArg) {
  console.error("Usage: node scripts/rerender.js --transcript <path> --video <path> [--out <path>]");
  process.exit(1);
}

const ROOT = path.join(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");
const transcriptPath = path.resolve(transcriptArg);
const videoPath = path.resolve(videoArg);
const outputPath = path.resolve(OUTPUT_DIR, path.basename(outArg));

// Ensure output stays inside output/ regardless of what --out contains
if (!outputPath.startsWith(OUTPUT_DIR + path.sep)) {
  console.error("Output path must be inside the output/ directory.");
  process.exit(1);
}

if (!fs.existsSync(transcriptPath)) {
  console.error(`Transcript not found: ${transcriptPath}`);
  process.exit(1);
}
if (!fs.existsSync(videoPath)) {
  console.error(`Video not found: ${videoPath}`);
  process.exit(1);
}

// --- Main ---
async function main() {
  console.log(`[rerender] transcript : ${transcriptPath}`);
  console.log(`[rerender] video      : ${videoPath}`);
  console.log(`[rerender] output     : ${outputPath}`);

  // Load transcript (Whisper verbose_json format)
  const raw = JSON.parse(fs.readFileSync(transcriptPath, "utf-8"));
  const transcript = {
    text: raw.text,
    segments: (raw.segments || []).map((s) => ({ start: s.start, end: s.end, text: s.text })),
    words: (raw.words || []).map((w) => ({ word: w.word, start: w.start, end: w.end })),
  };

  if (!transcript.text || !transcript.segments.length) {
    console.error("Transcript is empty or missing segments.");
    process.exit(1);
  }

  // Phase 1: generate slides
  console.log(`[rerender] generating slides (${transcript.segments.length} segments)...`);
  const { compositionId, themeId, slides, transitionFrames } = await generateSlides(transcript);
  console.log(`[rerender] theme=${themeId}, compositionId=${compositionId}, slides=${slides.length}, tf=${transitionFrames}`);

  // Phase 2: sync talking head (copies video to public/, adjusts last slide for drift)
  const jobId = `rerender_${Date.now()}`;
  console.log(`[rerender] syncing talking head...`);
  const { inputProps } = await syncTalkingHead({ slides, videoPath, compositionId, jobId, transitionFrames });

  // Phase 3: Remotion render
  const remotionBin = path.join(ROOT, "node_modules", ".bin", "remotion");
  console.log(`[rerender] rendering ${compositionId} → ${outputPath}...`);
  await new Promise((resolve, reject) => {
    execFile(
      remotionBin,
      ["render", compositionId, outputPath, "--props", JSON.stringify(inputProps), "--concurrency=1"],
      { cwd: ROOT, timeout: 30 * 60 * 1000 },
      (err, _stdout, stderr) => {
        if (err) return reject(new Error(`Remotion render failed:\n${stderr}`));
        resolve();
      }
    );
  });

  console.log(`[rerender] done → ${outputPath}`);
}

main().catch((e) => {
  console.error("[rerender] error:", e.message);
  process.exit(1);
});
