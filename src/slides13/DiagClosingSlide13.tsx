// src/slides13/DiagClosingSlide13.tsx
// P13 closing — two diagonal blocks meeting at center seam, headline straddling both

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme13 } from "./theme13";

type Props = {
  headline: string;
  sub: string;
  accent: string;
};

export const DiagClosingSlide13: React.FC<Props> = ({ headline, sub, accent }) => {
  const frame = useCurrentFrame();

  // Top-left accent block slides in from translateX -200→0, frames 0-25
  const accentX = interpolate(frame, [0, 25], [-200, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Bottom-right navy block slides in from translateX 200→0, frames 8-32
  const navyX = interpolate(frame, [8, 32], [200, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Text fades in frames 30-45
  const textOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme13.bg, overflow: "hidden" }}>
      {/* Top-left accent color block */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 1600,
          height: 1000,
          backgroundColor: accent,
          transform: `rotate(-10deg) translateX(${accentX}px)`,
          transformOrigin: "top left",
          zIndex: 1,
        }}
      />

      {/* Bottom-right navy block */}
      <div
        style={{
          position: "absolute",
          bottom: -200,
          right: -200,
          width: 1600,
          height: 1000,
          backgroundColor: theme13.navy,
          transform: `rotate(-10deg) translateX(${navyX}px)`,
          transformOrigin: "bottom right",
          zIndex: 2,
        }}
      />

      {/* Center content — headline straddles the seam */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          gap: 28,
        }}
      >
        <div
          style={{
            opacity: textOpacity,
            fontFamily: theme13.serif,
            fontSize: 96,
            fontWeight: 400,
            color: theme13.white,
            lineHeight: 1.05,
            textAlign: "center",
            letterSpacing: -3,
            maxWidth: 1100,
          }}
        >
          {headline}
        </div>

        <div
          style={{
            opacity: textOpacity,
            fontFamily: theme13.sans,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: 6,
            textTransform: "uppercase" as const,
            color: theme13.white,
          }}
        >
          {sub}
        </div>
      </div>
    </AbsoluteFill>
  );
};
