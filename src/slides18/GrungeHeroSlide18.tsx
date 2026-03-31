// src/slides18/GrungeHeroSlide18.tsx
// Distressed title card — grain bg, tape mark, rough stamped title

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme18 } from "./theme18";

type Props = { title: string; subtitle: string; tag: string };

export const GrungeHeroSlide18: React.FC<Props> = ({ title, subtitle, tag }) => {
  const frame = useCurrentFrame();

  const grainOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const stampScale = interpolate(frame, [4, 16, 22], [1.3, 0.98, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const stampOpacity = interpolate(frame, [4, 12], [0, 1], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [18, 30], [0, 1], { extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [18, 30], [20, 0], { extrapolateRight: "clamp" });
  const tapeOpacity = interpolate(frame, [8, 16], [0, 1], { extrapolateRight: "clamp" });
  const tapeRotate = interpolate(frame, [8, 16], [-6, -2], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme18.bg, overflow: "hidden", fontFamily: theme18.display }}>
      {/* Film grain overlay */}
      <div style={{ position: "absolute", inset: 0, ...theme18.grain, opacity: grainOpacity, zIndex: 1 }} />

      {/* Scratchy border lines */}
      <div style={{
        position: "absolute", inset: 30, border: `3px solid ${theme18.mustard}`,
        opacity: grainOpacity * 0.6, pointerEvents: "none", zIndex: 2,
      }} />

      {/* Tape mark with tag */}
      <div style={{
        position: "absolute", top: 50, left: 80, zIndex: 5,
        ...theme18.tape, transform: `rotate(${tapeRotate}deg)`, opacity: tapeOpacity,
        fontFamily: theme18.body, fontSize: 18, color: theme18.ink, letterSpacing: 2,
        textTransform: "uppercase",
      }}>
        {tag}
      </div>

      {/* Stamped title */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", zIndex: 3,
      }}>
        <div style={{
          fontSize: 110, fontWeight: 900, color: theme18.paper, lineHeight: 1.05,
          textTransform: "uppercase", letterSpacing: 6,
          transform: `scale(${stampScale})`, opacity: stampOpacity,
          textShadow: `4px 4px 0 ${theme18.rust}, -1px -1px 0 rgba(0,0,0,0.3)`,
          maxWidth: "85%", textAlign: "center",
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 28, fontFamily: theme18.body, color: theme18.mustard,
          marginTop: 20, opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`, letterSpacing: 3,
          textTransform: "uppercase",
        }}>
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
