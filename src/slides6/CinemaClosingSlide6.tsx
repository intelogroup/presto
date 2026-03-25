import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import React from "react";
import { theme6 } from "./theme6";

type Props = {
  word: string;
  tagline: string;
};

const CORNER_SIZE = 30;

export const CinemaClosingSlide6: React.FC<Props> = ({ word, tagline }) => {
  const frame = useCurrentFrame();

  // Top gold rule: grows frame 0→25
  const topRuleWidth = interpolate(frame, [0, 25], [0, 1920], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bottom gold rule: grows frame 5→30
  const bottomRuleWidth = interpolate(frame, [5, 30], [0, 1920], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Word: fades in from scale 0.95→1.0, frame 20→50
  const wordOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wordScale = interpolate(frame, [20, 50], [0.95, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tagline: fades in frame 50→70
  const taglineOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Corner decorations: fade in frame 60→80
  const cornerOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cornerStyle: React.CSSProperties = {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    opacity: cornerOpacity,
  };

  const goldBorder = `2px solid ${theme6.gold}`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme6.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
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

      {/* Bottom gold rule */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: bottomRuleWidth,
          height: 2,
          backgroundColor: theme6.gold,
        }}
      />

      {/* Corner decorations — L-shapes */}
      {/* Top-left */}
      <div style={{ ...cornerStyle, top: 40, left: 40, borderTop: goldBorder, borderLeft: goldBorder }} />
      {/* Top-right */}
      <div style={{ ...cornerStyle, top: 40, right: 40, borderTop: goldBorder, borderRight: goldBorder }} />
      {/* Bottom-left */}
      <div style={{ ...cornerStyle, bottom: 40, left: 40, borderBottom: goldBorder, borderLeft: goldBorder }} />
      {/* Bottom-right */}
      <div style={{ ...cornerStyle, bottom: 40, right: 40, borderBottom: goldBorder, borderRight: goldBorder }} />

      {/* Word */}
      <div
        style={{
          opacity: wordOpacity,
          transform: `scale(${wordScale})`,
          fontFamily: theme6.serif,
          fontSize: 180,
          fontWeight: 400,
          color: theme6.white,
          lineHeight: 1,
          marginBottom: 40,
        }}
      >
        {word}
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          fontFamily: theme6.sans,
          fontSize: 30,
          color: theme6.gold,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};
