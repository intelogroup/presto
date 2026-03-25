// src/slides12/KineticListSlide12.tsx
// P12 — Kinetic List: large items appear sequentially, alternating left/right alignment

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme12 } from "./theme12";

type Props = {
  items: string[];
};

// Each item appears 28 frames after the previous one
const ITEM_STAGGER = 28;

const POSITIONS: Array<{ left?: number; right?: number; textAlign: "left" | "right" }> = [
  { left: 80, textAlign: "left" },
  { right: 80, textAlign: "right" },
  { left: 80, textAlign: "left" },
  { right: 80, textAlign: "right" },
];

const COLORS = [theme12.white, theme12.red, theme12.white, theme12.red];

export const KineticListSlide12: React.FC<Props> = ({ items }) => {
  const frame = useCurrentFrame();
  const visibleItems = items.slice(0, 4);

  return (
    <AbsoluteFill style={{ backgroundColor: theme12.bg, overflow: "hidden" }}>
      {visibleItems.map((item, i) => {
        const startFrame = i * ITEM_STAGGER;
        const pos = POSITIONS[i];
        const isRight = pos.textAlign === "right";

        // Slide in from left or right
        const slideX = interpolate(frame, [startFrame, startFrame + 20], [isRight ? 200 : -200, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

        const opacity = interpolate(frame, [startFrame, startFrame + 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Vertical positions — evenly spaced
        const topValues = [80, 300, 520, 740];
        const top = topValues[i] ?? i * 220 + 80;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top,
              left: pos.left,
              right: pos.right,
              transform: `translateX(${slideX}px)`,
              opacity,
              fontFamily: theme12.display,
              fontSize: 96,
              fontWeight: 900,
              color: COLORS[i],
              lineHeight: 1,
              letterSpacing: -2,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              textAlign: pos.textAlign,
            }}
          >
            {item}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
