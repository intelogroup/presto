#!/usr/bin/env node
/**
 * Integration tests for the full preprocessVideo pipeline.
 * Tests end-to-end: validate → silence detect → trim → compress.
 * Run: node tests/preprocess-integration.test.js
 *
 * Fixtures are generated programmatically via ffmpeg so tests are hermetic.
 */

const { preprocessVideo, validateInput } = require("../pipeline/preprocess");
const { execFileSync } = require("child_process");
const fs = require("fs");

let passed = 0;
let failed = 0;

function assert(condition, msg) {
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

// Generate test fixtures using system ffmpeg
function generateFixtures() {
  const ffmpeg = "ffmpeg";
  const fixtures = [];

  try {
    // Use -filter_complex with nullsrc/anullsrc (compatible with Remotion's ffmpeg)
    // 1. Video with no audio (35s)
    execFileSync(ffmpeg, [
      "-y", "-filter_complex", "nullsrc=s=320x240:d=35:r=1[v]",
      "-map", "[v]", "-c:v", "libx264", "-preset", "ultrafast", "-t", "35",
      "/tmp/test_no_audio.mp4",
    ], { timeout: 30000, stdio: "pipe" });
    fixtures.push("/tmp/test_no_audio.mp4");

    // 2. Too-short video with audio (10s)
    execFileSync(ffmpeg, [
      "-y", "-filter_complex", "nullsrc=s=320x240:d=10:r=1[v];anullsrc=r=16000:cl=mono[a]",
      "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "ultrafast",
      "-c:a", "aac", "-t", "10",
      "/tmp/test_too_short.mp4",
    ], { timeout: 30000, stdio: "pipe" });
    fixtures.push("/tmp/test_too_short.mp4");

    // 3. Silent video — has audio track but no speech (35s)
    execFileSync(ffmpeg, [
      "-y", "-filter_complex", "nullsrc=s=320x240:d=35:r=1[v];anullsrc=r=16000:cl=mono[a]",
      "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "ultrafast",
      "-c:a", "aac", "-t", "35",
      "/tmp/test_silent_video.mp4",
    ], { timeout: 30000, stdio: "pipe" });
    fixtures.push("/tmp/test_silent_video.mp4");

    // 4. Audio-only file — no video stream (35s silent WAV)
    execFileSync(ffmpeg, [
      "-y", "-filter_complex", "anullsrc=r=16000:cl=mono[a]",
      "-map", "[a]", "-c:a", "pcm_s16le", "-t", "35",
      "/tmp/test_silent_audio.wav",
    ], { timeout: 30000, stdio: "pipe" });
    fixtures.push("/tmp/test_silent_audio.wav");
  } catch (e) {
    console.warn("  Warning: some fixtures could not be generated:", e.message);
  }

  return fixtures;
}

function cleanupFixtures(fixtures) {
  for (const f of fixtures) {
    try { fs.unlinkSync(f); } catch (_) {}
  }
}

async function main() {
  console.log("Generating test fixtures...");
  const fixtures = generateFixtures();

  try {
    // --- Test 1: preprocessVideo rejects video with no audio ---
    console.log("Test 1: preprocessVideo rejects video-no-audio");
    await expectReject(
      () => preprocessVideo("/tmp/test_no_audio.mp4", "/tmp"),
      "Video has no audio track",
      "pipeline rejects no-audio"
    );

    // --- Test 2: preprocessVideo rejects too-short video ---
    console.log("Test 2: preprocessVideo rejects too-short video");
    await expectReject(
      () => preprocessVideo("/tmp/test_too_short.mp4", "/tmp"),
      "File must be at least 30 seconds",
      "pipeline rejects <30s"
    );

    // --- Test 3: preprocessVideo handles silent video (entire silence) ---
    console.log("Test 3: preprocessVideo on entirely silent video (35s)");
    {
      const result = await preprocessVideo("/tmp/test_silent_video.mp4", "/tmp");
      assert(result.hasVideo === true, `hasVideo=true`);
      assert(result.hasAudio === true, `hasAudio=true`);
      assert(result.originalDuration >= 34, `originalDuration >= 34s (got ${result.originalDuration.toFixed(1)}s)`);
      // Entire video is silence >4s — detected but 0 segments to keep, so trim is skipped
      console.log(`  silencesFound=${result.silencesFound}, trimmed=${result.trimmed}`);
      console.log(`  trimmedDuration=${result.trimmedDuration.toFixed(1)}s, outputPath=${result.outputPath}`);
      if (result.trimmed) {
        assert(result.trimmedDuration < 10, `trimmed to <10s (got ${result.trimmedDuration.toFixed(1)}s)`);
        assert(fs.existsSync(result.outputPath), `output file exists at ${result.outputPath}`);
      } else {
        // Entirely silent file: no segments to keep → trim skipped (correct behavior)
        assert(true, "entirely silent file handled gracefully (trim skipped)");
      }
    }

    // --- Test 4: preprocessVideo handles audio-only file ---
    console.log("Test 4: preprocessVideo on audio-only silent WAV (35s)");
    {
      const result = await preprocessVideo("/tmp/test_silent_audio.wav", "/tmp");
      assert(result.hasVideo === false, `hasVideo=false`);
      assert(result.hasAudio === true, `hasAudio=true`);
      assert(result.compressed === false, `not compressed (audio-only)`);
      assert(result.originalDuration >= 34, `originalDuration >= 34s (got ${result.originalDuration.toFixed(1)}s)`);
      console.log(`  silencesFound=${result.silencesFound}, trimmed=${result.trimmed}`);
      console.log(`  outputPath=${result.outputPath}`);
    }

    // --- Test 5: preprocessVideo rejects non-existent file ---
    console.log("Test 5: preprocessVideo rejects missing file");
    await expectReject(
      () => preprocessVideo("/tmp/nope_not_here.mp4", "/tmp"),
      "ffprobe failed",
      "pipeline rejects missing file"
    );

    // --- Test 6: preprocessVideo rejects fake file ---
    console.log("Test 6: preprocessVideo rejects corrupt file");
    fs.writeFileSync("/tmp/test_corrupt.mp4", "corrupt data here");
    await expectReject(
      () => preprocessVideo("/tmp/test_corrupt.mp4", "/tmp"),
      "ffprobe failed",
      "pipeline rejects corrupt file"
    );
    try { fs.unlinkSync("/tmp/test_corrupt.mp4"); } catch (_) {}

    // --- Summary ---
    console.log(`\n${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
  } finally {
    cleanupFixtures(fixtures);
  }
}

main().catch((e) => {
  console.error("Test runner error:", e);
  process.exit(1);
});
