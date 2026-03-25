// src/slides11/BlueprintGridSlide11.tsx
// Blueprint Grid — 2×3 cell layout, code + title + body per cell, staggered entry

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme11 } from "./theme11";

type GridItem = {
  code: string;
  title: string;
  body: string;
};

type Props = {
  headline: string;
  items: GridItem[];
};

const BRACKET = 20;
const corners: React.CSSProperties[] = [
  { top: 40, left: 40, borderTop: "2px solid #3B9FE8", borderLeft: "2px solid #3B9FE8" },
  { top: 40, right: 40, borderTop: "2px solid #3B9FE8", borderRight: "2px solid #3B9FE8" },
  { bottom: 40, left: 40, borderBottom: "2px solid #3B9FE8", borderLeft: "2px solid #3B9FE8" },
  { bottom: 40, right: 40, borderBottom: "2px solid #3B9FE8", borderRight: "2px solid #3B9FE8" },
];

export const BlueprintGridSlide11: React.FC<Props> = ({ headline, items }) => {
  const frame = useCurrentFrame();

  const bracketOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const headlineOpacity = interpolate(frame, [3, 18], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme11.bg,
        ...theme11.dotGrid,
        fontFamily: theme11.sans,
        overflow: "hidden",
      }}
    >
      {/* Corner brackets */}
      {corners.map((corner, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: BRACKET,
            height: BRACKET,
            opacity: bracketOpacity,
            ...corner,
          }}
        />
      ))}

      {/* Content */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          paddingLeft: 80,
          paddingRight: 80,
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            fontSize: 44,
            fontWeight: 700,
            color: theme11.white,
            letterSpacing: -1,
            marginBottom: 36,
            flexShrink: 0,
          }}
        >
          {headline}
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr 1fr",
            gap: 1,
            flex: 1,
            backgroundColor: "rgba(59,159,232,0.08)",
          }}
        >
          {items.slice(0, 6).map((item, i) => {
            const cellOpacity = interpolate(
              frame,
              [10 + i * 8, 26 + i * 8],
              [0, 1],
              {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );
            const cellScale = interpolate(
              frame,
              [10 + i * 8, 26 + i * 8],
              [0.96, 1],
              {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );

            return (
              <div
                key={i}
                style={{
                  backgroundColor: "rgba(7, 18, 32, 0.92)",
                  border: "1px solid rgba(59,159,232,0.25)",
                  padding: "24px 28px",
                  opacity: cellOpacity,
                  transform: `scale(${cellScale})`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {/* Code */}
                <div
                  style={{
                    fontFamily: theme11.mono,
                    fontSize: 11,
                    color: theme11.amber,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {item.code}
                </div>

                {/* Title */}
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: theme11.white,
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </div>

                {/* Body */}
                <div
                  style={{
                    fontSize: 14,
                    color: theme11.label,
                    lineHeight: 1.6,
                    marginTop: 4,
                  }}
                >
                  {item.body}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
