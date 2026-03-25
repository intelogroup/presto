// src/slides12/KineticCounterSlide12.tsx
// P12 — Kinetic Counter: number counts up to target with glow, breathing scale, and label

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme12 } from "./theme12";

type Props = {
  from: number;
  to: number;
  suffix: string;
  label: string;
  color: "red" | "green" | "yellow";
};

const COLOR_MAP = {
  red: theme12.red,
  green: theme12.green,
  yellow: theme12.yellow,
};

export const KineticCounterSlide12: React.FC<Props> = ({ from, to, suffix, label, color }) => {
  const frame = useCurrentFrame();
  const accentColor = COLOR_MAP[color];

  // Count up — frames 10-70
  const currentValue = Math.round(
    interpolate(frame, [10, 70], [from, to], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })
  );

  // Breathing scale — always slightly pulsing
  const breathScale = Math.sin(frame * 0.1) * 0.02 + 1;

  // Glow intensity pulses with breathing
  const glowStrength = Math.sin(frame * 0.1) * 4 + 20;

  // Label slides up from below — frames 75-90
  const labelY = interpolate(frame, [75, 90], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const labelOpacity = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Initial fade in of counter
  const counterOpacity = interpolate(frame, [5, 20], [0, 1], {
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
      {/* Counter row: number + suffix */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          transform: `scale(${breathScale})`,
          opacity: counterOpacity,
        }}
      >
        {/* Main number */}
        <div
          style={{
            fontFamily: theme12.display,
            fontSize: 280,
            fontWeight: 900,
            color: accentColor,
            lineHeight: 1,
            letterSpacing: -8,
            textShadow: `0 0 ${glowStrength}px ${accentColor}, 0 0 ${glowStrength * 2}px ${accentColor}80`,
            whiteSpace: "nowrap",
          }}
        >
          {currentValue.toLocaleString()}
        </div>

        {/* Suffix */}
        <div
          style={{
            fontFamily: theme12.display,
            fontSize: 160,
            fontWeight: 900,
            color: theme12.white,
            lineHeight: 1,
            letterSpacing: -4,
            marginLeft: 16,
            whiteSpace: "nowrap",
          }}
        >
          {suffix}
        </div>
      </div>

      {/* Label slides up */}
      <div
        style={{
          transform: `translateY(${labelY}px)`,
          opacity: labelOpacity,
          fontFamily: theme12.display,
          fontSize: 28,
          fontWeight: 700,
          color: theme12.white,
          letterSpacing: 6,
          textTransform: "uppercase",
          marginTop: 32,
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};
