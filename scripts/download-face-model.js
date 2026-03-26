#!/usr/bin/env node
/**
 * download-face-model.js — Download and cache BlazeFace model weights locally.
 *
 * Run during Docker build or CI to avoid runtime CDN fetches:
 *   node scripts/download-face-model.js
 *
 * The model is saved to models/blazeface-short/ and loaded by pipeline/faceTrack.js.
 */

const path = require("path");
const fs = require("fs");

async function main() {
  const tf = require("@tensorflow/tfjs-node");
  const tfconv = require("@tensorflow/tfjs-converter");

  const modelDir = path.join(__dirname, "..", "models", "blazeface-short");
  const modelJsonPath = path.join(modelDir, "model.json");

  if (fs.existsSync(modelJsonPath)) {
    console.log(`[download-face-model] model already exists at ${modelDir}`);
    return;
  }

  console.log("[download-face-model] downloading BlazeFace short-range model from TFHub...");
  const model = await tfconv.loadGraphModel(
    "https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1",
    { fromTFHub: true }
  );

  fs.mkdirSync(modelDir, { recursive: true });
  await model.save(`file://${modelDir}`);
  console.log(`[download-face-model] saved to ${modelDir}`);

  // Verify
  const files = fs.readdirSync(modelDir);
  console.log(`[download-face-model] files: ${files.join(", ")}`);
}

main().catch((e) => {
  console.error("[download-face-model] failed:", e.message);
  process.exit(1);
});
