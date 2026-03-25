// src/slides17/PillarsSlide17.tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme17 } from "./theme17";

interface Props {
  title: string;
  pillars: string[];
}

export const PillarsSlide17: React.FC<Props> = ({ title, pillars }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme17.bg,
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 120,
        paddingRight: 120,
      }}
    >
      {/* Vertical gold bar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8, backgroundColor: theme17.gold }} />

      <div style={{ width: "100%" }}>
        {/* Section label */}
        <p
          style={{
            fontFamily: theme17.body,
            fontSize: 20,
            color: theme17.gold,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            margin: "0 0 24px",
            opacity: titleOpacity,
          }}
        >
          The Course
        </p>

        {/* Title */}
        <h2
          style={{
            fontFamily: theme17.display,
            fontSize: 64,
            fontWeight: "normal",
            color: theme17.text,
            margin: "0 0 72px",
            opacity: titleOpacity,
          }}
        >
          {title}
        </h2>

        {/* Pillars grid — 3 columns × 2 rows */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px 60px",
          }}
        >
          {pillars.map((pillar, i) => {
            const delay = 15 + i * 12;
            const op = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: "clamp" });
            const x = interpolate(frame, [delay, delay + 20], [-20, 0], { extrapolateRight: "clamp" });

            return (
              <div
                key={pillar}
                style={{
                  opacity: op,
                  transform: `translateX(${x}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  borderLeft: `3px solid ${theme17.gold}`,
                  paddingLeft: 24,
                }}
              >
                <span
                  style={{
                    fontFamily: theme17.display,
                    fontSize: 40,
                    color: theme17.text,
                    lineHeight: 1.2,
                  }}
                >
                  {pillar}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
