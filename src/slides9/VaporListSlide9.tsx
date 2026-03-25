// src/slides9/VaporListSlide9.tsx
// Vaporwave list slide — hot pink title, monospace items with ▶ markers in electric blue

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme9 } from "./theme9";

type Props = {
  title: string;
  items: string[];
};

export const VaporListSlide9: React.FC<Props> = ({ title, items }) => {
  const frame = useCurrentFrame();

  // Title slides up (frames 0–25)
  const titleY = interpolate(frame, [0, 25], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme9.bg,
        fontFamily: theme9.display,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: 120,
        paddingRight: 120,
      }}
    >
      {/* Decorative left glow bar */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "20%",
          bottom: "20%",
          width: 3,
          backgroundColor: theme9.pink,
          boxShadow: `0 0 12px ${theme9.pink}, 0 0 24px ${theme9.pink}`,
        }}
      />

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 72,
          fontFamily: theme9.display,
          fontWeight: 900,
          color: theme9.pink,
          marginBottom: 52,
          letterSpacing: -1,
          textShadow: `0 0 20px ${theme9.pink}, 0 0 40px ${theme9.pink}`,
        }}
      >
        {title}
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {items.map((item, i) => {
          const startFrame = 15 + i * 12;
          const endFrame = startFrame + 20;

          const itemX = interpolate(frame, [startFrame, endFrame], [-30, 0], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const itemOpacity = interpolate(frame, [startFrame, endFrame], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                transform: `translateX(${itemX}px)`,
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
              }}
            >
              <span
                style={{
                  fontFamily: theme9.mono,
                  fontSize: 24,
                  color: theme9.blue,
                  textShadow: `0 0 10px ${theme9.blue}`,
                  lineHeight: 1.5,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                ▶
              </span>
              <span
                style={{
                  fontFamily: theme9.mono,
                  fontSize: 28,
                  color: theme9.white,
                  lineHeight: 1.5,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
