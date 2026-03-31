// src/slides19/DataDonutSlide19.tsx
// Animated donut chart — segments reveal clockwise with center stat

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme19 } from "./theme19";

type Props = {
  title: string;
  segments: Array<{ label: string; value: number; color: string }>;
  centerValue: string;
  centerLabel: string;
};

export const DataDonutSlide19: React.FC<Props> = ({ title, segments, centerValue, centerLabel }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const ringProgress = interpolate(frame, [8, 45], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const centerOpacity = interpolate(frame, [30, 42], [0, 1], { extrapolateRight: "clamp" });
  const centerScale = interpolate(frame, [30, 40, 44], [0.8, 1.05, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });

  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const size = 320;
  const strokeWidth = 40;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: theme19.bg, overflow: "hidden", fontFamily: theme19.display }}>
      <div style={{ position: "absolute", inset: 0, ...theme19.grid, zIndex: 1 }} />

      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", zIndex: 3,
      }}>
        <div style={{
          fontSize: 36, fontWeight: 700, color: theme19.text,
          opacity: titleOpacity, marginBottom: 40,
        }}>
          {title}
        </div>

        <div style={{ position: "relative", width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            {segments.map((seg, i) => {
              const segAngle = (seg.value / total) * circumference;
              const visibleAngle = segAngle * ringProgress;
              const offset = circumference - visibleAngle;
              const el = (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${visibleAngle} ${circumference - visibleAngle}`}
                  strokeDashoffset={-cumulativeAngle * ringProgress}
                  strokeLinecap="round"
                  opacity={0.9}
                />
              );
              cumulativeAngle += segAngle;
              return el;
            })}
          </svg>

          {/* Center stat */}
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            opacity: centerOpacity, transform: `scale(${centerScale})`,
          }}>
            <div style={{
              fontSize: 48, fontFamily: theme19.mono, fontWeight: 700,
              color: theme19.accent,
            }}>
              {centerValue}
            </div>
            <div style={{
              fontSize: 14, color: theme19.muted, textTransform: "uppercase",
              letterSpacing: 2, marginTop: 4,
            }}>
              {centerLabel}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{
          display: "flex", gap: 24, marginTop: 30,
          opacity: interpolate(frame, [35, 45], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          {segments.map((seg, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: seg.color }} />
              <span style={{ fontSize: 14, color: theme19.muted }}>{seg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
