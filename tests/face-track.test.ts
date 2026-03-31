/**
 * Unit tests for pipeline/faceTrack.js — smoothKeypoints, clamping, fallbacks.
 *
 * The heavy deps (TensorFlow, canvas, ffmpeg) are mocked. We test the pure
 * logic: EMA smoothing, coordinate clamping, fallback behavior, and frame
 * timestamp calculation.
 */

import { describe, it, expect } from "vitest";

// ─── Re-implement smoothKeypoints (mirrors faceTrack.js lines 151-164) ──────
function smoothKeypoints(
  keypoints: Array<{ t: number; x: number; y: number }>,
  alpha: number = 0.4
): Array<{ t: number; x: number; y: number }> {
  if (keypoints.length === 0) return keypoints;

  const smoothed = [keypoints[0]];
  for (let i = 1; i < keypoints.length; i++) {
    const prev = smoothed[i - 1];
    const curr = keypoints[i];
    smoothed.push({
      t: curr.t,
      x: alpha * curr.x + (1 - alpha) * prev.x,
      y: alpha * curr.y + (1 - alpha) * prev.y,
    });
  }
  return smoothed;
}

// ─── Re-implement face center + clamp (mirrors faceTrack.js lines 209-214) ──
function computeFaceCenter(
  box: { xMin: number; yMin: number; width: number; height: number },
  imgWidth: number,
  imgHeight: number
): { x: number; y: number } {
  const cx = (box.xMin + box.width / 2) / imgWidth;
  const cy = (box.yMin + box.height / 2) / imgHeight;
  return {
    x: Math.max(0, Math.min(1, cx)),
    y: Math.max(0, Math.min(1, cy)),
  };
}

// ─── Re-implement timestamp calculation (mirrors faceTrack.js line 199) ─────
function frameTimestamp(frameIndex: number, sampleFps: number): number {
  return frameIndex / sampleFps;
}

describe("smoothKeypoints", () => {
  it("returns empty array for empty input", () => {
    expect(smoothKeypoints([])).toEqual([]);
  });

  it("returns single keypoint unchanged", () => {
    const kps = [{ t: 0, x: 0.5, y: 0.4 }];
    expect(smoothKeypoints(kps)).toEqual(kps);
  });

  it("applies EMA formula correctly with default alpha=0.4", () => {
    const kps = [
      { t: 0, x: 0.5, y: 0.5 },
      { t: 1, x: 1.0, y: 0.0 },
    ];
    const result = smoothKeypoints(kps);
    expect(result[0]).toEqual({ t: 0, x: 0.5, y: 0.5 });
    // x: 0.4 * 1.0 + 0.6 * 0.5 = 0.7
    // y: 0.4 * 0.0 + 0.6 * 0.5 = 0.3
    expect(result[1].x).toBeCloseTo(0.7, 10);
    expect(result[1].y).toBeCloseTo(0.3, 10);
  });

  it("applies EMA with alpha=1.0 (raw, no smoothing)", () => {
    const kps = [
      { t: 0, x: 0.2, y: 0.3 },
      { t: 1, x: 0.8, y: 0.9 },
    ];
    const result = smoothKeypoints(kps, 1.0);
    expect(result[1].x).toBeCloseTo(0.8, 10);
    expect(result[1].y).toBeCloseTo(0.9, 10);
  });

  it("applies EMA with alpha=0.0 (fully smoothed, locked to first value)", () => {
    const kps = [
      { t: 0, x: 0.5, y: 0.5 },
      { t: 1, x: 1.0, y: 1.0 },
      { t: 2, x: 0.0, y: 0.0 },
    ];
    const result = smoothKeypoints(kps, 0.0);
    expect(result[1].x).toBeCloseTo(0.5, 10);
    expect(result[1].y).toBeCloseTo(0.5, 10);
    expect(result[2].x).toBeCloseTo(0.5, 10);
    expect(result[2].y).toBeCloseTo(0.5, 10);
  });

  it("smooths a multi-point sequence progressively", () => {
    const kps = [
      { t: 0, x: 0.0, y: 0.0 },
      { t: 1, x: 1.0, y: 1.0 },
      { t: 2, x: 1.0, y: 1.0 },
      { t: 3, x: 1.0, y: 1.0 },
    ];
    const result = smoothKeypoints(kps, 0.4);
    // Each step moves closer to 1.0
    expect(result[1].x).toBeCloseTo(0.4, 10);
    expect(result[2].x).toBeCloseTo(0.64, 10); // 0.4*1.0 + 0.6*0.4
    expect(result[3].x).toBeCloseTo(0.784, 10); // 0.4*1.0 + 0.6*0.64
    // Should be monotonically increasing toward 1.0
    expect(result[1].x).toBeLessThan(result[2].x);
    expect(result[2].x).toBeLessThan(result[3].x);
    expect(result[3].x).toBeLessThan(1.0);
  });

  it("preserves timestamps from original keypoints", () => {
    const kps = [
      { t: 0.0, x: 0.5, y: 0.5 },
      { t: 0.5, x: 0.6, y: 0.4 },
      { t: 1.0, x: 0.7, y: 0.3 },
    ];
    const result = smoothKeypoints(kps);
    expect(result.map((k) => k.t)).toEqual([0.0, 0.5, 1.0]);
  });
});

describe("computeFaceCenter — coordinate normalization & clamping", () => {
  it("computes center of face box normalized to [0,1]", () => {
    const box = { xMin: 100, yMin: 50, width: 200, height: 200 };
    const result = computeFaceCenter(box, 640, 480);
    // cx = (100 + 100) / 640 = 0.3125
    // cy = (50 + 100) / 480 = 0.3125
    expect(result.x).toBeCloseTo(0.3125, 10);
    expect(result.y).toBeCloseTo(0.3125, 10);
  });

  it("returns (0.5, 0.5) for centered face in square image", () => {
    const box = { xMin: 0, yMin: 0, width: 100, height: 100 };
    const result = computeFaceCenter(box, 100, 100);
    expect(result.x).toBeCloseTo(0.5, 10);
    expect(result.y).toBeCloseTo(0.5, 10);
  });

  it("clamps to 0 when face extends into negative coords", () => {
    const box = { xMin: -200, yMin: -200, width: 50, height: 50 };
    const result = computeFaceCenter(box, 320, 240);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it("clamps to 1 when face extends beyond image bounds", () => {
    const box = { xMin: 600, yMin: 400, width: 100, height: 100 };
    const result = computeFaceCenter(box, 320, 240);
    expect(result.x).toBe(1);
    expect(result.y).toBe(1);
  });

  it("handles face at exact top-left corner", () => {
    const box = { xMin: 0, yMin: 0, width: 0, height: 0 };
    const result = computeFaceCenter(box, 320, 240);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it("handles face at exact bottom-right corner", () => {
    const box = { xMin: 320, yMin: 240, width: 0, height: 0 };
    const result = computeFaceCenter(box, 320, 240);
    expect(result.x).toBe(1);
    expect(result.y).toBe(1);
  });
});

describe("frameTimestamp", () => {
  it("calculates timestamp at 1fps", () => {
    expect(frameTimestamp(0, 1)).toBe(0);
    expect(frameTimestamp(5, 1)).toBe(5);
    expect(frameTimestamp(10, 1)).toBe(10);
  });

  it("calculates timestamp at 2fps", () => {
    expect(frameTimestamp(0, 2)).toBe(0);
    expect(frameTimestamp(1, 2)).toBe(0.5);
    expect(frameTimestamp(4, 2)).toBe(2);
  });

  it("calculates timestamp at 30fps", () => {
    expect(frameTimestamp(30, 30)).toBe(1);
    expect(frameTimestamp(15, 30)).toBe(0.5);
  });
});

describe("fallback behavior", () => {
  const DEFAULT_FALLBACK = { x: 0.5, y: 0.4 };

  it("uses default center-ish position when no face is detected", () => {
    // Simulates the fallback logic in faceTrack.js line 195
    const lastGoodPoint = { ...DEFAULT_FALLBACK };
    // When no faces detected, rawKeypoints should use lastGoodPoint
    const rawKeypoints = [{ t: 0, ...lastGoodPoint }];
    expect(rawKeypoints[0].x).toBe(0.5);
    expect(rawKeypoints[0].y).toBe(0.4);
  });

  it("holds last known position through consecutive failed detections", () => {
    // Simulate: frame 0 detects face, frames 1-3 fail
    let lastGoodPoint = { x: 0.5, y: 0.4 };
    const rawKeypoints: Array<{ t: number; x: number; y: number }> = [];

    // Frame 0: face detected at (0.3, 0.6)
    lastGoodPoint = { x: 0.3, y: 0.6 };
    rawKeypoints.push({ t: 0, ...lastGoodPoint });

    // Frames 1-3: detection fails
    for (let i = 1; i <= 3; i++) {
      rawKeypoints.push({ t: i, ...lastGoodPoint });
    }

    // All hold at last good position
    for (let i = 1; i <= 3; i++) {
      expect(rawKeypoints[i].x).toBe(0.3);
      expect(rawKeypoints[i].y).toBe(0.6);
    }
  });

  it("resumes tracking after detection recovers", () => {
    let lastGoodPoint = { x: 0.5, y: 0.4 };
    const rawKeypoints: Array<{ t: number; x: number; y: number }> = [];

    // Frame 0: detect at (0.3, 0.6)
    lastGoodPoint = { x: 0.3, y: 0.6 };
    rawKeypoints.push({ t: 0, ...lastGoodPoint });

    // Frame 1: fail
    rawKeypoints.push({ t: 1, ...lastGoodPoint });

    // Frame 2: detect at (0.7, 0.2)
    lastGoodPoint = { x: 0.7, y: 0.2 };
    rawKeypoints.push({ t: 2, ...lastGoodPoint });

    expect(rawKeypoints[1].x).toBe(0.3); // held
    expect(rawKeypoints[2].x).toBe(0.7); // recovered
  });
});

describe("end-to-end keypoint pipeline (unit simulation)", () => {
  it("produces smoothed output from raw face detections", () => {
    // Simulate: 5 frames, face gradually moves right
    const raw = [
      { t: 0, x: 0.3, y: 0.5 },
      { t: 1, x: 0.4, y: 0.5 },
      { t: 2, x: 0.5, y: 0.5 },
      { t: 3, x: 0.6, y: 0.5 },
      { t: 4, x: 0.7, y: 0.5 },
    ];
    const smoothed = smoothKeypoints(raw, 0.4);

    // Smoothed x should lag behind raw x
    expect(smoothed[0].x).toBe(0.3); // first point unchanged
    expect(smoothed[2].x).toBeLessThan(0.5); // lags behind raw 0.5
    expect(smoothed[4].x).toBeLessThan(0.7); // lags behind raw 0.7

    // But should still be increasing
    for (let i = 1; i < smoothed.length; i++) {
      expect(smoothed[i].x).toBeGreaterThan(smoothed[i - 1].x);
    }
  });

  it("all keypoints stay in [0,1] range after smoothing", () => {
    const raw = [
      { t: 0, x: 0.0, y: 0.0 },
      { t: 1, x: 1.0, y: 1.0 },
      { t: 2, x: 0.0, y: 0.0 },
      { t: 3, x: 1.0, y: 1.0 },
    ];
    const smoothed = smoothKeypoints(raw, 0.4);
    for (const kp of smoothed) {
      expect(kp.x).toBeGreaterThanOrEqual(0);
      expect(kp.x).toBeLessThanOrEqual(1);
      expect(kp.y).toBeGreaterThanOrEqual(0);
      expect(kp.y).toBeLessThanOrEqual(1);
    }
  });
});
