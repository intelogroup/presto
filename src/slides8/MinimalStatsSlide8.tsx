// src/slides8/MinimalStatsSlide8.tsx
// Clean Minimalist stats — 3 big numbers in a row, separated by thin vertical rules

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme8 } from "./theme8";

type StatItem = {
  value: string;
  label: string;
  note?: string;
};

type Props = {
  title: string;
  stats: [StatItem, StatItem, StatItem];
};

export const MinimalStatsSlide8: React.FC<Props> = ({ title, stats }) => {
  const frame = useCurrentFrame();

  // Title slides down from translateY -20→0 frame 0→18
  const titleY = interpolate(frame, [0, 18], [-20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  // Full-width rule grows from left frame 15→35
  const ruleW = interpolate(frame, [15, 35], [0, 1920], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Per-stat animations (stagger by i*12)
  const statAnims = stats.map((_, i) => {
    const start = 20 + i * 12;
    const end = start + 22;
    return {
      y: interpolate(frame, [start, end], [30, 0], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      }),
      opacity: interpolate(frame, [start, end], [0, 1], { extrapolateRight: "clamp" }),
      noteOpacity: interpolate(frame, [start + 10, end + 10], [0, 1], { extrapolateRight: "clamp" }),
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
          left: 120,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 52,
          fontWeight: 600,
          color: theme8.charcoal,
          letterSpacing: -1,
        }}
      >
        {title}
      </div>

      {/* Full-width thin rule at y=200 */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          width: ruleW,
          height: 1,
          backgroundColor: theme8.lightGray,
        }}
      />

      {/* Stats row */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {stats.map((stat, i) => (
          <React.Fragment key={i}>
            {/* Vertical separator (not before the first item) */}
            {i > 0 && (
              <div
                style={{
                  width: 1,
                  height: 200,
                  backgroundColor: theme8.lightGray,
                  flexShrink: 0,
                }}
              />
            )}

            {/* Stat block */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0 80px",
                opacity: statAnims[i].opacity,
                transform: `translateY(${statAnims[i].y}px)`,
              }}
            >
              {/* Value */}
              <div
                style={{
                  fontSize: 96,
                  fontWeight: 700,
                  color: theme8.charcoal,
                  letterSpacing: -3,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: theme8.gray,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginTop: 12,
                }}
              >
                {stat.label}
              </div>

              {/* Note (optional) */}
              {stat.note && (
                <div
                  style={{
                    opacity: statAnims[i].noteOpacity,
                    fontSize: 16,
                    color: theme8.gray,
                    fontStyle: "italic",
                    marginTop: 8,
                  }}
                >
                  {stat.note}
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};
