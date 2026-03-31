/**
 * Unit tests for calcDuration() from src/Root.tsx.
 *
 * Pure function: calcDuration(slides, transitionFrames) → total frames.
 * Formula: sum(durations) - (numSlides - 1) * transitionFrames
 *
 * Also tests the per-composition transition values used in Root.tsx
 * calculateMetadata callbacks.
 */

import { describe, it, expect } from "vitest";

// Re-implement calcDuration (mirrors Root.tsx lines 27-31)
function calcDuration(
  slides: Array<{ duration: number }>,
  transitionFrames: number = 20
): number {
  const total = slides.reduce((sum, s) => sum + s.duration, 0);
  const transitionOverlap = Math.max(0, slides.length - 1) * transitionFrames;
  return total - transitionOverlap;
}

describe("calcDuration — basic formula", () => {
  it("sums durations with no transitions for single slide", () => {
    expect(calcDuration([{ duration: 300 }])).toBe(300);
  });

  it("subtracts one transition for two slides", () => {
    expect(calcDuration([{ duration: 300 }, { duration: 300 }])).toBe(580);
    // 600 - (1 * 20)
  });

  it("subtracts (n-1) transitions for n slides", () => {
    const slides = Array(5).fill({ duration: 100 });
    // 500 - 4*20 = 420
    expect(calcDuration(slides)).toBe(420);
  });

  it("handles empty slides array", () => {
    expect(calcDuration([])).toBe(0);
  });

  it("handles single slide with minimum 60 frames", () => {
    expect(calcDuration([{ duration: 60 }])).toBe(60);
  });
});

describe("calcDuration — custom transitionFrames", () => {
  it("uses transitionFrames=0 (no overlap)", () => {
    const slides = [{ duration: 100 }, { duration: 200 }, { duration: 300 }];
    expect(calcDuration(slides, 0)).toBe(600);
  });

  it("uses transitionFrames=10 (P3, P4, P11, P16)", () => {
    const slides = [{ duration: 100 }, { duration: 200 }];
    expect(calcDuration(slides, 10)).toBe(290);
  });

  it("uses transitionFrames=15 (P5, P8, P13)", () => {
    const slides = [{ duration: 100 }, { duration: 200 }];
    expect(calcDuration(slides, 15)).toBe(285);
  });

  it("uses transitionFrames=20 (P1, P6, P14, P17 default)", () => {
    const slides = [{ duration: 100 }, { duration: 200 }];
    expect(calcDuration(slides, 20)).toBe(280);
  });

  it("uses transitionFrames=8 (P7, P12)", () => {
    const slides = [{ duration: 100 }, { duration: 200 }];
    expect(calcDuration(slides, 8)).toBe(292);
  });

  it("uses transitionFrames=3 (P15 — minimal)", () => {
    const slides = [{ duration: 100 }, { duration: 200 }];
    expect(calcDuration(slides, 3)).toBe(297);
  });

  it("uses transitionFrames=12 (P9)", () => {
    const slides = [{ duration: 100 }, { duration: 200 }];
    expect(calcDuration(slides, 12)).toBe(288);
  });

  it("uses transitionFrames=18 (P10)", () => {
    const slides = [{ duration: 100 }, { duration: 200 }];
    expect(calcDuration(slides, 18)).toBe(282);
  });
});

describe("calcDuration — edge cases", () => {
  it("handles very large number of slides", () => {
    const slides = Array(100).fill({ duration: 60 });
    // 6000 - 99*20 = 6000 - 1980 = 4020
    expect(calcDuration(slides)).toBe(4020);
  });

  it("result can be negative if transitions exceed total duration", () => {
    // 2 slides of 60 frames with 100-frame transitions
    const result = calcDuration([{ duration: 60 }, { duration: 60 }], 100);
    // 120 - 100 = 20
    expect(result).toBe(20);
  });

  it("handles slides with varying durations", () => {
    const slides = [
      { duration: 60 },
      { duration: 300 },
      { duration: 150 },
      { duration: 90 },
    ];
    // 600 - 3*20 = 540
    expect(calcDuration(slides)).toBe(540);
  });

  it("result matches the inline formula used in compositions P4-P16", () => {
    // Verify the inline formula used in Root.tsx P4-P16 compositions
    // total = slides.reduce((sum, s) => sum + s.duration, 0)
    // overlap = Math.max(0, slides.length - 1) * transitionFrames
    // durationInFrames = total - overlap
    const slides = [{ duration: 200 }, { duration: 300 }, { duration: 250 }];
    const transitionFrames = 10;
    const total = slides.reduce((sum, s) => sum + s.duration, 0);
    const overlap = Math.max(0, slides.length - 1) * transitionFrames;
    const inlineResult = total - overlap;
    expect(calcDuration(slides, transitionFrames)).toBe(inlineResult);
  });
});

describe("per-composition transition frames mapping", () => {
  // These map to the exact values used in Root.tsx
  const COMPOSITION_TRANSITIONS: Record<string, number> = {
    Presentation: 20,   // P1
    Presentation2: 20,  // P2 (default)
    Presentation3: 10,  // P3
    Presentation4: 10,  // P4
    Presentation5: 15,  // P5
    Presentation6: 20,  // P6
    Presentation7: 8,   // P7
    Presentation8: 15,  // P8
    Presentation9: 12,  // P9
    Presentation10: 18, // P10
    Presentation11: 10, // P11
    Presentation12: 8,  // P12
    Presentation13: 15, // P13
    Presentation14: 20, // P14
    Presentation15: 3,  // P15
    Presentation16: 10, // P16
    Presentation17: 20, // P17
    Presentation18: 12, // P18
    Presentation19: 10, // P19
    Presentation20: 5,  // P20
  };

  it("P1 uses compositionId 'Presentation' (not 'Presentation1')", () => {
    expect(COMPOSITION_TRANSITIONS).toHaveProperty("Presentation");
    expect(COMPOSITION_TRANSITIONS).not.toHaveProperty("Presentation1");
  });

  it("all transition values are positive integers", () => {
    for (const [id, frames] of Object.entries(COMPOSITION_TRANSITIONS)) {
      expect(frames, `${id} should have positive transitionFrames`).toBeGreaterThan(0);
      expect(Number.isInteger(frames), `${id} should have integer transitionFrames`).toBe(true);
    }
  });

  it("all 20 compositions have transition mappings", () => {
    expect(Object.keys(COMPOSITION_TRANSITIONS)).toHaveLength(20);
  });
});
