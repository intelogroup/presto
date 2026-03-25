// src/slides11/BlueprintQuoteSlide11.tsx
// Blueprint Quote — field note box, blue border, quote + author staggered entry

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme11 } from "./theme11";

type Props = {
  quote: string;
  author: string;
  role?: string;
};

export const BlueprintQuoteSlide11: React.FC<Props> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();

  // Box fades in 5→25
  const boxOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Quote text fades in 20→40
  const quoteOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Author fades in 45→60
  const authorOpacity = interpolate(frame, [45, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme11.bg,
        ...theme11.dotGrid,
        fontFamily: theme11.sans,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Field note box */}
      <div
        style={{
          opacity: boxOpacity,
          position: "relative",
          maxWidth: 880,
          width: "100%",
          border: "1px solid rgba(59,159,232,0.4)",
          backgroundColor: "rgba(59,159,232,0.06)",
          padding: "60px 72px",
        }}
      >
        {/* FIELD NOTE label */}
        <div
          style={{
            position: "absolute",
            top: -11,
            left: 32,
            backgroundColor: theme11.bg,
            paddingLeft: 10,
            paddingRight: 10,
            fontFamily: theme11.mono,
            fontSize: 11,
            color: theme11.blue,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          FIELD NOTE
        </div>

        {/* Quote text */}
        <div
          style={{
            opacity: quoteOpacity,
            fontSize: 40,
            fontWeight: 400,
            color: theme11.white,
            lineHeight: 1.7,
            marginBottom: 40,
          }}
        >
          &ldquo;{quote}&rdquo;
        </div>

        {/* Author + role */}
        <div
          style={{
            opacity: authorOpacity,
            fontFamily: theme11.mono,
            fontSize: 15,
            color: theme11.amber,
            letterSpacing: 1,
          }}
        >
          — {author}
          {role && (
            <span
              style={{
                color: theme11.label,
                marginLeft: 12,
              }}
            >
              // {role}
            </span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
