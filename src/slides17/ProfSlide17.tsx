// src/slides17/ProfSlide17.tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme17 } from "./theme17";

interface Props {
  name: string;
  role: string;
  background: string;
}

export const ProfSlide17: React.FC<Props> = ({ name, role, background }) => {
  const frame = useCurrentFrame();

  const bgPanelW = interpolate(frame, [0, 35], [0, 1], { extrapolateRight: "clamp" });
  const contentOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp" });
  const nameY = interpolate(frame, [30, 55], [20, 0], { extrapolateRight: "clamp" });
  const bgOpacity = interpolate(frame, [35, 60], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme17.bg, flexDirection: "row" }}>
      {/* Vertical gold bar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8, backgroundColor: theme17.gold }} />

      {/* Left panel — gold fill */}
      <div
        style={{
          width: `${bgPanelW * 38}%`,
          backgroundColor: theme17.gold,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          padding: "60px 50px",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontFamily: theme17.body,
            fontSize: 20,
            color: theme17.bg,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: bgOpacity,
            margin: 0,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          Your Instructor
        </p>
      </div>

      {/* Right panel — content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 80,
          paddingRight: 120,
          opacity: contentOpacity,
        }}
      >
        {/* Label */}
        <p
          style={{
            fontFamily: theme17.body,
            fontSize: 20,
            color: theme17.gold,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            margin: "0 0 24px",
          }}
        >
          Meet Your Professor
        </p>

        {/* Name */}
        <h2
          style={{
            fontFamily: theme17.display,
            fontSize: 80,
            fontWeight: "normal",
            color: theme17.text,
            margin: "0 0 8px",
            transform: `translateY(${nameY}px)`,
            lineHeight: 1,
          }}
        >
          {name}
        </h2>

        {/* Divider */}
        <div style={{ width: 80, height: 2, backgroundColor: theme17.gold, margin: "24px 0" }} />

        {/* Role */}
        <p
          style={{
            fontFamily: theme17.body,
            fontSize: 30,
            color: theme17.textMuted,
            margin: "0 0 32px",
          }}
        >
          {role}
        </p>

        {/* Background */}
        <p
          style={{
            fontFamily: theme17.body,
            fontSize: 26,
            color: theme17.text,
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 620,
          }}
        >
          {background}
        </p>
      </div>
    </AbsoluteFill>
  );
};
