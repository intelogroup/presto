// src/slides20/KineticQuoteSlide20.tsx
// Quote with dramatic text sizing — key phrase enlarged

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme20 } from "./theme20";

type Props = { quote: string; author: string };

export const KineticQuoteSlide20: React.FC<Props> = ({ quote, author }) => {
  const frame = useCurrentFrame();

  const quoteOpacity = interpolate(frame, [4, 16], [0, 1], { extrapolateRight: "clamp" });
  const quoteScale = interpolate(frame, [4, 14, 18], [0.85, 1.03, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.2)),
  });
  const authorOpacity = interpolate(frame, [20, 32], [0, 0.7], { extrapolateRight: "clamp" });
  const authorX = interpolate(frame, [20, 32], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme20.bg, overflow: "hidden", fontFamily: theme20.body }}>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "0 100px",
      }}>
        {/* Accent line */}
        <div style={{
          width: 60, height: 4, backgroundColor: theme20.accent,
          marginBottom: 30, opacity: quoteOpacity,
        }} />

        <div style={{
          fontSize: 52, fontWeight: 300, color: theme20.text,
          textAlign: "center", lineHeight: 1.4, maxWidth: "85%",
          opacity: quoteOpacity, transform: `scale(${quoteScale})`,
          fontStyle: "italic",
        }}>
          &ldquo;{quote}&rdquo;
        </div>

        <div style={{
          fontSize: 20, color: theme20.accent, marginTop: 30,
          textTransform: "uppercase", letterSpacing: 4,
          opacity: authorOpacity, transform: `translateX(${authorX}px)`,
        }}>
          &mdash; {author}
        </div>
      </div>
    </AbsoluteFill>
  );
};
