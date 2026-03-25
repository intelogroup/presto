// src/slides16/ComicListSlide16.tsx
// Comic list — blue halftone bg, yellow title, staggered item panels with slight rotation

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme16 } from "./theme16";

type Props = {
  title: string;
  items: string[];
};

export const ComicListSlide16: React.FC<Props> = ({ title, items }) => {
  const frame = useCurrentFrame();

  // Panel border snap in frames 0-8
  const borderOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Title slides down frames 0-18
  const titleY = interpolate(frame, [0, 18], [-40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme16.blue,
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

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 60,
          right: 60,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontFamily: theme16.display,
            fontWeight: 900,
            color: theme16.yellow,
            textTransform: "uppercase",
            textShadow: `3px 3px 0 ${theme16.black}`,
            paddingBottom: 12,
            borderBottom: `4px solid ${theme16.yellow}`,
          }}
        >
          {title}
        </div>
      </div>

      {/* Items */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 60,
          right: 60,
          bottom: 50,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {items.map((item, i) => {
          const startFrame = 18 + i * 8;
          const endFrame = startFrame + 8;
          const itemScale = interpolate(frame, [startFrame, endFrame], [0.9, 1.0], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.2)),
          });
          const itemOpacity = interpolate(frame, [startFrame, endFrame], [0, 1], {
            extrapolateRight: "clamp",
          });
          const rotation = i % 2 === 0 ? -2 : 2;

          return (
            <div
              key={i}
              style={{
                backgroundColor: theme16.white,
                border: `3px solid ${theme16.black}`,
                borderRadius: 4,
                padding: "14px 24px",
                transform: `scale(${itemScale}) rotate(${rotation}deg)`,
                opacity: itemOpacity,
                boxShadow: `4px 4px 0 ${theme16.black}`,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontFamily: theme16.body,
                  color: theme16.black,
                  lineHeight: 1.4,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 20,
                    fontFamily: theme16.display,
                    fontWeight: 900,
                    color: theme16.red,
                    minWidth: 32,
                  }}
                >
                  {i + 1}.
                </span>
                {item}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
