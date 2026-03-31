/**
 * Tests for server.js infrastructure hardening:
 * - compositionId allowlist validation
 * - Temp file cleanup correctness (right variable names)
 * - jobId sanitization + length enforcement
 */

import { describe, it, expect } from "vitest";

// --- Re-implement compositionId allowlist (mirrors server.js) ---
const VALID_COMPOSITION_IDS = new Set([
  "PanZoom", "Advanced", "Showcase", "PictureInPicture",
  "Presentation",
  ...Array.from({ length: 19 }, (_, i) => `Presentation${i + 2}`),
]);

describe("compositionId allowlist", () => {
  it("allows 'Presentation' (P1)", () => {
    expect(VALID_COMPOSITION_IDS.has("Presentation")).toBe(true);
  });

  it("does NOT allow 'Presentation1'", () => {
    expect(VALID_COMPOSITION_IDS.has("Presentation1")).toBe(false);
  });

  it("allows Presentation2 through Presentation20", () => {
    for (let i = 2; i <= 20; i++) {
      expect(VALID_COMPOSITION_IDS.has(`Presentation${i}`), `Presentation${i}`).toBe(true);
    }
  });

  it("allows utility compositions", () => {
    expect(VALID_COMPOSITION_IDS.has("PanZoom")).toBe(true);
    expect(VALID_COMPOSITION_IDS.has("Advanced")).toBe(true);
    expect(VALID_COMPOSITION_IDS.has("Showcase")).toBe(true);
    expect(VALID_COMPOSITION_IDS.has("PictureInPicture")).toBe(true);
  });

  it("rejects arbitrary strings", () => {
    expect(VALID_COMPOSITION_IDS.has("ArbitraryComposition")).toBe(false);
    expect(VALID_COMPOSITION_IDS.has("")).toBe(false);
    expect(VALID_COMPOSITION_IDS.has("../etc/passwd")).toBe(false);
    expect(VALID_COMPOSITION_IDS.has("Presentation21")).toBe(false);
  });

  it("contains exactly 24 valid IDs (4 utility + 20 presentations)", () => {
    // PanZoom, Advanced, Showcase, PictureInPicture + Presentation + Presentation2-20
    expect(VALID_COMPOSITION_IDS.size).toBe(24);
  });
});

// --- Test temp file cleanup collects correct job properties ---
describe("temp file cleanup — correct property names", () => {
  // Mirrors the job object structure as set by runPipeline in server.js
  const mockJob = {
    status: "error",
    videoPath: "/tmp/abc.mp4",
    trimmedVideoPath: "/tmp/abc_trimmed.mp4",
    mp3Path: "/tmp/abc.mp3",
    transcriptPath: "/tmp/abc_transcript.json",
    talkingHeadPublicPath: "/home/user/presto/public/abc_talkinghead.mp4",
    outputFilename: "Presentation_xyz.mp4", // NOT outputPath
  };

  // Mirrors the cleanup logic from server.js error handler (lines 224-232)
  function getCleanupFiles(job: Record<string, any>): string[] {
    return [
      job.videoPath,
      job.trimmedVideoPath,
      job.mp3Path,          // was incorrectly job.wavPath before fix
      job.transcriptPath,
      job.talkingHeadPublicPath,
    ].filter(Boolean);
  }

  it("collects all 5 temp file paths", () => {
    const files = getCleanupFiles(mockJob);
    expect(files).toHaveLength(5);
  });

  it("includes mp3Path (not wavPath)", () => {
    const files = getCleanupFiles(mockJob);
    expect(files).toContain(mockJob.mp3Path);
  });

  it("does NOT include outputFilename (it's a filename, not a path)", () => {
    const files = getCleanupFiles(mockJob);
    expect(files).not.toContain(mockJob.outputFilename);
  });

  it("handles partial jobs where some paths are undefined", () => {
    const partialJob = {
      videoPath: "/tmp/abc.mp4",
      // All other paths undefined (pipeline failed early)
    };
    const files = getCleanupFiles(partialJob);
    expect(files).toEqual(["/tmp/abc.mp4"]);
  });

  it("handles job with no paths set", () => {
    const emptyJob = { status: "error" };
    const files = getCleanupFiles(emptyJob);
    expect(files).toEqual([]);
  });
});

// --- Periodic sweep cleanup — mirrors server.js lines 379-388 ---
describe("periodic sweep cleanup — correct property names", () => {
  function getSweepFiles(job: Record<string, any>): string[] {
    return [
      job.videoPath,
      job.mp3Path,           // was incorrectly job.wavPath before fix
      job.transcriptPath,
      job.talkingHeadPublicPath,
      job.trimmedVideoPath,
    ].filter(Boolean);
  }

  it("collects sweep files without the removed outputPath", () => {
    const job = {
      videoPath: "/tmp/a.mp4",
      mp3Path: "/tmp/a.mp3",
      transcriptPath: "/tmp/a.json",
      talkingHeadPublicPath: "/public/a_th.mp4",
      trimmedVideoPath: "/tmp/a_trim.mp4",
    };
    const files = getSweepFiles(job);
    expect(files).toHaveLength(5);
    expect(files).toContain(job.mp3Path);
  });
});

// --- jobId sanitization + length enforcement (mirrors syncTalkingHead.js) ---
describe("jobId sanitization and length enforcement", () => {
  function sanitizeJobId(jobId: string): string {
    return jobId.replace(/[^a-zA-Z0-9\-]/g, "_").slice(0, 200);
  }

  it("passes through valid UUIDs unchanged", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    expect(sanitizeJobId(uuid)).toBe(uuid);
  });

  it("replaces special characters with underscores", () => {
    expect(sanitizeJobId("job@id#123")).toBe("job_id_123");
  });

  it("replaces path traversal characters", () => {
    expect(sanitizeJobId("../../etc/passwd")).toBe("______etc_passwd");
  });

  it("truncates to 200 characters", () => {
    const longId = "a".repeat(300);
    const result = sanitizeJobId(longId);
    expect(result.length).toBe(200);
    expect(result).toBe("a".repeat(200));
  });

  it("truncates AFTER sanitization", () => {
    const longSpecial = "@".repeat(300);
    const result = sanitizeJobId(longSpecial);
    expect(result.length).toBe(200);
    expect(result).toBe("_".repeat(200));
  });

  it("handles empty string", () => {
    expect(sanitizeJobId("")).toBe("");
  });

  it("resulting filename stays within filesystem 255-char limit", () => {
    // filename pattern: `${safeJobId}_talkinghead.mp4` = safeJobId + 17 chars
    const longId = "x".repeat(300);
    const safe = sanitizeJobId(longId);
    const filename = `${safe}_talkinghead.mp4`;
    expect(filename.length).toBeLessThanOrEqual(255);
  });
});
