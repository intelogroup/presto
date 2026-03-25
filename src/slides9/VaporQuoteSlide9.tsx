// src/slides9/VaporQuoteSlide9.tsx
// Vaporwave quote slide — large quote with decorative hot pink opening mark, author in blue

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme9 } from "./theme9";

type Props = {
  quote: string;
  author: string;
  role?: string;
};

export const VaporQuoteSlide9: React.FC<Props> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();

  // Giant opening quote mark fades in immediately (frames 0–12)
  const markOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // Quote fades in and translateY 20→0 (frames 5–30)
  const quoteY = interpolate(frame, [5, 30], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const quoteOpacity = interpolate(frame, [5, 30], [0, 1], { extrapolateRight: "clamp" });

  // Author staggered in after (frames 35–55)
  const authorY = interpolate(frame, [35, 55], [15, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const authorOpacity = interpolate(frame, [35, 55], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme9.bg,
        fontFamily: theme9.display,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 140,
        paddingRight: 140,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(184,79,255,0.1) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Decorative opening quote mark */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 100,
          opacity: markOpacity,
          fontSize: 220,
          fontFamily: theme9.display,
          fontWeight: 900,
          color: theme9.pink,
          lineHeight: 1,
          textShadow: `0 0 30px ${theme9.pink}, 0 0 60px ${theme9.pink}`,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        "
      </div>

      {/* Quote text */}
      <div
        style={{
          opacity: quoteOpacity,
          transform: `translateY(${quoteY}px)`,
          fontSize: 52,
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontWeight: 400,
          color: theme9.white,
          lineHeight: 1.5,
          textAlign: "center",
          maxWidth: 1100,
          marginBottom: 48,
          letterSpacing: 0.3,
        }}
      >
        {quote}
      </div>

      {/* Author */}
      <div
        style={{
          opacity: authorOpacity,
          transform: `translateY(${authorY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 60,
            height: 2,
            backgroundColor: theme9.blue,
            boxShadow: `0 0 8px ${theme9.blue}`,
            marginBottom: 12,
          }}
        />
        <div
          style={{
            fontFamily: theme9.mono,
            fontSize: 24,
            color: theme9.blue,
            letterSpacing: 3,
            textTransform: "uppercase",
            textShadow: `0 0 10px ${theme9.blue}`,
          }}
        >
          {author}
        </div>
        {role && (
          <div
            style={{
              fontFamily: theme9.mono,
              fontSize: 16,
              color: theme9.dim,
              letterSpacing: 2,
            }}
          >
            {role}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
