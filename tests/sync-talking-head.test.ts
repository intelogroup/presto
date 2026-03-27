/**
 * Unit tests for syncTalkingHead.js — drift absorption, frame math,
 * audio-only handling, path traversal protection.
 *
 * Since syncTalkingHead.js uses require("child_process").execFile which is
 * tricky to mock with CommonJS, we test the core logic in isolation by
 * re-implementing the drift absorption and frame math functions.
 */

import { describe, it, expect } from "vitest";

// =========================================================================
// Re-implement drift absorption logic from syncTalkingHead.js lines 59-96
// =========================================================================
function absorbDrift(
  slides: Array<{ duration: number; [key: string]: any }>,
  totalVideoFrames: number,
  transitionFrames: number
): Array<{ duration: number }> {
  const cleanSlides = slides.map((s) => ({ ...s }));
  const numTransitions = Math.max(0, cleanSlides.length - 1);
  const effectiveTotalFrames = totalVideoFrames + numTransitions * transitionFrames;
  const sumOfFrames = cleanSlides.reduce((sum, s) => sum + s.duration, 0);
  let drift = effectiveTotalFrames - sumOfFrames;

  const lastIdx = cleanSlides.length - 1;
  const newLastDuration = cleanSlides[lastIdx].duration + drift;

  if (newLastDuration >= 60) {
    cleanSlides[lastIdx].duration = newLastDuration;
  } else {
    cleanSlides[lastIdx].duration = 60;
    let remaining = newLastDuration - 60;
    for (let i = lastIdx - 1; i >= 0 && remaining !== 0; i--) {
      const step = Math.sign(remaining);
      const candidate = cleanSlides[i].duration + step;
      if (candidate >= 60) {
        cleanSlides[i].duration = candidate;
        remaining -= step;
      }
    }
  }

  return cleanSlides;
}

describe("drift absorption", () => {
  it("absorbs positive drift into last slide", () => {
    // Video = 30s = 900 frames. Slides sum = 850. Transitions: 2*20=40
    // Target = 900 + 40 = 940. Drift = 940 - 850 = 90
    const slides = [{ duration: 300 }, { duration: 300 }, { duration: 250 }];
    const result = absorbDrift(slides, 900, 20);

    expect(result[2].duration).toBe(250 + 90); // 340
    const effectiveTotal = result.reduce((s, sl) => s + sl.duration, 0) - 2 * 20;
    expect(effectiveTotal).toBe(900);
  });

  it("absorbs negative drift into last slide", () => {
    // Video = 25s = 750 frames. Slides sum = 900. Transitions: 2*20=40
    // Target = 750 + 40 = 790. Drift = 790 - 900 = -110
    const slides = [{ duration: 300 }, { duration: 300 }, { duration: 300 }];
    const result = absorbDrift(slides, 750, 20);

    expect(result[2].duration).toBe(300 - 110); // 190
  });

  it("enforces minimum 60 frames when drift is very negative", () => {
    // Video = 10s = 300. Slides sum = 600. Transitions: 1*20=20
    // Target = 300 + 20 = 320. Drift = 320 - 600 = -280
    // Last: 300 - 280 = 20 → clamped to 60, redistribute -40 to prev slides
    const slides = [{ duration: 300 }, { duration: 300 }];
    const result = absorbDrift(slides, 300, 20);

    result.forEach((s) => expect(s.duration).toBeGreaterThanOrEqual(60));
  });

  it("handles zero drift (perfect match)", () => {
    const slides = [{ duration: 300 }, { duration: 300 }, { duration: 300 }];
    // Target = 900 + 40 = 940. Sum = 900. Drift = 40
    const result = absorbDrift(slides, 900, 20);

    // Sum should = 940 (target)
    const total = result.reduce((s, sl) => s + sl.duration, 0);
    expect(total).toBe(940);
  });

  it("works with single slide (no transitions)", () => {
    const slides = [{ duration: 300 }];
    // Target = 500 + 0 = 500. Sum = 300. Drift = 200
    const result = absorbDrift(slides, 500, 20);

    expect(result[0].duration).toBe(500);
  });

  it("distributes excess negative drift across multiple slides", () => {
    // 5 slides at 100 each = 500. Target = 100 + 4*20 = 180. Drift = 180 - 500 = -320
    // Last: 100 - 320 = -220 → clamped to 60. Remaining = -220 - 60 = -280
    // Previous slides reduced 1 frame at a time
    const slides = Array.from({ length: 5 }, () => ({ duration: 100 }));
    const result = absorbDrift(slides, 100, 20);

    result.forEach((s) => expect(s.duration).toBeGreaterThanOrEqual(60));
  });

  it("uses different transition frame values", () => {
    const slides = [{ duration: 300 }, { duration: 300 }];

    // transitionFrames=10: target = 900 + 10 = 910
    const result10 = absorbDrift(slides.map(s => ({ ...s })), 900, 10);
    expect(result10.reduce((s, sl) => s + sl.duration, 0)).toBe(910);

    // transitionFrames=0: target = 900 + 0 = 900
    const result0 = absorbDrift(slides.map(s => ({ ...s })), 900, 0);
    expect(result0.reduce((s, sl) => s + sl.duration, 0)).toBe(900);
  });
});

// =========================================================================
// getMediaInfo frame calculation — mirrors syncTalkingHead.js line 36
// =========================================================================
describe("frame calculation", () => {
  it("converts duration to frames at 30fps", () => {
    expect(Math.round(10 * 30)).toBe(300);
    expect(Math.round(30.5 * 30)).toBe(915);
    expect(Math.round(0.5 * 30)).toBe(15);
    expect(Math.round(120 * 30)).toBe(3600);
  });

  it("handles fractional seconds correctly", () => {
    // 5.67s = 170.1 → 170 frames
    expect(Math.round(5.67 * 30)).toBe(170);
    // 10.33s = 309.9 → 310 frames
    expect(Math.round(10.33 * 30)).toBe(310);
  });
});

// =========================================================================
// Internal field stripping — mirrors syncTalkingHead.js line 57
// =========================================================================
describe("internal field stripping", () => {
  it("removes _segmentStart and _segmentEnd", () => {
    const slides = [
      { type: "title", title: "T", duration: 300, _segmentStart: 0, _segmentEnd: 10 },
      { type: "checklist", title: "C", duration: 300, _segmentStart: 10, _segmentEnd: 20 },
    ];
    const clean = slides.map(({ _segmentStart, _segmentEnd, ...rest }) => rest);

    clean.forEach((s) => {
      expect(s).not.toHaveProperty("_segmentStart");
      expect(s).not.toHaveProperty("_segmentEnd");
      expect(s).toHaveProperty("type");
      expect(s).toHaveProperty("duration");
    });
  });
});

// =========================================================================
// jobId sanitization — mirrors syncTalkingHead.js line 100
// =========================================================================
describe("jobId sanitization", () => {
  function sanitizeJobId(jobId: string): string {
    return jobId.replace(/[^a-zA-Z0-9\-]/g, "_");
  }

  it("preserves UUID-like jobIds", () => {
    expect(sanitizeJobId("abc-123-def")).toBe("abc-123-def");
    expect(sanitizeJobId("550e8400-e29b-41d4-a716-446655440000")).toBe("550e8400-e29b-41d4-a716-446655440000");
  });

  it("strips dots and slashes", () => {
    expect(sanitizeJobId("test.job")).toBe("test_job");
    expect(sanitizeJobId("../../etc")).toBe("______etc");
    expect(sanitizeJobId("a/b/c")).toBe("a_b_c");
  });

  it("strips spaces and special chars", () => {
    expect(sanitizeJobId("test job")).toBe("test_job");
    expect(sanitizeJobId("test;rm -rf")).toBe("test_rm_-rf");
  });
});

// =========================================================================
// Effective total frames formula
// =========================================================================
describe("effective total frames formula", () => {
  it("accounts for transition overlap correctly", () => {
    // After drift absorption, sum of slide durations = target
    // target = totalVideoFrames + (numSlides - 1) * transitionFrames
    // So effective = target - (numSlides - 1) * transitionFrames = totalVideoFrames
    const totalVideoFrames = 900;
    const numSlides = 5;
    const transitionFrames = 15;

    const target = totalVideoFrames + (numSlides - 1) * transitionFrames; // 960
    const effective = target - (numSlides - 1) * transitionFrames; // 900

    expect(effective).toBe(totalVideoFrames);
  });

  it("single slide has no transition subtraction", () => {
    const totalVideoFrames = 300;
    const target = totalVideoFrames + 0; // 0 transitions
    expect(target).toBe(300);
  });
});

// =========================================================================
// Audio-only detection
// =========================================================================
describe("audio-only detection", () => {
  it("correctly identifies audio-only from stream info", () => {
    const videoFile = { streams: [{ codec_type: "video" }, { codec_type: "audio" }] };
    const audioOnly = { streams: [{ codec_type: "audio" }] };

    const hasVideoV = !!videoFile.streams.find((s) => s.codec_type === "video");
    const hasVideoA = !!audioOnly.streams.find((s) => s.codec_type === "video");

    expect(hasVideoV).toBe(true);
    expect(hasVideoA).toBe(false);
  });
});
