// src/slides16/ComicHeroSlide16.tsx
// Comic Book Hero — yellow halftone bg, thick panel border, action word starburst, hero title, red tagline strip

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme16 } from "./theme16";

type Props = {
  action: string;
  hero: string;
  tagline: string;
};

export const ComicHeroSlide16: React.FC<Props> = ({ action, hero, tagline }) => {
  const frame = useCurrentFrame();

  // Panel border snaps in frames 0-8
  const borderOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Action word: scale 0→1.1→1.0 frames 5-20
  const actionScale = interpolate(
    frame,
    [5, 15, 20],
    [0, 1.1, 1.0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) }
  );
  const actionOpacity = interpolate(frame, [5, 12], [0, 1], { extrapolateRight: "clamp" });

  // Hero text: translateY 30→0, opacity 0→1 frames 12-30
  const heroY = interpolate(frame, [12, 30], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const heroOpacity = interpolate(frame, [12, 30], [0, 1], { extrapolateRight: "clamp" });

  // Tagline strip slides up frames 28-42
  const taglineY = interpolate(frame, [28, 42], [80, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const taglineOpacity = interpolate(frame, [28, 38], [0, 1], { extrapolateRight: "clamp" });

  const accentColor = (color: string) => {
    if (color === "red") return theme16.red;
    if (color === "blue") return theme16.blue;
    return theme16.yellow;
  };

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

      {/* Action word starburst background (rotated square) */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          opacity: actionOpacity,
          transform: `scale(${actionScale})`,
          transformOrigin: "center center",
          zIndex: 2,
        }}
      >
        {/* Starburst: rotated square */}
        <div
          style={{
            position: "absolute",
            width: 220,
            height: 220,
            backgroundColor: "#FF8C00",
            transform: "rotate(45deg)",
            top: -40,
            left: -40,
            zIndex: 1,
          }}
        />
        {/* Action text */}
        <div
          style={{
            position: "relative",
            fontSize: 120,
            fontFamily: theme16.display,
            fontWeight: 900,
            color: theme16.red,
            transform: "rotate(-8deg)",
            textShadow: `4px 4px 0 ${theme16.black}`,
            zIndex: 2,
            whiteSpace: "nowrap",
          }}
        >
          {action}
        </div>
      </div>

      {/* Hero title — center */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 3,
        }}
      >
        {/* White outline layer */}
        <div
          style={{
            position: "absolute",
            fontSize: 96,
            fontFamily: theme16.display,
            fontWeight: 900,
            color: theme16.white,
            textTransform: "uppercase",
            letterSpacing: 2,
            textAlign: "center",
            lineHeight: 1.1,
            opacity: heroOpacity,
            transform: `translateY(${heroY}px)`,
            textShadow: "0 0 0 #FFF",
            // Simulate white stroke via offset shadows
            filter: "blur(0)",
          }}
          aria-hidden
        >
          {/* Using white behind black via shadow trick */}
          <span
            style={{
              textShadow: `3px 3px 0 #FFF, -3px -3px 0 #FFF, 3px -3px 0 #FFF, -3px 3px 0 #FFF,
                           5px 0 0 #FFF, -5px 0 0 #FFF, 0 5px 0 #FFF, 0 -5px 0 #FFF`,
              color: theme16.black,
            }}
          >
            {hero}
          </span>
        </div>
      </div>

      {/* Bottom red tagline strip */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          backgroundColor: theme16.red,
          borderTop: `6px solid ${theme16.black}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${taglineY}px)`,
          opacity: taglineOpacity,
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontFamily: theme16.display,
            fontWeight: 900,
            color: theme16.white,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
