// src/slides9/VaporClosingSlide9.tsx
// Vaporwave closing — one giant typographic word, intense pink glow, retrowave horizon

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme9 } from "./theme9";

type Props = {
  word: string;
  tagline: string;
};

export const VaporClosingSlide9: React.FC<Props> = ({ word, tagline }) => {
  const frame = useCurrentFrame();

  // Word slides up dramatically (translateY 80→0, opacity 0→1, frames 0–30)
  const wordY = interpolate(frame, [0, 30], [80, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });
  const wordOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  // Tagline appears after (frames 38–55)
  const tagOpacity = interpolate(frame, [38, 55], [0, 1], { extrapolateRight: "clamp" });
  const tagY = interpolate(frame, [38, 55], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Retrowave lines — 6 lines, staggered
  const lineWidths = [0, 1, 2, 3, 4, 5].map((i) => {
    const start = 15 + i * 4;
    const end = 45 + i * 4;
    return interpolate(frame, [start, end], [0, 1920], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  });
  const linePositions = [0, 18, 33, 45, 55, 63];

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
      {/* Center glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1000,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(255,45,135,0.15) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Giant word */}
      <div
        style={{
          opacity: wordOpacity,
          transform: `translateY(${wordY}px)`,
          fontSize: 180,
          fontFamily: theme9.display,
          fontWeight: 900,
          color: theme9.pink,
          letterSpacing: -4,
          lineHeight: 1,
          textAlign: "center",
          textShadow: `0 0 20px ${theme9.pink}, 0 0 60px ${theme9.pink}, 0 0 120px ${theme9.pink}, 0 0 200px rgba(255,45,135,0.4)`,
          marginBottom: 36,
        }}
      >
        {word}
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
          fontFamily: theme9.mono,
          fontSize: 30,
          color: theme9.blue,
          letterSpacing: 6,
          textTransform: "uppercase",
          textShadow: `0 0 12px ${theme9.blue}`,
        }}
      >
        {tagline}
      </div>

      {/* Retrowave horizon lines at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          height: 74,
          overflow: "hidden",
        }}
      >
        {lineWidths.map((w, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: linePositions[i],
              left: "50%",
              transform: "translateX(-50%)",
              width: w,
              height: 1,
              backgroundColor: theme9.pink,
              opacity: 0.65 - i * 0.07,
              boxShadow: `0 0 6px ${theme9.pink}`,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
