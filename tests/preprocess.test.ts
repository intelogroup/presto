/**
 * Unit tests for preprocess.js — buildKeepSegments logic.
 * Migrated from plain Node.js to Vitest.
 */

import { describe, it, expect } from "vitest";

const { buildKeepSegments } = require("../pipeline/preprocess");

function approxEqual(a: number, b: number, eps = 0.01) {
  return Math.abs(a - b) < eps;
}

function totalKept(segs: { start: number; end: number }[]) {
  return segs.reduce((sum, s) => sum + (s.end - s.start), 0);
}

function assertOrdered(segs: { start: number; end: number }[]) {
  for (let i = 1; i < segs.length; i++) {
    expect(segs[i].start).toBeGreaterThanOrEqual(segs[i - 1].end);
  }
  segs.forEach((s) => expect(s.end).toBeGreaterThan(s.start));
}

// =========================================================================
// With explicit keepDuration=0.5 (old behavior)
// =========================================================================
describe("buildKeepSegments (keepDuration=0.5)", () => {
  it("returns 1 segment covering full video when no silences", () => {
    const segs = buildKeepSegments(120, []);
    expect(segs).toHaveLength(1);
    expect(segs[0].start).toBe(0);
    expect(segs[0].end).toBe(120);
  });

  it("splits on single silence in middle", () => {
    const segs = buildKeepSegments(60, [{ start: 20, end: 30 }], 0.5);
    expect(segs).toHaveLength(2);
    expect(segs[0].start).toBe(0);
    expect(approxEqual(segs[0].end, 20.25)).toBe(true);
    expect(approxEqual(segs[1].start, 29.75)).toBe(true);
    expect(segs[1].end).toBe(60);
  });

  it("handles silence at start", () => {
    const segs = buildKeepSegments(60, [{ start: 0, end: 10 }], 0.5);
    expect(segs).toHaveLength(1);
    expect(approxEqual(segs[0].start, 9.5)).toBe(true);
    expect(segs[0].end).toBe(60);
  });

  it("handles silence at end", () => {
    const segs = buildKeepSegments(60, [{ start: 50, end: 60 }], 0.5);
    expect(segs.length).toBeGreaterThanOrEqual(1);
    expect(segs[0].start).toBe(0);
    expect(approxEqual(segs[0].end, 50.5)).toBe(true);
    expect(totalKept(segs)).toBeLessThan(51);
  });

  it("handles multiple silences", () => {
    const silences = [
      { start: 20, end: 30 },
      { start: 50, end: 65 },
      { start: 90, end: 100 },
    ];
    const segs = buildKeepSegments(120, silences, 0.5);
    expect(segs).toHaveLength(4);
    const removed = 120 - totalKept(segs);
    expect(removed).toBeGreaterThan(25);
    expect(removed).toBeLessThan(35);
  });

  it("handles silence extending to Infinity", () => {
    const segs = buildKeepSegments(60, [{ start: 45, end: Infinity }], 0.5);
    expect(segs.length).toBeGreaterThanOrEqual(1);
    expect(segs[0].start).toBe(0);
    expect(approxEqual(segs[0].end, 45.5)).toBe(true);
  });

  it("handles entire video as silence", () => {
    const segs = buildKeepSegments(5, [{ start: 0, end: 5 }], 0.5);
    expect(totalKept(segs)).toBeLessThan(1);
  });

  it("handles back-to-back silences", () => {
    const silences = [
      { start: 10, end: 20 },
      { start: 21, end: 30 },
    ];
    const segs = buildKeepSegments(60, silences, 0.5);
    expect(segs.length).toBeGreaterThanOrEqual(2);
    expect(segs[0].start).toBe(0);
  });
});

// =========================================================================
// With DEFAULT keepDuration=2.0 (new behavior)
// =========================================================================
describe("buildKeepSegments (default keepDuration=2.0)", () => {
  it("single silence preserves ~2s", () => {
    const segs = buildKeepSegments(60, [{ start: 20, end: 30 }]);
    expect(segs).toHaveLength(2);
    expect(segs[0].start).toBe(0);
    expect(approxEqual(segs[0].end, 21)).toBe(true);
    expect(approxEqual(segs[1].start, 29)).toBe(true);
    const removed = 60 - totalKept(segs);
    expect(approxEqual(removed, 8, 0.5)).toBe(true);
  });

  it("short silence (exactly 4s) removes ~2s", () => {
    const segs = buildKeepSegments(60, [{ start: 20, end: 24 }]);
    expect(segs).toHaveLength(2);
    expect(approxEqual(segs[0].end, 21)).toBe(true);
    expect(approxEqual(segs[1].start, 23)).toBe(true);
    const removed = 60 - totalKept(segs);
    expect(approxEqual(removed, 2, 0.5)).toBe(true);
  });

  it("handles multiple silences", () => {
    const silences = [
      { start: 20, end: 30 },
      { start: 50, end: 65 },
      { start: 90, end: 100 },
    ];
    const segs = buildKeepSegments(120, silences);
    expect(segs).toHaveLength(4);
    const removed = 120 - totalKept(segs);
    expect(removed).toBeGreaterThan(25);
    expect(removed).toBeLessThan(35);
  });

  it("20-min realistic teacher video", () => {
    const silences = [
      { start: 45, end: 52 },
      { start: 120, end: 128 },
      { start: 250, end: 260 },
      { start: 400, end: 406 },
      { start: 550, end: 555 },
      { start: 700, end: 720 },
      { start: 900, end: 910 },
      { start: 1100, end: 1108 },
    ];
    const segs = buildKeepSegments(1200, silences);
    expect(segs).toHaveLength(9);
    const removed = 1200 - totalKept(segs);
    expect(removed).toBeGreaterThan(50);
    expect(removed).toBeLessThan(65);
    assertOrdered(segs);
  });
});

// =========================================================================
// Ordering & edge cases
// =========================================================================
describe("buildKeepSegments (ordering & edges)", () => {
  it("segments are always ordered and non-overlapping", () => {
    const silences = [
      { start: 5, end: 15 },
      { start: 25, end: 35 },
      { start: 45, end: 55 },
      { start: 65, end: 75 },
      { start: 85, end: 95 },
    ];
    const segs = buildKeepSegments(100, silences);
    assertOrdered(segs);
  });

  it("very long silence (60s) trimmed to ~2s", () => {
    const segs = buildKeepSegments(120, [{ start: 30, end: 90 }]);
    expect(segs).toHaveLength(2);
    const removed = 120 - totalKept(segs);
    expect(removed).toBeGreaterThan(55);
    expect(removed).toBeLessThan(62);
  });
});
