import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createWatchdog } from "../pipeline/watchdog.js";

describe("watchdog", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("marks a stalled job as error after stall threshold", () => {
    const jobs = new Map();
    const STALL_MS = 30 * 60 * 1000; // 30 minutes

    jobs.set("job-1", {
      status: "transcribing",
      step: "transcribing",
      createdAt: Date.now(),
      lastProgressAt: Date.now() - STALL_MS - 1,
    });

    const { tick } = createWatchdog(jobs, { stallMs: STALL_MS });
    tick();

    expect(jobs.get("job-1")?.status).toBe("error");
    expect(jobs.get("job-1")?.error).toContain("stalled");
  });

  it("does not mark a recently progressed job as error", () => {
    const jobs = new Map();
    jobs.set("job-2", {
      status: "rendering",
      step: "rendering",
      createdAt: Date.now(),
      lastProgressAt: Date.now() - 5_000, // 5 seconds ago
    });

    const { tick } = createWatchdog(jobs, { stallMs: 30 * 60 * 1000 });
    tick();

    expect(jobs.get("job-2")?.status).toBe("rendering");
  });

  it("does not touch done or error jobs", () => {
    const jobs = new Map();
    jobs.set("job-3", {
      status: "done",
      step: "done",
      createdAt: Date.now(),
      lastProgressAt: Date.now() - 99_999_999, // very old
    });

    const { tick } = createWatchdog(jobs, { stallMs: 30 * 60 * 1000 });
    tick();

    expect(jobs.get("job-3")?.status).toBe("done");
  });
});
