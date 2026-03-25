import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme5 } from "./theme5";

interface Props {
  headline: string;
  tagline: string;
}

export const GlassClosingSlide5: React.FC<Props> = ({ headline, tagline }) => {
  const frame = useCurrentFrame();

  // Orb pulsing via sin wave
  const orbScale = 0.95 + 0.1 * Math.sin((frame / 60) * Math.PI * 2);
  const orbScaleViloet = 0.95 + 0.1 * Math.sin((frame / 60) * Math.PI * 2 + Math.PI);

  // Headline: fade + slide up frame 10 → 35
  const headlineOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headlineY = interpolate(frame, [10, 35], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rule halves grow from center frame 35 → 55 (each half: 0 → 240px)
  const halfWidth = interpolate(frame, [35, 55], [0, 240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline fades in frame 50 → 70
  const taglineOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme5.bg,
        fontFamily: theme5.sans,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Teal orb */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme5.teal}55 0%, transparent 70%)`,
          transform: `scale(${orbScale})`,
          filter: "blur(60px)",
        }}
      />
      {/* Violet orb */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme5.violet}44 0%, transparent 70%)`,
          transform: `scale(${orbScaleViloet})`,
          filter: "blur(80px)",
        }}
      />

      {/* Centered text content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
          }}
        >
          <h1
            style={{
              fontSize: 100,
              fontWeight: 700,
              color: theme5.white,
              letterSpacing: -3,
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            {headline}
          </h1>
        </div>

        {/* Rule growing from center outward */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 36,
            height: 2,
          }}
        >
          {/* Left half (grows leftward) */}
          <div
            style={{
              width: halfWidth,
              height: 2,
              background: theme5.teal,
              borderRadius: 1,
              transformOrigin: "right center",
            }}
          />
          {/* Right half (grows rightward) */}
          <div
            style={{
              width: halfWidth,
              height: 2,
              background: theme5.teal,
              borderRadius: 1,
              transformOrigin: "left center",
            }}
          />
        </div>

        {/* Tagline */}
        <div style={{ opacity: taglineOpacity, marginTop: 32 }}>
          <p
            style={{
              fontSize: 32,
              color: theme5.teal,
              margin: 0,
            }}
          >
            {tagline}
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
