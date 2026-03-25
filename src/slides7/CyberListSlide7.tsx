import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme7 } from "./theme7";
import { GridBg7 } from "./GridBg7";

interface Props {
  title: string;
  items: string[];
}

export const CyberListSlide7: React.FC<Props> = ({ title, items }) => {
  const frame = useCurrentFrame();

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cyan rule under title grows
  const ruleScaleX = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Blinking cursor: toggles every 15 frames
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  return (
    <AbsoluteFill style={{ backgroundColor: theme7.bg }}>
      <GridBg7 />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          fontFamily: theme7.mono,
          fontSize: 48,
          color: theme7.cyan,
          opacity: titleOpacity,
          textShadow: `0 0 20px rgba(0,240,255,0.4)`,
        }}
      >
        {title}
      </div>

      {/* Cyan rule */}
      <div
        style={{
          position: "absolute",
          top: 158,
          left: 80,
          right: 80,
          height: 1,
          backgroundColor: theme7.cyan,
          transformOrigin: "left center",
          transform: `scaleX(${ruleScaleX})`,
          boxShadow: `0 0 8px rgba(0,240,255,0.4)`,
        }}
      />

      {/* Items */}
      <div
        style={{
          position: "absolute",
          top: 188,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {items.map((item, i) => {
          const startFrame = 28 + i * 16;
          const endFrame = startFrame + 18;

          const rowOpacity = interpolate(frame, [startFrame, endFrame], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const rowX = interpolate(frame, [startFrame, endFrame], [-50, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });

          const isLast = i === items.length - 1;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 24,
                opacity: rowOpacity,
                transform: `translateX(${rowX}px)`,
              }}
            >
              {/* Prompt character */}
              <div
                style={{
                  fontFamily: theme7.mono,
                  fontSize: 28,
                  color: theme7.cyan,
                  opacity: 0.8,
                  flexShrink: 0,
                  textShadow: `0 0 10px rgba(0,240,255,0.5)`,
                }}
              >
                {">_"}
              </div>

              {/* Item text */}
              <div
                style={{
                  fontFamily: theme7.mono,
                  fontSize: 30,
                  color: theme7.white,
                  lineHeight: 1.4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {item}
                {/* Blinking cursor after last item */}
                {isLast && (
                  <span
                    style={{
                      display: "inline-block",
                      color: theme7.cyan,
                      opacity: rowOpacity >= 1 && cursorVisible ? 1 : 0,
                      marginLeft: 4,
                    }}
                  >
                    █
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
