import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme7 } from "./theme7";
import { GridBg7 } from "./GridBg7";

interface Props {
  quote: string;
  author: string;
  role?: string;
}

export const CyberQuoteSlide7: React.FC<Props> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();

  // Quote fade in
  const quoteOpacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Magenta rule grows
  const ruleScaleX = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Author fade in
  const authorOpacity = interpolate(frame, [52, 66], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Role fade in
  const roleOpacity = interpolate(frame, [62, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bracket opacity — fade in with quote
  const bracketOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme7.bg }}>
      <GridBg7 />

      {/* Decorative bracket left [ */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: "50%",
          transform: "translateY(-50%)",
          height: 200,
          width: 40,
          opacity: bracketOpacity,
        }}
      >
        {/* Top arm */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 3,
            height: 200,
            backgroundColor: theme7.cyan,
            boxShadow: `0 0 10px rgba(0,240,255,0.5)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 32,
            height: 3,
            backgroundColor: theme7.cyan,
            boxShadow: `0 0 10px rgba(0,240,255,0.5)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 32,
            height: 3,
            backgroundColor: theme7.cyan,
            boxShadow: `0 0 10px rgba(0,240,255,0.5)`,
          }}
        />
      </div>

      {/* Decorative bracket right ] */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: "50%",
          transform: "translateY(-50%)",
          height: 200,
          width: 40,
          opacity: bracketOpacity,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 3,
            height: 200,
            backgroundColor: theme7.cyan,
            boxShadow: `0 0 10px rgba(0,240,255,0.5)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 32,
            height: 3,
            backgroundColor: theme7.cyan,
            boxShadow: `0 0 10px rgba(0,240,255,0.5)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 32,
            height: 3,
            backgroundColor: theme7.cyan,
            boxShadow: `0 0 10px rgba(0,240,255,0.5)`,
          }}
        />
      </div>

      {/* Content box centered */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            width: "100%",
            padding: "72px 80px",
            border: `1px solid ${theme7.magenta}`,
            borderRadius: 12,
            backgroundColor: "rgba(255,0,255,0.05)",
            boxShadow: `0 0 40px rgba(255,0,255,0.1)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Quote text */}
          <div
            style={{
              fontFamily: theme7.sans,
              fontSize: 42,
              fontStyle: "italic",
              color: theme7.white,
              lineHeight: 1.7,
              opacity: quoteOpacity,
            }}
          >
            "{quote}"
          </div>

          {/* Magenta rule */}
          <div
            style={{
              height: 2,
              width: 80,
              backgroundColor: theme7.magenta,
              marginTop: 36,
              transformOrigin: "left center",
              transform: `scaleX(${ruleScaleX})`,
              boxShadow: `0 0 8px rgba(255,0,255,0.5)`,
            }}
          />

          {/* Author */}
          <div
            style={{
              marginTop: 24,
              fontFamily: theme7.mono,
              fontSize: 26,
              color: theme7.cyan,
              opacity: authorOpacity,
            }}
          >
            — {author}
          </div>

          {/* Role */}
          {role && (
            <div
              style={{
                marginTop: 8,
                fontFamily: theme7.mono,
                fontSize: 20,
                color: theme7.muted,
                opacity: roleOpacity,
              }}
            >
              {role}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
