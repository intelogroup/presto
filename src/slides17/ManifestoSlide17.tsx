// src/slides17/ManifestoSlide17.tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme17 } from "./theme17";

interface Props {
  statement: string;
  detail: string;
}

export const ManifestoSlide17: React.FC<Props> = ({ statement, detail }) => {
  const frame = useCurrentFrame();

  const lineOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const stmtOpacity = interpolate(frame, [15, 45], [0, 1], { extrapolateRight: "clamp" });
  const stmtScale = interpolate(frame, [15, 45], [0.92, 1], { extrapolateRight: "clamp" });
  const detailOpacity = interpolate(frame, [45, 75], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme17.bg,
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 120,
        paddingRight: 120,
      }}
    >
      {/* Vertical gold bar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8, backgroundColor: theme17.gold }} />

      {/* Background large quote mark */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 100,
          fontSize: 400,
          fontFamily: theme17.display,
          color: "rgba(212,160,23,0.07)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        "
      </div>

      <div style={{ width: "100%", maxWidth: 1400 }}>
        {/* Top horizontal line */}
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: theme17.border,
            marginBottom: 64,
            opacity: lineOpacity,
          }}
        />

        {/* Main statement */}
        <h2
          style={{
            fontFamily: theme17.display,
            fontSize: 96,
            fontWeight: "normal",
            color: theme17.text,
            margin: "0 0 48px",
            lineHeight: 1.1,
            opacity: stmtOpacity,
            transform: `scale(${stmtScale})`,
            transformOrigin: "left center",
          }}
        >
          {statement}
        </h2>

        {/* Detail */}
        <p
          style={{
            fontFamily: theme17.body,
            fontSize: 34,
            color: theme17.textMuted,
            margin: 0,
            lineHeight: 1.7,
            maxWidth: 900,
            opacity: detailOpacity,
          }}
        >
          {detail}
        </p>

        {/* Bottom line */}
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: theme17.border,
            marginTop: 64,
            opacity: lineOpacity,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
