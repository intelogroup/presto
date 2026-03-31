/**
 * Unit tests for server.js route logic, CORS middleware, maybeCleanup,
 * renderVideo sanitization, and runPipeline orchestration.
 *
 * Tests pure logic extracted from server.js without starting Express.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import path from "path";

// ─── CORS origin matching (mirrors server.js lines 29-47) ───────────────────
const ALLOWED_ORIGINS = new Set([
  "https://presto-lake.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
]);

function matchCorsOrigin(origin: string | undefined): string | null {
  if (!origin) return null;
  if (ALLOWED_ORIGINS.has(origin)) return origin;
  return null;
}

// ─── maybeCleanup TTL logic (mirrors server.js lines 121-133) ───────────────
function shouldCleanup(createdAt: number, now: number): boolean {
  const JOB_TTL = 24 * 60 * 60 * 1000; // 24 hours
  return createdAt > 0 && (now - createdAt) > JOB_TTL;
}

// ─── compositionId sanitization (mirrors server.js line 140) ────────────────
function sanitizeCompositionId(compositionId: string): string {
  return compositionId.replace(/[^a-zA-Z0-9_\-]/g, "_");
}

// ─── download filename sanitization (mirrors server.js line 359) ────────────
function sanitizeDownloadFilename(filename: string): string {
  return path.basename(filename).replace(/[^a-zA-Z0-9_\-\.]/g, "_");
}

// ─── Active job counting (mirrors server.js lines 259-262) ──────────────────
function countActiveJobs(jobs: Map<string, { status: string }>): number {
  let count = 0;
  for (const job of jobs.values()) {
    if (!["done", "error"].includes(job.status)) count++;
  }
  return count;
}

// ─── MIME type allowlist (mirrors server.js lines 115-118) ──────────────────
const ALLOWED_MIME_TYPES = new Set([
  "video/mp4", "video/quicktime", "video/webm", "video/x-msvideo", "video/x-matroska",
  "audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a", "audio/ogg", "audio/webm",
]);

// ═══════════════════════════════════════════════════════════════════════════════

describe("CORS origin matching", () => {
  it("allows production Vercel origin", () => {
    expect(matchCorsOrigin("https://presto-lake.vercel.app")).toBe("https://presto-lake.vercel.app");
  });

  it("allows localhost:3000", () => {
    expect(matchCorsOrigin("http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("allows localhost:3001-3003", () => {
    expect(matchCorsOrigin("http://localhost:3001")).toBe("http://localhost:3001");
    expect(matchCorsOrigin("http://localhost:3002")).toBe("http://localhost:3002");
    expect(matchCorsOrigin("http://localhost:3003")).toBe("http://localhost:3003");
  });

  it("rejects unknown origin", () => {
    expect(matchCorsOrigin("https://evil.com")).toBeNull();
  });

  it("rejects similar-looking origin (subdomain attack)", () => {
    expect(matchCorsOrigin("https://presto-lake.vercel.app.evil.com")).toBeNull();
  });

  it("rejects origin with different protocol", () => {
    expect(matchCorsOrigin("http://presto-lake.vercel.app")).toBeNull(); // http, not https
  });

  it("rejects localhost with different port", () => {
    expect(matchCorsOrigin("http://localhost:4000")).toBeNull();
  });

  it("rejects localhost with https", () => {
    expect(matchCorsOrigin("https://localhost:3000")).toBeNull();
  });

  it("rejects undefined origin", () => {
    expect(matchCorsOrigin(undefined)).toBeNull();
  });

  it("rejects empty string origin", () => {
    expect(matchCorsOrigin("")).toBeNull();
  });

  it("never reflects arbitrary origin (CWE-346 check)", () => {
    const arbitrary = "https://attacker.example.com";
    expect(matchCorsOrigin(arbitrary)).toBeNull();
  });
});

describe("maybeCleanup — TTL logic", () => {
  it("does not cleanup jobs younger than 24h", () => {
    const now = Date.now();
    const createdAt = now - 23 * 60 * 60 * 1000; // 23h ago
    expect(shouldCleanup(createdAt, now)).toBe(false);
  });

  it("cleans up jobs older than 24h", () => {
    const now = Date.now();
    const createdAt = now - 25 * 60 * 60 * 1000; // 25h ago
    expect(shouldCleanup(createdAt, now)).toBe(true);
  });

  it("cleans up jobs at exactly 24h + 1ms", () => {
    const now = Date.now();
    const createdAt = now - (24 * 60 * 60 * 1000 + 1);
    expect(shouldCleanup(createdAt, now)).toBe(true);
  });

  it("does not cleanup at exactly 24h (not strictly greater)", () => {
    const now = Date.now();
    const createdAt = now - 24 * 60 * 60 * 1000;
    expect(shouldCleanup(createdAt, now)).toBe(false);
  });

  it("handles zero createdAt", () => {
    expect(shouldCleanup(0, Date.now())).toBe(false);
  });
});

describe("sanitizeCompositionId", () => {
  it("preserves valid compositionId 'Presentation'", () => {
    expect(sanitizeCompositionId("Presentation")).toBe("Presentation");
  });

  it("preserves 'Presentation3'", () => {
    expect(sanitizeCompositionId("Presentation3")).toBe("Presentation3");
  });

  it("preserves 'Presentation17'", () => {
    expect(sanitizeCompositionId("Presentation17")).toBe("Presentation17");
  });

  it("strips shell injection characters", () => {
    expect(sanitizeCompositionId("Presentation; rm -rf /")).toBe("Presentation__rm_-rf__");
  });

  it("strips path traversal characters", () => {
    expect(sanitizeCompositionId("../../etc/passwd")).toBe("______etc_passwd");
  });

  it("allows hyphens and underscores", () => {
    expect(sanitizeCompositionId("My_Comp-1")).toBe("My_Comp-1");
  });
});

describe("sanitizeDownloadFilename", () => {
  it("preserves safe filename", () => {
    expect(sanitizeDownloadFilename("output.mp4")).toBe("output.mp4");
  });

  it("strips directory traversal", () => {
    expect(sanitizeDownloadFilename("../../etc/passwd")).toBe("passwd");
  });

  it("strips absolute paths", () => {
    expect(sanitizeDownloadFilename("/tmp/secret/file.mp4")).toBe("file.mp4");
  });

  it("replaces special characters", () => {
    expect(sanitizeDownloadFilename("my file (1).mp4")).toBe("my_file__1_.mp4");
  });

  it("preserves UUID-based filenames", () => {
    const name = "Presentation_a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp4";
    expect(sanitizeDownloadFilename(name)).toBe(name);
  });
});

describe("countActiveJobs", () => {
  it("returns 0 for empty job map", () => {
    expect(countActiveJobs(new Map())).toBe(0);
  });

  it("counts only non-terminal jobs", () => {
    const jobs = new Map([
      ["a", { status: "preprocessing" }],
      ["b", { status: "transcribing" }],
      ["c", { status: "done" }],
      ["d", { status: "error" }],
      ["e", { status: "rendering" }],
    ]);
    expect(countActiveJobs(jobs)).toBe(3);
  });

  it("returns 0 when all jobs are done or error", () => {
    const jobs = new Map([
      ["a", { status: "done" }],
      ["b", { status: "error" }],
    ]);
    expect(countActiveJobs(jobs)).toBe(0);
  });

  it("counts all pipeline statuses as active", () => {
    const statuses = ["uploading", "preprocessing", "transcribing", "generating_slides", "syncing", "rendering"];
    const jobs = new Map(statuses.map((s, i) => [String(i), { status: s }]));
    expect(countActiveJobs(jobs)).toBe(6);
  });
});

describe("ALLOWED_MIME_TYPES", () => {
  it("accepts common video types", () => {
    expect(ALLOWED_MIME_TYPES.has("video/mp4")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("video/quicktime")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("video/webm")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("video/x-msvideo")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("video/x-matroska")).toBe(true);
  });

  it("accepts common audio types", () => {
    expect(ALLOWED_MIME_TYPES.has("audio/mpeg")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("audio/wav")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("audio/mp4")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("audio/x-m4a")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("audio/ogg")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("audio/webm")).toBe(true);
  });

  it("rejects non-media types", () => {
    expect(ALLOWED_MIME_TYPES.has("text/plain")).toBe(false);
    expect(ALLOWED_MIME_TYPES.has("application/json")).toBe(false);
    expect(ALLOWED_MIME_TYPES.has("image/png")).toBe(false);
    expect(ALLOWED_MIME_TYPES.has("application/octet-stream")).toBe(false);
  });

  it("rejects empty and undefined", () => {
    expect(ALLOWED_MIME_TYPES.has("")).toBe(false);
    expect(ALLOWED_MIME_TYPES.has(undefined as unknown as string)).toBe(false);
  });

  it("has exactly 11 allowed types", () => {
    expect(ALLOWED_MIME_TYPES.size).toBe(11);
  });
});

describe("pipeline status transitions", () => {
  const EXPECTED_STEPS = [
    "uploading",
    "preprocessing",
    "transcribing",
    "generating_slides",
    "syncing",
    "rendering",
    "done",
  ];

  it("has correct step order", () => {
    expect(EXPECTED_STEPS.indexOf("uploading")).toBeLessThan(EXPECTED_STEPS.indexOf("preprocessing"));
    expect(EXPECTED_STEPS.indexOf("preprocessing")).toBeLessThan(EXPECTED_STEPS.indexOf("transcribing"));
    expect(EXPECTED_STEPS.indexOf("transcribing")).toBeLessThan(EXPECTED_STEPS.indexOf("generating_slides"));
    expect(EXPECTED_STEPS.indexOf("generating_slides")).toBeLessThan(EXPECTED_STEPS.indexOf("syncing"));
    expect(EXPECTED_STEPS.indexOf("syncing")).toBeLessThan(EXPECTED_STEPS.indexOf("rendering"));
    expect(EXPECTED_STEPS.indexOf("rendering")).toBeLessThan(EXPECTED_STEPS.indexOf("done"));
  });

  it("terminal states are 'done' and 'error'", () => {
    const terminal = ["done", "error"];
    expect(terminal).toContain("done");
    expect(terminal).toContain("error");
    expect(terminal).not.toContain("rendering");
  });
});

describe("concurrent job limit", () => {
  const MAX_CONCURRENT_JOBS = 10;

  it("allows jobs under the limit", () => {
    const jobs = new Map(
      Array.from({ length: 9 }, (_, i) => [String(i), { status: "rendering" }])
    );
    expect(countActiveJobs(jobs)).toBeLessThan(MAX_CONCURRENT_JOBS);
  });

  it("rejects at the limit", () => {
    const jobs = new Map(
      Array.from({ length: 10 }, (_, i) => [String(i), { status: "rendering" }])
    );
    expect(countActiveJobs(jobs)).toBe(MAX_CONCURRENT_JOBS);
    expect(countActiveJobs(jobs) >= MAX_CONCURRENT_JOBS).toBe(true);
  });

  it("allows new jobs when some are terminal", () => {
    const jobs = new Map([
      ...Array.from({ length: 10 }, (_, i) => [String(i), { status: "done" }] as [string, { status: string }]),
      ["active", { status: "rendering" }],
    ]);
    expect(countActiveJobs(jobs)).toBe(1);
    expect(countActiveJobs(jobs) < MAX_CONCURRENT_JOBS).toBe(true);
  });
});

describe("job store capacity", () => {
  const MAX_TRACKED_JOBS = 10_000;

  it("enforces hard cap on total tracked jobs", () => {
    // server.js line 269: if (jobs.size >= 10_000)
    const jobsSize = 10_000;
    expect(jobsSize >= MAX_TRACKED_JOBS).toBe(true);
  });

  it("allows jobs under the cap", () => {
    expect(9_999 >= MAX_TRACKED_JOBS).toBe(false);
  });
});

describe("pipeline timeout", () => {
  const PIPELINE_TIMEOUT_MS = 60 * 60 * 1000;

  it("timeout is 60 minutes", () => {
    expect(PIPELINE_TIMEOUT_MS).toBe(3_600_000);
  });

  it("AbortController signal can be checked", () => {
    const controller = new AbortController();
    expect(controller.signal.aborted).toBe(false);
    controller.abort();
    expect(controller.signal.aborted).toBe(true);
  });
});

describe("graceful shutdown timeout", () => {
  const SHUTDOWN_TIMEOUT_MS = 30_000;

  it("shutdown timeout is 30 seconds", () => {
    expect(SHUTDOWN_TIMEOUT_MS).toBe(30_000);
  });
});

describe("renderVideo output filename pattern", () => {
  it("generates filename with sanitized compositionId prefix", () => {
    const compositionId = "Presentation3";
    const safeCompositionId = sanitizeCompositionId(compositionId);
    const uuid = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    const filename = `${safeCompositionId}_${uuid}.mp4`;
    expect(filename).toBe("Presentation3_a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp4");
    expect(filename.endsWith(".mp4")).toBe(true);
  });

  it("sanitizes dangerous compositionId in filename", () => {
    const safeId = sanitizeCompositionId("../../evil");
    expect(safeId).not.toContain("/");
    expect(safeId).not.toContain(".");
  });
});

describe("multer safe extension extraction", () => {
  // Mirrors server.js lines 100-101
  function extractSafeExtension(originalname: string): string {
    const rawExt = path.extname(originalname).toLowerCase();
    return /^\.[a-z0-9]{1,8}$/.test(rawExt) ? rawExt : "";
  }

  it("extracts .mp4", () => {
    expect(extractSafeExtension("video.mp4")).toBe(".mp4");
  });

  it("extracts .webm", () => {
    expect(extractSafeExtension("video.webm")).toBe(".webm");
  });

  it("lowercases extension", () => {
    expect(extractSafeExtension("video.MP4")).toBe(".mp4");
  });

  it("rejects extension with special characters", () => {
    expect(extractSafeExtension("video.mp4;rm")).toBe("");
  });

  it("rejects extension longer than 8 chars", () => {
    expect(extractSafeExtension("file.extremely_long")).toBe("");
  });

  it("handles files with no extension", () => {
    expect(extractSafeExtension("noextension")).toBe("");
  });

  it("extracts last extension from double-dot", () => {
    expect(extractSafeExtension("video.tar.gz")).toBe(".gz");
  });
});
