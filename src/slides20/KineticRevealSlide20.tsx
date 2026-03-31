// src/slides20/KineticRevealSlide20.tsx
// Word-by-word reveal — each word slides up in sequence

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme20 } from "./theme20";

type Props = { words: string[]; accent: string };

const ACCENT_MAP: Record<string, string> = {
  pink: theme20.accent,
  cyan: theme20.accent2,
  yellow: theme20.accent3,
  white: theme20.text,
};

export const KineticRevealSlide20: React.FC<Props> = ({ words, accent }) => {
  const frame = useCurrentFrame();
  const color = ACCENT_MAP[accent] || theme20.text;

  return (
    <AbsoluteFill style={{ backgroundColor: theme20.bg, overflow: "hidden", fontFamily: theme20.display }}>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        flexWrap: "wrap", gap: 20, padding: "0 100px",
      }}>
        {words.map((word, i) => {
          const start = 4 + i * 5;
          const wordOpacity = interpolate(frame, [start, start + 6], [0, 1], { extrapolateRight: "clamp" });
          const wordY = interpolate(frame, [start, start + 6], [60, 0], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const isLast = i === words.length - 1;

          return (
            <div key={i} style={{
              fontSize: isLast ? 110 : 90,
              fontWeight: 900,
              color: isLast ? color : theme20.text,
              textTransform: "uppercase",
              opacity: wordOpacity,
              transform: `translateY(${wordY}px)`,
              lineHeight: 1.1,
              textShadow: isLast ? `0 0 40px ${color}44` : "none",
            }}>
              {word}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
