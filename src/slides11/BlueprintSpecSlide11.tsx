// src/slides11/BlueprintSpecSlide11.tsx
// Technical Specifications — monospace key/value rows, dotted separators, staggered entry

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme11 } from "./theme11";

type Spec = {
  key: string;
  value: string;
  unit?: string;
};

type Props = {
  title: string;
  specs: Spec[];
};

const BRACKET = 20;
const corners: React.CSSProperties[] = [
  { top: 40, left: 40, borderTop: "2px solid #3B9FE8", borderLeft: "2px solid #3B9FE8" },
  { top: 40, right: 40, borderTop: "2px solid #3B9FE8", borderRight: "2px solid #3B9FE8" },
  { bottom: 40, left: 40, borderBottom: "2px solid #3B9FE8", borderLeft: "2px solid #3B9FE8" },
  { bottom: 40, right: 40, borderBottom: "2px solid #3B9FE8", borderRight: "2px solid #3B9FE8" },
];

export const BlueprintSpecSlide11: React.FC<Props> = ({ title, specs }) => {
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

        {/* Label under title */}
        <div
          style={{
            opacity: titleOpacity,
            fontFamily: theme11.mono,
            fontSize: 11,
            color: theme11.label,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 48,
          }}
        >
          // TECHNICAL SPECIFICATIONS
        </div>

        {/* Spec rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {specs.map((spec, i) => {
            const rowOpacity = interpolate(
              frame,
              [10 + i * 8, 25 + i * 8],
              [0, 1],
              {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );

            return (
              <div key={i}>
                {/* Row separator */}
                <div
                  style={{
                    height: 1,
                    backgroundColor: theme11.gridLine,
                    opacity: rowOpacity,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingTop: 18,
                    paddingBottom: 18,
                    opacity: rowOpacity,
                  }}
                >
                  {/* Key */}
                  <div
                    style={{
                      fontFamily: theme11.mono,
                      fontSize: 15,
                      color: theme11.label,
                      width: 260,
                      flexShrink: 0,
                    }}
                  >
                    {spec.key}
                  </div>

                  {/* Dotted separator */}
                  <div
                    style={{
                      flex: 1,
                      fontFamily: theme11.mono,
                      fontSize: 13,
                      color: "rgba(59, 159, 232, 0.25)",
                      letterSpacing: 3,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      paddingLeft: 12,
                      paddingRight: 12,
                    }}
                  >
                    {"·".repeat(60)}
                  </div>

                  {/* Value + unit */}
                  <div
                    style={{
                      fontFamily: theme11.mono,
                      fontSize: 18,
                      color: theme11.amber,
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {spec.value}
                    {spec.unit && (
                      <span
                        style={{
                          fontSize: 13,
                          color: theme11.label,
                          marginLeft: 6,
                        }}
                      >
                        {spec.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {/* Bottom separator */}
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
