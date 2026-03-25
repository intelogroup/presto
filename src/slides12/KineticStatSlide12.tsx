// src/slides12/KineticStatSlide12.tsx
// P12 — Kinetic Stat: a number scales up from tiny to enormous, filling the frame

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme12 } from "./theme12";

type Props = {
  value: string;
  label: string;
  color: "red" | "green" | "yellow";
};

const COLOR_MAP = {
  red: theme12.red,
  green: theme12.green,
  yellow: theme12.yellow,
};

export const KineticStatSlide12: React.FC<Props> = ({ value, label, color }) => {
  const frame = useCurrentFrame();
  const accentColor = COLOR_MAP[color];

  // Scale up: tiny → huge, frames 0-35
  const scale = interpolate(frame, [0, 30, 40], [0.04, 1.08, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Opacity: 0→1 frames 0-15
  const valueOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label slides up from below — frames 30-50
  const labelY = interpolate(frame, [30, 50], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const labelOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme12.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Giant value */}
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: valueOpacity,
          fontFamily: theme12.display,
          fontSize: 360,
          fontWeight: 900,
          color: accentColor,
          lineHeight: 1,
          letterSpacing: -12,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        {value}
      </div>

      {/* Label slides up */}
      <div
        style={{
          transform: `translateY(${labelY}px)`,
          opacity: labelOpacity,
          fontFamily: theme12.display,
          fontSize: 36,
          fontWeight: 700,
          color: theme12.white,
          letterSpacing: 6,
          textTransform: "uppercase",
          marginTop: 24,
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};
