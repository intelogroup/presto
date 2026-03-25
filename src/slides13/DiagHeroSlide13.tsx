// src/slides13/DiagHeroSlide13.tsx
// P13 hero — animated diagonal color block, serif display type, vertical rule detail

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme13 } from "./theme13";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
};

export const DiagHeroSlide13: React.FC<Props> = ({ eyebrow, title, subtitle, accent }) => {
  const frame = useCurrentFrame();

  // Diagonal block animates: width 800→1100, frames 0-30
  const blockW = interpolate(frame, [0, 30], [800, 1100], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Eyebrow fade in frames 5-18
  const eyebrowOpacity = interpolate(frame, [5, 18], [0, 1], { extrapolateRight: "clamp" });

  // Title translateX + opacity, frames 12-38
  const titleX = interpolate(frame, [12, 38], [-30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [12, 32], [0, 1], { extrapolateRight: "clamp" });

  // Subtitle opacity, frames 35-52
  const subOpacity = interpolate(frame, [35, 52], [0, 1], { extrapolateRight: "clamp" });

  // Navy vertical line height 0→200, frames 25-45
  const lineH = interpolate(frame, [25, 45], [0, 200], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme13.bg, overflow: "hidden", fontFamily: theme13.serif }}>
      {/* Diagonal color block — fills left ~55% */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: blockW,
          height: 1480,
          backgroundColor: accent,
          transform: "rotate(-8deg)",
          transformOrigin: "top left",
        }}
      />

      {/* LEFT CONTENT — white text on color */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 700,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 100,
          paddingRight: 60,
          zIndex: 10,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            opacity: eyebrowOpacity,
            fontFamily: theme13.sans,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase" as const,
            color: theme13.white,
            marginBottom: 32,
          }}
        >
          {eyebrow}
        </div>

        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateX(${titleX}px)`,
            fontFamily: theme13.serif,
            fontSize: 88,
            fontWeight: 400,
            color: theme13.white,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
      </div>

      {/* RIGHT CONTENT — navy text on light */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 560,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 80,
          paddingRight: 80,
          zIndex: 10,
        }}
      >
        {/* Vertical navy rule */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 2,
            height: lineH,
            backgroundColor: theme13.navy,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            opacity: subOpacity,
            fontFamily: theme13.serif,
            fontSize: 28,
            fontWeight: 400,
            color: theme13.navy,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
