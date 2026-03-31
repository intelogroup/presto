/**
 * Unit tests for useFacePosition logic from src/TalkingHead.tsx.
 *
 * Since useFacePosition is a React hook (uses useCurrentFrame, useMemo),
 * we test the pure logic it encapsulates: time calculation, default
 * fallback, single keypoint scaling, and multi-keypoint interpolation.
 */

import { describe, it, expect } from "vitest";

// ─── Time calculation (mirrors TalkingHead.tsx line 39) ─────────────────────
function currentTime(frame: number, startFrom: number, fps: number): number {
  return (frame + startFrom) / fps;
}

// ─── Default fallback (mirrors TalkingHead.tsx line 42-43) ──────────────────
function defaultPosition(): { x: number; y: number } {
  return { x: 50, y: 40 };
}

// ─── Single keypoint (mirrors TalkingHead.tsx lines 45-49) ──────────────────
function singleKeypointPosition(kp: { x: number; y: number }): { x: number; y: number } {
  return { x: kp.x * 100, y: kp.y * 100 };
}

// ─── Multi-keypoint interpolation (mirrors TalkingHead.tsx lines 53-72) ─────
// Simplified interpolation matching Remotion's interpolate with clamp
function interpolatePosition(
  time: number,
  faceTrack: Array<{ t: number; x: number; y: number }>
): { x: number; y: number } {
  const timestamps = faceTrack.map((kp) => kp.t);
  const xValues = faceTrack.map((kp) => kp.x * 100);
  const yValues = faceTrack.map((kp) => kp.y * 100);

  function linearInterpolate(t: number, ts: number[], vals: number[]): number {
    // Clamp: before first timestamp, return first value
    if (t <= ts[0]) return vals[0];
    // Clamp: after last timestamp, return last value
    if (t >= ts[ts.length - 1]) return vals[vals.length - 1];
    // Find surrounding keypoints
    for (let i = 0; i < ts.length - 1; i++) {
      if (t >= ts[i] && t <= ts[i + 1]) {
        const progress = (t - ts[i]) / (ts[i + 1] - ts[i]);
        return vals[i] + progress * (vals[i + 1] - vals[i]);
      }
    }
    return vals[vals.length - 1];
  }

  return {
    x: linearInterpolate(time, timestamps, xValues),
    y: linearInterpolate(time, timestamps, yValues),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════

describe("currentTime — time calculation", () => {
  it("at frame 0 with startFrom 0 at 30fps", () => {
    expect(currentTime(0, 0, 30)).toBe(0);
  });

  it("at frame 30 with startFrom 0 at 30fps → 1 second", () => {
    expect(currentTime(30, 0, 30)).toBe(1);
  });

  it("at frame 0 with startFrom 30 at 30fps → 1 second", () => {
    expect(currentTime(0, 30, 30)).toBe(1);
  });

  it("at frame 15 with startFrom 15 at 30fps → 1 second", () => {
    expect(currentTime(15, 15, 30)).toBe(1);
  });

  it("fractional frames", () => {
    expect(currentTime(1, 0, 30)).toBeCloseTo(1 / 30, 10);
  });

  it("default startFrom (30 frames)", () => {
    // Default in TalkingHead component: startFrom = 30
    expect(currentTime(0, 30, 30)).toBe(1);
    expect(currentTime(60, 30, 30)).toBe(3);
  });
});

describe("defaultPosition — fallback", () => {
  it("returns center-ish position (50%, 40%)", () => {
    const pos = defaultPosition();
    expect(pos.x).toBe(50);
    expect(pos.y).toBe(40);
  });

  it("y is above center (40 < 50)", () => {
    const pos = defaultPosition();
    expect(pos.y).toBeLessThan(50);
  });
});

describe("singleKeypointPosition — scale [0,1] → [0,100]", () => {
  it("scales (0.5, 0.4) → (50, 40)", () => {
    expect(singleKeypointPosition({ x: 0.5, y: 0.4 })).toEqual({ x: 50, y: 40 });
  });

  it("scales (0, 0) → (0, 0)", () => {
    expect(singleKeypointPosition({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
  });

  it("scales (1, 1) → (100, 100)", () => {
    expect(singleKeypointPosition({ x: 1, y: 1 })).toEqual({ x: 100, y: 100 });
  });

  it("scales fractional values correctly", () => {
    const result = singleKeypointPosition({ x: 0.333, y: 0.667 });
    expect(result.x).toBeCloseTo(33.3, 1);
    expect(result.y).toBeCloseTo(66.7, 1);
  });
});

describe("interpolatePosition — multi-keypoint interpolation", () => {
  const faceTrack = [
    { t: 0, x: 0.3, y: 0.5 },
    { t: 2, x: 0.7, y: 0.3 },
    { t: 4, x: 0.5, y: 0.5 },
  ];

  it("returns exact value at keypoint timestamps", () => {
    const p0 = interpolatePosition(0, faceTrack);
    expect(p0.x).toBeCloseTo(30, 5);
    expect(p0.y).toBeCloseTo(50, 5);

    const p2 = interpolatePosition(2, faceTrack);
    expect(p2.x).toBeCloseTo(70, 5);
    expect(p2.y).toBeCloseTo(30, 5);
  });

  it("interpolates midpoint between keypoints", () => {
    const p1 = interpolatePosition(1, faceTrack);
    // Midpoint between (30,50) and (70,30) → (50, 40)
    expect(p1.x).toBeCloseTo(50, 5);
    expect(p1.y).toBeCloseTo(40, 5);
  });

  it("clamps before first keypoint (extrapolateLeft: clamp)", () => {
    const p = interpolatePosition(-1, faceTrack);
    expect(p.x).toBeCloseTo(30, 5);
    expect(p.y).toBeCloseTo(50, 5);
  });

  it("clamps after last keypoint (extrapolateRight: clamp)", () => {
    const p = interpolatePosition(10, faceTrack);
    expect(p.x).toBeCloseTo(50, 5);
    expect(p.y).toBeCloseTo(50, 5);
  });

  it("handles two keypoints", () => {
    const track = [
      { t: 0, x: 0.0, y: 0.0 },
      { t: 1, x: 1.0, y: 1.0 },
    ];
    const mid = interpolatePosition(0.5, track);
    expect(mid.x).toBeCloseTo(50, 5);
    expect(mid.y).toBeCloseTo(50, 5);
  });

  it("handles quarter progress between keypoints", () => {
    const track = [
      { t: 0, x: 0.0, y: 0.0 },
      { t: 4, x: 1.0, y: 1.0 },
    ];
    const q = interpolatePosition(1, track);
    expect(q.x).toBeCloseTo(25, 5);
    expect(q.y).toBeCloseTo(25, 5);
  });

  it("handles closely spaced keypoints", () => {
    const track = [
      { t: 0.0, x: 0.5, y: 0.5 },
      { t: 0.001, x: 0.6, y: 0.4 },
    ];
    // At exact second keypoint
    const p = interpolatePosition(0.001, track);
    expect(p.x).toBeCloseTo(60, 5);
    expect(p.y).toBeCloseTo(40, 5);
  });
});

describe("useFacePosition decision tree", () => {
  // Simulate the branching logic in useFacePosition

  function facePosition(
    faceTrack: Array<{ t: number; x: number; y: number }> | undefined,
    frame: number,
    fps: number,
    startFrom: number = 0
  ): { x: number; y: number } {
    const time = currentTime(frame, startFrom, fps);

    if (!faceTrack || faceTrack.length === 0) {
      return defaultPosition();
    }
    if (faceTrack.length === 1) {
      return singleKeypointPosition(faceTrack[0]);
    }
    return interpolatePosition(time, faceTrack);
  }

  it("uses default when faceTrack is undefined", () => {
    expect(facePosition(undefined, 0, 30)).toEqual({ x: 50, y: 40 });
  });

  it("uses default when faceTrack is empty", () => {
    expect(facePosition([], 0, 30)).toEqual({ x: 50, y: 40 });
  });

  it("uses single keypoint when array has one element", () => {
    const result = facePosition([{ t: 0, x: 0.3, y: 0.6 }], 0, 30);
    expect(result.x).toBeCloseTo(30, 5);
    expect(result.y).toBeCloseTo(60, 5);
  });

  it("interpolates when array has multiple elements", () => {
    const track = [
      { t: 0, x: 0.3, y: 0.5 },
      { t: 2, x: 0.7, y: 0.3 },
    ];
    // At frame 30 with startFrom=0 at 30fps → time = 1s (midpoint)
    const result = facePosition(track, 30, 30, 0);
    expect(result.x).toBeCloseTo(50, 5);
    expect(result.y).toBeCloseTo(40, 5);
  });

  it("accounts for startFrom offset", () => {
    const track = [
      { t: 0, x: 0.0, y: 0.0 },
      { t: 2, x: 1.0, y: 1.0 },
    ];
    // frame=0, startFrom=30 → time = 30/30 = 1s → midpoint
    const result = facePosition(track, 0, 30, 30);
    expect(result.x).toBeCloseTo(50, 5);
    expect(result.y).toBeCloseTo(50, 5);
  });
});
