// src/slides17/CTASlide17.tsx
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme17 } from "./theme17";

interface Props {
  headline: string;
  instruction: string;
}

export const CTASlide17: React.FC<Props> = ({ headline, instruction }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = spring({ frame, fps, config: { damping: 18, stiffness: 60 } });
  const headlineOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateRight: "clamp" });
  const headlineY = interpolate(frame, [10, 35], [40, 0], { extrapolateRight: "clamp" });
  const instrOpacity = interpolate(frame, [35, 60], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme17.gold,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Animated background ornament */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          border: `2px solid rgba(13,27,42,0.12)`,
          transform: `scale(${bgScale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: `2px solid rgba(13,27,42,0.18)`,
          transform: `scale(${bgScale * 0.9})`,
        }}
      />

      {/* Headline */}
      <h1
        style={{
          fontFamily: theme17.display,
          fontSize: 130,
          fontWeight: "normal",
          color: theme17.bg,
          margin: "0 0 32px",
          letterSpacing: "-0.02em",
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {headline}
      </h1>

      {/* Divider */}
      <div
        style={{
          width: 120,
          height: 3,
          backgroundColor: theme17.bg,
          opacity: instrOpacity,
          marginBottom: 32,
          zIndex: 1,
        }}
      />

      {/* Instruction */}
      <p
        style={{
          fontFamily: theme17.body,
          fontSize: 32,
          color: theme17.bg,
          opacity: instrOpacity,
          margin: 0,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.5,
        }}
      >
        {instruction}
      </p>
    </AbsoluteFill>
  );
};
