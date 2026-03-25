// src/slides10/OrganicListSlide10.tsx
// P10 Warm Organic — numbered list with terracotta numerals
// Serif title, staggered item entrances

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme10 } from "./theme10";

type Props = {
  title: string;
  items: string[];
};

export const OrganicListSlide10: React.FC<Props> = ({ title, items }) => {
  const frame = useCurrentFrame();

  // Title fades in + slides up frames 0-25
  const titleOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 25], [20, 0], {
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
      {/* Decorative partial circle top-right */}
      <div
        style={{
          position: "absolute",
          right: -120,
          top: -120,
          width: 380,
          height: 380,
          borderRadius: "50%",
          border: `1px solid ${theme10.rule}`,
          pointerEvents: "none",
        }}
      />

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
          paddingLeft: 140,
          paddingRight: 200,
        }}
      >
        {/* Serif title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: theme10.serif,
            fontSize: 60,
            fontWeight: 400,
            color: theme10.ink,
            lineHeight: 1.15,
            marginBottom: 64,
          }}
        >
          {title}
        </div>

        {/* Items */}
        {items.map((item, i) => {
          const startFrame = 20 + i * 10;
          const endFrame = startFrame + 20;

          const itemOpacity = interpolate(frame, [startFrame, endFrame], [0, 1], {
            extrapolateRight: "clamp",
          });
          const itemY = interpolate(frame, [startFrame, endFrame], [15, 0], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          const numeral = String(i + 1).padStart(2, "0");

          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                transform: `translateY(${itemY}px)`,
                display: "flex",
                flexDirection: "row",
                alignItems: "baseline",
                marginBottom: i < items.length - 1 ? 32 : 0,
              }}
            >
              {/* Terracotta numeral */}
              <div
                style={{
                  fontFamily: theme10.serif,
                  fontSize: 18,
                  fontWeight: 400,
                  color: theme10.terracotta,
                  width: 52,
                  flexShrink: 0,
                  paddingTop: 2,
                }}
              >
                {numeral}
              </div>

              {/* Hairline separator */}
              <div
                style={{
                  width: 1,
                  height: 20,
                  backgroundColor: theme10.rule,
                  marginRight: 28,
                  flexShrink: 0,
                  alignSelf: "center",
                }}
              />

              {/* Item text */}
              <div
                style={{
                  fontFamily: theme10.sans,
                  fontSize: 22,
                  fontWeight: 400,
                  color: theme10.ink,
                  lineHeight: 1.5,
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
