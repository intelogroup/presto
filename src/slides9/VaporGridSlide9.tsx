// src/slides9/VaporGridSlide9.tsx
// Vaporwave 2×3 grid of neon-bordered cards

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme9 } from "./theme9";

type CardAccent = "pink" | "blue" | "yellow" | "purple";

type Props = {
  headline: string;
  items: Array<{ label: string; body: string; accent: CardAccent }>;
};

const accentColor = (accent: CardAccent) => {
  if (accent === "pink") return theme9.pink;
  if (accent === "blue") return theme9.blue;
  if (accent === "yellow") return theme9.yellow;
  return theme9.purple;
};

export const VaporGridSlide9: React.FC<Props> = ({ headline, items }) => {
  const frame = useCurrentFrame();

  // Headline slides down from above (frames 0–22)
  const headY = interpolate(frame, [0, 22], [-30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  const displayItems = items.slice(0, 6);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme9.bg,
        fontFamily: theme9.display,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        paddingLeft: 80,
        paddingRight: 80,
        paddingTop: 60,
        paddingBottom: 60,
      }}
    >
      {/* Headline */}
      <div
        style={{
          opacity: headOpacity,
          transform: `translateY(${headY}px)`,
          fontSize: 54,
          fontFamily: theme9.display,
          fontWeight: 900,
          color: theme9.white,
          marginBottom: 40,
          letterSpacing: -1,
          textShadow: `0 0 30px rgba(240,240,255,0.2)`,
        }}
      >
        {headline}
      </div>

      {/* 2×3 Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 20,
          flex: 1,
        }}
      >
        {displayItems.map((item, i) => {
          const color = accentColor(item.accent);
          const startFrame = 15 + i * 8;
          const endFrame = 30 + i * 8;

          const cardScale = interpolate(frame, [startFrame, endFrame], [0.9, 1], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const cardOpacity = interpolate(frame, [startFrame, endFrame], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `scale(${cardScale})`,
                backgroundColor: "rgba(255,255,255,0.05)",
                border: `1px solid ${color}`,
                borderRadius: 8,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                boxShadow: `0 0 12px ${color}40, inset 0 0 20px ${color}08`,
              }}
            >
              <div
                style={{
                  fontFamily: theme9.mono,
                  fontSize: 13,
                  color: color,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 12,
                  textShadow: `0 0 8px ${color}`,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: theme9.mono,
                  fontSize: 17,
                  color: theme9.white,
                  lineHeight: 1.55,
                  flex: 1,
                }}
              >
                {item.body}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
