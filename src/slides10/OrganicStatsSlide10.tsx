// src/slides10/OrganicStatsSlide10.tsx
// P10 Warm Organic — 3-stat row with hairline vertical dividers
// Big serif terracotta values, staggered entrance

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme10 } from "./theme10";

type StatItem = {
  value: string;
  label: string;
  note?: string;
};

type Props = {
  title: string;
  stats: [StatItem, StatItem, StatItem];
};

export const OrganicStatsSlide10: React.FC<Props> = ({ title, stats }) => {
  const frame = useCurrentFrame();

  // Section title fades in frames 0-12
  const titleOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // Vertical dividers grow frames 12-35
  const dividerH = interpolate(frame, [12, 35], [0, 160], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme10.bg,
        fontFamily: theme10.sans,
        overflow: "hidden",
      }}
    >
      {/* Subtle decorative circle bottom-left */}
      <div
        style={{
          position: "absolute",
          left: -80,
          bottom: -80,
          width: 320,
          height: 320,
          borderRadius: "50%",
          border: `1px solid ${theme10.rule}`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 140,
          paddingRight: 140,
        }}
      >
        {/* Section title */}
        <div
          style={{
            opacity: titleOpacity,
            fontFamily: theme10.sans,
            fontSize: 12,
            fontWeight: 500,
            color: theme10.gray,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 72,
          }}
        >
          {title}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          {stats.map((stat, i) => {
            // Stagger: each stat starts at frame 18 + i*15
            const startFrame = 18 + i * 15;
            const endFrame = startFrame + 20;

            const statOpacity = interpolate(frame, [startFrame, endFrame], [0, 1], {
              extrapolateRight: "clamp",
            });
            const statY = interpolate(frame, [startFrame, endFrame], [20, 0], {
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });

            return (
              <React.Fragment key={i}>
                {/* Vertical divider between stats */}
                {i > 0 && (
                  <div
                    style={{
                      width: 1,
                      height: dividerH,
                      backgroundColor: theme10.rule,
                      marginTop: 8,
                      marginRight: 64,
                      flexShrink: 0,
                    }}
                  />
                )}

                <div
                  style={{
                    opacity: statOpacity,
                    transform: `translateY(${statY}px)`,
                    marginRight: i < stats.length - 1 ? 64 : 0,
                    minWidth: 200,
                  }}
                >
                  {/* Big serif value in terracotta */}
                  <div
                    style={{
                      fontFamily: theme10.serif,
                      fontSize: 96,
                      fontWeight: 400,
                      color: theme10.terracotta,
                      lineHeight: 1,
                      marginBottom: 16,
                    }}
                  >
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      fontFamily: theme10.sans,
                      fontSize: 15,
                      fontWeight: 400,
                      color: theme10.gray,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: stat.note ? 8 : 0,
                    }}
                  >
                    {stat.label}
                  </div>

                  {/* Optional note */}
                  {stat.note && (
                    <div
                      style={{
                        fontFamily: theme10.sans,
                        fontSize: 13,
                        fontWeight: 400,
                        color: theme10.gray,
                        opacity: 0.7,
                      }}
                    >
                      {stat.note}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
