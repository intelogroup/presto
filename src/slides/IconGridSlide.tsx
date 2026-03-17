// src/slides/IconGridSlide.tsx
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveIcon } from "../iconMap";
import { theme } from "./theme";

type GridItem = {
  iconName: string;
  label: string;
  color?: string;
};

type Props = { title: string; items: GridItem[] };

export const IconGridSlide: React.FC<Props> = ({ title, items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, padding: 100, color: theme.text, fontFamily: "sans-serif" }}>
      <h1
        style={{
          fontSize: 80,
          borderBottom: `4px solid ${theme.primary}`,
          paddingBottom: 20,
          marginBottom: 60,
          opacity: titleOpacity,
        }}
      >
        {title}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 60,
          flex: 1,
        }}
      >
        {items.map((item, i) => {
          const cellScale = spring({ frame: frame - i * 12, fps, config: { damping: 12 } });
          const cellOpacity = interpolate(frame, [i * 12, i * 12 + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const Icon = resolveIcon(item.iconName);
          const color = item.color ?? theme.primary;

          return (
            <div
              key={i}
              style={{
                backgroundColor: theme.card,
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
                padding: 48,
                transform: `scale(${cellScale})`,
                opacity: cellOpacity,
              }}
            >
              <Icon size={72} color={color} />
              <div style={{ fontSize: 36, fontWeight: "600", textAlign: "center" }}>{item.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
