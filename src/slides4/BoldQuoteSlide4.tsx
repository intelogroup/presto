// src/slides4/BoldQuoteSlide4.tsx
// Full yellow background — giant black quote, attribution bottom-right
// Big decorative quote mark, quote flies up from bottom

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme4 } from "./theme4";

type Props = {
  quote: string;
  author: string;
  role?: string;
};

export const BoldQuoteSlide4: React.FC<Props> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();

  // Decorative quote mark drops in from top
  const qMarkY = interpolate(frame, [0, 20], [-200, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const qMarkOpacity = interpolate(frame, [0, 20], [0, 0.12], { extrapolateRight: "clamp" });

  // Quote slides up
  const quoteY = interpolate(frame, [12, 38], [80, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const quoteOpacity = interpolate(frame, [12, 38], [0, 1], { extrapolateRight: "clamp" });

  // Black top bar slides in from right
  const topBarW = interpolate(frame, [0, 16], [0, 1920], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Attribution fades in
  const attrOpacity = interpolate(frame, [50, 68], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme4.yellow,
        fontFamily: theme4.sans,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Black top stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: topBarW,
          height: 12,
          backgroundColor: theme4.black,
        }}
      />

      {/* Red bottom stripe */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 12,
          backgroundColor: theme4.red,
        }}
      />

      {/* Decorative huge quote mark */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          fontSize: 600,
          fontWeight: 900,
          color: theme4.black,
          opacity: qMarkOpacity,
          transform: `translateY(${qMarkY}px)`,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        "
      </div>

      {/* Quote text */}
      <div
        style={{
          maxWidth: 1300,
          padding: "0 120px",
          opacity: quoteOpacity,
          transform: `translateY(${quoteY}px)`,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: theme4.black,
            lineHeight: 1.15,
            letterSpacing: -2,
          }}
        >
          "{quote}"
        </div>
      </div>

      {/* Attribution */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 100,
          opacity: attrOpacity,
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: theme4.black,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          — {author}
        </div>
        {role && (
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: theme4.black,
              opacity: 0.7,
              marginTop: 8,
              letterSpacing: 1,
            }}
          >
            {role}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
