import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import React from "react";
import { theme6 } from "./theme6";

type Props = {
  title: string;
  items: string[];
};

const ITEM_START_FRAMES = [30, 44, 58, 72, 86];

export const CinemaListSlide6: React.FC<Props> = ({ title, items }) => {
  const frame = useCurrentFrame();

  // Title: slides down from translateY -30→0 frame 0→20
  const titleY = interpolate(frame, [0, 20], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Gold rule under title: grows frame 18→35
  const ruleWidth = interpolate(frame, [18, 35], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const getItemOpacity = (startFrame: number) =>
    interpolate(frame, [startFrame, startFrame + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const getItemX = (startFrame: number) =>
    interpolate(frame, [startFrame, startFrame + 18], [-30, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });

  return (
    <AbsoluteFill style={{ backgroundColor: theme6.bg, overflow: "hidden" }}>
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 120,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: theme6.serif,
          fontSize: 64,
          fontWeight: 400,
          color: theme6.white,
        }}
      >
        {title}
      </div>

      {/* Gold rule under title */}
      <div
        style={{
          position: "absolute",
          top: 228,
          left: 120,
          width: ruleWidth,
          height: 1,
          backgroundColor: theme6.gold,
        }}
      />

      {/* Items */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 120,
          right: 120,
        }}
      >
        {items.slice(0, 5).map((item, i) => {
          const startFrame = ITEM_START_FRAMES[i] ?? ITEM_START_FRAMES[4];
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 40,
                opacity: getItemOpacity(startFrame),
                transform: `translateX(${getItemX(startFrame)}px)`,
              }}
            >
              {/* Number */}
              <div
                style={{
                  width: 80,
                  flexShrink: 0,
                  fontFamily: theme6.serif,
                  fontWeight: 400,
                  fontSize: 48,
                  color: theme6.gold,
                  lineHeight: 1,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              {/* Text */}
              <div
                style={{
                  fontFamily: theme6.sans,
                  fontSize: 30,
                  color: theme6.white,
                  lineHeight: 1.5,
                  paddingTop: 8,
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
