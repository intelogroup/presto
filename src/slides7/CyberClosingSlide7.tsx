import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme7 } from "./theme7";
import { GridBg7 } from "./GridBg7";

interface Props {
  word: string;
  tagline: string;
}

export const CyberClosingSlide7: React.FC<Props> = ({ word, tagline }) => {
  const frame = useCurrentFrame();

  // Cyan scanline sweeps top to bottom over 40 frames
  const scanlineY = interpolate(frame, [0, 40], [0, 1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });
  const scanlineOpacity = interpolate(frame, [0, 5, 35, 40], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Word fade in
  const wordOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline fade in
  const taglineOpacity = interpolate(frame, [55, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Corner decorations fade in
  const cornerOpacity = interpolate(frame, [65, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ARM = 20;
  const THICKNESS = 1;
  const CORNER_COLOR = theme7.cyan;
  const CORNER_SHADOW = `0 0 8px rgba(0,240,255,0.6)`;

  return (
    <AbsoluteFill style={{ backgroundColor: theme7.bg }}>
      <GridBg7 />

      {/* Scanline sweeping top to bottom */}
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

      {/* Corner decorations */}
      {/* Top-left */}
      <div style={{ position: "absolute", top: 40, left: 40, opacity: cornerOpacity }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: ARM, height: THICKNESS, backgroundColor: CORNER_COLOR, boxShadow: CORNER_SHADOW }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: THICKNESS, height: ARM, backgroundColor: CORNER_COLOR, boxShadow: CORNER_SHADOW }} />
      </div>

      {/* Top-right */}
      <div style={{ position: "absolute", top: 40, right: 40, opacity: cornerOpacity }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: ARM, height: THICKNESS, backgroundColor: CORNER_COLOR, boxShadow: CORNER_SHADOW }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: THICKNESS, height: ARM, backgroundColor: CORNER_COLOR, boxShadow: CORNER_SHADOW }} />
      </div>

      {/* Bottom-left */}
      <div style={{ position: "absolute", bottom: 40, left: 40, opacity: cornerOpacity }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, width: ARM, height: THICKNESS, backgroundColor: CORNER_COLOR, boxShadow: CORNER_SHADOW }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: THICKNESS, height: ARM, backgroundColor: CORNER_COLOR, boxShadow: CORNER_SHADOW }} />
      </div>

      {/* Bottom-right */}
      <div style={{ position: "absolute", bottom: 40, right: 40, opacity: cornerOpacity }}>
        <div style={{ position: "absolute", bottom: 0, right: 0, width: ARM, height: THICKNESS, backgroundColor: CORNER_COLOR, boxShadow: CORNER_SHADOW }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: THICKNESS, height: ARM, backgroundColor: CORNER_COLOR, boxShadow: CORNER_SHADOW }} />
      </div>

      {/* Center content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        {/* Main word */}
        <div
          style={{
            fontFamily: theme7.mono,
            fontSize: 180,
            fontWeight: 700,
            color: theme7.white,
            textShadow: `0 0 60px rgba(0,240,255,0.8), 0 0 120px rgba(0,240,255,0.4)`,
            opacity: wordOpacity,
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          {word}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: theme7.mono,
            fontSize: 28,
            color: theme7.cyan,
            textTransform: "uppercase",
            letterSpacing: 6,
            opacity: taglineOpacity,
            textShadow: `0 0 20px rgba(0,240,255,0.4)`,
          }}
        >
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
