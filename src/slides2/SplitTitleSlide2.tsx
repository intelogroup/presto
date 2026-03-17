// src/slides2/SplitTitleSlide2.tsx
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme2 } from "./theme2";

type Props = {
  title: string;
  subtitle?: string;
  tag?: string; // small label above title
};

export const SplitTitleSlide2: React.FC<Props> = ({ title, subtitle, tag }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Left panel slides in from left
  const leftX = interpolate(frame, [0, 25], [-1100, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Right panel fades + slides from right
  const rightX = interpolate(frame, [10, 35], [200, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const rightOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: "clamp" });

  // Title words stagger up
  const words = title.split(" ");
  const wordAnims = words.map((_, i) => {
    const start = 20 + i * 8;
    return {
      opacity: interpolate(frame, [start, start + 15], [0, 1], { extrapolateRight: "clamp" }),
      y: interpolate(frame, [start, start + 20], [60, 0], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      }),
    };
  });

  // Diagonal SVG slash — draws in
  const slashLength = 1082; // hypotenuse of 60w × 1080h
  const slashOffset = interpolate(frame, [15, 45], [slashLength, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtitle line
  const subtitleOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [50, 70], [30, 0], { extrapolateRight: "clamp" });

  // Red rule under subtitle
  const ruleWidth = interpolate(frame, [60, 90], [0, 320], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tag
  const tagOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme2.bg, flexDirection: "row", overflow: "hidden" }}>
      {/* Left panel — dark with title */}
      <div
        style={{
          width: "55%",
          height: "100%",
          backgroundColor: theme2.split,
          transform: `translateX(${leftX}px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 80px 80px 100px",
          position: "relative",
        }}
      >
        {/* Tag label */}
        {tag && (
          <div
            style={{
              opacity: tagOpacity,
              fontFamily: theme2.mono,
              fontSize: 22,
              color: theme2.primary,
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 40,
            }}
          >
            {tag}
          </div>
        )}

        {/* Title words */}
        <div style={{ overflow: "hidden" }}>
          {words.map((word, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: theme2.serif,
                fontSize: 108,
                fontWeight: "bold",
                color: "#FAFAF7",
                lineHeight: 1.05,
                marginRight: 24,
                opacity: wordAnims[i].opacity,
                transform: `translateY(${wordAnims[i].y}px)`,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Diagonal red slash at the seam */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: "calc(55% - 30px)",
          width: 60,
          height: 1080,
          overflow: "visible",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <line
          x1="60"
          y1="0"
          x2="0"
          y2="1080"
          stroke={theme2.primary}
          strokeWidth={6}
          strokeDasharray={slashLength}
          strokeDashoffset={slashOffset}
        />
      </svg>

      {/* Right panel — cream with subtitle */}
      <div
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: theme2.bg,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 100px 80px 80px",
          opacity: rightOpacity,
          transform: `translateX(${rightX}px)`,
        }}
      >
        {subtitle && (
          <>
            <div
              style={{
                opacity: subtitleOpacity,
                transform: `translateY(${subtitleY}px)`,
                fontFamily: theme2.serif,
                fontSize: 46,
                color: theme2.text,
                lineHeight: 1.3,
                marginBottom: 40,
                fontStyle: "italic",
              }}
            >
              {subtitle}
            </div>
            {/* Red rule */}
            <div
              style={{
                width: ruleWidth,
                height: 5,
                backgroundColor: theme2.primary,
                borderRadius: 2,
              }}
            />
          </>
        )}

        {/* Year / edition stamp */}
        <div
          style={{
            position: "absolute",
            bottom: 100,
            right: 100,
            fontFamily: theme2.mono,
            fontSize: 18,
            color: theme2.muted,
            letterSpacing: 3,
            textTransform: "uppercase",
            opacity: subtitleOpacity,
          }}
        >
          2026 Edition
        </div>
      </div>
    </AbsoluteFill>
  );
};
