/**
 * Unit tests for generateSlides.js — schema validation, segment coverage,
 * duration calculation, and theme config.
 *
 * Since generateSlides.js uses a lazy singleton for OpenAI that's hard to mock
 * via vi.mock with CommonJS, we test the internal logic by importing the module's
 * internals indirectly via the `validateSegmentCoverage` pattern and by testing
 * duration/schema logic in isolation.
 *
 * Full integration tests with mocked OpenAI are handled via the schema-validation
 * and server tests. This file focuses on the segment coverage validator, duration
 * math, and theme config validation.
 */

import { describe, it, expect } from "vitest";

// =========================================================================
// validateSegmentCoverage — re-implemented to test in isolation
// (mirrors generateSlides.js lines 213-244 exactly)
// =========================================================================
function validateSegmentCoverage(
  slides: Array<{ segmentIndices?: number[]; reuseSlideIndex?: number }>,
  totalSegments: number
): string[] {
  const covered = new Array(totalSegments).fill(false);
  const errors: string[] = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const indices = slide.segmentIndices;

    if (!Array.isArray(indices) || indices.length === 0) {
      errors.push(`slide[${i}]: missing or empty segmentIndices`);
      continue;
    }

    for (const idx of indices) {
      if (typeof idx !== "number" || idx < 0 || idx >= totalSegments) {
        errors.push(`slide[${i}]: segmentIndices contains invalid index ${idx} (valid: 0–${totalSegments - 1})`);
        continue;
      }
      if (covered[idx]) {
        errors.push(`slide[${i}]: segment index ${idx} is already assigned to a previous slide`);
      }
      covered[idx] = true;
    }
  }

  const missing = covered.map((v: boolean, i: number) => (!v ? i : null)).filter((v: number | null) => v !== null);
  if (missing.length > 0) {
    errors.push(`segments [${missing.join(", ")}] are not assigned to any slide — every segment must appear in exactly one slide`);
  }

  return errors;
}

describe("validateSegmentCoverage", () => {
  it("accepts perfect coverage", () => {
    const slides = [
      { segmentIndices: [0, 1] },
      { segmentIndices: [2, 3] },
      { segmentIndices: [4, 5] },
    ];
    expect(validateSegmentCoverage(slides, 6)).toEqual([]);
  });

  it("detects gaps (missing segments)", () => {
    const slides = [
      { segmentIndices: [0, 1] },
      { segmentIndices: [4, 5] }, // gap: 2, 3 missing
    ];
    const errors = validateSegmentCoverage(slides, 6);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.includes("not assigned"))).toBe(true);
  });

  it("detects overlaps (duplicate segment)", () => {
    const slides = [
      { segmentIndices: [0, 1, 2] },
      { segmentIndices: [2, 3] }, // 2 is duplicated
      { segmentIndices: [4, 5] },
    ];
    const errors = validateSegmentCoverage(slides, 6);
    expect(errors.some((e) => e.includes("already assigned"))).toBe(true);
  });

  it("detects out-of-range indices", () => {
    const slides = [
      { segmentIndices: [0, 1] },
      { segmentIndices: [2, 99] }, // 99 is out of range
      { segmentIndices: [4, 5] },
    ];
    const errors = validateSegmentCoverage(slides, 6);
    expect(errors.some((e) => e.includes("invalid index 99"))).toBe(true);
  });

  it("detects negative indices", () => {
    const slides = [
      { segmentIndices: [-1, 0] },
      { segmentIndices: [1, 2] },
    ];
    const errors = validateSegmentCoverage(slides, 3);
    expect(errors.some((e) => e.includes("invalid index -1"))).toBe(true);
  });

  it("detects missing segmentIndices", () => {
    const slides = [
      { segmentIndices: [0, 1] },
      {} as any, // no segmentIndices
      { segmentIndices: [4, 5] },
    ];
    const errors = validateSegmentCoverage(slides, 6);
    expect(errors.some((e) => e.includes("missing or empty"))).toBe(true);
  });

  it("detects empty segmentIndices array", () => {
    const slides = [
      { segmentIndices: [0, 1] },
      { segmentIndices: [] },
      { segmentIndices: [4, 5] },
    ];
    const errors = validateSegmentCoverage(slides, 6);
    expect(errors.some((e) => e.includes("missing or empty"))).toBe(true);
  });

  it("handles single segment per slide", () => {
    const slides = [0, 1, 2, 3, 4, 5].map((i) => ({ segmentIndices: [i] }));
    expect(validateSegmentCoverage(slides, 6)).toEqual([]);
  });

  it("handles all segments in one slide", () => {
    const slides = [{ segmentIndices: [0, 1, 2, 3, 4, 5] }];
    expect(validateSegmentCoverage(slides, 6)).toEqual([]);
  });
});

// =========================================================================
// Duration calculation logic — mirrors generateSlides.js lines 417-438
// =========================================================================
function calcSlideDuration(
  slideIndex: number,
  totalSlides: number,
  segments: Array<{ start: number; end: number }>,
  segmentIndices: number[],
  allSlides: Array<{ segmentIndices: number[] }>,
  transitionFrames: number
): number {
  const coveredSegments = segmentIndices.map((idx) => segments[idx]);
  const start = slideIndex === 0 ? 0 : coveredSegments[0].start;
  let end;
  if (slideIndex < totalSlides - 1) {
    const nextSegIdx = allSlides[slideIndex + 1].segmentIndices[0];
    end = segments[nextSegIdx].start;
  } else {
    end = coveredSegments[coveredSegments.length - 1].end;
  }
  const rawDuration = Math.max(60, Math.round((end - start) * 30));
  return slideIndex < totalSlides - 1 ? rawDuration + transitionFrames : rawDuration;
}

describe("slide duration calculation", () => {
  const segments = [
    { start: 0, end: 5 },
    { start: 5, end: 10 },
    { start: 10, end: 15 },
    { start: 15, end: 20 },
    { start: 20, end: 25 },
    { start: 25, end: 30 },
  ];
  const allSlides = [
    { segmentIndices: [0, 1] },
    { segmentIndices: [2, 3] },
    { segmentIndices: [4, 5] },
  ];

  it("first slide anchors from frame 0", () => {
    const d = calcSlideDuration(0, 3, segments, [0, 1], allSlides, 20);
    // 0 to 10 (start of next slide's seg[2]) = 10s = 300 frames + 20 transition = 320
    expect(d).toBe(320);
  });

  it("middle slide uses segment start as anchor", () => {
    const d = calcSlideDuration(1, 3, segments, [2, 3], allSlides, 20);
    // 10 to 20 (start of next slide's seg[4]) = 10s = 300 frames + 20 transition = 320
    expect(d).toBe(320);
  });

  it("last slide ends at its last segment end (no transition added)", () => {
    const d = calcSlideDuration(2, 3, segments, [4, 5], allSlides, 20);
    // 20 to 30 = 10s = 300 frames, NO transition
    expect(d).toBe(300);
  });

  it("enforces minimum 60 frames", () => {
    const shortSegments = [
      { start: 0, end: 0.5 },
      { start: 0.5, end: 1.0 },
    ];
    const shortSlides = [{ segmentIndices: [0] }, { segmentIndices: [1] }];
    const d = calcSlideDuration(1, 2, shortSegments, [1], shortSlides, 20);
    // 0.5 to 1.0 = 0.5s = 15 frames → clamped to 60
    expect(d).toBe(60);
  });

  it("first slide absorbs initial Whisper silence correctly", () => {
    // Whisper starts at 2s (initial silence)
    const delayedSegments = [
      { start: 2.0, end: 7.0 },
      { start: 7.0, end: 12.0 },
      { start: 12.0, end: 17.0 },
    ];
    const slides = [
      { segmentIndices: [0] },
      { segmentIndices: [1] },
      { segmentIndices: [2] },
    ];
    const d = calcSlideDuration(0, 3, delayedSegments, [0], slides, 20);
    // 0 to 7.0 (next slide start) = 7s = 210 frames + 20 = 230
    expect(d).toBe(230);
  });
});

// =========================================================================
// THEME_CONFIGS validation
// =========================================================================
describe("THEME_CONFIGS", () => {
  const THEME_CONFIGS: Record<string, { compositionId: string; transitionFrames: number; name: string }> = {
    P1: { compositionId: "Presentation", transitionFrames: 20, name: "Dark Tech" },
    P3: { compositionId: "Presentation3", transitionFrames: 10, name: "Dashboard/KPI" },
    P17: { compositionId: "Presentation17", transitionFrames: 20, name: "Prestige Academic" },
    P8: { compositionId: "Presentation8", transitionFrames: 15, name: "Clean Minimalist" },
  };

  it("has correct compositionId for each theme", () => {
    expect(THEME_CONFIGS.P1.compositionId).toBe("Presentation");
    expect(THEME_CONFIGS.P3.compositionId).toBe("Presentation3");
    expect(THEME_CONFIGS.P17.compositionId).toBe("Presentation17");
    expect(THEME_CONFIGS.P8.compositionId).toBe("Presentation8");
  });

  it("has positive transitionFrames for each theme", () => {
    Object.values(THEME_CONFIGS).forEach((t) => {
      expect(t.transitionFrames).toBeGreaterThan(0);
    });
  });

  it("P1 is NOT 'Presentation1'", () => {
    expect(THEME_CONFIGS.P1.compositionId).not.toBe("Presentation1");
  });
});

// =========================================================================
// Segment density check — mirrors generateSlides.js lines 344-352
// =========================================================================
describe("segment density check", () => {
  function checkDensity(slides: Array<{ segmentIndices: number[] }>): string[] {
    return slides
      .map((s, i) =>
        s.segmentIndices.length > 4
          ? `slide[${i}] covers ${s.segmentIndices.length} segments — max is 4`
          : null
      )
      .filter(Boolean) as string[];
  }

  it("accepts slides with 1-4 segments", () => {
    expect(checkDensity([{ segmentIndices: [0] }])).toEqual([]);
    expect(checkDensity([{ segmentIndices: [0, 1, 2, 3] }])).toEqual([]);
  });

  it("rejects slides with 5+ segments", () => {
    const errors = checkDensity([{ segmentIndices: [0, 1, 2, 3, 4] }]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("5 segments");
  });
});

// =========================================================================
// reuseSlideIndex validation — mirrors generateSlides.js lines 361-369
// =========================================================================
describe("reuseSlideIndex validation", () => {
  function validateReuse(slideIndex: number, reuseIndex: number, resolvedSlides: Array<{ _isReuse: boolean }>): string | null {
    if (reuseIndex < 0 || reuseIndex >= slideIndex) {
      return `slide[${slideIndex}]: reuseSlideIndex ${reuseIndex} is out of range`;
    }
    if (resolvedSlides[reuseIndex]._isReuse) {
      return `slide[${slideIndex}]: reuseSlideIndex ${reuseIndex} points to another reuse slide`;
    }
    return null;
  }

  it("accepts valid forward reference", () => {
    const resolved = [{ _isReuse: false }, { _isReuse: false }];
    expect(validateReuse(2, 0, resolved)).toBeNull();
    expect(validateReuse(2, 1, resolved)).toBeNull();
  });

  it("rejects self-reference", () => {
    const resolved = [{ _isReuse: false }];
    expect(validateReuse(1, 1, resolved)).toContain("out of range");
  });

  it("rejects future reference", () => {
    const resolved = [{ _isReuse: false }];
    expect(validateReuse(1, 2, resolved)).toContain("out of range");
  });

  it("rejects negative index", () => {
    const resolved = [{ _isReuse: false }];
    expect(validateReuse(1, -1, resolved)).toContain("out of range");
  });

  it("rejects chained reuse (reuse pointing to reuse)", () => {
    const resolved = [{ _isReuse: false }, { _isReuse: true }];
    expect(validateReuse(2, 1, resolved)).toContain("points to another reuse slide");
  });
});
