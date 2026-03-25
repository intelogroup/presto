// src/slides8/MinimalQuoteSlide8.tsx
// Clean Minimalist quote — decorative vertical rule, large opening quote mark, attribution

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme8 } from "./theme8";

type Props = {
  quote: string;
  author: string;
  role?: string;
};

export const MinimalQuoteSlide8: React.FC<Props> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();

  // Vertical rule fades in frame 0→20
  const ruleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Quote fades + slides up frame 15→45
  const quoteY = interpolate(frame, [15, 45], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const quoteOpacity = interpolate(frame, [15, 45], [0, 1], { extrapolateRight: "clamp" });

  // Small rule grows frame 44→58
  const smallRuleW = interpolate(frame, [44, 58], [0, 60], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Author fades in frame 55→68
  const authorOpacity = interpolate(frame, [55, 68], [0, 1], { extrapolateRight: "clamp" });

  // Role fades in frame 64→76
  const roleOpacity = interpolate(frame, [64, 76], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme8.bg,
        fontFamily: theme8.sans,
        overflow: "hidden",
      }}
    >
      {/* Thin 2px charcoal vertical rule, 200px tall, centered vertically at left=120 */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: "50%",
          transform: "translateY(-50%)",
          width: 2,
          height: 200,
          backgroundColor: theme8.charcoal,
          opacity: ruleOpacity,
        }}
      />

      {/* Main content offset by rule */}
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
          paddingLeft: 160,
          paddingRight: 120,
        }}
      >
        {/* Opening quote mark — decorative */}
        <div
          style={{
            fontSize: 100,
            fontFamily: theme8.sans,
            color: theme8.lightGray,
            lineHeight: 0.8,
            marginBottom: -20,
            userSelect: "none",
          }}
        >
          &ldquo;
        </div>

        {/* Quote text */}
        <div
          style={{
            opacity: quoteOpacity,
            transform: `translateY(${quoteY}px)`,
            fontSize: 52,
            fontWeight: 400,
            color: theme8.charcoal,
            lineHeight: 1.6,
            maxWidth: 1100,
            marginBottom: 40,
          }}
        >
          {quote}
        </div>

        {/* Small rule */}
        <div
          style={{
            width: smallRuleW,
            height: 1,
            backgroundColor: theme8.charcoal,
            marginBottom: 28,
          }}
        />

        {/* Author */}
        <div
          style={{
            opacity: authorOpacity,
            fontSize: 28,
            fontWeight: 600,
            color: theme8.charcoal,
            marginBottom: role ? 8 : 0,
          }}
        >
          {author}
        </div>

        {/* Role (optional) */}
        {role && (
          <div
            style={{
              opacity: roleOpacity,
              fontSize: 20,
              fontWeight: 400,
              color: theme8.gray,
            }}
          >
            {role}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
