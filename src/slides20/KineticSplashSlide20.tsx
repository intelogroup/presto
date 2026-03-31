// src/slides20/KineticSplashSlide20.tsx
// Full-screen word slam — word scales up fast, bounces, holds

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme20 } from "./theme20";

type Props = { word: string; accent: string };

const ACCENT_MAP: Record<string, string> = {
  pink: theme20.accent,
  cyan: theme20.accent2,
  yellow: theme20.accent3,
  white: theme20.text,
};

export const KineticSplashSlide20: React.FC<Props> = ({ word, accent }) => {
  const frame = useCurrentFrame();
  const color = ACCENT_MAP[accent] || theme20.accent;

  const scale = interpolate(frame, [0, 6, 12, 16], [0, 1.15, 0.95, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" });
  const bgFlash = interpolate(frame, [0, 3, 8], [0.15, 0.15, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme20.bg, overflow: "hidden", fontFamily: theme20.display }}>
      {/* Impact flash */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: color, opacity: bgFlash,
      }} />

      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          fontSize: 200, fontWeight: 900, color, lineHeight: 1,
          textTransform: "uppercase", letterSpacing: 8,
          transform: `scale(${scale})`, opacity,
          textShadow: `0 0 80px ${color}66`,
        }}>
          {word}
        </div>
      </div>
    </AbsoluteFill>
  );
};
