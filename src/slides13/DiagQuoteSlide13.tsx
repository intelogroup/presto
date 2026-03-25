// src/slides13/DiagQuoteSlide13.tsx
// P13 quote — thin diagonal strip left, quote spans center, decorative quotation mark

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme13 } from "./theme13";

type Props = {
  quote: string;
  author: string;
  role?: string;
  accent: string;
};

export const DiagQuoteSlide13: React.FC<Props> = ({ quote, author, role, accent }) => {
  const frame = useCurrentFrame();

  // Quote translateY 15→0, opacity 0→1, frames 8-35
  const quoteY = interpolate(frame, [8, 35], [15, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const quoteOpacity = interpolate(frame, [8, 30], [0, 1], { extrapolateRight: "clamp" });

  // Author fade in frames 40-55
  const authorOpacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme13.bg, overflow: "hidden" }}>
      {/* Thin accent strip — left side, more of an accent than a half-split */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 400,
          height: 1480,
          backgroundColor: accent,
          transform: "rotate(-8deg)",
          transformOrigin: "top left",
        }}
      />

      {/* Decorative giant quotation mark */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: theme13.serif,
          fontSize: 200,
          color: accent,
          opacity: 0.15,
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 5,
        }}
      >
        &ldquo;
      </div>

      {/* Quote centered */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 200,
          paddingRight: 100,
          zIndex: 10,
        }}
      >
        <div
          style={{
            opacity: quoteOpacity,
            transform: `translateY(${quoteY}px)`,
            fontFamily: theme13.serif,
            fontSize: 44,
            fontWeight: 400,
            color: theme13.navy,
            lineHeight: 1.5,
            maxWidth: 1100,
            textAlign: "center",
          }}
        >
          {quote}
        </div>
      </div>

      {/* Author */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
          gap: 8,
        }}
      >
        <div
          style={{
            opacity: authorOpacity,
            fontFamily: theme13.sans,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase" as const,
            color: accent,
          }}
        >
          {author}
        </div>
        {role && (
          <div
            style={{
              opacity: authorOpacity,
              fontFamily: theme13.sans,
              fontSize: 15,
              fontWeight: 400,
              letterSpacing: 1,
              color: "#888",
            }}
          >
            {role}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
