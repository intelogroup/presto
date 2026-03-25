import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme5 } from "./theme5";

interface GridItem {
  label: string;
  body: string;
  accent: "teal" | "blue" | "violet" | "white";
}

interface Props {
  headline: string;
  items: [GridItem, GridItem, GridItem, GridItem];
}

const accentColor = (accent: "teal" | "blue" | "violet" | "white"): string => {
  if (accent === "teal") return theme5.teal;
  if (accent === "blue") return theme5.blue;
  if (accent === "violet") return theme5.violet;
  return theme5.white;
};

// Card stagger: top-left=20, top-right=28, bottom-left=36, bottom-right=44
const CARD_STARTS = [20, 28, 36, 44];

export const GlassGridSlide5: React.FC<Props> = ({ headline, items }) => {
  const frame = useCurrentFrame();

  const headlineOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme5.bg,
        fontFamily: theme5.sans,
        padding: "72px 100px",
        overflow: "hidden",
      }}
    >
      {/* Headline */}
      <div style={{ opacity: headlineOpacity, marginBottom: 40 }}>
        <h2
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: theme5.white,
            margin: 0,
          }}
        >
          {headline}
        </h2>
      </div>

      {/* 2×2 Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 24,
          maxWidth: 1400,
          flex: 1,
        }}
      >
        {items.map((item, i) => {
          const start = CARD_STARTS[i];
          const cardOpacity = interpolate(frame, [start, start + 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const cardY = interpolate(frame, [start, start + 18], [40, 0], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const color = accentColor(item.accent);

          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
                background: theme5.glass,
                border: `1px solid ${theme5.glassBorder}`,
                borderRadius: 20,
                minHeight: 200,
                padding: "40px",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Accent bar */}
              <div
                style={{
                  width: 48,
                  height: 3,
                  borderRadius: 2,
                  background: color,
                  marginBottom: 20,
                }}
              />
              {/* Label */}
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: theme5.white,
                }}
              >
                {item.label}
              </div>
              {/* Body */}
              <div
                style={{
                  fontSize: 20,
                  color: "rgba(255,255,255,0.6)",
                  marginTop: 12,
                  lineHeight: 1.5,
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
