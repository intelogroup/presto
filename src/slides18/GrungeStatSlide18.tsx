// src/slides18/GrungeStatSlide18.tsx
// Distressed stat — big stamped number, rough underline, faded label

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme18 } from "./theme18";

type Props = { value: string; label: string; context: string };

export const GrungeStatSlide18: React.FC<Props> = ({ value, label, context }) => {
  const frame = useCurrentFrame();

  const grainOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const valueScale = interpolate(frame, [2, 14, 20], [1.4, 0.97, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const valueOpacity = interpolate(frame, [2, 10], [0, 1], { extrapolateRight: "clamp" });
  const lineWidth = interpolate(frame, [12, 28], [0, 100], { extrapolateRight: "clamp" });
  const labelOpacity = interpolate(frame, [20, 32], [0, 1], { extrapolateRight: "clamp" });
  const contextOpacity = interpolate(frame, [30, 42], [0, 0.7], { extrapolateRight: "clamp" });

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
          fontSize: 200, fontWeight: 900, color: theme18.rust, lineHeight: 1,
          transform: `scale(${valueScale})`, opacity: valueOpacity,
          textShadow: `5px 5px 0 rgba(0,0,0,0.4)`,
        }}>
          {value}
        </div>
        {/* Rough underline */}
        <div style={{
          width: `${lineWidth}%`, maxWidth: 500, height: 4,
          backgroundColor: theme18.mustard, marginTop: 16,
          transform: "rotate(-0.5deg)", borderRadius: 2,
        }} />
        <div style={{
          fontSize: 36, fontFamily: theme18.body, color: theme18.chalk,
          marginTop: 20, opacity: labelOpacity, textTransform: "uppercase",
          letterSpacing: 4,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 20, fontFamily: theme18.body, color: theme18.mustard,
          marginTop: 12, opacity: contextOpacity, maxWidth: "60%",
          textAlign: "center",
        }}>
          {context}
        </div>
      </div>
    </AbsoluteFill>
  );
};
