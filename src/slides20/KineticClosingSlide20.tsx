// src/slides20/KineticClosingSlide20.tsx
// CTA closing — dramatic scale-in with color flash

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme20 } from "./theme20";

type Props = { line1: string; line2: string };

export const KineticClosingSlide20: React.FC<Props> = ({ line1, line2 }) => {
  const frame = useCurrentFrame();

  const line1Scale = interpolate(frame, [0, 8, 14], [0, 1.1, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });
  const line1Opacity = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const line2Opacity = interpolate(frame, [12, 22], [0, 1], { extrapolateRight: "clamp" });
  const line2Y = interpolate(frame, [12, 22], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const bgFlash = interpolate(frame, [0, 3, 10], [0.2, 0.2, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme20.bg, overflow: "hidden", fontFamily: theme20.display }}>
      {/* Flash */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: theme20.accent, opacity: bgFlash,
      }} />

      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 10,
      }}>
        <div style={{
          fontSize: 120, fontWeight: 900, color: theme20.text,
          textTransform: "uppercase", letterSpacing: 6,
          transform: `scale(${line1Scale})`, opacity: line1Opacity,
          textShadow: `0 0 60px ${theme20.accent}44`,
        }}>
          {line1}
        </div>
        <div style={{
          fontSize: 48, fontWeight: 300, fontFamily: theme20.body,
          color: theme20.accent, opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
          letterSpacing: 2,
        }}>
          {line2}
        </div>
      </div>
    </AbsoluteFill>
  );
};
