import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme5 } from "./theme5";

interface Props {
  quote: string;
  author: string;
  role?: string;
}

export const GlassQuoteSlide5: React.FC<Props> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();

  // Quote: fade + scale from 0.97 → 1 frame 10 → 40
  const quoteOpacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const quoteScale = interpolate(frame, [10, 40], [0.97, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Teal rule grows frame 40 → 60
  const ruleWidth = interpolate(frame, [40, 60], [0, 80], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Author fades in frame 50 → 65
  const authorOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Role fades in frame 60 → 75
  const roleOpacity = interpolate(frame, [60, 75], [0, 1], {
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
      {/* Centered glass card */}
      <div
        style={{
          position: "relative",
          maxWidth: 1100,
          width: "100%",
          background: theme5.glass,
          border: `1px solid ${theme5.glassBorder}`,
          borderRadius: 28,
          padding: "80px",
          backdropFilter: "blur(20px)",
          margin: "0 80px",
        }}
      >
        {/* Large quotation mark */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 40,
            fontSize: 160,
            fontWeight: 700,
            color: theme5.teal,
            opacity: 0.2,
            lineHeight: 1,
            fontFamily: "Georgia, serif",
            userSelect: "none",
          }}
        >
          "
        </div>

        {/* Quote text */}
        <div
          style={{
            opacity: quoteOpacity,
            transform: `scale(${quoteScale})`,
            position: "relative",
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontSize: 44,
              fontWeight: 400,
              color: theme5.white,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {quote}
          </p>
        </div>

        {/* Teal rule */}
        <div
          style={{
            width: ruleWidth,
            height: 2,
            background: theme5.teal,
            borderRadius: 1,
            marginTop: 40,
          }}
        />

        {/* Author */}
        <div style={{ opacity: authorOpacity, marginTop: 24 }}>
          <span
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: theme5.white,
            }}
          >
            {author}
          </span>
        </div>

        {/* Role */}
        {role && (
          <div style={{ opacity: roleOpacity, marginTop: 8 }}>
            <span
              style={{
                fontSize: 20,
                color: theme5.muted,
              }}
            >
              {role}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
