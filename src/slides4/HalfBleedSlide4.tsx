// src/slides4/HalfBleedSlide4.tsx
// Left: solid red block with giant white number/label
// Right: white bg with 3 stacked bold bullet facts
// Hard vertical split, no soft edges

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme4 } from "./theme4";

type Props = {
  bigValue: string;    // e.g. "60%"
  bigLabel: string;    // e.g. "Faster"
  facts: string[];     // 2-3 short lines
};

export const HalfBleedSlide4: React.FC<Props> = ({ bigValue, bigLabel, facts }) => {
  const frame = useCurrentFrame();

  // Left panel slides in from left
  const leftX = interpolate(frame, [0, 22], [-760, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Big value pops with scale
  const valueScale = interpolate(frame, [16, 32], [0.6, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });
  const valueOpacity = interpolate(frame, [16, 28], [0, 1], { extrapolateRight: "clamp" });

  // Right side facts stagger in
  const factAnims = facts.map((_, i) => {
    const start = 28 + i * 14;
    return {
      opacity: interpolate(frame, [start, start + 14], [0, 1], { extrapolateRight: "clamp" }),
      x: interpolate(frame, [start, start + 14], [60, 0], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      }),
    };
  });

  // Yellow accent bar on right panel
  const accentH = interpolate(frame, [20, 45], [0, 540], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: theme4.white, fontFamily: theme4.sans, overflow: "hidden" }}
    >
      {/* Left red panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "42%",
          height: "100%",
          backgroundColor: theme4.red,
          transform: `translateX(${leftX}px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 40px",
        }}
      >
        <div
          style={{
            transform: `scale(${valueScale})`,
            opacity: valueOpacity,
            textAlign: "center",
          }}
        >
          {/* Big value */}
          <div
            style={{
              fontSize: 160,
              fontWeight: 900,
              color: theme4.white,
              lineHeight: 0.9,
              letterSpacing: -6,
            }}
          >
            {bigValue}
          </div>
          {/* Yellow line separator */}
          <div
            style={{
              width: 80,
              height: 8,
              backgroundColor: theme4.yellow,
              margin: "28px auto",
            }}
          />
          {/* Label */}
          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: theme4.white,
            }}
          >
            {bigLabel}
          </div>
        </div>
      </div>

      {/* Yellow accent bar on right side */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 80,
          width: 8,
          height: accentH,
          backgroundColor: theme4.yellow,
        }}
      />

      {/* Right panel facts */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "42%",
          right: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 100px 60px 80px",
          gap: 48,
        }}
      >
        {facts.map((fact, i) => (
          <div
            key={i}
            style={{
              opacity: factAnims[i].opacity,
              transform: `translateX(${factAnims[i].x}px)`,
              display: "flex",
              alignItems: "flex-start",
              gap: 24,
            }}
          >
            {/* Red leading dash */}
            <div
              style={{
                width: 32,
                height: 6,
                backgroundColor: theme4.red,
                marginTop: 22,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: theme4.black,
                lineHeight: 1.2,
                letterSpacing: -0.5,
              }}
            >
              {fact}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
