// src/slides11/BlueprintHeroSlide11.tsx
// Blueprint Hero — dot-grid bg, corner brackets, project code, large title, animated line

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme11 } from "./theme11";

type Props = {
  projectCode: string;
  title: string;
  subtitle: string;
};

const BRACKET = 20;
const corners: React.CSSProperties[] = [
  { top: 40, left: 40, borderTop: "2px solid #3B9FE8", borderLeft: "2px solid #3B9FE8" },
  { top: 40, right: 40, borderTop: "2px solid #3B9FE8", borderRight: "2px solid #3B9FE8" },
  { bottom: 40, left: 40, borderBottom: "2px solid #3B9FE8", borderLeft: "2px solid #3B9FE8" },
  { bottom: 40, right: 40, borderBottom: "2px solid #3B9FE8", borderRight: "2px solid #3B9FE8" },
];

export const BlueprintHeroSlide11: React.FC<Props> = ({ projectCode, title, subtitle }) => {
  const frame = useCurrentFrame();

  // Corner brackets fade in 0→20
  const bracketOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Project code fades in 0→18
  const codeOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Title: translateY 25→0, opacity 0→1, frames 15-45
  const titleY = interpolate(frame, [15, 45], [25, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Horizontal blue line grows 0→600px, frames 40→58
  const lineW = interpolate(frame, [40, 58], [0, 600], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtitle fades in 55→70
  const subOpacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme11.bg,
        ...theme11.dotGrid,
        fontFamily: theme11.sans,
        overflow: "hidden",
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

      {/* Project code — top left */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          opacity: codeOpacity,
          fontFamily: theme11.mono,
          fontSize: 12,
          color: theme11.amber,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        {projectCode}
      </div>

      {/* Main content */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 120,
          paddingRight: 120,
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 88,
            fontWeight: 700,
            color: theme11.white,
            letterSpacing: -2,
            lineHeight: 1.05,
            maxWidth: 900,
            marginBottom: 36,
          }}
        >
          {title}
        </div>

        {/* Animated horizontal blue line */}
        <div
          style={{
            width: lineW,
            height: 1,
            backgroundColor: theme11.blue,
            marginBottom: 32,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            opacity: subOpacity,
            fontFamily: theme11.mono,
            fontSize: 20,
            color: theme11.label,
            letterSpacing: 0.5,
            lineHeight: 1.6,
            maxWidth: 700,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
