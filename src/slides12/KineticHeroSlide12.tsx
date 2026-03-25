// src/slides12/KineticHeroSlide12.tsx
// P12 — Kinetic Hero: two massive words slam in from opposite sides and nearly collide

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme12 } from "./theme12";

type Props = {
  word1: string;
  word2: string;
  tagline: string;
};

export const KineticHeroSlide12: React.FC<Props> = ({ word1, word2, tagline }) => {
  const frame = useCurrentFrame();

  // word1 slams in from LEFT — frames 0-20
  const word1X = interpolate(frame, [0, 20], [-1920, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // word2 slams in from RIGHT — frames 8-28
  const word2X = interpolate(frame, [8, 28], [1920, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Red line grows from 0→1920 — frames 26-38
  const lineW = interpolate(frame, [26, 38], [0, 1920], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Tagline fades in — frames 35-50
  const taglineOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme12.bg, overflow: "hidden" }}>
      {/* word1 — slams from left, top ~280px, left-aligned */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 80,
          transform: `translateX(${word1X}px)`,
          fontFamily: theme12.display,
          fontSize: 220,
          fontWeight: 900,
          color: theme12.white,
          lineHeight: 1,
          letterSpacing: -6,
          whiteSpace: "nowrap",
          textTransform: "uppercase",
        }}
      >
        {word1}
      </div>

      {/* word2 — slams from right, top ~460px, right-aligned */}
      <div
        style={{
          position: "absolute",
          top: 460,
          right: 80,
          transform: `translateX(${word2X}px)`,
          fontFamily: theme12.display,
          fontSize: 220,
          fontWeight: 900,
          color: theme12.red,
          lineHeight: 1,
          letterSpacing: -6,
          whiteSpace: "nowrap",
          textTransform: "uppercase",
          textAlign: "right",
        }}
      >
        {word2}
      </div>

      {/* Red horizontal line between the words — grows left to right */}
      <div
        style={{
          position: "absolute",
          top: 452,
          left: 0,
          width: lineW,
          height: 4,
          backgroundColor: theme12.red,
        }}
      />

      {/* Tagline — bottom center, subtle */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: taglineOpacity * 0.6,
          fontFamily: theme12.display,
          fontSize: 24,
          fontWeight: 700,
          color: theme12.white,
          letterSpacing: 8,
          textTransform: "uppercase",
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};
