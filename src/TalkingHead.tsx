/**
 * TalkingHead — shared circular talking-head overlay with auto-focus face tracking.
 *
 * Uses faceTrack keypoints (from the pipeline's BlazeFace detection) to dynamically
 * set `objectPosition` on the video, keeping the speaker's face centered in the
 * circular crop even when they drift left/right in a 16:9 or 9:16 frame.
 *
 * Falls back to center (50% 40%) when no faceTrack data is provided.
 */

import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { FaceTrackPoint } from "./schema";

interface TalkingHeadProps {
  src: string;
  faceTrack?: FaceTrackPoint[];
  /** Circle diameter in pixels (default 300) */
  size?: number;
  /** Border color (theme-aware) */
  borderColor?: string;
  /** Padding from canvas edges in px (default 60) */
  padding?: number;
  /** Start playback N frames in (default 30) */
  startFrom?: number;
}

/**
 * Given the current frame and faceTrack keypoints, interpolate the face position.
 * Returns { x, y } as percentages for objectPosition.
 */
function useFacePosition(
  faceTrack: FaceTrackPoint[] | undefined,
  fps: number,
  startFrom: number = 0
): { x: number; y: number } {
  const frame = useCurrentFrame();
  // Account for startFrom: when frame=0, the video is already at startFrom frames in
  const currentTime = (frame + startFrom) / fps;

  if (!faceTrack || faceTrack.length === 0) {
    return { x: 50, y: 40 }; // sensible default: center, slightly above middle
  }

  if (faceTrack.length === 1) {
    return {
      x: faceTrack[0].x * 100,
      y: faceTrack[0].y * 100,
    };
  }

  // Memoize interpolation arrays so they aren't rebuilt every frame
  const { timestamps, xValues, yValues } = React.useMemo(() => {
    if (!faceTrack || faceTrack.length <= 1) return { timestamps: [], xValues: [], yValues: [] };
    return {
      timestamps: faceTrack.map((kp) => kp.t),
      xValues: faceTrack.map((kp) => kp.x * 100),
      yValues: faceTrack.map((kp) => kp.y * 100),
    };
  }, [faceTrack]);

  const x = interpolate(currentTime, timestamps, xValues, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(currentTime, timestamps, yValues, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return { x, y };
}

export const TalkingHead: React.FC<TalkingHeadProps> = ({
  src,
  faceTrack,
  size = 300,
  borderColor = "#38bdf8",
  padding = 60,
  startFrom = 30,
}) => {
  const { fps } = useVideoConfig();
  const { x, y } = useFacePosition(faceTrack, fps, startFrom);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-end",
        padding,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
          border: `6px solid ${borderColor}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          backgroundColor: "black",
        }}
      >
        {/* @ts-expect-error loop is valid at runtime but missing from OffthreadVideo types in this version */}
        <OffthreadVideo loop
          src={staticFile(src)}
          startFrom={startFrom}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${x}% ${y}%`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
