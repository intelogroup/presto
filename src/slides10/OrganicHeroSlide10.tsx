// src/slides10/OrganicHeroSlide10.tsx
// P10 Warm Organic — Hero slide
// Eyebrow → large serif title → hairline rule → subtitle
// Decorative partial circle top-right

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme10 } from "./theme10";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export const OrganicHeroSlide10: React.FC<Props> = ({ eyebrow, title, subtitle }) => {
  const frame = useCurrentFrame();

  // Eyebrow fades in frames 0-15
  const eyebrowOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Title slides up translateY 30→0, frames 10-45
  const titleY = interpolate(frame, [10, 45], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });

  // Hairline terracotta rule grows 0→120px, frames 40-58
  const ruleW = interpolate(frame, [40, 58], [0, 120], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtitle fades in frames 55-72
  const subtitleOpacity = interpolate(frame, [55, 72], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme10.bg,
        fontFamily: theme10.sans,
        overflow: "hidden",
      }}
    >
      {/* Decorative large partial circle — top right, terracotta, cut off at edge */}
      <div
        style={{
          position: "absolute",
          right: -150,
          top: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          backgroundColor: theme10.terracotta,
          opacity: 0.08,
          pointerEvents: "none",
        }}
      />

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
          paddingLeft: 140,
          paddingRight: 140,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            opacity: eyebrowOpacity,
            fontFamily: theme10.sans,
            fontSize: 13,
            fontWeight: 500,
            color: theme10.terracotta,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          {eyebrow}
        </div>

        {/* Large serif title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: theme10.serif,
            fontSize: 100,
            fontWeight: 400,
            color: theme10.ink,
            letterSpacing: -2,
            lineHeight: 1.05,
            maxWidth: 900,
            marginBottom: 40,
          }}
        >
          {title}
        </div>

        {/* Hairline terracotta rule */}
        <div
          style={{
            width: ruleW,
            height: 1,
            backgroundColor: theme10.terracotta,
            marginBottom: 36,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            opacity: subtitleOpacity,
            fontFamily: theme10.sans,
            fontSize: 28,
            fontWeight: 400,
            color: theme10.gray,
            lineHeight: 1.5,
            maxWidth: 680,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
