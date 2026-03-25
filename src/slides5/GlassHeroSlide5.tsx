import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme5 } from "./theme5";

interface Props {
  title: string;
  subtitle: string;
  tag: string;
}

export const GlassHeroSlide5: React.FC<Props> = ({ title, subtitle, tag }) => {
  const frame = useCurrentFrame();

  // Glowing orb pulse: scale 0.8 → 1.0 over 120 frames
  const orbScale = interpolate(frame, [0, 120], [0.8, 1.0], {
    easing: Easing.inOut(Easing.sin),
    extrapolateRight: "clamp",
  });

  // Tag fade in: 0 → 15
  const tagOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Teal rule width: 0 → 120px over frame 5 → 20
  const ruleWidth = interpolate(frame, [5, 20], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title: fade + slide up frame 10 → 35
  const titleOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [10, 35], [40, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle: fade in frame 30 → 50
  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme5.bg, fontFamily: theme5.sans, overflow: "hidden" }}>
      {/* Teal orb */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -200,
          width: 700,
          height: 700,
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
          bottom: -200,
          right: -200,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme5.violet}44 0%, transparent 70%)`,
          transform: `scale(${orbScale})`,
          filter: "blur(80px)",
        }}
      />

      {/* Centered glass card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: theme5.glass,
          border: `1px solid ${theme5.glassBorder}`,
          borderRadius: 24,
          padding: "64px 80px",
          backdropFilter: "blur(20px)",
          minWidth: 900,
          maxWidth: 1100,
          textAlign: "center",
        }}
      >
        {/* Tag */}
        <div style={{ opacity: tagOpacity }}>
          <span
            style={{
              color: theme5.teal,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {tag}
          </span>
        </div>

        {/* Teal rule */}
        <div
          style={{
            width: ruleWidth,
            height: 2,
            background: theme5.teal,
            margin: "12px auto 0",
            borderRadius: 1,
          }}
        />

        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginTop: 32,
          }}
        >
          <h1
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: theme5.white,
              letterSpacing: -2,
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Subtitle */}
        <div style={{ opacity: subtitleOpacity, marginTop: 28 }}>
          <p
            style={{
              fontSize: 32,
              color: "rgba(255,255,255,0.65)",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
