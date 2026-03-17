// src/slides/StatsSlide.tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { LucideIcon } from "lucide-react";
import { theme } from "./theme";

type StatItem = {
  icon: LucideIcon;
  value: number;
  label: string;
  suffix?: string;
  color?: string;
};

type Props = { title: string; stats: StatItem[] };

export const StatsSlide: React.FC<Props> = ({ title, stats }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, padding: 100, color: theme.text, fontFamily: "sans-serif" }}>
      <h1
        style={{
          fontSize: 80,
          borderBottom: `4px solid ${theme.primary}`,
          paddingBottom: 20,
          marginBottom: 80,
          opacity: titleOpacity,
        }}
      >
        {title}
      </h1>

      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flex: 1 }}>
        {stats.map((stat, i) => {
          const startFrame = i * 20;

          const iconOpacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const countedValue = Math.round(
            interpolate(frame, [startFrame, startFrame + 60], [0, stat.value], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          );

          const labelOpacity = interpolate(frame, [startFrame + 60, startFrame + 80], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const Icon = stat.icon;
          const color = stat.color ?? theme.primary;

          return (
            <div key={i} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
              <div style={{ opacity: iconOpacity, color }}>
                <Icon size={80} />
              </div>
              <div style={{ fontSize: 120, fontWeight: "bold", color, lineHeight: 1 }}>
                {countedValue.toLocaleString()}{stat.suffix ?? ""}
              </div>
              <div style={{ fontSize: 40, color: theme.muted, opacity: labelOpacity }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
