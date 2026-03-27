/**
 * Unit tests for server.js — validateUploadToken, MIME validation,
 * job store logic, maybeCleanup, ALLOWED_MIME_TYPES.
 *
 * Tests pure logic extracted from the server without starting Express.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHmac, timingSafeEqual } from "crypto";

// Re-implement validateUploadToken to test it (it's not exported from server.js)
// This mirrors the exact logic in server.js lines 36-49
function validateUploadToken(header: string | null, secret: string | null): boolean {
  if (!header || !secret) return false;
  const parts = header.split(":");
  if (parts.length !== 3) return false;
  const [expiresAt, nonce, sig] = parts;
  if (Date.now() > Number(expiresAt)) return false;
  const payload = `${expiresAt}:${nonce}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

function createValidToken(secret: string, ttlMs = 60_000): string {
  const expiresAt = Date.now() + ttlMs;
  const nonce = "test-nonce-" + Math.random().toString(36).slice(2);
  const payload = `${expiresAt}:${nonce}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${expiresAt}:${nonce}:${sig}`;
}

describe("validateUploadToken", () => {
  const SECRET = "test-secret-key-12345";

  it("validates a correctly signed token", () => {
    const token = createValidToken(SECRET);
    expect(validateUploadToken(token, SECRET)).toBe(true);
  });

  it("rejects token with wrong secret", () => {
    const token = createValidToken(SECRET);
    expect(validateUploadToken(token, "wrong-secret")).toBe(false);
  });

  it("rejects expired token", () => {
    const token = createValidToken(SECRET, -1000); // already expired
    expect(validateUploadToken(token, SECRET)).toBe(false);
  });

  it("rejects null/empty token", () => {
    expect(validateUploadToken(null, SECRET)).toBe(false);
    expect(validateUploadToken("", SECRET)).toBe(false);
  });

  it("rejects null/empty secret", () => {
    const token = createValidToken(SECRET);
    expect(validateUploadToken(token, null)).toBe(false);
    expect(validateUploadToken(token, "")).toBe(false);
  });

  it("rejects malformed token (wrong part count)", () => {
    expect(validateUploadToken("only-one-part", SECRET)).toBe(false);
    expect(validateUploadToken("two:parts", SECRET)).toBe(false);
    expect(validateUploadToken("a:b:c:d", SECRET)).toBe(false);
  });

  it("rejects token with tampered signature", () => {
    const token = createValidToken(SECRET);
    const parts = token.split(":");
    parts[2] = "0".repeat(64); // tampered sig
    expect(validateUploadToken(parts.join(":"), SECRET)).toBe(false);
  });

  it("rejects token with tampered expiry", () => {
    const token = createValidToken(SECRET);
    const parts = token.split(":");
    parts[0] = String(Date.now() + 999999); // changed expiry invalidates sig
    expect(validateUploadToken(parts.join(":"), SECRET)).toBe(false);
  });

  it("rejects token with tampered nonce", () => {
    const token = createValidToken(SECRET);
    const parts = token.split(":");
    parts[1] = "tampered-nonce"; // changed nonce invalidates sig
    expect(validateUploadToken(parts.join(":"), SECRET)).toBe(false);
  });

  it("handles non-hex signature gracefully", () => {
    const expiresAt = Date.now() + 60_000;
    const token = `${expiresAt}:nonce:not-hex-at-all!!!`;
    expect(validateUploadToken(token, SECRET)).toBe(false);
  });
});

describe("ALLOWED_MIME_TYPES", () => {
  // Mirror the set from server.js
  const ALLOWED_MIME_TYPES = new Set([
    "video/mp4", "video/quicktime", "video/webm", "video/x-msvideo", "video/x-matroska",
    "audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a", "audio/ogg", "audio/webm",
  ]);

  it("accepts common video types", () => {
    expect(ALLOWED_MIME_TYPES.has("video/mp4")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("video/quicktime")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("video/webm")).toBe(true);
  });

  it("accepts common audio types", () => {
    expect(ALLOWED_MIME_TYPES.has("audio/mpeg")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("audio/wav")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("audio/mp4")).toBe(true);
    expect(ALLOWED_MIME_TYPES.has("audio/x-m4a")).toBe(true);
  });

  it("rejects non-media types", () => {
    expect(ALLOWED_MIME_TYPES.has("application/pdf")).toBe(false);
    expect(ALLOWED_MIME_TYPES.has("image/png")).toBe(false);
    expect(ALLOWED_MIME_TYPES.has("text/html")).toBe(false);
    expect(ALLOWED_MIME_TYPES.has("application/zip")).toBe(false);
    expect(ALLOWED_MIME_TYPES.has("application/octet-stream")).toBe(false);
  });

  it("rejects empty and undefined", () => {
    expect(ALLOWED_MIME_TYPES.has("")).toBe(false);
    expect(ALLOWED_MIME_TYPES.has(undefined as any)).toBe(false);
  });
});

describe("filename sanitization", () => {
  // Mirrors server.js path.extname + regex logic
  function safeExt(originalname: string): string {
    const rawExt = require("path").extname(originalname).toLowerCase();
    return /^\.[a-z0-9]{1,8}$/.test(rawExt) ? rawExt : "";
  }

  it("preserves normal extensions", () => {
    expect(safeExt("video.mp4")).toBe(".mp4");
    expect(safeExt("audio.m4a")).toBe(".m4a");
    expect(safeExt("file.webm")).toBe(".webm");
    expect(safeExt("test.mov")).toBe(".mov");
  });

  it("extracts last extension (no deny list)", () => {
    expect(safeExt("file.mp4.exe")).toBe(".exe"); // extname takes last
    expect(safeExt("file.")).toBe(""); // trailing dot
    expect(safeExt("file")).toBe(""); // no extension
  });

  it("rejects extensions with special characters", () => {
    expect(safeExt("file.mp4;rm -rf")).toBe(""); // semicolon
    expect(safeExt("file.a b")).toBe(""); // space
  });

  it("lowercases extensions", () => {
    expect(safeExt("video.MP4")).toBe(".mp4");
    expect(safeExt("audio.WAV")).toBe(".wav");
  });
});

describe("download filename sanitization", () => {
  // Mirrors server.js line 287
  function sanitizeFilename(filename: string): string {
    return require("path").basename(filename).replace(/[^a-zA-Z0-9_\-\.]/g, "_");
  }

  it("preserves safe filenames", () => {
    expect(sanitizeFilename("output.mp4")).toBe("output.mp4");
    expect(sanitizeFilename("Presentation_abc-123.mp4")).toBe("Presentation_abc-123.mp4");
  });

  it("strips directory traversal", () => {
    expect(sanitizeFilename("../../etc/passwd")).toBe("passwd");
    expect(sanitizeFilename("/tmp/secret.mp4")).toBe("secret.mp4");
  });

  it("replaces special characters", () => {
    expect(sanitizeFilename("file name (1).mp4")).toBe("file_name__1_.mp4");
    expect(sanitizeFilename("file;rm -rf.mp4")).toBe("file_rm_-rf.mp4");
  });
});

describe("maybeCleanup logic", () => {
  it("does not clean up jobs younger than 24h", () => {
    const jobs = new Map();
    const jobId = "test-1";
    jobs.set(jobId, {
      createdAt: Date.now() - 1000, // 1 second ago
      status: "done",
    });

    // Simulate maybeCleanup logic
    const job = jobs.get(jobId)!;
    const shouldClean = job.createdAt && Date.now() - job.createdAt > 24 * 60 * 60 * 1000;
    expect(shouldClean).toBe(false);
    expect(jobs.has(jobId)).toBe(true);
  });

  it("marks jobs older than 24h for cleanup", () => {
    const jobs = new Map();
    const jobId = "test-old";
    jobs.set(jobId, {
      createdAt: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
      status: "done",
    });

    const job = jobs.get(jobId)!;
    const shouldClean = job.createdAt && Date.now() - job.createdAt > 24 * 60 * 60 * 1000;
    expect(shouldClean).toBe(true);
  });
});

describe("concurrent job counting", () => {
  it("counts only active jobs (not done or error)", () => {
    const jobs = new Map([
      ["j1", { status: "transcribing" }],
      ["j2", { status: "rendering" }],
      ["j3", { status: "done" }],
      ["j4", { status: "error" }],
      ["j5", { status: "preprocessing" }],
    ]);

    let activeCount = 0;
    for (const job of jobs.values()) {
      if (!["done", "error"].includes((job as any).status)) activeCount++;
    }
    expect(activeCount).toBe(3);
  });

  it("allows jobs up to MAX_CONCURRENT_JOBS", () => {
    const MAX_CONCURRENT_JOBS = 10;
    const jobs = new Map();
    for (let i = 0; i < 10; i++) {
      jobs.set(`j${i}`, { status: "rendering" });
    }

    let activeCount = 0;
    for (const job of jobs.values()) {
      if (!["done", "error"].includes((job as any).status)) activeCount++;
    }
    expect(activeCount).toBe(10);
    expect(activeCount >= MAX_CONCURRENT_JOBS).toBe(true);
  });
});

describe("compositionId sanitization", () => {
  function sanitizeCompositionId(id: string): string {
    return id.replace(/[^a-zA-Z0-9_\-]/g, "_");
  }

  it("preserves valid composition IDs", () => {
    expect(sanitizeCompositionId("Presentation")).toBe("Presentation");
    expect(sanitizeCompositionId("Presentation3")).toBe("Presentation3");
    expect(sanitizeCompositionId("Presentation17")).toBe("Presentation17");
  });

  it("sanitizes invalid characters", () => {
    expect(sanitizeCompositionId("Presentation; rm -rf /")).toBe("Presentation__rm_-rf__");
    expect(sanitizeCompositionId("../../../etc")).toBe("_________etc");
  });
});
