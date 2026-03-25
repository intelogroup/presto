// src/slides4/TriGridSlide4.tsx
// Three equal columns, each with a bold colored top band, big animated counter, and label
// Columns slide up staggered from bottom

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme4 } from "./theme4";

type Column = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  accent: "red" | "yellow" | "black";
};

type Props = {
  headline: string;
  columns: [Column, Column, Column];
};

const ACCENT_MAP: Record<"red" | "yellow" | "black", string> = {
  red: theme4.red,
  yellow: theme4.yellow,
  black: theme4.black,
};

export const TriGridSlide4: React.FC<Props> = ({ headline, columns }) => {
  const frame = useCurrentFrame();

  // Black header bar slides down from top
  const headerH = interpolate(frame, [0, 14], [0, 120], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Headline fades in
  const headlineOpacity = interpolate(frame, [10, 26], [0, 1], { extrapolateRight: "clamp" });

  // Each column slides up staggered
  const colAnims = columns.map((_, i) => {
    const start = 14 + i * 14;
    return {
      y: interpolate(frame, [start, start + 20], [120, 0], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.back(1.2)),
      }),
      opacity: interpolate(frame, [start, start + 16], [0, 1], { extrapolateRight: "clamp" }),
    };
  });

  // Number counters
  const counterValues = columns.map((col, i) => {
    const start = 20 + i * 14;
    const end = start + 40;
    return interpolate(frame, [start, end], [0, col.value], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme4.white,
        fontFamily: theme4.sans,
        overflow: "hidden",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: headerH,
          backgroundColor: theme4.black,
          display: "flex",
          alignItems: "center",
          paddingLeft: 80,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            opacity: headlineOpacity,
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: theme4.white,
          }}
        >
          {headline}
        </span>
      </div>

      {/* Three columns */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
        }}
      >
        {columns.map((col, i) => {
          const accentColor = ACCENT_MAP[col.accent];
          const textColor = col.accent === "yellow" ? theme4.black : theme4.white;
          const raw = counterValues[i];
          const formatted = col.value % 1 === 0
            ? Math.round(raw).toLocaleString()
            : raw.toFixed(1);

          return (
            <div
              key={i}
              style={{
                flex: 1,
                borderRight: i < 2 ? `3px solid ${theme4.black}` : "none",
                display: "flex",
                flexDirection: "column",
                opacity: colAnims[i].opacity,
                transform: `translateY(${colAnims[i].y}px)`,
              }}
            >
              {/* Accent band */}
              <div
                style={{
                  width: "100%",
                  height: 18,
                  backgroundColor: accentColor,
                }}
              />

              {/* Content */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px 60px",
                  textAlign: "center",
                  backgroundColor: theme4.white,
                }}
              >
                {/* Big number */}
                <div
                  style={{
                    fontSize: 120,
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: -4,
                    color: theme4.black,
                    marginBottom: 20,
                  }}
                >
                  {col.prefix ?? ""}
                  {formatted}
                  {col.suffix ?? ""}
                </div>

                {/* Accent divider */}
                <div
                  style={{
                    width: 60,
                    height: 6,
                    backgroundColor: accentColor,
                    marginBottom: 24,
                  }}
                />

                {/* Label */}
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: theme4.black,
                    lineHeight: 1.2,
                  }}
                >
                  {col.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
