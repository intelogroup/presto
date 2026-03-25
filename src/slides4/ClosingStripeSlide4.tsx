// src/slides4/ClosingStripeSlide4.tsx
// Three horizontal stripes: black (top) / yellow (mid) / red (bottom)
// Stripes slam in from edges, giant word printed across them

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme4 } from "./theme4";

type Props = {
  word: string;     // the big word (e.g. "BUILD.")
  tagline: string;  // smaller line below
};

export const ClosingStripeSlide4: React.FC<Props> = ({ word, tagline }) => {
  const frame = useCurrentFrame();

  // Stripes slam in sequentially from alternating sides
  const stripe1X = interpolate(frame, [0, 16], [-1920, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const stripe2X = interpolate(frame, [8, 24], [1920, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const stripe3X = interpolate(frame, [16, 32], [-1920, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Big word pops in
  const wordScale = interpolate(frame, [28, 42], [0.7, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.3)),
  });
  const wordOpacity = interpolate(frame, [28, 38], [0, 1], { extrapolateRight: "clamp" });

  // Tagline slides up
  const taglineY = interpolate(frame, [45, 60], [40, 0], { extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [45, 60], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{ fontFamily: theme4.sans, overflow: "hidden", backgroundColor: theme4.white }}
    >
      {/* Stripe 1 — black (top) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "33.33%",
          backgroundColor: theme4.black,
          transform: `translateX(${stripe1X}px)`,
        }}
      />

      {/* Stripe 2 — yellow (mid) */}
      <div
        style={{
          position: "absolute",
          top: "33.33%",
          left: 0,
          right: 0,
          height: "33.33%",
          backgroundColor: theme4.yellow,
          transform: `translateX(${stripe2X}px)`,
        }}
      />

      {/* Stripe 3 — red (bottom) */}
      <div
        style={{
          position: "absolute",
          top: "66.66%",
          left: 0,
          right: 0,
          height: "33.34%",
          backgroundColor: theme4.red,
          transform: `translateX(${stripe3X}px)`,
        }}
      />

      {/* Big word — overlays all stripes */}
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
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            opacity: wordOpacity,
            transform: `scale(${wordScale})`,
            fontSize: 220,
            fontWeight: 900,
            letterSpacing: -8,
            textTransform: "uppercase",
            color: theme4.black,
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          {word}
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            marginTop: 32,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: theme4.black,
          }}
        >
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
