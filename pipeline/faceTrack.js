/**
 * faceTrack.js — Extract face position keypoints from a video.
 *
 * Extracts frames at ~2fps using ffmpeg, runs BlazeFace face detection via
 * TensorFlow.js, and returns an array of { t, x, y } keypoints (normalized
 * 0-1) representing the face center at each sample. An exponential moving
 * average is applied to smooth jitter.
 *
 * The Remotion TalkingHead component uses these keypoints to set objectPosition
 * dynamically, keeping the speaker's face centered in the circular crop.
 */

const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Lazy-load heavy deps so the module can be required without immediate cost
let _tf = null;
let _faceDetection = null;
let _canvas = null;

function getTf() {
  if (!_tf) _tf = require("@tensorflow/tfjs-node");
  return _tf;
}

function getFaceDetection() {
  if (!_faceDetection)
    _faceDetection = require("@tensorflow-models/face-detection");
  return _faceDetection;
}

function getCanvas() {
  if (!_canvas) _canvas = require("canvas");
  return _canvas;
}

let _detector = null;

async function getDetector() {
  if (_detector) return _detector;
  const tf = getTf();
  const faceDetection = getFaceDetection();
  _detector = await faceDetection.createDetector(
    faceDetection.SupportedModels.MediaPipeFaceDetector,
    { runtime: "tfjs", maxFaces: 1 }
  );
  return _detector;
}

/**
 * Extract frames from video at the given fps rate into a temp directory.
 * Returns the directory path containing frame_0001.jpg, frame_0002.jpg, ...
 */
async function extractFrames(videoPath, fps = 2) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "facetrack-"));
  const outputPattern = path.join(tmpDir, "frame_%04d.jpg");

  await new Promise((resolve, reject) => {
    execFile(
      "ffmpeg",
      [
        "-y",
        "-i", videoPath,
        "-vf", `fps=${fps},scale=320:-1`,
        "-q:v", "8",
        outputPattern,
      ],
      { timeout: 3 * 60 * 1000 },
      (err, _stdout, stderr) => {
        if (err) return reject(new Error(`ffmpeg frame extraction failed: ${stderr}`));
        resolve();
      }
    );
  });

  const files = fs.readdirSync(tmpDir)
    .filter((f) => f.startsWith("frame_") && f.endsWith(".jpg"))
    .sort();

  return { tmpDir, files };
}

/**
 * Load a JPEG file into a TensorFlow.js tensor suitable for face detection.
 */
async function loadImageAsTensor(imagePath) {
  const tf = getTf();
  const { loadImage } = getCanvas();
  const img = await loadImage(imagePath);
  const canvas = getCanvas().createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  // Create a 3-channel tensor (RGB) from RGBA image data
  const tensor = tf.tidy(() => {
    const raw = tf.tensor3d(
      new Uint8Array(imageData.data),
      [img.height, img.width, 4]
    );
    return raw.slice([0, 0, 0], [-1, -1, 3]); // drop alpha
  });
  return { tensor, width: img.width, height: img.height };
}

/**
 * Apply exponential moving average to smooth face position jitter.
 */
function smoothKeypoints(keypoints, alpha = 0.4) {
  if (keypoints.length === 0) return keypoints;

  const smoothed = [keypoints[0]];
  for (let i = 1; i < keypoints.length; i++) {
    const prev = smoothed[i - 1];
    const curr = keypoints[i];
    smoothed.push({
      t: curr.t,
      x: alpha * curr.x + (1 - alpha) * prev.x,
      y: alpha * curr.y + (1 - alpha) * prev.y,
    });
  }
  return smoothed;
}

/**
 * Main entry point: extract face tracking keypoints from a video.
 *
 * @param {string} videoPath - absolute path to video file
 * @param {object} [options]
 * @param {number} [options.sampleFps=2] - frames per second to sample
 * @param {number} [options.smoothingAlpha=0.4] - EMA smoothing (0=smooth, 1=raw)
 * @returns {Promise<Array<{ t: number, x: number, y: number }>>}
 *   Normalized coordinates: x,y in [0,1] where 0,0 = top-left.
 *   Returns empty array if no faces detected (caller should default to center).
 */
async function extractFaceTrack(videoPath, options = {}) {
  const { sampleFps = 2, smoothingAlpha = 0.4 } = options;

  console.log(`[faceTrack] extracting frames at ${sampleFps}fps...`);
  const { tmpDir, files } = await extractFrames(videoPath, sampleFps);

  if (files.length === 0) {
    console.warn("[faceTrack] no frames extracted");
    return [];
  }

  console.log(`[faceTrack] ${files.length} frames, running face detection...`);
  const detector = await getDetector();
  const tf = getTf();

  const rawKeypoints = [];
  let lastGoodPoint = { x: 0.5, y: 0.4 }; // default: center-ish, slightly above middle

  for (let i = 0; i < files.length; i++) {
    const framePath = path.join(tmpDir, files[i]);
    const t = i / sampleFps; // timestamp in seconds

    try {
      const { tensor, width, height } = await loadImageAsTensor(framePath);
      const faces = await detector.estimateFaces(tensor);
      tensor.dispose();

      if (faces.length > 0) {
        const face = faces[0];
        // face.box = { xMin, yMin, xMax, yMax, width, height }
        const box = face.box;
        const cx = (box.xMin + box.width / 2) / width;
        const cy = (box.yMin + box.height / 2) / height;
        // Clamp to [0, 1]
        const x = Math.max(0, Math.min(1, cx));
        const y = Math.max(0, Math.min(1, cy));
        lastGoodPoint = { x, y };
        rawKeypoints.push({ t, x, y });
      } else {
        // No face detected — hold last known position
        rawKeypoints.push({ t, ...lastGoodPoint });
      }
    } catch (err) {
      // Frame failed — hold last known position
      console.warn(`[faceTrack] frame ${i} failed: ${err.message}`);
      rawKeypoints.push({ t, ...lastGoodPoint });
    }
  }

  // Cleanup temp frames
  files.forEach((f) => {
    try { fs.unlinkSync(path.join(tmpDir, f)); } catch (_) {}
  });
  try { fs.rmdirSync(tmpDir); } catch (_) {}

  const smoothed = smoothKeypoints(rawKeypoints, smoothingAlpha);
  console.log(`[faceTrack] done — ${smoothed.length} keypoints`);

  return smoothed;
}

module.exports = { extractFaceTrack };
