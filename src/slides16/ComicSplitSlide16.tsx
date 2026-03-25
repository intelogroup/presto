// src/slides16/ComicSplitSlide16.tsx
// Comic split — two panels side by side, optional VS starburst

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme16 } from "./theme16";

type PanelColor = "red" | "blue" | "yellow";

type Props = {
  panel1: { text: string; color: PanelColor };
  panel2: { text: string; color: PanelColor };
  versus: boolean;
};

const getColor = (c: PanelColor) => {
  if (c === "red") return theme16.red;
  if (c === "blue") return theme16.blue;
  return theme16.yellow;
};

const getTextColor = (c: PanelColor) => {
  return c === "yellow" ? theme16.black : theme16.white;
};

export const ComicSplitSlide16: React.FC<Props> = ({ panel1, panel2, versus }) => {
  const frame = useCurrentFrame();

  // Panel border snap in frames 0-8
  const borderOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Left panel slides in from left frames 0-20
  const leftX = interpolate(frame, [0, 20], [-200, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const leftOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // Right panel slides in from right frames 8-28
  const rightX = interpolate(frame, [8, 28], [200, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rightOpacity = interpolate(frame, [8, 20], [0, 1], { extrapolateRight: "clamp" });

  // VS starburst spins in frames 22-35
  const vsScale = interpolate(frame, [22, 30, 35], [0, 1.1, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });
  const vsRotate = interpolate(frame, [22, 35], [0, 360], { extrapolateRight: "clamp" });
  const vsOpacity = interpolate(frame, [22, 30], [0, 1], { extrapolateRight: "clamp" });

  const color1 = getColor(panel1.color);
  const color2 = getColor(panel2.color);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme16.black,
        overflow: "hidden",
        fontFamily: theme16.display,
      }}
    >
      {/* Left panel */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: "calc(50% - 23px)",
          bottom: 20,
          backgroundColor: color1,
          ...theme16.halftone,
          border: `6px solid ${theme16.black}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${leftX}px)`,
          opacity: leftOpacity,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontFamily: theme16.display,
            fontWeight: 900,
            color: getTextColor(panel1.color),
            textShadow:
              getTextColor(panel1.color) === theme16.white
                ? `3px 3px 0 ${theme16.black}`
                : "none",
            textAlign: "center",
            padding: "0 40px",
            lineHeight: 1.1,
            textTransform: "uppercase",
          }}
        >
          {panel1.text}
        </div>
      </div>

      {/* Right panel */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: "calc(50% - 23px)",
          bottom: 20,
          backgroundColor: color2,
          ...theme16.halftone,
          border: `6px solid ${theme16.black}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${rightX}px)`,
          opacity: rightOpacity,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontFamily: theme16.display,
            fontWeight: 900,
            color: getTextColor(panel2.color),
            textShadow:
              getTextColor(panel2.color) === theme16.white
                ? `3px 3px 0 ${theme16.black}`
                : "none",
            textAlign: "center",
            padding: "0 40px",
            lineHeight: 1.1,
            textTransform: "uppercase",
          }}
        >
          {panel2.text}
        </div>
      </div>

      {/* Center divider line */}
      <div
        style={{
          position: "absolute",
          top: 20,
          bottom: 20,
          left: "50%",
          width: 6,
          backgroundColor: theme16.black,
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
      />

      {/* VS Starburst */}
      {versus && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${vsScale}) rotate(${vsRotate}deg)`,
            opacity: vsOpacity,
            zIndex: 10,
            width: 120,
            height: 120,
          }}
        >
          {/* Octagon background (rotated square) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: theme16.yellow,
              border: `4px solid ${theme16.black}`,
              borderRadius: 8,
              transform: "rotate(22.5deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontFamily: theme16.display,
                fontWeight: 900,
                color: theme16.black,
              }}
            >
              VS
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
