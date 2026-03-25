// src/slides11/BlueprintClosingSlide11.tsx
// Blueprint Closing — centered, large headline, animated line, status tag

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme11 } from "./theme11";

type Props = {
  projectCode: string;
  headline: string;
  tagline: string;
};

const BRACKET = 20;
const corners: React.CSSProperties[] = [
  { top: 40, left: 40, borderTop: "2px solid #3B9FE8", borderLeft: "2px solid #3B9FE8" },
  { top: 40, right: 40, borderTop: "2px solid #3B9FE8", borderRight: "2px solid #3B9FE8" },
  { bottom: 40, left: 40, borderBottom: "2px solid #3B9FE8", borderLeft: "2px solid #3B9FE8" },
  { bottom: 40, right: 40, borderBottom: "2px solid #3B9FE8", borderRight: "2px solid #3B9FE8" },
];

export const BlueprintClosingSlide11: React.FC<Props> = ({ projectCode, headline, tagline }) => {
  const frame = useCurrentFrame();

  // Corner brackets fade in 0→20
  const bracketOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Project code fades in 0→15
  const codeOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Headline: translateY 30→0, opacity 0→1, frames 5-35
  const headlineY = interpolate(frame, [5, 35], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Horizontal blue line grows 0→400px centered, frames 32→50
  const lineW = interpolate(frame, [32, 50], [0, 400], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tagline fades in 52→68
  const taglineOpacity = interpolate(frame, [52, 68], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Status fades in 65→78
  const statusOpacity = interpolate(frame, [65, 78], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme11.bg,
        ...theme11.dotGrid,
        fontFamily: theme11.sans,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Corner brackets */}
      {corners.map((corner, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: BRACKET,
            height: BRACKET,
            opacity: bracketOpacity,
            ...corner,
          }}
        />
      ))}

      {/* Center content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Project code */}
        <div
          style={{
            opacity: codeOpacity,
            fontFamily: theme11.mono,
            fontSize: 13,
            color: theme11.amber,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          {projectCode}
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontSize: 96,
            fontWeight: 700,
            color: theme11.white,
            letterSpacing: -3,
            lineHeight: 1.0,
            maxWidth: 1000,
            marginBottom: 40,
          }}
        >
          {headline}
        </div>

        {/* Horizontal blue line */}
        <div
          style={{
            width: lineW,
            height: 1,
            backgroundColor: theme11.blue,
            marginBottom: 32,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            fontFamily: theme11.mono,
            fontSize: 18,
            color: theme11.label,
            letterSpacing: 1,
            marginBottom: 48,
          }}
        >
          {tagline}
        </div>

        {/* Status */}
        <div
          style={{
            opacity: statusOpacity,
            fontFamily: theme11.mono,
            fontSize: 13,
            color: theme11.amber,
            letterSpacing: 3,
            textTransform: "uppercase",
            border: "1px solid rgba(245,158,11,0.4)",
            padding: "10px 24px",
          }}
        >
          STATUS: OPEN FOR INVESTMENT
        </div>
      </div>
    </AbsoluteFill>
  );
};
