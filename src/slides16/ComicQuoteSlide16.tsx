// src/slides16/ComicQuoteSlide16.tsx
// Comic quote — yellow halftone bg, large speech bubble with pointer, author attribution

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme16 } from "./theme16";

type Props = {
  quote: string;
  author: string;
  role?: string;
};

export const ComicQuoteSlide16: React.FC<Props> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();

  // Panel border snap in frames 0-8
  const borderOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Speech bubble: scale 0.95→1 opacity 0→1 frames 0-20
  const bubbleScale = interpolate(frame, [0, 12, 20], [0.95, 1.02, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });
  const bubbleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Author fades in frames 25-40
  const authorOpacity = interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" });
  const authorX = interpolate(frame, [25, 40], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme16.yellow,
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

      {/* Speech bubble container */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 80,
          right: 180,
          transform: `translateY(-55%) scale(${bubbleScale})`,
          transformOrigin: "left center",
          opacity: bubbleOpacity,
          zIndex: 5,
        }}
      >
        {/* Bubble */}
        <div
          style={{
            backgroundColor: theme16.white,
            border: `4px solid ${theme16.black}`,
            borderRadius: 16,
            padding: "32px 40px",
            position: "relative",
            boxShadow: `6px 6px 0 ${theme16.black}`,
          }}
        >
          {/* Opening quote mark */}
          <div
            style={{
              fontSize: 120,
              fontFamily: theme16.display,
              fontWeight: 900,
              color: theme16.red,
              lineHeight: 0.6,
              marginBottom: 12,
            }}
          >
            "
          </div>
          <div
            style={{
              fontSize: 32,
              fontFamily: theme16.body,
              color: theme16.black,
              lineHeight: 1.5,
              fontStyle: "italic",
            }}
          >
            {quote}
          </div>

          {/* Triangle pointer — bottom-right */}
          <div
            style={{
              position: "absolute",
              bottom: -28,
              right: 60,
              width: 0,
              height: 0,
              borderLeft: "24px solid transparent",
              borderRight: "0px solid transparent",
              borderTop: `28px solid ${theme16.black}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              right: 64,
              width: 0,
              height: 0,
              borderLeft: "20px solid transparent",
              borderRight: "0px solid transparent",
              borderTop: `22px solid ${theme16.white}`,
            }}
          />
        </div>
      </div>

      {/* Author attribution */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          right: 100,
          opacity: authorOpacity,
          transform: `translateX(${authorX}px)`,
          textAlign: "right",
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontFamily: theme16.display,
            fontWeight: 900,
            color: theme16.black,
          }}
        >
          — {author}
        </div>
        {role && (
          <div
            style={{
              fontSize: 16,
              fontFamily: theme16.body,
              color: "#333",
              marginTop: 4,
              fontStyle: "italic",
            }}
          >
            {role}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
