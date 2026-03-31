// src/slides19/DataCounterSlide19.tsx
// Animated number counter — ticker-style counting up to target value

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme19 } from "./theme19";

type Props = {
  value: number;
  suffix: string;
  label: string;
  sublabel?: string;
};

export const DataCounterSlide19: React.FC<Props> = ({ value, suffix, label, sublabel }) => {
  const frame = useCurrentFrame();

  // Counter ticks from 0 to value over frames 8-50
  const progress = interpolate(frame, [8, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const displayValue = Math.round(value * progress);

  const counterOpacity = interpolate(frame, [4, 12], [0, 1], { extrapolateRight: "clamp" });
  const labelOpacity = interpolate(frame, [20, 32], [0, 1], { extrapolateRight: "clamp" });
  const sublabelOpacity = interpolate(frame, [30, 42], [0, 0.7], { extrapolateRight: "clamp" });

  // Glow pulse when counter finishes
  const glowOpacity = interpolate(frame, [48, 55, 65], [0, 0.4, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme19.bg, overflow: "hidden", fontFamily: theme19.display }}>
      <div style={{ position: "absolute", inset: 0, ...theme19.grid, zIndex: 1 }} />

      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", zIndex: 3,
      }}>
        {/* Glow ring */}
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          border: `2px solid ${theme19.accent}`, opacity: glowOpacity,
          boxShadow: `0 0 60px ${theme19.accent}, inset 0 0 60px ${theme19.accent}`,
        }} />

        <div style={{
          fontSize: 160, fontFamily: theme19.mono, fontWeight: 700,
          color: theme19.accent, lineHeight: 1, opacity: counterOpacity,
          textShadow: `0 0 40px rgba(0,212,170,0.3)`,
        }}>
          {displayValue.toLocaleString()}{suffix}
        </div>
        <div style={{
          fontSize: 28, color: theme19.text, marginTop: 20,
          opacity: labelOpacity, textTransform: "uppercase", letterSpacing: 4,
        }}>
          {label}
        </div>
        {sublabel && (
          <div style={{
            fontSize: 18, fontFamily: theme19.mono, color: theme19.muted,
            marginTop: 10, opacity: sublabelOpacity,
          }}>
            {sublabel}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
