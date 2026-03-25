// src/slides13/DiagListSlide13.tsx
// P13 list — diagonal block top-left quadrant, numbered list with decorative oversized numbers

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme13 } from "./theme13";

type Props = {
  title: string;
  items: string[];
  accent: string;
};

export const DiagListSlide13: React.FC<Props> = ({ title, items, accent }) => {
  const frame = useCurrentFrame();

  // Title fade in frames 0-20
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Each item: translateX -20→0, opacity 0→1, staggered 10 frames each starting frame 20
  const itemAnimations = items.map((_, i) => ({
    opacity: interpolate(frame, [20 + i * 10, 30 + i * 10], [0, 1], { extrapolateRight: "clamp" }),
    x: interpolate(frame, [20 + i * 10, 30 + i * 10], [-20, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: theme13.bg, overflow: "hidden" }}>
      {/* Diagonal block — top-left quadrant, ~30% of canvas */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 900,
          height: 900,
          backgroundColor: accent,
          transform: "rotate(-8deg)",
          transformOrigin: "top left",
        }}
      />

      {/* Title on color block */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 100,
          zIndex: 10,
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontFamily: theme13.serif,
            fontSize: 72,
            fontWeight: 400,
            color: theme13.white,
            lineHeight: 1.1,
            maxWidth: 500,
          }}
        >
          {title}
        </div>
      </div>

      {/* Numbered list in light area */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 620,
          right: 80,
          bottom: 80,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 36,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              opacity: itemAnimations[i]?.opacity ?? 0,
              transform: `translateX(${itemAnimations[i]?.x ?? -20}px)`,
              position: "relative",
              paddingLeft: 80,
              minHeight: 80,
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Decorative oversized number */}
            <div
              style={{
                position: "absolute",
                left: -10,
                top: "50%",
                transform: "translateY(-50%)",
                fontFamily: theme13.serif,
                fontSize: 80,
                fontWeight: 400,
                color: accent,
                opacity: 0.3,
                lineHeight: 1,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>

            {/* Item text */}
            <div
              style={{
                fontFamily: theme13.serif,
                fontSize: 22,
                fontWeight: 400,
                color: theme13.navy,
                lineHeight: 1.5,
                position: "relative",
                zIndex: 1,
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
