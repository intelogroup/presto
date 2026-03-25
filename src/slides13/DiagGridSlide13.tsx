// src/slides13/DiagGridSlide13.tsx
// P13 grid — diagonal color block fills top ~45%, 3 content columns below

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme13 } from "./theme13";

type Item = { title: string; body: string };

type Props = {
  headline: string;
  items: [Item, Item, Item];
  accent: string;
};

export const DiagGridSlide13: React.FC<Props> = ({ headline, items, accent }) => {
  const frame = useCurrentFrame();

  // Headline translateY -20→0, frames 5-25
  const headlineY = interpolate(frame, [5, 25], [-20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: "clamp" });

  // Each column staggered: opacity 0→1, translateY 20→0
  const colAnimations = items.map((_, i) => ({
    opacity: interpolate(frame, [25 + i * 12, 45 + i * 12], [0, 1], { extrapolateRight: "clamp" }),
    y: interpolate(frame, [25 + i * 12, 45 + i * 12], [20, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: theme13.bg, overflow: "hidden" }}>
      {/* Diagonal color block — fills top ~45%, wide */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: -200,
          width: 2200,
          height: 700,
          backgroundColor: accent,
          transform: "rotate(-4deg)",
          transformOrigin: "top left",
        }}
      />

      {/* Headline on color block */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 560,
          display: "flex",
          alignItems: "flex-end",
          paddingLeft: 100,
          paddingBottom: 60,
          zIndex: 10,
        }}
      >
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontFamily: theme13.serif,
            fontSize: 64,
            fontWeight: 400,
            color: theme13.white,
            lineHeight: 1.1,
            letterSpacing: -1,
            maxWidth: 900,
          }}
        >
          {headline}
        </div>
      </div>

      {/* Three columns in the light area */}
      <div
        style={{
          position: "absolute",
          top: 580,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "row",
          zIndex: 10,
        }}
      >
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {/* Vertical rule between columns */}
            {i > 0 && (
              <div
                style={{
                  width: 1,
                  backgroundColor: theme13.navy,
                  opacity: 0.25,
                  alignSelf: "stretch",
                  margin: "20px 0",
                }}
              />
            )}
            <div
              style={{
                flex: 1,
                opacity: colAnimations[i].opacity,
                transform: `translateY(${colAnimations[i].y}px)`,
                paddingLeft: 80,
                paddingRight: 60,
                paddingTop: 40,
              }}
            >
              <div
                style={{
                  fontFamily: theme13.sans,
                  fontSize: 18,
                  fontWeight: 700,
                  color: theme13.navy,
                  letterSpacing: 0.5,
                  marginBottom: 16,
                  textTransform: "uppercase" as const,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontFamily: theme13.sans,
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#666",
                  lineHeight: 1.7,
                }}
              >
                {item.body}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};
