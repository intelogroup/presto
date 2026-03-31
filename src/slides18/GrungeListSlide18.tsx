// src/slides18/GrungeListSlide18.tsx
// Distressed list — staggered items with tape/scratch marks

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme18 } from "./theme18";

type Props = { title: string; items: string[] };

export const GrungeListSlide18: React.FC<Props> = ({ title, items }) => {
  const frame = useCurrentFrame();

  const grainOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const titleX = interpolate(frame, [0, 14], [-30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme18.bg, overflow: "hidden", fontFamily: theme18.display }}>
      <div style={{ position: "absolute", inset: 0, ...theme18.grain, opacity: grainOpacity, zIndex: 1 }} />
      <div style={{
        position: "absolute", inset: 30, border: `3px solid ${theme18.mustard}`,
        opacity: grainOpacity * 0.6, pointerEvents: "none", zIndex: 2,
      }} />

      <div style={{
        position: "absolute", top: 80, left: 100, right: 100, bottom: 80,
        display: "flex", flexDirection: "column", zIndex: 3,
      }}>
        {/* Title with tape */}
        <div style={{
          fontSize: 52, fontWeight: 900, color: theme18.rust,
          textTransform: "uppercase", letterSpacing: 4,
          opacity: titleOpacity, transform: `translateX(${titleX}px)`,
          borderBottom: `3px solid ${theme18.mustard}`, paddingBottom: 16,
          marginBottom: 40, textShadow: `3px 3px 0 rgba(0,0,0,0.3)`,
        }}>
          {title}
        </div>

        {/* Staggered items */}
        {items.map((item, i) => {
          const start = 14 + i * 8;
          const itemOpacity = interpolate(frame, [start, start + 10], [0, 1], { extrapolateRight: "clamp" });
          const itemX = interpolate(frame, [start, start + 10], [40, 0], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const rotations = [-0.8, 0.5, -0.3, 0.7, -0.5];
          const rot = rotations[i % rotations.length];

          return (
            <div key={i} style={{
              fontSize: 32, fontFamily: theme18.body, color: theme18.chalk,
              opacity: itemOpacity, transform: `translateX(${itemX}px) rotate(${rot}deg)`,
              padding: "12px 0", borderBottom: `1px solid rgba(212,168,67,0.3)`,
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <span style={{ color: theme18.rust, fontSize: 20 }}>&#9632;</span>
              {item}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
