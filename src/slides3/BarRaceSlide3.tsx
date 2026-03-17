// src/slides3/BarRaceSlide3.tsx
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme3 } from "./theme3";

type Bar = { label: string; value: number };

type Props = {
  title: string;
  bars: Bar[];
  maxValue: number;
};

export const BarRaceSlide3: React.FC<Props> = ({ title, bars, maxValue }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  // bars animate from 0 to full width between frame 10 and 50
  const barProgress = interpolate(frame, [10, 50], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const BAR_MAX_PX = 1200;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme3.bg,
        fontFamily: theme3.sans,
        padding: "80px 140px",
        overflow: "hidden",
      }}
    >
      {/* title */}
      <div
        style={{
          opacity: titleOpacity,
          fontSize: 36,
          fontWeight: 600,
          color: theme3.muted,
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 70,
        }}
      >
        {title}
      </div>

      {/* bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {bars.map((bar, i) => {
          const targetWidth = (bar.value / maxValue) * BAR_MAX_PX;
          const currentWidth = targetWidth * barProgress;

          const labelOpacity = interpolate(frame - i * 4, [0, 20], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });

          return (
            <div key={i} style={{ opacity: labelOpacity }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: theme3.muted,
                  marginBottom: 10,
                  letterSpacing: 1,
                }}
              >
                {bar.label}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div
                  style={{
                    width: currentWidth,
                    height: 44,
                    backgroundColor: theme3.green,
                    borderRadius: 4,
                    minWidth: 4,
                  }}
                />
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: theme3.text,
                    minWidth: 80,
                  }}
                >
                  {bar.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
