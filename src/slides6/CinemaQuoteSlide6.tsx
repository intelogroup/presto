import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import React from "react";
import { theme6 } from "./theme6";

type Props = {
  quote: string;
  author: string;
  role?: string;
};

export const CinemaQuoteSlide6: React.FC<Props> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();

  // Quote: fades + scales from 0.96→1.0, frame 15→45
  const quoteOpacity = interpolate(frame, [15, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const quoteScale = interpolate(frame, [15, 45], [0.96, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Gold rule: grows frame 45→62
  const ruleWidth = interpolate(frame, [45, 62], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Author: fades in frame 58→72
  const authorOpacity = interpolate(frame, [58, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Role: fades in frame 68→82
  const roleOpacity = interpolate(frame, [68, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme6.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Big decorative quotation mark */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 80,
          fontFamily: theme6.serif,
          fontSize: 280,
          color: "rgba(232,184,75,0.15)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        &ldquo;
      </div>

      {/* Quote */}
      <div
        style={{
          maxWidth: 1200,
          textAlign: "center",
          opacity: quoteOpacity,
          transform: `scale(${quoteScale})`,
          fontFamily: theme6.serif,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 52,
          color: theme6.white,
          lineHeight: 1.6,
          paddingLeft: 80,
          paddingRight: 80,
        }}
      >
        {quote}
      </div>

      {/* Gold rule */}
      <div
        style={{
          width: ruleWidth,
          height: 1,
          backgroundColor: theme6.gold,
          marginTop: 48,
          marginBottom: 32,
        }}
      />

      {/* Author */}
      <div
        style={{
          opacity: authorOpacity,
          fontFamily: theme6.sans,
          fontWeight: 600,
          fontSize: 28,
          color: theme6.gold,
          marginBottom: 8,
        }}
      >
        {author}
      </div>

      {/* Role */}
      {role && (
        <div
          style={{
            opacity: roleOpacity,
            fontFamily: theme6.sans,
            fontSize: 22,
            color: theme6.muted,
          }}
        >
          {role}
        </div>
      )}
    </AbsoluteFill>
  );
};
