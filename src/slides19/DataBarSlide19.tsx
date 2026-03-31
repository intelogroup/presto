// src/slides19/DataBarSlide19.tsx
// Animated horizontal bar chart — bars grow from left

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme19 } from "./theme19";

type Props = {
  title: string;
  bars: Array<{ label: string; value: number; max: number }>;
};

const BAR_COLORS = [theme19.accent, theme19.accentAlt, theme19.warm, "#ec4899", "#8b5cf6"];

export const DataBarSlide19: React.FC<Props> = ({ title, bars }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme19.bg, overflow: "hidden", fontFamily: theme19.display }}>
      <div style={{ position: "absolute", inset: 0, ...theme19.grid, zIndex: 1 }} />

      <div style={{
        position: "absolute", top: 80, left: 100, right: 100, bottom: 80,
        display: "flex", flexDirection: "column", zIndex: 3,
      }}>
        <div style={{
          fontSize: 40, fontWeight: 700, color: theme19.text,
          opacity: titleOpacity, marginBottom: 50,
        }}>
          {title}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
          {bars.map((bar, i) => {
            const start = 10 + i * 6;
            const barWidth = interpolate(frame, [start, start + 30], [0, (bar.value / bar.max) * 100], {
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const labelOpacity = interpolate(frame, [start, start + 10], [0, 1], { extrapolateRight: "clamp" });
            const valueOpacity = interpolate(frame, [start + 15, start + 25], [0, 1], { extrapolateRight: "clamp" });
            const color = BAR_COLORS[i % BAR_COLORS.length];

            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{
                  width: 140, fontSize: 16, fontFamily: theme19.mono, color: theme19.muted,
                  textAlign: "right", opacity: labelOpacity, flexShrink: 0,
                }}>
                  {bar.label}
                </div>
                <div style={{
                  flex: 1, height: 36, backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: 6, overflow: "hidden", position: "relative",
                }}>
                  <div style={{
                    width: `${barWidth}%`, height: "100%",
                    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                    borderRadius: 6, boxShadow: `0 0 20px ${color}44`,
                    transition: "none",
                  }} />
                </div>
                <div style={{
                  width: 60, fontSize: 18, fontFamily: theme19.mono, fontWeight: 700,
                  color, opacity: valueOpacity, textAlign: "left",
                }}>
                  {bar.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
