// src/slides10/OrganicClosingSlide10.tsx
// P10 Warm Organic — closing slide
// Large serif headline, growing rule, uppercase tagline, decorative circles

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme10 } from "./theme10";

type Props = {
  headline: string;
  tagline: string;
};

export const OrganicClosingSlide10: React.FC<Props> = ({ headline, tagline }) => {
  const frame = useCurrentFrame();

  // Headline slides up + fades in frames 0-30
  const headlineOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const headlineY = interpolate(frame, [0, 30], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Terracotta rule grows frames 32-50
  const ruleW = interpolate(frame, [32, 50], [0, 120], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tagline fades in frames 52-68
  const taglineOpacity = interpolate(frame, [52, 68], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme10.bg,
        fontFamily: theme10.sans,
        overflow: "hidden",
      }}
    >
      {/* Decorative circles bottom-right */}
      <div
        style={{
          position: "absolute",
          right: -100,
          bottom: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          backgroundColor: theme10.terracotta,
          opacity: 0.06,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 60,
          bottom: 60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor: theme10.terracotta,
          opacity: 0.06,
          pointerEvents: "none",
        }}
      />

      {/* Centered content */}
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
          alignItems: "flex-start",
          paddingLeft: 140,
          paddingRight: 140,
        }}
      >
        {/* Large serif headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontFamily: theme10.serif,
            fontSize: 96,
            fontWeight: 400,
            color: theme10.ink,
            letterSpacing: -2,
            lineHeight: 1.05,
            maxWidth: 900,
            marginBottom: 48,
          }}
        >
          {headline}
        </div>

        {/* Growing terracotta rule */}
        <div
          style={{
            width: ruleW,
            height: 1,
            backgroundColor: theme10.terracotta,
            marginBottom: 40,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            fontFamily: theme10.sans,
            fontSize: 24,
            fontWeight: 400,
            color: theme10.gray,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
