// src/slides9/VaporStatSlide9.tsx
// Vaporwave single stat — massive neon number, scanline accent

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme9 } from "./theme9";

type Props = {
  label: string;
  value: string;
  sublabel?: string;
  accent: "pink" | "blue" | "yellow";
};

const accentColor = (accent: Props["accent"]) => {
  if (accent === "pink") return theme9.pink;
  if (accent === "blue") return theme9.blue;
  return theme9.yellow;
};

export const VaporStatSlide9: React.FC<Props> = ({ label, value, sublabel, accent }) => {
  const frame = useCurrentFrame();
  const color = accentColor(accent);

  // Value scales in (scale 0.6→1, opacity 0→1, frames 10–35)
  const scale = interpolate(frame, [10, 35], [0.6, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.3)),
  });
  const valueOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });

  // Label fades in earlier (frames 0–18)
  const labelOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  // Sublabel fades in after (frames 40–55)
  const subOpacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" });

  // Scanline strip width grows (frames 20–45)
  const scanW = interpolate(frame, [20, 45], [0, 1920], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme9.bg,
        fontFamily: theme9.display,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background glow blob */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${color}15 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Scanline strip at midline */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: scanW,
          height: 2,
          backgroundColor: color,
          opacity: 0.3,
          boxShadow: `0 0 8px ${color}`,
        }}
      />

      {/* Label */}
      <div
        style={{
          opacity: labelOpacity,
          fontFamily: theme9.mono,
          fontSize: 18,
          color: theme9.dim,
          letterSpacing: 6,
          textTransform: "uppercase",
          marginBottom: 20,
        }}
      >
        {label}
      </div>

      {/* Massive stat value */}
      <div
        style={{
          opacity: valueOpacity,
          transform: `scale(${scale})`,
          fontSize: 200,
          fontFamily: theme9.display,
          fontWeight: 900,
          color: color,
          lineHeight: 1,
          textShadow: `0 0 20px ${color}, 0 0 60px ${color}, 0 0 120px ${color}40`,
          letterSpacing: -4,
        }}
      >
        {value}
      </div>

      {/* Sublabel */}
      {sublabel && (
        <div
          style={{
            opacity: subOpacity,
            fontFamily: theme9.mono,
            fontSize: 22,
            color: theme9.dim,
            marginTop: 24,
            letterSpacing: 2,
          }}
        >
          {sublabel}
        </div>
      )}
    </AbsoluteFill>
  );
};
