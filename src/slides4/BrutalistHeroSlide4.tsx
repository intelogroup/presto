// src/slides4/BrutalistHeroSlide4.tsx
// Swiss Brutalist opening card — white bg, heavy type, red/black bars
// Animation: bars slam in from edges, title words stamp up one by one

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme4 } from "./theme4";

type Props = {
  title: string;   // all-caps display line (e.g. "LAUNCH.")
  tag: string;     // small label in red box (e.g. "FEEDEO 2026")
  subtitle: string;
};

export const BrutalistHeroSlide4: React.FC<Props> = ({ title, tag, subtitle }) => {
  const frame = useCurrentFrame();

  // Red top bar slides in from left
  const topBarW = interpolate(frame, [0, 18], [0, 1920], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Black left vertical bar drops from top
  const leftBarH = interpolate(frame, [5, 25], [0, 540], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Yellow right accent bar rises from bottom
  const rightBarH = interpolate(frame, [8, 28], [0, 380], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Title words stagger up
  const words = title.split(" ");
  const wordAnims = words.map((_, i) => {
    const start = 18 + i * 10;
    return {
      opacity: interpolate(frame, [start, start + 12], [0, 1], { extrapolateRight: "clamp" }),
      y: interpolate(frame, [start, start + 16], [80, 0], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.back(1.4)),
      }),
    };
  });

  // Tag badge fades in
  const tagOpacity = interpolate(frame, [30, 44], [0, 1], { extrapolateRight: "clamp" });
  const tagX = interpolate(frame, [30, 44], [-40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtitle slides in
  const subOpacity = interpolate(frame, [50, 65], [0, 1], { extrapolateRight: "clamp" });
  const subY = interpolate(frame, [50, 65], [24, 0], { extrapolateRight: "clamp" });

  // Bottom rule grows
  const ruleW = interpolate(frame, [60, 90], [0, 700], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme4.white,
        fontFamily: theme4.sans,
        overflow: "hidden",
      }}
    >
      {/* Red top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: topBarW,
          height: 14,
          backgroundColor: theme4.red,
        }}
      />

      {/* Black left vertical bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 80,
          width: 10,
          height: leftBarH,
          backgroundColor: theme4.black,
        }}
      />

      {/* Yellow right accent bar (bottom-anchored) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 120,
          width: 10,
          height: rightBarH,
          backgroundColor: theme4.yellow,
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
          alignItems: "flex-start",
          paddingLeft: 130,
          paddingRight: 200,
        }}
      >
        {/* Tag badge */}
        <div
          style={{
            opacity: tagOpacity,
            transform: `translateX(${tagX}px)`,
            backgroundColor: theme4.red,
            color: theme4.white,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 6,
            textTransform: "uppercase",
            padding: "8px 24px",
            marginBottom: 40,
            display: "inline-block",
          }}
        >
          {tag}
        </div>

        {/* Title words */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0 20px", marginBottom: 48 }}>
          {words.map((word, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize: 148,
                fontWeight: 900,
                color: theme4.black,
                lineHeight: 0.95,
                letterSpacing: -5,
                textTransform: "uppercase",
                opacity: wordAnims[i].opacity,
                transform: `translateY(${wordAnims[i].y}px)`,
              }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Red rule */}
        <div
          style={{
            width: ruleW,
            height: 6,
            backgroundColor: theme4.red,
            marginBottom: 32,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            fontSize: 36,
            fontWeight: 500,
            color: theme4.black,
            letterSpacing: 1,
            maxWidth: 800,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
