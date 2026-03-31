// src/slides19/DataClosingSlide19.tsx
// Data closing — summary headline + CTA with scan line

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme19 } from "./theme19";

type Props = { headline: string; tagline: string };

export const DataClosingSlide19: React.FC<Props> = ({ headline, tagline }) => {
  const frame = useCurrentFrame();

  const scanY = interpolate(frame, [0, 40], [110, -10], { extrapolateRight: "clamp" });
  const headlineOpacity = interpolate(frame, [4, 16], [0, 1], { extrapolateRight: "clamp" });
  const headlineScale = interpolate(frame, [4, 14, 18], [0.9, 1.02, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });
  const taglineOpacity = interpolate(frame, [18, 30], [0, 1], { extrapolateRight: "clamp" });
  const lineWidth = interpolate(frame, [12, 26], [0, 100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme19.bg, overflow: "hidden", fontFamily: theme19.display }}>
      <div style={{ position: "absolute", inset: 0, ...theme19.grid, zIndex: 1 }} />

      {/* Reverse scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: `${scanY}%`, height: 2,
        background: `linear-gradient(90deg, transparent, ${theme19.accentAlt}, transparent)`,
        opacity: 0.5, zIndex: 2,
      }} />

      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", zIndex: 3,
      }}>
        <div style={{
          fontSize: 72, fontWeight: 800, color: theme19.text, textAlign: "center",
          maxWidth: "75%", lineHeight: 1.15,
          opacity: headlineOpacity, transform: `scale(${headlineScale})`,
        }}>
          {headline}
        </div>
        <div style={{
          width: `${lineWidth}%`, maxWidth: 300, height: 3,
          background: `linear-gradient(90deg, ${theme19.accent}, ${theme19.accentAlt})`,
          marginTop: 24, borderRadius: 2,
        }} />
        <div style={{
          fontSize: 22, color: theme19.muted, marginTop: 20,
          opacity: taglineOpacity, fontFamily: theme19.mono,
        }}>
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
