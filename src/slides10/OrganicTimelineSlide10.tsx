// src/slides10/OrganicTimelineSlide10.tsx
// P10 Warm Organic — vertical timeline with animated line
// Terracotta year labels, dots on line, staggered milestone entrances

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme10 } from "./theme10";

type Milestone = {
  year: string;
  label: string;
  body?: string;
};

type Props = {
  title: string;
  milestones: Milestone[];
};

export const OrganicTimelineSlide10: React.FC<Props> = ({ title, milestones }) => {
  const frame = useCurrentFrame();

  // Title fades in frames 0-18
  const titleOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 18], [15, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Timeline line grows frames 5-35 (full height of list area)
  const lineScaleY = interpolate(frame, [5, 35], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Estimated row height per milestone
  const rowHeight = 110;
  const totalLineHeight = milestones.length * rowHeight - 20;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme10.bg,
        fontFamily: theme10.sans,
        overflow: "hidden",
      }}
    >
      {/* Decorative circle top-right */}
      <div
        style={{
          position: "absolute",
          right: -100,
          top: -60,
          width: 280,
          height: 280,
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
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: theme10.serif,
            fontSize: 52,
            fontWeight: 400,
            color: theme10.ink,
            marginBottom: 60,
          }}
        >
          {title}
        </div>

        {/* Timeline container */}
        <div style={{ position: "relative", paddingLeft: 48 }}>
          {/* Animated vertical line */}
          <div
            style={{
              position: "absolute",
              left: 6,
              top: 6,
              width: 1,
              height: totalLineHeight,
              backgroundColor: theme10.terracotta,
              transformOrigin: "top center",
              transform: `scaleY(${lineScaleY})`,
            }}
          />

          {/* Milestones */}
          {milestones.map((milestone, i) => {
            const startFrame = 20 + i * 12;
            const endFrame = startFrame + 20;

            const itemOpacity = interpolate(frame, [startFrame, endFrame], [0, 1], {
              extrapolateRight: "clamp",
            });
            const itemX = interpolate(frame, [startFrame, endFrame], [-20, 0], {
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });

            return (
              <div
                key={i}
                style={{
                  opacity: itemOpacity,
                  transform: `translateX(${itemX}px)`,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: i < milestones.length - 1 ? 40 : 0,
                  position: "relative",
                }}
              >
                {/* Dot on line */}
                <div
                  style={{
                    position: "absolute",
                    left: -43,
                    top: 6,
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    backgroundColor: theme10.bg,
                    border: `2px solid ${theme10.terracotta}`,
                    flexShrink: 0,
                  }}
                />

                {/* Year */}
                <div
                  style={{
                    fontFamily: theme10.serif,
                    fontSize: 20,
                    fontWeight: 700,
                    color: theme10.terracotta,
                    width: 72,
                    flexShrink: 0,
                    paddingTop: 1,
                  }}
                >
                  {milestone.year}
                </div>

                {/* Label + body */}
                <div>
                  <div
                    style={{
                      fontFamily: theme10.sans,
                      fontSize: 18,
                      fontWeight: 500,
                      color: theme10.ink,
                      lineHeight: 1.4,
                      marginBottom: milestone.body ? 6 : 0,
                    }}
                  >
                    {milestone.label}
                  </div>
                  {milestone.body && (
                    <div
                      style={{
                        fontFamily: theme10.sans,
                        fontSize: 15,
                        fontWeight: 400,
                        color: theme10.gray,
                        lineHeight: 1.5,
                        maxWidth: 600,
                      }}
                    >
                      {milestone.body}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
