// src/slides/ChecklistSlide.tsx
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CheckCircle } from "lucide-react";
import { theme } from "./theme";

type Props = { title: string; points: string[]; duration: number };

export const ChecklistSlide: React.FC<Props> = ({ title, points }) => {
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

      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {points.map((point, i) => {
          const textStart = i * 40;
          const tickStart = textStart + 20;

          const textOpacity = interpolate(frame, [textStart, textStart + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const textX = interpolate(frame, [textStart, textStart + 20], [50, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const tickScale = spring({
            frame: frame - tickStart,
            fps,
            config: { damping: 14, stiffness: 180 },
          });
          const tickVisible = frame >= tickStart;

          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <div
                style={{
                  transform: `scale(${tickVisible ? tickScale : 0})`,
                  color: theme.green,
                  flexShrink: 0,
                  width: 64,
                  height: 64,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle size={64} />
              </div>
              <div
                style={{
                  fontSize: 56,
                  opacity: textOpacity,
                  transform: `translateX(${textX}px)`,
                }}
              >
                {point}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
