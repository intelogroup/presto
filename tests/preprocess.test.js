#!/usr/bin/env node
/**
 * Unit tests for preprocess.js — buildKeepSegments + buildComplexFilter logic.
 * Run: node tests/preprocess.test.js
 */

const { buildKeepSegments } = require("../pipeline/preprocess");

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

function approxEqual(a, b, eps = 0.01) {
  return Math.abs(a - b) < eps;
}

// =========================================================================
// buildKeepSegments tests — with explicit keepDuration=0.5 (old behavior)
// =========================================================================

console.log("Test 1: No silences");
{
  const segs = buildKeepSegments(120, []);
  assert(segs.length === 1, "should return 1 segment");
  assert(segs[0].start === 0 && segs[0].end === 120, "segment covers full video");
}

console.log("Test 2: Single silence in middle (keepDuration=0.5)");
{
  const segs = buildKeepSegments(60, [{ start: 20, end: 30 }], 0.5);
  assert(segs.length === 2, `should return 2 segments (got ${segs.length})`);
  assert(segs[0].start === 0, "first segment starts at 0");
  assert(approxEqual(segs[0].end, 20.25), `first segment ends near 20.25 (got ${segs[0].end})`);
  assert(approxEqual(segs[1].start, 29.75), `second segment starts near 29.75 (got ${segs[1].start})`);
  assert(segs[1].end === 60, "second segment ends at 60");
}

console.log("Test 3: Silence at start (keepDuration=0.5)");
{
  const segs = buildKeepSegments(60, [{ start: 0, end: 10 }], 0.5);
  assert(segs.length === 1, `should return 1 segment (got ${segs.length})`);
  assert(approxEqual(segs[0].start, 9.75), `starts near 9.75 (got ${segs[0].start})`);
  assert(segs[0].end === 60, "ends at 60");
}

console.log("Test 4: Silence at end (keepDuration=0.5)");
{
  const segs = buildKeepSegments(60, [{ start: 50, end: 60 }], 0.5);
  assert(segs.length >= 1, `should return at least 1 segment (got ${segs.length})`);
  assert(segs[0].start === 0, "starts at 0");
  assert(approxEqual(segs[0].end, 50.25), `main segment ends near 50.25 (got ${segs[0].end})`);
  const totalKept = segs.reduce((sum, s) => sum + (s.end - s.start), 0);
  assert(totalKept < 51, `total kept is reasonable (${totalKept.toFixed(1)}s)`);
}

console.log("Test 5: Multiple silences (keepDuration=0.5)");
{
  const silences = [
    { start: 20, end: 30 },
    { start: 50, end: 65 },
    { start: 90, end: 100 },
  ];
  const segs = buildKeepSegments(120, silences, 0.5);
  assert(segs.length === 4, `should return 4 segments (got ${segs.length})`);
  const totalKept = segs.reduce((sum, s) => sum + (s.end - s.start), 0);
  const totalSilenceRemoved = 120 - totalKept;
  assert(totalSilenceRemoved > 25, `removed significant silence (${totalSilenceRemoved.toFixed(1)}s)`);
  assert(totalSilenceRemoved < 35, `didn't remove too much (${totalSilenceRemoved.toFixed(1)}s)`);
}

console.log("Test 6: Silence to end (Infinity, keepDuration=0.5)");
{
  const segs = buildKeepSegments(60, [{ start: 45, end: Infinity }], 0.5);
  assert(segs.length >= 1, `should return at least 1 segment (got ${segs.length})`);
  assert(segs[0].start === 0, "starts at 0");
  assert(approxEqual(segs[0].end, 45.25), `main segment ends near 45.25 (got ${segs[0].end})`);
}

console.log("Test 7: Entire video is silence (keepDuration=0.5)");
{
  const segs = buildKeepSegments(5, [{ start: 0, end: 5 }], 0.5);
  const totalKept = segs.reduce((sum, s) => sum + (s.end - s.start), 0);
  assert(totalKept < 1, `kept very little (${totalKept.toFixed(2)}s)`);
}

console.log("Test 8: Back-to-back silences (keepDuration=0.5)");
{
  const silences = [
    { start: 10, end: 20 },
    { start: 21, end: 30 },
  ];
  const segs = buildKeepSegments(60, silences, 0.5);
  assert(segs.length >= 2, `should return at least 2 segments (got ${segs.length})`);
  assert(segs[0].start === 0, "first segment starts at 0");
}

// =========================================================================
// buildKeepSegments tests — with DEFAULT keepDuration=2.0 (new behavior)
// =========================================================================

console.log("\nTest 9: Single silence with default keepDuration=2.0");
{
  // 60s video, silence from 20s to 30s (10s silence)
  // Should keep: [0, 21] and [28, 60] — preserving 2s of the 10s silence
  const segs = buildKeepSegments(60, [{ start: 20, end: 30 }]);
  assert(segs.length === 2, `should return 2 segments (got ${segs.length})`);
  assert(segs[0].start === 0, "first segment starts at 0");
  assert(approxEqual(segs[0].end, 21), `first segment ends near 21 (got ${segs[0].end})`);
  assert(approxEqual(segs[1].start, 29), `second segment starts near 29 (got ${segs[1].start})`);
  // removed ~8s of the 10s silence
  const removed = 60 - segs.reduce((sum, s) => sum + (s.end - s.start), 0);
  assert(approxEqual(removed, 8, 0.5), `removed ~8s of silence (got ${removed.toFixed(1)}s)`);
}

console.log("Test 10: Short silence (exactly 4s) with default keepDuration=2.0");
{
  // 60s video, silence from 20s to 24s (exactly 4s)
  // keepDuration=2 means we keep 1s before + 1s after = 2s of the 4s silence
  const segs = buildKeepSegments(60, [{ start: 20, end: 24 }]);
  assert(segs.length === 2, `should return 2 segments (got ${segs.length})`);
  assert(approxEqual(segs[0].end, 21), `first ends near 21 (got ${segs[0].end})`);
  assert(approxEqual(segs[1].start, 23), `second starts near 23 (got ${segs[1].start})`);
  const removed = 60 - segs.reduce((sum, s) => sum + (s.end - s.start), 0);
  assert(approxEqual(removed, 2, 0.5), `removed ~2s of silence (got ${removed.toFixed(1)}s)`);
}

console.log("Test 11: Multiple silences with default keepDuration=2.0");
{
  // 120s video, silences at 20-30 (10s), 50-65 (15s), 90-100 (10s)
  // Should remove ~8 + ~13 + ~8 = ~29s
  const silences = [
    { start: 20, end: 30 },
    { start: 50, end: 65 },
    { start: 90, end: 100 },
  ];
  const segs = buildKeepSegments(120, silences);
  assert(segs.length === 4, `should return 4 segments (got ${segs.length})`);
  const totalKept = segs.reduce((sum, s) => sum + (s.end - s.start), 0);
  const removed = 120 - totalKept;
  assert(removed > 25, `removed significant silence (${removed.toFixed(1)}s)`);
  assert(removed < 35, `didn't remove too much (${removed.toFixed(1)}s)`);
}

console.log("Test 12: 20-min teacher video with many silences (default keepDuration=2.0)");
{
  // Simulates a realistic teacher recording: 1200s (20 min) with 8 silences
  const silences = [
    { start: 45, end: 52 },    // 7s — looking at notes
    { start: 120, end: 128 },  // 8s — coughing
    { start: 250, end: 260 },  // 10s — long pause
    { start: 400, end: 406 },  // 6s — drinking water
    { start: 550, end: 555 },  // 5s — turning page
    { start: 700, end: 720 },  // 20s — student question (silence on speaker mic)
    { start: 900, end: 910 },  // 10s — writing on board
    { start: 1100, end: 1108 }, // 8s — checking phone
  ];
  const segs = buildKeepSegments(1200, silences);
  assert(segs.length === 9, `should return 9 segments (got ${segs.length})`);
  const totalKept = segs.reduce((sum, s) => sum + (s.end - s.start), 0);
  const removed = 1200 - totalKept;
  // Total silence = 74s, each keeps 2s, so ~58s removed
  assert(removed > 50, `removed significant silence (${removed.toFixed(1)}s)`);
  assert(removed < 65, `didn't over-trim (${removed.toFixed(1)}s)`);
  // Verify no segment overlaps
  let noOverlap = true;
  for (let i = 1; i < segs.length; i++) {
    if (segs[i].start < segs[i - 1].end) {
      noOverlap = false;
      break;
    }
  }
  assert(noOverlap, "no segments overlap");
}

// =========================================================================
// buildComplexFilter tests (audio-only vs video+audio)
// =========================================================================

// We can't easily import buildComplexFilter since it's not exported, but
// we verify the behavior indirectly through buildKeepSegments producing
// valid segment arrays that the filter would consume.
console.log("\nTest 13: Segments are always ordered and non-overlapping");
{
  const silences = [
    { start: 5, end: 15 },
    { start: 25, end: 35 },
    { start: 45, end: 55 },
    { start: 65, end: 75 },
    { start: 85, end: 95 },
  ];
  const segs = buildKeepSegments(100, silences);
  let ordered = true;
  for (let i = 1; i < segs.length; i++) {
    if (segs[i].start < segs[i - 1].end) {
      ordered = false;
      break;
    }
  }
  assert(ordered, "all segments are ordered and non-overlapping");
  assert(segs.every((s) => s.end > s.start), "all segments have positive duration");
}

console.log("Test 14: Very long silence (60s) trimmed to 2s");
{
  // 120s video with one massive 60s silence
  const segs = buildKeepSegments(120, [{ start: 30, end: 90 }]);
  assert(segs.length === 2, `should return 2 segments (got ${segs.length})`);
  const totalKept = segs.reduce((sum, s) => sum + (s.end - s.start), 0);
  const removed = 120 - totalKept;
  // Should remove ~58s of the 60s silence (keeping 2s)
  assert(removed > 55, `removed most of 60s silence (${removed.toFixed(1)}s)`);
  assert(removed < 62, `didn't over-remove (${removed.toFixed(1)}s)`);
}

// --- Summary ---
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
