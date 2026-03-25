// src/slides9/VaporTimelineSlide9.tsx
// Vaporwave horizontal timeline — neon line draws left to right, dots pop in, labels fade

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme9 } from "./theme9";

type MilestoneAccent = "pink" | "blue" | "yellow";

type Props = {
  title: string;
  milestones: Array<{ year: string; label: string; accent: MilestoneAccent }>;
};

const accentColor = (accent: MilestoneAccent) => {
  if (accent === "pink") return theme9.pink;
  if (accent === "blue") return theme9.blue;
  return theme9.yellow;
};

export const VaporTimelineSlide9: React.FC<Props> = ({ title, milestones }) => {
  const frame = useCurrentFrame();

  // Title slides in (frames 0–22)
  const titleY = interpolate(frame, [0, 22], [-30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  // Timeline line draws left to right (width 0%→100%, frames 10–40)
  const lineProgress = interpolate(frame, [10, 40], [0, 100], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const count = milestones.length;
  // Each milestone is evenly spaced along the line
  const positions = milestones.map((_, i) =>
    count === 1 ? 50 : (i / (count - 1)) * 100
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme9.bg,
        fontFamily: theme9.display,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: 100,
        paddingRight: 100,
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 64,
          fontFamily: theme9.display,
          fontWeight: 900,
          color: theme9.white,
          marginBottom: 80,
          letterSpacing: -1,
          textShadow: `0 0 20px rgba(240,240,255,0.2)`,
        }}
      >
        {title}
      </div>

      {/* Timeline container */}
      <div style={{ position: "relative", height: 220 }}>
        {/* Base track (dim) */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: "rgba(240,240,255,0.1)",
            transform: "translateY(-50%)",
          }}
        />

        {/* Animated neon line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: `${lineProgress}%`,
            height: 2,
            backgroundColor: theme9.blue,
            transform: "translateY(-50%)",
            boxShadow: `0 0 8px ${theme9.blue}, 0 0 16px ${theme9.blue}`,
          }}
        />

        {/* Milestone dots + labels */}
        {milestones.map((m, i) => {
          const color = accentColor(m.accent);
          const dotStart = 35 + i * 10;
          const dotEnd = dotStart + 15;
          const labelStart = dotEnd;
          const labelEnd = labelStart + 15;

          const dotScale = interpolate(frame, [dotStart, dotEnd], [0, 1], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.5)),
          });
          const labelOpacity = interpolate(frame, [labelStart, labelEnd], [0, 1], {
            extrapolateRight: "clamp",
          });

          const leftPct = positions[i];
          const isAbove = i % 2 === 0;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${leftPct}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Dot */}
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: color,
                  transform: `scale(${dotScale})`,
                  boxShadow: `0 0 12px ${color}, 0 0 24px ${color}`,
                  position: "relative",
                  zIndex: 2,
                }}
              />

              {/* Label block (above or below) */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  ...(isAbove ? { bottom: 28 } : { top: 28 }),
                  opacity: labelOpacity,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  style={{
                    fontFamily: theme9.mono,
                    fontSize: 22,
                    color: color,
                    fontWeight: 700,
                    textShadow: `0 0 8px ${color}`,
                    letterSpacing: 1,
                  }}
                >
                  {m.year}
                </div>
                <div
                  style={{
                    fontFamily: theme9.mono,
                    fontSize: 15,
                    color: theme9.white,
                    letterSpacing: 1,
                  }}
                >
                  {m.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
