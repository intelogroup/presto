// src/slides19/DataHeroSlide19.tsx
// Data hero — clean title with animated scan line

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme19 } from "./theme19";

type Props = { title: string; subtitle: string; badge: string };

export const DataHeroSlide19: React.FC<Props> = ({ title, subtitle, badge }) => {
  const frame = useCurrentFrame();

  const scanY = interpolate(frame, [0, 30], [-10, 110], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [6, 18], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [6, 18], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const subtitleOpacity = interpolate(frame, [16, 28], [0, 1], { extrapolateRight: "clamp" });
  const badgeScale = interpolate(frame, [22, 32, 36], [0, 1.08, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.3)),
  });
  const badgeOpacity = interpolate(frame, [22, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme19.bg, overflow: "hidden", fontFamily: theme19.display }}>
      <div style={{ position: "absolute", inset: 0, ...theme19.grid, zIndex: 1 }} />

      {/* Scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: `${scanY}%`, height: 2,
        background: `linear-gradient(90deg, transparent, ${theme19.accent}, transparent)`,
        opacity: 0.6, zIndex: 2,
      }} />

      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", zIndex: 3,
      }}>
        {/* Badge */}
        <div style={{
          fontSize: 14, fontFamily: theme19.mono, color: theme19.accent,
          backgroundColor: "rgba(0,212,170,0.1)", border: `1px solid ${theme19.accent}`,
          borderRadius: 20, padding: "6px 20px", marginBottom: 24,
          textTransform: "uppercase", letterSpacing: 3,
          transform: `scale(${badgeScale})`, opacity: badgeOpacity,
        }}>
          {badge}
        </div>

        <div style={{
          fontSize: 80, fontWeight: 800, color: theme19.text, lineHeight: 1.1,
          textAlign: "center", maxWidth: "80%",
          opacity: titleOpacity, transform: `translateY(${titleY}px)`,
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 24, color: theme19.muted, marginTop: 20,
          opacity: subtitleOpacity, letterSpacing: 1,
        }}>
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
