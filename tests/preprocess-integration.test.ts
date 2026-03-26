/**
 * Integration tests for the full preprocessVideo pipeline.
 * Requires ffmpeg/ffprobe in PATH — tests are skipped if unavailable.
 * Migrated from plain Node.js to Vitest.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execFileSync } from "child_process";
import fs from "fs";

const { preprocessVideo } = require("../pipeline/preprocess");

let ffmpegAvailable = false;
const fixtures: string[] = [];

function tryGenerate(args: string[], outPath: string) {
  execFileSync("ffmpeg", args, { timeout: 30_000, stdio: "pipe" });
  fixtures.push(outPath);
}

beforeAll(() => {
  try {
    execFileSync("ffprobe", ["-version"], { stdio: "pipe" });
    ffmpegAvailable = true;
  } catch {
    ffmpegAvailable = false;
    return;
  }

  try {
    tryGenerate(
      ["-y", "-filter_complex", "nullsrc=s=320x240:d=35:r=1[v]",
       "-map", "[v]", "-c:v", "libx264", "-preset", "ultrafast", "-t", "35",
       "/tmp/test_int_no_audio.mp4"],
      "/tmp/test_int_no_audio.mp4"
    );
    tryGenerate(
      ["-y", "-filter_complex", "nullsrc=s=320x240:d=10:r=1[v];anullsrc=r=16000:cl=mono[a]",
       "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "ultrafast",
       "-c:a", "aac", "-t", "10",
       "/tmp/test_int_too_short.mp4"],
      "/tmp/test_int_too_short.mp4"
    );
    tryGenerate(
      ["-y", "-filter_complex", "nullsrc=s=320x240:d=35:r=1[v];anullsrc=r=16000:cl=mono[a]",
       "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "ultrafast",
       "-c:a", "aac", "-t", "35",
       "/tmp/test_int_silent_video.mp4"],
      "/tmp/test_int_silent_video.mp4"
    );
    tryGenerate(
      ["-y", "-filter_complex", "anullsrc=r=16000:cl=mono[a]",
       "-map", "[a]", "-c:a", "pcm_s16le", "-t", "35",
       "/tmp/test_int_silent_audio.wav"],
      "/tmp/test_int_silent_audio.wav"
    );
  } catch {
    // Handled per-test
  }
});

afterAll(() => {
  for (const f of fixtures) {
    try { fs.unlinkSync(f); } catch {}
  }
  try { fs.unlinkSync("/tmp/test_int_corrupt.mp4"); } catch {}
});

describe("preprocessVideo (integration)", () => {
  it.skipIf(!ffmpegAvailable)("rejects video with no audio", async () => {
    await expect(preprocessVideo("/tmp/test_int_no_audio.mp4", "/tmp"))
      .rejects.toThrow("Video has no audio track");
  });

  it.skipIf(!ffmpegAvailable)("rejects video shorter than 30s", async () => {
    await expect(preprocessVideo("/tmp/test_int_too_short.mp4", "/tmp"))
      .rejects.toThrow("File must be at least 30 seconds");
  });

  it.skipIf(!ffmpegAvailable)("handles entirely silent video gracefully", async () => {
    const result = await preprocessVideo("/tmp/test_int_silent_video.mp4", "/tmp");
    expect(result.hasVideo).toBe(true);
    expect(result.hasAudio).toBe(true);
    expect(result.originalDuration).toBeGreaterThanOrEqual(34);
    if (result.trimmed) {
      expect(result.trimmedDuration).toBeLessThan(10);
      expect(fs.existsSync(result.outputPath)).toBe(true);
    }
  });

  it.skipIf(!ffmpegAvailable)("handles audio-only file", async () => {
    const result = await preprocessVideo("/tmp/test_int_silent_audio.wav", "/tmp");
    expect(result.hasVideo).toBe(false);
    expect(result.hasAudio).toBe(true);
    expect(result.compressed).toBe(false);
    expect(result.originalDuration).toBeGreaterThanOrEqual(34);
  });

  it.skipIf(!ffmpegAvailable)("rejects non-existent file", async () => {
    await expect(preprocessVideo("/tmp/nope_not_here.mp4", "/tmp"))
      .rejects.toThrow("ffprobe failed");
  });

  it.skipIf(!ffmpegAvailable)("rejects corrupt file", async () => {
    fs.writeFileSync("/tmp/test_int_corrupt.mp4", "corrupt data here");
    await expect(preprocessVideo("/tmp/test_int_corrupt.mp4", "/tmp"))
      .rejects.toThrow("ffprobe failed");
  });
});
