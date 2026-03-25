import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme7 } from "./theme7";
import { GridBg7 } from "./GridBg7";

interface Metric {
  value: string;
  label: string;
  delta?: string;
  accent: "cyan" | "magenta" | "green";
}

interface Props {
  title: string;
  metrics: Metric[];
}

const ACCENT_COLORS = {
  cyan: theme7.cyan,
  magenta: theme7.magenta,
  green: theme7.green,
};

const ACCENT_SHADOWS = {
  cyan: "rgba(0,240,255,0.2)",
  magenta: "rgba(255,0,255,0.2)",
  green: "rgba(0,255,136,0.2)",
};

const ACCENT_INSET = {
  cyan: "rgba(0,240,255,0.05)",
  magenta: "rgba(255,0,255,0.05)",
  green: "rgba(0,255,136,0.05)",
};

export const CyberMetricsSlide7: React.FC<Props> = ({ title, metrics }) => {
  const frame = useCurrentFrame();

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Horizontal rule slides in
  const ruleScaleX = interpolate(frame, [12, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Metric start frames
  const metricStartFrames = [20, 32, 44];

  return (
    <AbsoluteFill style={{ backgroundColor: theme7.bg }}>
      <GridBg7 />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          fontFamily: theme7.mono,
          fontSize: 32,
          color: theme7.cyan,
          letterSpacing: 2,
          opacity: titleOpacity,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>

      {/* Horizontal rule */}
      <div
        style={{
          position: "absolute",
          top: 148,
          left: 80,
          right: 80,
          height: 1,
          backgroundColor: theme7.cyan,
          transformOrigin: "left center",
          transform: `scaleX(${ruleScaleX})`,
          boxShadow: `0 0 8px rgba(0,240,255,0.4)`,
        }}
      />

      {/* Metrics row */}
      <div
        style={{
          position: "absolute",
          top: 180,
          bottom: 80,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
        }}
      >
        {metrics.map((metric, i) => {
          const startFrame = metricStartFrames[i] ?? 20 + i * 12;
          const metricOpacity = interpolate(frame, [startFrame, startFrame + 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const metricScale = interpolate(frame, [startFrame, startFrame + 18], [0.92, 1.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          const color = ACCENT_COLORS[metric.accent];
          const shadow = ACCENT_SHADOWS[metric.accent];
          const inset = ACCENT_INSET[metric.accent];

          const isDeltaPositive = metric.delta ? !metric.delta.startsWith("-") : true;
          const deltaColor = isDeltaPositive ? theme7.green : theme7.magenta;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${color}`,
                borderRadius: 8,
                padding: "48px 56px",
                opacity: metricOpacity,
                transform: `scale(${metricScale})`,
                boxShadow: `0 0 20px ${shadow}, inset 0 0 20px ${inset}`,
                backgroundColor: "transparent",
                minHeight: 280,
              }}
            >
              {/* Value */}
              <div
                style={{
                  fontFamily: theme7.mono,
                  fontSize: 88,
                  fontWeight: 700,
                  color,
                  textShadow: `0 0 20px ${color}`,
                  lineHeight: 1,
                }}
              >
                {metric.value}
              </div>

              {/* Label */}
              <div
                style={{
                  fontFamily: theme7.mono,
                  fontSize: 16,
                  color: theme7.muted,
                  textTransform: "uppercase",
                  letterSpacing: 3,
                  marginTop: 12,
                }}
              >
                {metric.label}
              </div>

              {/* Delta */}
              {metric.delta && (
                <div
                  style={{
                    fontFamily: theme7.mono,
                    fontSize: 20,
                    color: deltaColor,
                    marginTop: 8,
                  }}
                >
                  {metric.delta}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
