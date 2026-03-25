import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme7 } from "./theme7";
import { GridBg7 } from "./GridBg7";

interface Props {
  title: string;
  subtitle: string;
  systemLabel: string;
}

export const CyberHeroSlide7: React.FC<Props> = ({ title, subtitle, systemLabel }) => {
  const frame = useCurrentFrame();

  // Cyan scanline sweeping from top — "screen boot" effect
  const scanlineY = interpolate(frame, [0, 25], [-2, 1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const scanlineOpacity = interpolate(frame, [0, 5, 20, 25], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // systemLabel fade in
  const labelOpacity = interpolate(frame, [18, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title slide up
  const titleY = interpolate(frame, [22, 50], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [22, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cyan accent bar grows
  const accentBarHeight = interpolate(frame, [5, 30], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Subtitle fade in
  const subtitleOpacity = interpolate(frame, [45, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom-right "READY" fade in
  const readyOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme7.bg }}>
      <GridBg7 />

      {/* Cyan scanline */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanlineY,
          height: 2,
          backgroundColor: theme7.cyan,
          opacity: scanlineOpacity,
          boxShadow: `0 0 12px ${theme7.cyan}, 0 0 24px rgba(0,240,255,0.5)`,
          zIndex: 10,
        }}
      />

      {/* System label top-left */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 80,
          fontFamily: theme7.mono,
          fontSize: 13,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: theme7.cyan,
          opacity: labelOpacity,
        }}
      >
        {systemLabel}
      </div>

      {/* Cyan left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: "translateY(-50%)",
          width: 4,
          height: accentBarHeight,
          backgroundColor: theme7.cyan,
          boxShadow: `0 0 16px ${theme7.cyan}, 0 0 32px rgba(0,240,255,0.4)`,
          borderRadius: 2,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: 108,
          top: "50%",
          transform: `translateY(calc(-50% + ${titleY}px))`,
          opacity: titleOpacity,
          right: 80,
        }}
      >
        <div
          style={{
            fontFamily: theme7.mono,
            fontSize: 112,
            fontWeight: 700,
            color: theme7.white,
            letterSpacing: -3,
            lineHeight: 1.0,
            textShadow: `0 0 40px rgba(0,240,255,0.5), 0 0 80px rgba(0,240,255,0.2)`,
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 32,
            fontFamily: theme7.sans,
            fontSize: 32,
            color: "rgba(232,244,248,0.7)",
            opacity: subtitleOpacity,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Bottom-right READY label */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          right: 80,
          fontFamily: theme7.mono,
          fontSize: 13,
          letterSpacing: 3,
          color: "rgba(0,240,255,0.5)",
          opacity: readyOpacity,
        }}
      >
        P7.0 READY
      </div>
    </AbsoluteFill>
  );
};
