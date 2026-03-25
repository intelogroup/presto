// src/slides8/MinimalProgressBarsSlide8.tsx
// Clean Minimalist — animated progress bars with smooth ease-out fill

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme8 } from "./theme8";

type Bar = {
  label: string;
  value: number; // 0-100
  note?: string;
};

type Props = {
  title: string;
  bars: Bar[];
};

export const MinimalProgressBarsSlide8: React.FC<Props> = ({ title, bars }) => {
  const frame = useCurrentFrame();

  // Title slides down: translateY -20→0, frame 0→20
  const titleY = interpolate(frame, [0, 20], [-20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Thin rule grows frame 18→34 to 240px
  const ruleW = interpolate(frame, [18, 34], [0, 240], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Left vertical rule fades in frame 0→15
  const sideRuleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Bar animations: bar i starts at frame 28 + i*14, animates over 35 frames
  const barAnims = bars.map((bar, i) => {
    const start = 28 + i * 14;
    const end = start + 35;
    const fillPct = interpolate(frame, [start, end], [0, bar.value], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const labelOpacity = interpolate(frame, [end - 5, end + 10], [0, 1], {
      extrapolateRight: "clamp",
    });
    return { fillPct, labelOpacity };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme8.bg,
        fontFamily: theme8.sans,
        overflow: "hidden",
      }}
    >
      {/* Subtle left vertical rule */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 160,
          width: 2,
          height: 300,
          backgroundColor: theme8.charcoal,
          opacity: sideRuleOpacity,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 160,
          paddingLeft: 24,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 64,
          fontWeight: 700,
          color: theme8.charcoal,
          letterSpacing: -2,
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>

      {/* Thin 2px rule under title */}
      <div
        style={{
          position: "absolute",
          top: 192,
          left: 160,
          width: ruleW,
          height: 2,
          backgroundColor: theme8.charcoal,
        }}
      />

      {/* Bars */}
      <div
        style={{
          position: "absolute",
          top: 272,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          gap: 48,
          padding: "0 160px",
          boxSizing: "border-box",
        }}
      >
        {bars.map((bar, i) => {
          const { fillPct, labelOpacity } = barAnims[i];
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column" }}>
              {/* Label row */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 500,
                    color: theme8.charcoal,
                    lineHeight: 1.3,
                  }}
                >
                  {bar.label}
                </span>
                {bar.note && (
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 400,
                      color: "#6B7280",
                      lineHeight: 1.3,
                    }}
                  >
                    {bar.note}
                  </span>
                )}
              </div>

              {/* Bar track */}
              <div
                style={{
                  width: "100%",
                  height: 12,
                  backgroundColor: "#E5E7EB",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                {/* Bar fill */}
                <div
                  style={{
                    height: "100%",
                    borderRadius: 6,
                    backgroundColor: theme8.charcoal,
                    width: `${fillPct}%`,
                  }}
                />
              </div>

              {/* Value % label below bar, right-aligned */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 8,
                  opacity: labelOpacity,
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: theme8.charcoal,
                  }}
                >
                  {bar.value}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
