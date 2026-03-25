// src/slides16/ComicClosingSlide16.tsx
// Comic closing — red halftone bg, massive action text, tagline, black CTA strip

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme16 } from "./theme16";

type Props = {
  action: string;
  tagline: string;
  cta: string;
};

export const ComicClosingSlide16: React.FC<Props> = ({ action, tagline, cta }) => {
  const frame = useCurrentFrame();

  // Panel border snap in frames 0-8
  const borderOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Action overshoot frames 0-25
  const actionScale = interpolate(frame, [0, 18, 25], [0.5, 1.1, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });
  const actionOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // Tagline fades in frames 22-38
  const taglineOpacity = interpolate(frame, [22, 38], [0, 1], { extrapolateRight: "clamp" });

  // CTA strip slides up frames 30-45
  const ctaY = interpolate(frame, [30, 45], [80, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const ctaOpacity = interpolate(frame, [30, 40], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme16.red,
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

      {/* Action text */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontFamily: theme16.display,
            fontWeight: 900,
            color: theme16.yellow,
            textTransform: "uppercase",
            textAlign: "center",
            transform: `scale(${actionScale})`,
            opacity: actionOpacity,
            textShadow: `4px 4px 0 ${theme16.black}, -2px -2px 0 ${theme16.black}, 2px -2px 0 ${theme16.black}, -2px 2px 0 ${theme16.black}`,
            lineHeight: 1.05,
            padding: "0 80px",
          }}
        >
          {action}
        </div>

        {/* Thick rule */}
        <div
          style={{
            width: "60%",
            height: 4,
            backgroundColor: theme16.black,
            marginTop: 32,
            opacity: taglineOpacity,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontFamily: theme16.body,
            color: theme16.white,
            textAlign: "center",
            marginTop: 24,
            opacity: taglineOpacity,
            lineHeight: 1.5,
            padding: "0 120px",
            fontStyle: "italic",
          }}
        >
          {tagline}
        </div>
      </div>

      {/* Bottom CTA strip */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          backgroundColor: theme16.black,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${ctaY}px)`,
          opacity: ctaOpacity,
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontFamily: theme16.display,
            fontWeight: 900,
            color: theme16.yellow,
            letterSpacing: 6,
            textTransform: "uppercase",
            textShadow: `2px 2px 0 ${theme16.red}`,
          }}
        >
          {cta}
        </div>
      </div>
    </AbsoluteFill>
  );
};
