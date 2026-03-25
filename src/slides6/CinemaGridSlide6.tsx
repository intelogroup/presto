import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import React from "react";
import { theme6 } from "./theme6";

type Column = { title: string; body: string };

type Props = {
  headline: string;
  columns: [Column, Column, Column];
};

export const CinemaGridSlide6: React.FC<Props> = ({ headline, columns }) => {
  const frame = useCurrentFrame();

  // Headline: slides in from top frame 0→22
  const headlineY = interpolate(frame, [0, 22], [-60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Gold dividers: fade in frame 30→45
  const dividerOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Column stagger frames: 22, 32, 42
  const colStartFrames = [22, 32, 42];

  const getColOpacity = (startFrame: number) =>
    interpolate(frame, [startFrame, startFrame + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const getColY = (startFrame: number) =>
    interpolate(frame, [startFrame, startFrame + 20], [30, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });

  return (
    <AbsoluteFill style={{ backgroundColor: theme6.bg, overflow: "hidden" }}>
      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          fontFamily: theme6.serif,
          fontSize: 64,
          fontWeight: 400,
          color: theme6.white,
        }}
      >
        {headline}
      </div>

      {/* 3-column grid */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {columns.map((col, i) => (
          <React.Fragment key={i}>
            {/* Gold vertical divider before col 1 and col 2 */}
            {i > 0 && (
              <div
                style={{
                  width: 1,
                  alignSelf: "center",
                  height: 300,
                  backgroundColor: theme6.gold,
                  opacity: dividerOpacity,
                  flexShrink: 0,
                }}
              />
            )}
            <div
              style={{
                flex: 1,
                padding: "60px 64px",
                opacity: getColOpacity(colStartFrames[i]),
                transform: `translateY(${getColY(colStartFrames[i])}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: theme6.serif,
                  fontSize: 32,
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: theme6.gold,
                  marginBottom: 20,
                }}
              >
                {col.title}
              </div>
              <div
                style={{
                  fontFamily: theme6.sans,
                  fontSize: 22,
                  color: theme6.muted,
                  lineHeight: 1.7,
                }}
              >
                {col.body}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};
