// src/slides10/OrganicQuoteSlide10.tsx
// P10 Warm Organic — full-screen editorial quote
// Large decorative quotation mark, serif quote, hairline rule, author

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme10 } from "./theme10";

type Props = {
  quote: string;
  author: string;
  role?: string;
};

export const OrganicQuoteSlide10: React.FC<Props> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();

  // Quote fades in + slides up frames 8-35
  const quoteOpacity = interpolate(frame, [8, 35], [0, 1], { extrapolateRight: "clamp" });
  const quoteY = interpolate(frame, [8, 35], [15, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Terracotta rule grows frames 38-52
  const ruleW = interpolate(frame, [38, 52], [0, 80], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Author fades in frames 55-70
  const authorOpacity = interpolate(frame, [55, 70], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme10.bg,
        fontFamily: theme10.serif,
        overflow: "hidden",
      }}
    >
      {/* Decorative large opening quotation mark */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 60,
          fontFamily: theme10.serif,
          fontSize: 180,
          fontWeight: 400,
          color: theme10.terracotta,
          opacity: 0.3,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        &ldquo;
      </div>

      {/* Main content — centered */}
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
          alignItems: "flex-start",
          paddingLeft: 160,
          paddingRight: 160,
          paddingTop: 80,
        }}
      >
        {/* Quote text */}
        <div
          style={{
            opacity: quoteOpacity,
            transform: `translateY(${quoteY}px)`,
            fontFamily: theme10.serif,
            fontSize: 48,
            fontWeight: 400,
            color: theme10.ink,
            lineHeight: 1.6,
            maxWidth: 900,
            marginBottom: 48,
          }}
        >
          {quote}
        </div>

        {/* Hairline rule */}
        <div
          style={{
            width: ruleW,
            height: 1,
            backgroundColor: theme10.terracotta,
            marginBottom: 28,
          }}
        />

        {/* Author block */}
        <div style={{ opacity: authorOpacity }}>
          <div
            style={{
              fontFamily: theme10.sans,
              fontSize: 13,
              fontWeight: 500,
              color: theme10.gray,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: role ? 6 : 0,
            }}
          >
            {author}
          </div>
          {role && (
            <div
              style={{
                fontFamily: theme10.sans,
                fontSize: 13,
                fontWeight: 400,
                color: theme10.gray,
                opacity: 0.7,
                letterSpacing: 1,
              }}
            >
              {role}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
