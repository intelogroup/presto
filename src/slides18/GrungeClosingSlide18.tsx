// src/slides18/GrungeClosingSlide18.tsx
// Distressed closing — big word stamp, fading tagline, tape mark CTA

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme18 } from "./theme18";

type Props = { word: string; tagline: string };

export const GrungeClosingSlide18: React.FC<Props> = ({ word, tagline }) => {
  const frame = useCurrentFrame();

  const grainOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const wordScale = interpolate(frame, [0, 12, 18], [1.5, 0.96, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const wordOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [16, 28], [0, 1], { extrapolateRight: "clamp" });
  const lineWidth = interpolate(frame, [10, 24], [0, 100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme18.bg, overflow: "hidden", fontFamily: theme18.display }}>
      <div style={{ position: "absolute", inset: 0, ...theme18.grain, opacity: grainOpacity, zIndex: 1 }} />
      <div style={{
        position: "absolute", inset: 30, border: `3px solid ${theme18.mustard}`,
        opacity: grainOpacity * 0.6, pointerEvents: "none", zIndex: 2,
      }} />

      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", zIndex: 3,
      }}>
        <div style={{
          fontSize: 160, fontWeight: 900, color: theme18.paper,
          textTransform: "uppercase", letterSpacing: 12,
          transform: `scale(${wordScale})`, opacity: wordOpacity,
          textShadow: `6px 6px 0 ${theme18.rust}, -2px -2px 0 rgba(0,0,0,0.3)`,
        }}>
          {word}
        </div>
        {/* Rough underline */}
        <div style={{
          width: `${lineWidth}%`, maxWidth: 400, height: 3,
          backgroundColor: theme18.rust, marginTop: 20,
          transform: "rotate(-0.5deg)",
        }} />
        <div style={{
          fontSize: 24, fontFamily: theme18.body, color: theme18.mustard,
          marginTop: 24, opacity: taglineOpacity, letterSpacing: 3,
          textTransform: "uppercase",
        }}>
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
