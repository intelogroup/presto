// src/slides2/PullQuoteSlide2.tsx
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme2 } from "./theme2";

type Props = {
  quote: string;
  author: string;
  role?: string;
};

export const PullQuoteSlide2: React.FC<Props> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Giant quotation mark scales in
  const quoteMarkScale = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const quoteMarkOpacity = interpolate(frame, [0, 20], [0, 0.12], { extrapolateRight: "clamp" });

  // Red left border grows down
  const borderHeight = interpolate(frame, [10, 50], [0, 580], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Quote text fades + rises
  const quoteOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });
  const quoteY = interpolate(frame, [20, 50], [50, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Author fades in
  const authorOpacity = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: "clamp" });

  // Background color shift (very subtle warm tint)
  const bgOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme2.split, overflow: "hidden" }}>
      {/* Background texture strip */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "35%",
          height: "100%",
          backgroundColor: theme2.primary,
          opacity: 0.08,
        }}
      />

      {/* Giant quotation mark */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 80,
          fontFamily: theme2.serif,
          fontSize: 600,
          color: "#FAFAF7",
          opacity: quoteMarkOpacity,
          transform: `scale(${quoteMarkScale})`,
          transformOrigin: "top left",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        "
      </div>

      {/* Red left border */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: "50%",
          transform: "translateY(-50%)",
          width: 8,
          height: borderHeight,
          backgroundColor: theme2.primary,
          borderRadius: 4,
        }}
      />

      {/* Quote + Author */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "100px 160px 100px 180px",
        }}
      >
        <div
          style={{
            opacity: quoteOpacity,
            transform: `translateY(${quoteY}px)`,
            fontFamily: theme2.serif,
            fontSize: 62,
            color: "#FAFAF7",
            lineHeight: 1.4,
            fontStyle: "italic",
            maxWidth: 1400,
            marginBottom: 60,
          }}
        >
          "{quote}"
        </div>

        <div style={{ opacity: authorOpacity }}>
          <div
            style={{
              fontFamily: theme2.mono,
              fontSize: 28,
              color: theme2.primary,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            — {author}
          </div>
          {role && (
            <div
              style={{
                fontFamily: theme2.mono,
                fontSize: 22,
                color: theme2.muted,
                letterSpacing: 1,
              }}
            >
              {role}
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
