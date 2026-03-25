import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import React from "react";
import { theme6 } from "./theme6";

type Props = {
  label: string;
  value: string;
  sublabel?: string;
  context?: string;
};

export const CinemaStatSlide6: React.FC<Props> = ({ label, value, sublabel, context }) => {
  const frame = useCurrentFrame();

  // Label: fades in frame 0→18
  const labelOpacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Value: slides up frame 10→40
  const valueY = interpolate(frame, [10, 40], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const valueOpacity = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Underline halves: each grows to 160px, frame 38→58
  const underlineHalf = interpolate(frame, [38, 58], [0, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Sublabel: fades in frame 55→72
  const sublabelOpacity = interpolate(frame, [55, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Context: fades in frame 65→80
  const contextOpacity = interpolate(frame, [65, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
      {/* Label */}
      <div
        style={{
          opacity: labelOpacity,
          fontFamily: theme6.sans,
          fontSize: 18,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: theme6.gold,
          marginBottom: 20,
        }}
      >
        {label}
      </div>

      {/* Value */}
      <div
        style={{
          opacity: valueOpacity,
          transform: `translateY(${valueY}px)`,
          fontFamily: theme6.sans,
          fontSize: 200,
          fontWeight: 300,
          color: theme6.white,
          lineHeight: 1,
        }}
      >
        {value}
      </div>

      {/* Gold underline — two halves from center */}
      <div
        style={{
          position: "relative",
          width: underlineHalf * 2,
          height: 2,
          backgroundColor: theme6.gold,
          marginTop: 16,
          marginBottom: 32,
        }}
      />

      {/* Sublabel */}
      {sublabel && (
        <div
          style={{
            opacity: sublabelOpacity,
            fontFamily: theme6.serif,
            fontStyle: "italic",
            fontSize: 28,
            color: theme6.gold,
            marginBottom: 16,
          }}
        >
          {sublabel}
        </div>
      )}

      {/* Context */}
      {context && (
        <div
          style={{
            opacity: contextOpacity,
            fontFamily: theme6.sans,
            fontSize: 20,
            color: theme6.muted,
          }}
        >
          {context}
        </div>
      )}
    </AbsoluteFill>
  );
};
