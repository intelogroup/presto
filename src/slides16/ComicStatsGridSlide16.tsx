// src/slides16/ComicStatsGridSlide16.tsx
// Comic stats grid — white halftone bg, headline, 2x2 grid of colored mini-panels

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme16 } from "./theme16";

type StatColor = "red" | "blue" | "yellow";

type Props = {
  headline: string;
  stats: Array<{ value: string; label: string; color: StatColor }>;
};

const getColor = (c: StatColor) => {
  if (c === "red") return theme16.red;
  if (c === "blue") return theme16.blue;
  return theme16.yellow;
};

const getTextColor = (c: StatColor) => {
  return c === "yellow" ? theme16.black : theme16.white;
};

export const ComicStatsGridSlide16: React.FC<Props> = ({ headline, stats }) => {
  const frame = useCurrentFrame();

  // Panel border snap in frames 0-8
  const borderOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Headline slides in frames 0-18
  const headlineY = interpolate(frame, [0, 18], [-30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme16.white,
        ...theme16.halftone,
        overflow: "hidden",
        fontFamily: theme16.display,
      }}
    >
      {/* Panel border */}
      <div
        style={{
          position: "absolute",
          inset: 20,
          border: `6px solid ${theme16.black}`,
          opacity: borderOpacity,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 60,
          right: 60,
          transform: `translateY(${headlineY}px)`,
          opacity: headlineOpacity,
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontFamily: theme16.display,
            fontWeight: 900,
            color: theme16.black,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            height: 4,
            backgroundColor: theme16.black,
            marginTop: 8,
          }}
        />
      </div>

      {/* 2x2 Stats grid */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 60,
          right: 60,
          bottom: 50,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 20,
        }}
      >
        {stats.slice(0, 4).map((stat, i) => {
          const startFrame = 15 + i * 10;
          const endFrame = 30 + i * 10;
          const itemScale = interpolate(frame, [startFrame, endFrame - 4, endFrame], [0.8, 1.05, 1.0], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.3)),
          });
          const itemOpacity = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
            extrapolateRight: "clamp",
          });

          const color = getColor(stat.color);
          const textColor = getTextColor(stat.color);

          return (
            <div
              key={i}
              style={{
                backgroundColor: color,
                ...theme16.halftone,
                border: `4px solid ${theme16.black}`,
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${itemScale})`,
                opacity: itemOpacity,
                boxShadow: `5px 5px 0 ${theme16.black}`,
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontFamily: theme16.display,
                  fontWeight: 900,
                  color: textColor,
                  textShadow:
                    textColor === theme16.white
                      ? `3px 3px 0 ${theme16.black}`
                      : "none",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontFamily: theme16.body,
                  color: textColor === theme16.white ? "rgba(255,255,255,0.85)" : theme16.black,
                  marginTop: 8,
                  letterSpacing: 1,
                  textAlign: "center",
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
