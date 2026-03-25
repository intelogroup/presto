import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme5 } from "./theme5";

interface BarItem {
  label: string;
  value: number;
  maxValue: number;
}

interface Props {
  title: string;
  bars: BarItem[];
}

export const GlassBarSlide5: React.FC<Props> = ({ title, bars }) => {
  const frame = useCurrentFrame();

  // Title fades in frame 0 → 15
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme5.bg,
        fontFamily: theme5.sans,
        padding: "80px 120px",
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div style={{ opacity: titleOpacity }}>
        <h2
          style={{
            fontSize: 52,
            fontWeight: 600,
            color: theme5.white,
            margin: 0,
            marginBottom: 48,
          }}
        >
          {title}
        </h2>
      </div>

      {/* Bars */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {bars.map((bar, i) => {
          const start = 15 + i * 12;
          const fillPct = (bar.value / bar.maxValue) * 100;

          const barWidth = interpolate(frame, [start, start + 30], [0, fillPct], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const valueOpacity = interpolate(frame, [start, start + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 24,
              }}
            >
              {/* Label */}
              <div
                style={{
                  width: 200,
                  fontSize: 20,
                  color: theme5.muted,
                  flexShrink: 0,
                  textAlign: "right",
                }}
              >
                {bar.label}
              </div>

              {/* Bar track */}
              <div
                style={{
                  flex: 1,
                  height: 16,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {/* Fill bar */}
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: "100%",
                    borderRadius: 8,
                    background: `linear-gradient(90deg, ${theme5.teal}, ${theme5.blue})`,
                  }}
                />
              </div>

              {/* Value label */}
              <div
                style={{
                  opacity: valueOpacity,
                  width: 80,
                  fontSize: 20,
                  color: theme5.teal,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {bar.value}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
