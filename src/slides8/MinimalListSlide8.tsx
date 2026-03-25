// src/slides8/MinimalListSlide8.tsx
// Clean Minimalist list — generous spacing, bullet circles, staggered slide-in

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme8 } from "./theme8";

type Props = {
  title: string;
  items: string[];
};

export const MinimalListSlide8: React.FC<Props> = ({ title, items }) => {
  const frame = useCurrentFrame();

  // Title slides down from translateY -24→0 frame 0→20
  const titleY = interpolate(frame, [0, 20], [-24, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Rule under title grows frame 18→36
  const ruleW = interpolate(frame, [18, 36], [0, 400], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Per-item stagger animations
  const itemAnims = items.map((_, i) => {
    const start = 32 + i * 16;
    const end = start + 20;
    return {
      x: interpolate(frame, [start, end], [-40, 0], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      }),
      opacity: interpolate(frame, [start, end], [0, 1], { extrapolateRight: "clamp" }),
    };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme8.bg,
        fontFamily: theme8.sans,
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 160,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 64,
          fontWeight: 700,
          color: theme8.charcoal,
          letterSpacing: -2,
        }}
      >
        {title}
      </div>

      {/* 2px charcoal rule under title */}
      <div
        style={{
          position: "absolute",
          top: 218,
          left: 160,
          width: ruleW,
          height: 2,
          backgroundColor: theme8.charcoal,
        }}
      />

      {/* Items list */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 160,
          right: 120,
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {items.slice(0, 5).map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 24,
              opacity: itemAnims[i].opacity,
              transform: `translateX(${itemAnims[i].x}px)`,
            }}
          >
            {/* Bullet circle */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: theme8.charcoal,
                flexShrink: 0,
                alignSelf: "center",
              }}
            />

            {/* Item text */}
            <div
              style={{
                fontSize: 32,
                fontWeight: 400,
                color: theme8.charcoal,
                lineHeight: 1.5,
              }}
            >
              {item}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
