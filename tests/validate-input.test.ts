/**
 * Integration tests for validateInput edge cases.
 * Requires ffmpeg/ffprobe in PATH — tests are skipped if unavailable.
 * Migrated from plain Node.js to Vitest.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execFileSync } from "child_process";
import fs from "fs";

const { validateInput } = require("../pipeline/preprocess");

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

  // Generate fixtures
  try {
    tryGenerate(
      ["-y", "-filter_complex", "nullsrc=s=320x240:d=35:r=1[v]",
       "-map", "[v]", "-c:v", "libx264", "-preset", "ultrafast", "-t", "35",
       "/tmp/test_no_audio.mp4"],
      "/tmp/test_no_audio.mp4"
    );
    tryGenerate(
      ["-y", "-filter_complex", "nullsrc=s=320x240:d=10:r=1[v];anullsrc=r=16000:cl=mono[a]",
       "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "ultrafast",
       "-c:a", "aac", "-t", "10",
       "/tmp/test_too_short.mp4"],
      "/tmp/test_too_short.mp4"
    );
    tryGenerate(
      ["-y", "-filter_complex", "nullsrc=s=320x240:d=35:r=1[v];anullsrc=r=16000:cl=mono[a]",
       "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "ultrafast",
       "-c:a", "aac", "-t", "35",
       "/tmp/test_silent_video.mp4"],
      "/tmp/test_silent_video.mp4"
    );
    tryGenerate(
      ["-y", "-filter_complex", "anullsrc=r=16000:cl=mono[a]",
       "-map", "[a]", "-c:a", "pcm_s16le", "-t", "35",
       "/tmp/test_silent_audio.wav"],
      "/tmp/test_silent_audio.wav"
    );
  } catch {
    // Some fixtures may not generate — individual tests handle this
  }
});

afterAll(() => {
  for (const f of fixtures) {
    try { fs.unlinkSync(f); } catch {}
  }
  try { fs.unlinkSync("/tmp/test_fake_video.mp4"); } catch {}
});

describe("validateInput", () => {
  it.skipIf(!ffmpegAvailable)("rejects video with no audio stream", async () => {
    await expect(validateInput("/tmp/test_no_audio.mp4"))
      .rejects.toThrow("Video has no audio track");
  });

  it.skipIf(!ffmpegAvailable)("rejects video shorter than 30s", async () => {
    await expect(validateInput("/tmp/test_too_short.mp4"))
      .rejects.toThrow("File must be at least 30 seconds");
  });

  it.skipIf(!ffmpegAvailable)("accepts silent video (has audio track)", async () => {
    const info = await validateInput("/tmp/test_silent_video.mp4");
    expect(info.hasVideo).toBe(true);
    expect(info.hasAudio).toBe(true);
    expect(info.duration).toBeGreaterThanOrEqual(34);
    expect(info.videoCodec).toBe("h264");
    expect(info.audioCodec).toBe("aac");
  });

  it.skipIf(!ffmpegAvailable)("accepts audio-only file", async () => {
    const info = await validateInput("/tmp/test_silent_audio.wav");
    expect(info.hasVideo).toBe(false);
    expect(info.hasAudio).toBe(true);
    expect(info.duration).toBeGreaterThanOrEqual(34);
    expect(info.audioCodec).toBeTruthy();
  });

  it.skipIf(!ffmpegAvailable)("rejects non-existent file", async () => {
    await expect(validateInput("/tmp/this_file_does_not_exist.mp4"))
      .rejects.toThrow("ffprobe failed");
  });

  it.skipIf(!ffmpegAvailable)("rejects non-media file", async () => {
    fs.writeFileSync("/tmp/test_fake_video.mp4", "this is not a video file");
    await expect(validateInput("/tmp/test_fake_video.mp4"))
      .rejects.toThrow("ffprobe failed");
  });
});
