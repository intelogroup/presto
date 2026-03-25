// src/slides8/MinimalClosingSlide8.tsx
// Clean Minimalist closing — two horizontal rules, big headline, tagline

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme8 } from "./theme8";

type Props = {
  headline: string;
  tagline: string;
};

export const MinimalClosingSlide8: React.FC<Props> = ({ headline, tagline }) => {
  const frame = useCurrentFrame();

  // Top rule grows from left frame 0→30
  const topRuleW = interpolate(frame, [0, 30], [0, 1920], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Bottom rule grows from right frame 5→35
  const bottomRuleW = interpolate(frame, [5, 35], [0, 1920], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Headline fades + scale 0.97→1.0 frame 25→55
  const headlineOpacity = interpolate(frame, [25, 55], [0, 1], { extrapolateRight: "clamp" });
  const headlineScale = interpolate(frame, [25, 55], [0.97, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tagline fades in frame 52→68
  const taglineOpacity = interpolate(frame, [52, 68], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme8.bg,
        fontFamily: theme8.sans,
        overflow: "hidden",
      }}
    >
      {/* Top rule at y=300, grows from left */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          width: topRuleW,
          height: 1,
          backgroundColor: theme8.charcoal,
        }}
      />

      {/* Bottom rule at y=780, grows from right */}
      <div
        style={{
          position: "absolute",
          top: 780,
          right: 0,
          width: bottomRuleW,
          height: 1,
          backgroundColor: theme8.charcoal,
        }}
      />

      {/* Headline — centered vertically between rules (300→780 = 540px range, center = 300+270 = 570) */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          height: 480,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            opacity: headlineOpacity,
            transform: `scale(${headlineScale})`,
            fontSize: 120,
            fontWeight: 700,
            color: theme8.charcoal,
            letterSpacing: -4,
            textAlign: "center",
          }}
        >
          {headline}
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            fontSize: 28,
            fontWeight: 400,
            color: theme8.gray,
            letterSpacing: 1,
            textAlign: "center",
          }}
        >
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
