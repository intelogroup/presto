// src/slides/IconFeaturesSlide.tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { resolveIcon } from "../iconMap";
import { theme } from "./theme";

type FeatureItem = { iconName: string; title: string; body: string; color: string };
type Props = { title: string; features: FeatureItem[] };

export const IconFeaturesSlide: React.FC<Props> = ({ title, features }) => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, padding: 100, color: theme.text, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 80, borderBottom: `4px solid ${theme.primary}`, paddingBottom: 20, marginBottom: 60, opacity: titleOpacity }}>
        {title}
      </h1>
      <div style={{ display: "flex", gap: 48, flex: 1 }}>
        {features.map((feature, i) => {
          const startFrame = i * 18;
          const colOpacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const colY = interpolate(frame, [startFrame, startFrame + 20], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const Icon = resolveIcon(feature.iconName);

          return (
            <div key={i} style={{ flex: 1, backgroundColor: theme.card, borderRadius: 24, padding: 56, display: "flex", flexDirection: "column", gap: 28, opacity: colOpacity, transform: `translateY(${colY}px)`, borderTop: `6px solid ${feature.color}` }}>
              <Icon size={80} color={feature.color} />
              <div style={{ fontSize: 44, fontWeight: "bold" }}>{feature.title}</div>
              <div style={{ fontSize: 32, color: theme.muted, lineHeight: 1.6 }}>{feature.body}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
