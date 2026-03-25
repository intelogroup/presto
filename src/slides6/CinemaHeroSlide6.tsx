import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import React from "react";
import { theme6 } from "./theme6";

type Props = {
  chapter: string;
  title: string;
  subtitle: string;
};

export const CinemaHeroSlide6: React.FC<Props> = ({ chapter, title, subtitle }) => {
  const frame = useCurrentFrame();

  // Top gold rule: grows from left, frame 0→20
  const topRuleWidth = interpolate(frame, [0, 20], [0, 1920], { extrapolateRight: "clamp" });

  // Chapter label: fades in frame 10→25
  const chapterOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Title: slides up from translateY 50→0 frame 20→50
  const titleY = interpolate(frame, [20, 50], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtitle: fades in frame 45→65
  const subtitleOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Vertical left border: height grows from 0→400, frame 5→30
  const borderHeight = interpolate(frame, [5, 30], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Bottom gold rule: grows from right, frame 60→90
  const bottomRuleWidth = interpolate(frame, [60, 90], [0, 1920], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme6.bg, overflow: "hidden" }}>
      {/* Top gold rule */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: topRuleWidth,
          height: 2,
          backgroundColor: theme6.gold,
        }}
      />

      {/* Vertical left border — grows from bottom */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: (1080 - 400) / 2,
          width: 3,
          height: borderHeight,
          backgroundColor: theme6.gold,
        }}
      />

      {/* Chapter label */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 120,
          opacity: chapterOpacity,
          fontFamily: theme6.sans,
          fontSize: 14,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: theme6.gold,
        }}
      >
        CHAPTER {chapter}
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 120,
          maxWidth: 900,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: theme6.serif,
          fontSize: 108,
          fontWeight: 400,
          color: theme6.white,
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>

      {/* Italic subtitle */}
      <div
        style={{
          position: "absolute",
          top: 740,
          left: 120,
          opacity: subtitleOpacity,
          fontFamily: theme6.serif,
          fontStyle: "italic",
          fontSize: 36,
          color: "rgba(240,237,230,0.6)",
        }}
      >
        {subtitle}
      </div>

      {/* Bottom gold rule — grows from right */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: bottomRuleWidth,
          height: 2,
          backgroundColor: theme6.gold,
        }}
      />
    </AbsoluteFill>
  );
};
