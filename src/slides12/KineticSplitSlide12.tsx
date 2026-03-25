// src/slides12/KineticSplitSlide12.tsx
// P12 — Kinetic Split: left/right text collide from opposite axes, connector pops in center

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme12 } from "./theme12";

type Props = {
  left: string;
  right: string;
  connector: string;
};

export const KineticSplitSlide12: React.FC<Props> = ({ left, right, connector }) => {
  const frame = useCurrentFrame();

  // left enters from top — frames 0-20
  const leftY = interpolate(frame, [0, 20], [-400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.1)),
  });

  // right enters from bottom — frames 10-30
  const rightY = interpolate(frame, [10, 30], [400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.1)),
  });

  // connector pops in center — scale 0→1, frames 25-35
  const connScale = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(2.0)),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme12.bg, overflow: "hidden" }}>
      {/* LEFT — top half, left side, enters from top */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 80,
          transform: `translateY(${leftY}px)`,
          fontFamily: theme12.display,
          fontSize: 160,
          fontWeight: 900,
          color: theme12.white,
          lineHeight: 1,
          letterSpacing: -4,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {left}
      </div>

      {/* RIGHT — bottom half, right side, enters from bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          right: 80,
          transform: `translateY(${rightY}px)`,
          fontFamily: theme12.display,
          fontSize: 160,
          fontWeight: 900,
          color: theme12.red,
          lineHeight: 1,
          letterSpacing: -4,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          textAlign: "right",
        }}
      >
        {right}
      </div>

      {/* CONNECTOR — center, pops in with overshoot */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${connScale})`,
          fontFamily: theme12.display,
          fontSize: 120,
          fontWeight: 900,
          color: theme12.yellow,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {connector}
      </div>
    </AbsoluteFill>
  );
};
