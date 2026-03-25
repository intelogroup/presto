// src/slides8/MinimalGridSlide8.tsx
// Clean Minimalist 2×2 grid — off-white cards with subtle border, staggered fade-in

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme8 } from "./theme8";

type GridItem = {
  title: string;
  body: string;
};

type Props = {
  headline: string;
  items: [GridItem, GridItem, GridItem, GridItem];
};

export const MinimalGridSlide8: React.FC<Props> = ({ headline, items }) => {
  const frame = useCurrentFrame();

  // Headline fades + translateY -20→0 frame 0→20
  const headlineY = interpolate(frame, [0, 20], [-20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Rule under headline grows from center frame 18→32
  const ruleW = interpolate(frame, [18, 32], [0, 240], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Card stagger frames: top-left=28, top-right=36, bottom-left=44, bottom-right=52
  const cardStartFrames = [28, 36, 44, 52];
  const cardAnims = cardStartFrames.map((start) => ({
    opacity: interpolate(frame, [start, start + 18], [0, 1], { extrapolateRight: "clamp" }),
    y: interpolate(frame, [start, start + 18], [24, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  }));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme8.bg,
        fontFamily: theme8.sans,
        overflow: "hidden",
      }}
    >
      {/* Headline — centered at top */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontSize: 64,
            fontWeight: 700,
            color: theme8.charcoal,
            letterSpacing: -2,
            textAlign: "center",
          }}
        >
          {headline}
        </div>

        {/* Thin rule centered under headline */}
        <div
          style={{
            marginTop: 20,
            width: ruleW,
            height: 1,
            backgroundColor: theme8.lightGray,
          }}
        />
      </div>

      {/* 2×2 grid */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 0,
          right: 0,
          bottom: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            maxWidth: 1400,
            width: "100%",
            padding: "0 80px",
            boxSizing: "border-box",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: theme8.bgCard,
                borderRadius: 16,
                padding: "48px 40px",
                border: "1px solid #E5E7EB",
                opacity: cardAnims[i].opacity,
                transform: `translateY(${cardAnims[i].y}px)`,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: theme8.charcoal,
                  marginBottom: 12,
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 400,
                  color: theme8.gray,
                  lineHeight: 1.6,
                }}
              >
                {item.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
