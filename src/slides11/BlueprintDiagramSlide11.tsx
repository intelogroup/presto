// src/slides11/BlueprintDiagramSlide11.tsx
// Blueprint Diagram — horizontal bar chart, amber bars, blueprint aesthetic

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme11 } from "./theme11";

type Bar = {
  label: string;
  value: number; // 0–100
  unit?: string;
};

type Props = {
  title: string;
  bars: Bar[];
};

const BRACKET = 20;
const corners: React.CSSProperties[] = [
  { top: 40, left: 40, borderTop: "2px solid #3B9FE8", borderLeft: "2px solid #3B9FE8" },
  { top: 40, right: 40, borderTop: "2px solid #3B9FE8", borderRight: "2px solid #3B9FE8" },
  { bottom: 40, left: 40, borderBottom: "2px solid #3B9FE8", borderLeft: "2px solid #3B9FE8" },
  { bottom: 40, right: 40, borderBottom: "2px solid #3B9FE8", borderRight: "2px solid #3B9FE8" },
];

const BAR_TRACK_WIDTH = 560;

export const BlueprintDiagramSlide11: React.FC<Props> = ({ title, bars }) => {
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
            fontSize: 48,
            fontWeight: 700,
            color: theme11.white,
            letterSpacing: -1,
            marginBottom: 8,
          }}
        >
          {title}
        </div>

        {/* Sub-label */}
        <div
          style={{
            opacity: titleOpacity,
            fontFamily: theme11.mono,
            fontSize: 11,
            color: theme11.label,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 52,
          }}
        >
          // PERFORMANCE METRICS
        </div>

        {/* Bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {bars.map((bar, i) => {
            const barW = interpolate(
              frame,
              [15 + i * 10, 40 + i * 10],
              [0, (bar.value / 100) * BAR_TRACK_WIDTH],
              {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );

            const rowOpacity = interpolate(
              frame,
              [12 + i * 8, 25 + i * 8],
              [0, 1],
              {
                extrapolateRight: "clamp",
              }
            );

            return (
              <div key={i} style={{ opacity: rowOpacity }}>
                {/* Horizontal rule above */}
                <div
                  style={{
                    height: 1,
                    backgroundColor: theme11.gridLine,
                    marginBottom: 16,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    marginBottom: 16,
                  }}
                >
                  {/* Label */}
                  <div
                    style={{
                      fontFamily: theme11.mono,
                      fontSize: 14,
                      color: theme11.white,
                      width: 220,
                      flexShrink: 0,
                    }}
                  >
                    {bar.label}
                  </div>

                  {/* Track + bar */}
                  <div
                    style={{
                      position: "relative",
                      width: BAR_TRACK_WIDTH,
                      height: 8,
                      backgroundColor: "rgba(59,159,232,0.1)",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: 8,
                        width: barW,
                        backgroundColor: theme11.amber,
                      }}
                    />
                  </div>

                  {/* Value label */}
                  <div
                    style={{
                      fontFamily: theme11.mono,
                      fontSize: 14,
                      color: theme11.amber,
                      flexShrink: 0,
                    }}
                  >
                    {bar.value}
                    {bar.unit && (
                      <span
                        style={{ color: theme11.label, fontSize: 12, marginLeft: 4 }}
                      >
                        {bar.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bottom rule */}
          <div
            style={{
              height: 1,
              backgroundColor: theme11.gridLine,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
