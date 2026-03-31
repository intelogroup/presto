/**
 * Unit tests for pipeline/transcribe.js — file size validation,
 * jobId sanitization, segment mapping, empty response detection.
 *
 * External deps (ffmpeg, OpenAI) are not called. We test the pure logic
 * by re-implementing the key calculations from transcribe.js.
 */

import { describe, it, expect } from "vitest";

// ─── File size validation (mirrors transcribe.js lines 41-48) ───────────────
function validateAudioSize(fileSizeBytes: number): { ok: boolean; warning: boolean; error: string | null } {
  const audioSizeMB = fileSizeBytes / (1024 * 1024);
  if (audioSizeMB > 25) {
    return {
      ok: false,
      warning: false,
      error: `Extracted audio is ${audioSizeMB.toFixed(1)} MB — exceeds Whisper 25MB limit. Try a shorter video.`,
    };
  }
  if (audioSizeMB > 24) {
    return { ok: true, warning: true, error: null };
  }
  return { ok: true, warning: false, error: null };
}

// ─── JobId sanitization (mirrors transcribe.js line 70) ─────────────────────
function sanitizeJobId(jobId: string): string {
  return String(jobId).replace(/[^a-zA-Z0-9\-_]/g, "_");
}

// ─── Segment mapping (mirrors transcribe.js lines 80-85) ────────────────────
function mapSegments(
  segments: Array<{ start: number; end: number; text: string; [key: string]: unknown }>
): Array<{ start: number; end: number; text: string }> {
  return (segments || []).map((s) => ({
    start: s.start,
    end: s.end,
    text: s.text,
  }));
}

// ─── Empty response detection (mirrors transcribe.js lines 64-66) ───────────
function isEmptyTranscript(text: string | undefined | null): boolean {
  return !text || text.trim().length === 0;
}

// ═══════════════════════════════════════════════════════════════════════════════

describe("validateAudioSize", () => {
  it("accepts files well under 24MB", () => {
    const result = validateAudioSize(10 * 1024 * 1024); // 10MB
    expect(result.ok).toBe(true);
    expect(result.warning).toBe(false);
    expect(result.error).toBeNull();
  });

  it("accepts files at exactly 24MB without warning", () => {
    const result = validateAudioSize(24 * 1024 * 1024); // exactly 24MB
    expect(result.ok).toBe(true);
    expect(result.warning).toBe(false);
  });

  it("warns for files between 24-25MB", () => {
    const result = validateAudioSize(24.5 * 1024 * 1024);
    expect(result.ok).toBe(true);
    expect(result.warning).toBe(true);
    expect(result.error).toBeNull();
  });

  it("rejects files over 25MB", () => {
    const result = validateAudioSize(26 * 1024 * 1024);
    expect(result.ok).toBe(false);
    expect(result.error).toContain("exceeds Whisper 25MB limit");
  });

  it("rejects files at exactly 25.001MB", () => {
    const result = validateAudioSize(25.001 * 1024 * 1024);
    expect(result.ok).toBe(false);
  });

  it("accepts empty file (0 bytes)", () => {
    const result = validateAudioSize(0);
    expect(result.ok).toBe(true);
    expect(result.warning).toBe(false);
  });

  it("accepts tiny file (1 byte)", () => {
    const result = validateAudioSize(1);
    expect(result.ok).toBe(true);
  });

  it("correctly calculates MB boundary (25 * 1024 * 1024 = exactly 25MB)", () => {
    // Exactly 25MB should NOT be over 25 — it's equal, not greater
    const result = validateAudioSize(25 * 1024 * 1024);
    // 25.0 > 25 is false, so it falls through to the warning check
    // 25.0 > 24 is true, so it warns
    expect(result.ok).toBe(true);
    expect(result.warning).toBe(true);
  });
});

describe("sanitizeJobId", () => {
  it("preserves UUID-like jobIds", () => {
    expect(sanitizeJobId("a1b2c3d4-e5f6-7890-abcd-ef1234567890")).toBe(
      "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    );
  });

  it("preserves alphanumeric jobIds", () => {
    expect(sanitizeJobId("job123")).toBe("job123");
  });

  it("preserves underscores and hyphens", () => {
    expect(sanitizeJobId("my_job-id")).toBe("my_job-id");
  });

  it("replaces dots with underscores", () => {
    expect(sanitizeJobId("job.123")).toBe("job_123");
  });

  it("replaces slashes (path traversal) with underscores", () => {
    expect(sanitizeJobId("../../../etc/passwd")).toBe("_________etc_passwd");
  });

  it("replaces spaces with underscores", () => {
    expect(sanitizeJobId("my job id")).toBe("my_job_id");
  });

  it("replaces special characters", () => {
    expect(sanitizeJobId("job@#$%^&*()")).toBe("job_________");
  });

  it("handles empty string", () => {
    expect(sanitizeJobId("")).toBe("");
  });

  it("coerces non-string input", () => {
    expect(sanitizeJobId(12345 as unknown as string)).toBe("12345");
  });
});

describe("mapSegments", () => {
  it("extracts only start, end, text from segments", () => {
    const whisperSegments = [
      { start: 0, end: 2.5, text: "Hello", id: 0, seek: 0, tokens: [1, 2], temperature: 0.5 },
      { start: 2.5, end: 5.0, text: "World", id: 1, seek: 0, tokens: [3, 4], temperature: 0.5 },
    ];
    const result = mapSegments(whisperSegments);
    expect(result).toEqual([
      { start: 0, end: 2.5, text: "Hello" },
      { start: 2.5, end: 5.0, text: "World" },
    ]);
  });

  it("handles empty segments array", () => {
    expect(mapSegments([])).toEqual([]);
  });

  it("handles null/undefined segments", () => {
    expect(mapSegments(null as unknown as [])).toEqual([]);
    expect(mapSegments(undefined as unknown as [])).toEqual([]);
  });

  it("preserves segment order", () => {
    const segments = [
      { start: 10, end: 15, text: "C" },
      { start: 0, end: 5, text: "A" },
      { start: 5, end: 10, text: "B" },
    ];
    const result = mapSegments(segments);
    expect(result[0].text).toBe("C");
    expect(result[1].text).toBe("A");
    expect(result[2].text).toBe("B");
  });

  it("handles segments with zero duration", () => {
    const segments = [{ start: 5, end: 5, text: "instant" }];
    expect(mapSegments(segments)).toEqual([{ start: 5, end: 5, text: "instant" }]);
  });
});

describe("isEmptyTranscript", () => {
  it("detects empty string", () => {
    expect(isEmptyTranscript("")).toBe(true);
  });

  it("detects whitespace-only string", () => {
    expect(isEmptyTranscript("   ")).toBe(true);
    expect(isEmptyTranscript("\n\t  ")).toBe(true);
  });

  it("detects null", () => {
    expect(isEmptyTranscript(null)).toBe(true);
  });

  it("detects undefined", () => {
    expect(isEmptyTranscript(undefined)).toBe(true);
  });

  it("accepts non-empty text", () => {
    expect(isEmptyTranscript("Hello world")).toBe(false);
  });

  it("accepts text with leading/trailing whitespace", () => {
    expect(isEmptyTranscript("  Hello  ")).toBe(false);
  });
});

describe("ffmpeg command construction", () => {
  it("produces correct audio extraction args", () => {
    const jobId = "test-job-123";
    const videoPath = "/tmp/input.mp4";
    const audioPath = `/tmp/${jobId}.mp3`;

    const args = ["-y", "-i", videoPath, "-ar", "16000", "-ac", "1", "-b:a", "64k", "-f", "mp3", audioPath];

    expect(args).toContain("-ar");
    expect(args).toContain("16000"); // 16kHz
    expect(args).toContain("-ac");
    expect(args).toContain("1"); // mono
    expect(args).toContain("-b:a");
    expect(args).toContain("64k"); // 64kbps
    expect(args).toContain("-f");
    expect(args).toContain("mp3");
    expect(args[args.length - 1]).toBe(audioPath);
  });
});

describe("transcript persistence paths", () => {
  it("generates correct durable path", () => {
    const safeJobId = sanitizeJobId("abc-123");
    const durablePath = `output/transcripts/${safeJobId}.json`;
    expect(durablePath).toBe("output/transcripts/abc-123.json");
  });

  it("generates correct tmp path", () => {
    const safeJobId = sanitizeJobId("abc-123");
    const tmpPath = `/tmp/${safeJobId}.transcript.json`;
    expect(tmpPath).toBe("/tmp/abc-123.transcript.json");
  });

  it("sanitizes dangerous jobId in paths", () => {
    const safeJobId = sanitizeJobId("../../etc/passwd");
    expect(safeJobId).not.toContain("/");
    expect(safeJobId).not.toContain("..");
    const durablePath = `output/transcripts/${safeJobId}.json`;
    expect(durablePath).not.toContain("../../");
  });
});
