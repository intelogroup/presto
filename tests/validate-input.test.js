#!/usr/bin/env node
/**
 * Integration tests for validateInput edge cases.
 * Tests: no-audio video, too-short video, silent video, silent audio-only.
 * Run: node tests/validate-input.test.js
 */

const { validateInput } = require("../pipeline/preprocess");

let passed = 0;
let failed = 0;

async function assert(condition, msg) {
  if (condition) {
    passed++;
    console.log(`  \u2713 ${msg}`);
  } else {
    failed++;
    console.error(`  \u2717 ${msg}`);
  }
}

async function expectReject(fn, expectedMsg, testName) {
  try {
    await fn();
    failed++;
    console.error(`  \u2717 ${testName}: should have thrown but didn't`);
  } catch (err) {
    if (err.message.includes(expectedMsg)) {
      passed++;
      console.log(`  \u2713 ${testName}: correctly rejected with "${err.message}"`);
    } else {
      failed++;
      console.error(`  \u2717 ${testName}: wrong error. Expected "${expectedMsg}", got "${err.message}"`);
    }
  }
}

async function main() {
  // --- Test 1: Video with NO audio stream → should reject ---
  console.log("Test 1: Video with no audio stream");
  await expectReject(
    () => validateInput("/tmp/test_no_audio.mp4"),
    "Video has no audio track",
    "reject video-no-audio"
  );

  // --- Test 2: Video that is too short (10s < 30s minimum) → should reject ---
  console.log("Test 2: Video too short (10s)");
  await expectReject(
    () => validateInput("/tmp/test_too_short.mp4"),
    "File must be at least 30 seconds",
    "reject too-short video"
  );

  // --- Test 3: Video WITH audio but total silence → should PASS validation ---
  // (silence is not a reason to reject — the video has an audio track)
  console.log("Test 3: Silent video (has audio track, just no speech)");
  {
    const info = await validateInput("/tmp/test_silent_video.mp4");
    await assert(info.hasVideo === true, "hasVideo=true");
    await assert(info.hasAudio === true, "hasAudio=true");
    await assert(info.duration >= 34, `duration >= 34s (got ${info.duration.toFixed(1)}s)`);
    await assert(info.videoCodec === "h264", `videoCodec=h264 (got ${info.videoCodec})`);
    await assert(info.audioCodec === "aac", `audioCodec=aac (got ${info.audioCodec})`);
    console.log("  (Silent video passes validation — silence trimming handles it later)");
  }

  // --- Test 4: Audio-only file (no video) → should PASS validation ---
  console.log("Test 4: Audio-only file (no video stream)");
  {
    const info = await validateInput("/tmp/test_silent_audio.wav");
    await assert(info.hasVideo === false, "hasVideo=false");
    await assert(info.hasAudio === true, "hasAudio=true");
    await assert(info.duration >= 34, `duration >= 34s (got ${info.duration.toFixed(1)}s)`);
    await assert(info.audioCodec !== null, `audioCodec present (got ${info.audioCodec})`);
    console.log("  (Audio-only accepted for PPTX pairing workflow)");
  }

  // --- Test 5: Non-existent file → should throw ---
  console.log("Test 5: Non-existent file");
  await expectReject(
    () => validateInput("/tmp/this_file_does_not_exist.mp4"),
    "ffprobe failed",
    "reject missing file"
  );

  // --- Test 6: Not a media file → should throw ---
  console.log("Test 6: Non-media file (text file renamed to .mp4)");
  const fs = require("fs");
  fs.writeFileSync("/tmp/test_fake_video.mp4", "this is not a video file");
  await expectReject(
    () => validateInput("/tmp/test_fake_video.mp4"),
    "ffprobe failed",
    "reject non-media file"
  );
  fs.unlinkSync("/tmp/test_fake_video.mp4");

  // --- Summary ---
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error("Test runner error:", e);
  process.exit(1);
});
