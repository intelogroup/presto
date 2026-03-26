#!/usr/bin/env node
/**
 * Unit tests for preprocess.js — buildKeepSegments logic.
 * Run: node tests/preprocess.test.js
 */

const { buildKeepSegments } = require("../pipeline/preprocess");

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ ${msg}`);
  }
}

function approxEqual(a, b, eps = 0.01) {
  return Math.abs(a - b) < eps;
}

// --- Test 1: No silences → keep entire video ---
console.log("Test 1: No silences");
{
  const segs = buildKeepSegments(120, []);
  assert(segs.length === 1, "should return 1 segment");
  assert(segs[0].start === 0 && segs[0].end === 120, "segment covers full video");
}

// --- Test 2: Single silence in the middle ---
console.log("Test 2: Single silence in middle");
{
  // 60s video, silence from 20s to 30s
  const segs = buildKeepSegments(60, [{ start: 20, end: 30 }], 0.5);
  assert(segs.length === 2, `should return 2 segments (got ${segs.length})`);
  // First segment: 0 to ~20.25 (start + keepDuration/2)
  assert(segs[0].start === 0, "first segment starts at 0");
  assert(approxEqual(segs[0].end, 20.25), `first segment ends near 20.25 (got ${segs[0].end})`);
  // Second segment: ~29.75 to 60
  assert(approxEqual(segs[1].start, 29.75), `second segment starts near 29.75 (got ${segs[1].start})`);
  assert(segs[1].end === 60, "second segment ends at 60");
}

// --- Test 3: Silence at the very start ---
console.log("Test 3: Silence at start");
{
  // 60s video, silence from 0s to 10s
  const segs = buildKeepSegments(60, [{ start: 0, end: 10 }], 0.5);
  // Should skip silence, keep from ~9.75 to 60
  assert(segs.length === 1, `should return 1 segment (got ${segs.length})`);
  assert(approxEqual(segs[0].start, 9.75), `starts near 9.75 (got ${segs[0].start})`);
  assert(segs[0].end === 60, "ends at 60");
}

// --- Test 4: Silence at the very end ---
console.log("Test 4: Silence at end");
{
  // 60s video, silence from 50s to 60s
  const segs = buildKeepSegments(60, [{ start: 50, end: 60 }], 0.5);
  assert(segs.length >= 1, `should return at least 1 segment (got ${segs.length})`);
  assert(segs[0].start === 0, "starts at 0");
  assert(approxEqual(segs[0].end, 50.25), `main segment ends near 50.25 (got ${segs[0].end})`);
  // A tiny trailing segment (0.25s) after the silence is acceptable
  const totalKept = segs.reduce((sum, s) => sum + (s.end - s.start), 0);
  assert(totalKept < 51, `total kept is reasonable (${totalKept.toFixed(1)}s)`);
}

// --- Test 5: Multiple silences ---
console.log("Test 5: Multiple silences");
{
  // 120s video, silences at 20-30, 50-65, 90-100
  const silences = [
    { start: 20, end: 30 },
    { start: 50, end: 65 },
    { start: 90, end: 100 },
  ];
  const segs = buildKeepSegments(120, silences, 0.5);
  assert(segs.length === 4, `should return 4 segments (got ${segs.length})`);
  // Total kept time should be roughly: 20 + 0.5 + 20 + 0.5 + 25 + 0.5 + 20 = ~86.5
  const totalKept = segs.reduce((sum, s) => sum + (s.end - s.start), 0);
  const totalSilenceRemoved = 120 - totalKept;
  assert(totalSilenceRemoved > 25, `removed significant silence (${totalSilenceRemoved.toFixed(1)}s)`);
  assert(totalSilenceRemoved < 35, `didn't remove too much (${totalSilenceRemoved.toFixed(1)}s)`);
}

// --- Test 6: Silence extending to Infinity (end of video) ---
console.log("Test 6: Silence to end (Infinity)");
{
  const segs = buildKeepSegments(60, [{ start: 45, end: Infinity }], 0.5);
  assert(segs.length >= 1, `should return at least 1 segment (got ${segs.length})`);
  assert(segs[0].start === 0, "starts at 0");
  assert(approxEqual(segs[0].end, 45.25), `main segment ends near 45.25 (got ${segs[0].end})`);
}

// --- Test 7: Very short video with no room to keep ---
console.log("Test 7: Entire video is silence");
{
  // 5s video that is entirely silent
  const segs = buildKeepSegments(5, [{ start: 0, end: 5 }], 0.5);
  // Should produce tiny or no segments (all filtered by the 0.05s minimum)
  const totalKept = segs.reduce((sum, s) => sum + (s.end - s.start), 0);
  assert(totalKept < 1, `kept very little (${totalKept.toFixed(2)}s)`);
}

// --- Test 8: Adjacent silences ---
console.log("Test 8: Back-to-back silences");
{
  // Two silences with only 1s gap between them
  const silences = [
    { start: 10, end: 20 },
    { start: 21, end: 30 },
  ];
  const segs = buildKeepSegments(60, silences, 0.5);
  assert(segs.length >= 2, `should return at least 2 segments (got ${segs.length})`);
  assert(segs[0].start === 0, "first segment starts at 0");
}

// --- Summary ---
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
