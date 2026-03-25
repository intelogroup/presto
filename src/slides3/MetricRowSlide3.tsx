// src/slides3/MetricRowSlide3.tsx
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme3 } from "./theme3";

type Metric = {
  label: string;
  value: string;
  delta?: string; // e.g. "+12%" — green if starts with "+", red if "-"
};

type Props = {
  title: string;
  metrics: [Metric, Metric, Metric];
};

export const MetricRowSlide3: React.FC<Props> = ({ title, metrics }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [-20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme3.bg,
        fontFamily: theme3.sans,
        padding: "80px 120px",
        overflow: "hidden",
      }}
    >
      {/* title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 36,
          fontWeight: 600,
          color: theme3.muted,
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 80,
        }}
      >
        {title}
      </div>

      {/* metric cards */}
      <div style={{ display: "flex", gap: 40, flex: 1 }}>
        {metrics.map((m, i) => {
          const cardSpring = spring({
            frame: frame - i * 8,
            fps,
            config: { damping: 14, stiffness: 120 },
          });
          const cardOpacity = interpolate(frame - i * 8, [0, 20], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });
          const deltaColor = m.delta?.startsWith("+") ? theme3.green : "#ef4444";

          return (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: theme3.bgAlt,
                border: `1px solid ${theme3.border}`,
                borderRadius: 12,
                padding: "56px 48px",
                opacity: cardOpacity,
                transform: `scale(${cardSpring})`,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: theme3.muted,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: 96,
                  fontWeight: 800,
                  color: theme3.text,
                  lineHeight: 1,
                  letterSpacing: -3,
                }}
              >
                {m.value}
              </div>
              {m.delta && (
                <div
                  style={{
                    marginTop: 20,
                    fontSize: 28,
                    fontWeight: 700,
                    color: deltaColor,
                  }}
                >
                  {m.delta}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
