#!/usr/bin/env node
/**
 * run-pipeline-cli.js — run full pipeline (transcribe → slides → render) from CLI.
 * Saves transcript to output/transcripts/<jobId>.json for future rerenders.
 *
 * Usage:
 *   node scripts/run-pipeline-cli.js --video public/<file>.mp4 [--out rerender_v5.mp4]
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });

const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");
const { transcribe } = require("../pipeline/transcribe");
const { generateSlides } = require("../pipeline/generateSlides");
const { syncTalkingHead } = require("../pipeline/syncTalkingHead");

const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
}

const videoArg = flag("--video");
const outArg = flag("--out") || `rerender_${Date.now()}.mp4`;

if (!videoArg) {
  console.error("Usage: node scripts/run-pipeline-cli.js --video <path> [--out <filename>]");
  process.exit(1);
}

const ROOT = path.join(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "output");
const videoPath = path.resolve(videoArg);
const outputPath = path.join(OUTPUT_DIR, path.basename(outArg));

if (!fs.existsSync(videoPath)) {
  console.error(`Video not found: ${videoPath}`);
  process.exit(1);
}

async function main() {
  const jobId = `cli_${Date.now()}`;
  console.log(`[pipeline] jobId=${jobId}`);
  console.log(`[pipeline] video: ${videoPath}`);

  console.log("[pipeline] transcribing...");
  const transcript = await transcribe(videoPath, jobId);
  console.log(`[pipeline] ${transcript.segments.length} segments transcribed`);

  console.log("[pipeline] generating slides...");
  const { compositionId, themeId, slides, transitionFrames } = await generateSlides(transcript);
  console.log(`[pipeline] theme=${themeId}, ${slides.length} slides, tf=${transitionFrames}`);

  console.log("[pipeline] syncing talking head...");
  const { inputProps } = await syncTalkingHead({ slides, videoPath, compositionId, jobId, transitionFrames });

  const remotionBin = path.join(ROOT, "node_modules", ".bin", "remotion");
  console.log(`[pipeline] rendering ${compositionId} → ${outputPath}`);
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

  console.log(`[pipeline] done → ${outputPath}`);
  console.log(`[pipeline] transcript saved → output/transcripts/${jobId}.json`);
  console.log(`[pipeline] next rerender: node scripts/rerender.js --transcript output/transcripts/${jobId}.json --video ${videoArg}`);
}

main().catch((e) => {
  console.error("[pipeline] error:", e.message);
  process.exit(1);
});
