// src/slides16/ComicStatSlide16.tsx
// Comic stat — halftone white bg, speech-bubble exclamation, enormous value, diagonal accent bar

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme16 } from "./theme16";

type Props = {
  label: string;
  value: string;
  exclamation: string;
  color: "red" | "blue" | "yellow";
};

export const ComicStatSlide16: React.FC<Props> = ({ label, value, exclamation, color }) => {
  const frame = useCurrentFrame();

  const accentColor = color === "red" ? theme16.red : color === "blue" ? theme16.blue : theme16.yellow;
  const exclamationTextColor = color === "yellow" ? theme16.black : theme16.white;

  // Speech bubble pops in frames 0-12
  const bubbleScale = interpolate(frame, [0, 8, 12], [0, 1.08, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });
  const bubbleOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Value scales in frames 10-35
  const valueScale = interpolate(frame, [10, 28, 35], [0.7, 1.04, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });
  const valueOpacity = interpolate(frame, [10, 22], [0, 1], { extrapolateRight: "clamp" });

  // Label fades in frames 32-45
  const labelOpacity = interpolate(frame, [32, 45], [0, 1], { extrapolateRight: "clamp" });

  // Panel border snaps in frames 0-8
  const borderOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme16.white,
        ...theme16.halftone,
        overflow: "hidden",
        fontFamily: theme16.display,
      }}
    >
      {/* Panel border */}
      <div
        style={{
          position: "absolute",
          inset: 20,
          border: `6px solid ${theme16.black}`,
          opacity: borderOpacity,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Diagonal accent bar — bottom-left corner */}
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -120,
          width: 400,
          height: 200,
          backgroundColor: accentColor,
          border: `6px solid ${theme16.black}`,
          transform: "rotate(-25deg)",
          zIndex: 1,
        }}
      />

      {/* Speech bubble exclamation — top center */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: `translateX(-50%) scale(${bubbleScale})`,
          transformOrigin: "center center",
          opacity: bubbleOpacity,
          zIndex: 5,
        }}
      >
        <div
          style={{
            backgroundColor: accentColor,
            border: `4px solid ${theme16.black}`,
            borderRadius: 12,
            padding: "16px 40px",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontFamily: theme16.display,
              fontWeight: 900,
              color: exclamationTextColor,
              textShadow: exclamationTextColor === theme16.black ? "none" : `2px 2px 0 ${theme16.black}`,
              whiteSpace: "nowrap",
            }}
          >
            {exclamation}
          </div>
          {/* Triangle pointer down */}
          <div
            style={{
              position: "absolute",
              bottom: -28,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "20px solid transparent",
              borderRight: "20px solid transparent",
              borderTop: `28px solid ${theme16.black}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "16px solid transparent",
              borderRight: "16px solid transparent",
              borderTop: `22px solid ${accentColor}`,
            }}
          />
        </div>
      </div>

      {/* Value — enormous center */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
        }}
      >
        <div
          style={{
            fontSize: 200,
            fontFamily: theme16.display,
            fontWeight: 900,
            color: theme16.black,
            lineHeight: 1,
            transform: `scale(${valueScale})`,
            opacity: valueOpacity,
            textShadow: `6px 6px 0 rgba(0,0,0,0.15)`,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 24,
            fontFamily: theme16.body,
            color: "#555",
            marginTop: 16,
            opacity: labelOpacity,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
