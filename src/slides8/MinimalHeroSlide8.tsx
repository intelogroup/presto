// src/slides8/MinimalHeroSlide8.tsx
// Clean Minimalist hero — off-white bg, charcoal type, Apple/Linear/Vercel aesthetic
// Thin vertical rule, tag → title → subtitle stagger, decorative circle

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme8 } from "./theme8";

type Props = {
  title: string;
  subtitle: string;
  tag: string;
};

export const MinimalHeroSlide8: React.FC<Props> = ({ title, subtitle, tag }) => {
  const frame = useCurrentFrame();

  // Thin vertical charcoal rule grows from 0→360px (frame 0→25)
  const ruleH = interpolate(frame, [0, 25], [0, 360], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tag fades in frame 8→22
  const tagOpacity = interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" });

  // Title slides up translateY 40→0 frame 15→45
  const titleY = interpolate(frame, [15, 45], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });
  const titleOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" });

  // Thin rule under title grows frame 42→58
  const underlineW = interpolate(frame, [42, 58], [0, 80], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtitle fades in frame 52→68
  const subOpacity = interpolate(frame, [52, 68], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme8.bg,
        fontFamily: theme8.sans,
        overflow: "hidden",
      }}
    >
      {/* Decorative large circle — purely decorative, no animation */}
      <div
        style={{
          position: "absolute",
          right: -100,
          bottom: -100,
          width: 600,
          height: 600,
          borderRadius: "50%",
          backgroundColor: "#F0F0F0",
          pointerEvents: "none",
        }}
      />

      {/* Thin vertical charcoal rule */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: "50%",
          transform: "translateY(-50%)",
          width: 2,
          height: ruleH,
          backgroundColor: theme8.charcoal,
        }}
      />

      {/* Main content block */}
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
          paddingLeft: 160,
          paddingRight: 120,
        }}
      >
        {/* Tag */}
        <div
          style={{
            opacity: tagOpacity,
            fontSize: 14,
            fontWeight: 500,
            color: theme8.gray,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          {tag}
        </div>

        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 96,
            fontWeight: 700,
            color: theme8.charcoal,
            letterSpacing: -3,
            lineHeight: 1.1,
            maxWidth: 900,
            marginBottom: 32,
          }}
        >
          {title}
        </div>

        {/* Thin rule under title */}
        <div
          style={{
            width: underlineW,
            height: 2,
            backgroundColor: theme8.charcoal,
            marginBottom: 32,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            opacity: subOpacity,
            fontSize: 32,
            fontWeight: 400,
            color: theme8.gray,
            lineHeight: 1.5,
            maxWidth: 700,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
