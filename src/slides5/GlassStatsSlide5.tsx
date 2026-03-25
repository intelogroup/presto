import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme5 } from "./theme5";

interface StatItem {
  value: string;
  label: string;
  accent: "teal" | "blue" | "violet";
}

interface Props {
  title: string;
  stats: StatItem[];
}

const accentColor = (accent: "teal" | "blue" | "violet"): string => {
  if (accent === "teal") return theme5.teal;
  if (accent === "blue") return theme5.blue;
  return theme5.violet;
};

export const GlassStatsSlide5: React.FC<Props> = ({ title, stats }) => {
  const frame = useCurrentFrame();

  // Title slides in from left: frame 0 → 20
  const titleX = interpolate(frame, [0, 20], [-80, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Card stagger starts: 0→15, 1→25, 2→35
  const cardStarts = [15, 25, 35];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme5.bg,
        fontFamily: theme5.sans,
        padding: "80px 100px",
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateX(${titleX}px)`,
          marginBottom: 60,
        }}
      >
        <h2
          style={{
            fontSize: 52,
            fontWeight: 600,
            color: theme5.white,
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 32,
          justifyContent: "center",
          flex: 1,
          alignItems: "center",
        }}
      >
        {stats.map((stat, i) => {
          const start = cardStarts[i] ?? 15 + i * 10;
          const cardOpacity = interpolate(frame, [start, start + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const cardY = interpolate(frame, [start, start + 20], [60, 0], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const color = accentColor(stat.accent);

          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
                background: theme5.glass,
                border: `1px solid ${theme5.glassBorder}`,
                borderRadius: 20,
                padding: "48px 40px",
                textAlign: "center",
                flex: 1,
                maxWidth: 380,
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Value */}
              <div
                style={{
                  fontSize: 80,
                  fontWeight: 700,
                  color,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>

              {/* Faint glowing dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 12px 4px ${color}88`,
                  margin: "10px auto 0",
                }}
              />

              {/* Label */}
              <div
                style={{
                  fontSize: 18,
                  color: theme5.muted,
                  textTransform: "uppercase",
                  letterSpacing: 3,
                  marginTop: 12,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
