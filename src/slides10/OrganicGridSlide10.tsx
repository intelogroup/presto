// src/slides10/OrganicGridSlide10.tsx
// P10 Warm Organic — 2×2 editorial card grid
// Warm cream cards, terracotta dot accents, staggered entrance

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme10 } from "./theme10";

type CardItem = {
  title: string;
  body: string;
};

type Props = {
  headline: string;
  items: [CardItem, CardItem, CardItem, CardItem];
};

export const OrganicGridSlide10: React.FC<Props> = ({ headline, items }) => {
  const frame = useCurrentFrame();

  // Headline fades + slides up frames 0-20
  const headlineOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const headlineY = interpolate(frame, [0, 20], [15, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme10.bg,
        fontFamily: theme10.sans,
        overflow: "hidden",
      }}
    >
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
          paddingLeft: 100,
          paddingRight: 100,
          paddingTop: 60,
          paddingBottom: 60,
        }}
      >
        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontFamily: theme10.serif,
            fontSize: 56,
            fontWeight: 400,
            color: theme10.ink,
            marginBottom: 48,
          }}
        >
          {headline}
        </div>

        {/* 2×2 Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 20,
            flex: 1,
            maxHeight: 480,
          }}
        >
          {items.map((item, i) => {
            const startFrame = 15 + i * 12;
            const endFrame = startFrame + 20;

            const cardOpacity = interpolate(frame, [startFrame, endFrame], [0, 1], {
              extrapolateRight: "clamp",
            });
            const cardY = interpolate(frame, [startFrame, endFrame], [20, 0], {
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });

            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `translateY(${cardY}px)`,
                  backgroundColor: "#F3EDE4",
                  padding: "36px 40px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {/* Terracotta dot accent */}
                <div
                  style={{
                    position: "absolute",
                    top: 28,
                    left: 28,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: theme10.terracotta,
                  }}
                />

                {/* Card title */}
                <div
                  style={{
                    fontFamily: theme10.sans,
                    fontSize: 20,
                    fontWeight: 600,
                    color: theme10.ink,
                    marginBottom: 12,
                    paddingLeft: 20,
                  }}
                >
                  {item.title}
                </div>

                {/* Card body */}
                <div
                  style={{
                    fontFamily: theme10.sans,
                    fontSize: 16,
                    fontWeight: 400,
                    color: theme10.gray,
                    lineHeight: 1.6,
                    paddingLeft: 20,
                  }}
                >
                  {item.body}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
