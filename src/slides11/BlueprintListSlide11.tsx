// src/slides11/BlueprintListSlide11.tsx
// Blueprint List — checkmark items with left blue border strip, staggered entry

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme11 } from "./theme11";

type Props = {
  title: string;
  items: string[];
};

const BRACKET = 20;
const corners: React.CSSProperties[] = [
  { top: 40, left: 40, borderTop: "2px solid #3B9FE8", borderLeft: "2px solid #3B9FE8" },
  { top: 40, right: 40, borderTop: "2px solid #3B9FE8", borderRight: "2px solid #3B9FE8" },
  { bottom: 40, left: 40, borderBottom: "2px solid #3B9FE8", borderLeft: "2px solid #3B9FE8" },
  { bottom: 40, right: 40, borderBottom: "2px solid #3B9FE8", borderRight: "2px solid #3B9FE8" },
];

export const BlueprintListSlide11: React.FC<Props> = ({ title, items }) => {
  const frame = useCurrentFrame();

  const bracketOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleOpacity = interpolate(frame, [5, 20], [0, 1], {
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

      {/* Left blue border strip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: theme11.blue,
        }}
      />

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
          justifyContent: "center",
          paddingLeft: 120,
          paddingRight: 120,
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            fontSize: 52,
            fontWeight: 700,
            color: theme11.white,
            letterSpacing: -1,
            marginBottom: 52,
          }}
        >
          {title}
        </div>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {items.map((item, i) => {
            const itemOpacity = interpolate(
              frame,
              [15 + i * 10, 30 + i * 10],
              [0, 1],
              {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );
            const itemX = interpolate(
              frame,
              [15 + i * 10, 30 + i * 10],
              [-20, 0],
              {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  opacity: itemOpacity,
                  transform: `translateX(${itemX}px)`,
                }}
              >
                {/* Checkmark badge */}
                <div
                  style={{
                    fontFamily: theme11.mono,
                    fontSize: 14,
                    color: theme11.amber,
                    flexShrink: 0,
                    letterSpacing: 0,
                  }}
                >
                  [✓]
                </div>

                {/* Item text */}
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 400,
                    color: theme11.white,
                    lineHeight: 1.4,
                  }}
                >
                  {item}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
