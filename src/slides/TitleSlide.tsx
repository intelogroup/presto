// src/slides/TitleSlide.tsx
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

type Props = { title: string; subtitle?: string };

export const TitleSlide: React.FC<Props> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const scale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: "center", alignItems: "center", color: theme.text }}>
      <div style={{ transform: `scale(${scale})`, opacity, textAlign: "center" }}>
        <h1 style={{ fontSize: 100, marginBottom: 20, fontFamily: "sans-serif" }}>{title}</h1>
        {subtitle && (
          <h2 style={{ fontSize: 50, color: theme.primary, fontFamily: "sans-serif", fontWeight: "normal" }}>
            {subtitle}
          </h2>
        )}
      </div>
    </AbsoluteFill>
  );
};
