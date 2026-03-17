// src/slides/BarChartSlide.tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "./theme";

type BarItem = { label: string; value: number; color?: string };
type Props = { title: string; bars: BarItem[] };

export const BarChartSlide: React.FC<Props> = ({ title, bars }) => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, padding: 100, color: theme.text, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 80, borderBottom: `4px solid ${theme.primary}`, paddingBottom: 20, marginBottom: 60, opacity: titleOpacity }}>
        {title}
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 40, flex: 1, justifyContent: "center" }}>
        {bars.map((bar, i) => {
          const startFrame = i * 15;
          const barWidth = interpolate(frame, [startFrame, startFrame + 45], [0, bar.value], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const labelOpacity = interpolate(frame, [startFrame + 30, startFrame + 50], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const color = bar.color ?? theme.primary;

          return (
            <div key={i}>
              <div style={{ fontSize: 36, marginBottom: 12, color: theme.muted }}>{bar.label}</div>
              <div style={{ position: "relative", height: 56, backgroundColor: theme.card, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${barWidth}%`, backgroundColor: color, borderRadius: 12 }} />
                <div style={{ position: "absolute", left: `${barWidth}%`, top: "50%", transform: "translate(12px, -50%)", fontSize: 32, fontWeight: "bold", color: theme.text, opacity: labelOpacity, whiteSpace: "nowrap" }}>
                  {bar.value}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
