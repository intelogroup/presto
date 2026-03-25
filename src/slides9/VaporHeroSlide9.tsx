// src/slides9/VaporHeroSlide9.tsx
// Vaporwave hero — neon title, retrowave grid horizon lines, tag + subtitle stagger

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme9 } from "./theme9";

type Props = {
  title: string;
  subtitle: string;
  tag: string;
};

export const VaporHeroSlide9: React.FC<Props> = ({ title, subtitle, tag }) => {
  const frame = useCurrentFrame();

  // Tag fades in first (frames 0–15)
  const tagOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Title slides up from below (translateY 50→0, opacity 0→1, frames 10–45)
  const titleY = interpolate(frame, [10, 45], [50, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.1)),
  });
  const titleOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: "clamp" });

  // Subtitle fades in (frames 48–65)
  const subOpacity = interpolate(frame, [48, 65], [0, 1], { extrapolateRight: "clamp" });

  // Retrowave horizon lines — 6 lines, each draws width 0→1920, staggered starting frame 20–50
  const lineWidths = [0, 1, 2, 3, 4, 5].map((i) => {
    const start = 20 + i * 5;
    const end = 50 + i * 5;
    return interpolate(frame, [start, end], [0, 1920], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  });

  // Line vertical positions (closer together toward horizon = top of the group)
  const linePositions = [0, 18, 32, 43, 52, 59]; // px from top of grid block, converging upward

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme9.bg,
        fontFamily: theme9.display,
        overflow: "hidden",
      }}
    >
      {/* Decorative corner glow */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(184,79,255,0.18) 0%, transparent 70%)`,
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
          bottom: 140,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 120,
          paddingRight: 120,
        }}
      >
        {/* Tag */}
        <div
          style={{
            opacity: tagOpacity,
            fontFamily: theme9.mono,
            fontSize: 16,
            color: theme9.blue,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 32,
            textShadow: `0 0 12px ${theme9.blue}`,
          }}
        >
          {tag}
        </div>

        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: 108,
            fontFamily: theme9.display,
            fontWeight: 900,
            color: theme9.pink,
            letterSpacing: -2,
            lineHeight: 1.05,
            maxWidth: 1100,
            marginBottom: 40,
            textShadow: `0 0 20px ${theme9.pink}, 0 0 40px ${theme9.pink}, 0 0 80px rgba(255,45,135,0.4)`,
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: subOpacity,
            fontFamily: theme9.mono,
            fontSize: 28,
            color: theme9.dim,
            lineHeight: 1.5,
            maxWidth: 800,
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Retrowave grid horizon lines at the bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          height: 70,
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
              opacity: 0.6 - i * 0.06,
              boxShadow: `0 0 6px ${theme9.pink}`,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
