// src/slides13/DiagStatSlide13.tsx
// P13 stat slide — enormous serif value on right color block, context on left light area

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme13 } from "./theme13";

type Props = {
  value: string;
  label: string;
  context: string;
  accent: string;
};

export const DiagStatSlide13: React.FC<Props> = ({ value, label, context, accent }) => {
  const frame = useCurrentFrame();

  // Value slides from translateX 100→0, frames 5-30
  const valueX = interpolate(frame, [5, 30], [100, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const valueOpacity = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: "clamp" });

  // Label fade in frames 18-32
  const labelOpacity = interpolate(frame, [18, 32], [0, 1], { extrapolateRight: "clamp" });

  // Context fade in frames 25-45
  const contextOpacity = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme13.bg, overflow: "hidden" }}>
      {/* Diagonal color block — fills right ~60% */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: 400,
          width: 1400,
          height: 1480,
          backgroundColor: accent,
          transform: "rotate(-8deg)",
          transformOrigin: "top left",
        }}
      />

      {/* LEFT CONTENT — navy text on light */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 560,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 80,
          paddingRight: 60,
          zIndex: 10,
        }}
      >
        <div
          style={{
            opacity: contextOpacity,
            fontFamily: theme13.serif,
            fontSize: 32,
            fontWeight: 400,
            color: theme13.navy,
            lineHeight: 1.65,
            maxWidth: 480,
          }}
        >
          {context}
        </div>
      </div>

      {/* RIGHT CONTENT — white text on color */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 800,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 120,
          paddingRight: 80,
          zIndex: 10,
        }}
      >
        {/* Enormous value */}
        <div
          style={{
            opacity: valueOpacity,
            transform: `translateX(${valueX}px)`,
            fontFamily: theme13.serif,
            fontSize: 180,
            fontWeight: 400,
            color: theme13.white,
            lineHeight: 1,
            letterSpacing: -6,
          }}
        >
          {value}
        </div>

        {/* Label */}
        <div
          style={{
            opacity: labelOpacity,
            fontFamily: theme13.sans,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase" as const,
            color: theme13.white,
            marginTop: 20,
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
