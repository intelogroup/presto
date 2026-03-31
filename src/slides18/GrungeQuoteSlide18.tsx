// src/slides18/GrungeQuoteSlide18.tsx
// Distressed quote — big quote marks, rough paper feel, faded attribution

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme18 } from "./theme18";

type Props = { quote: string; author: string; role?: string };

export const GrungeQuoteSlide18: React.FC<Props> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();

  const grainOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const quoteMarkScale = interpolate(frame, [0, 12, 18], [0, 1.1, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.3)),
  });
  const quoteOpacity = interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp" });
  const quoteY = interpolate(frame, [8, 22], [20, 0], { extrapolateRight: "clamp" });
  const authorOpacity = interpolate(frame, [24, 36], [0, 0.8], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme18.bg, overflow: "hidden", fontFamily: theme18.body }}>
      <div style={{ position: "absolute", inset: 0, ...theme18.grain, opacity: grainOpacity, zIndex: 1 }} />
      <div style={{
        position: "absolute", inset: 30, border: `3px solid ${theme18.mustard}`,
        opacity: grainOpacity * 0.6, pointerEvents: "none", zIndex: 2,
      }} />

      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "0 120px", zIndex: 3,
      }}>
        {/* Big quote mark */}
        <div style={{
          fontSize: 180, fontFamily: theme18.display, color: theme18.rust,
          lineHeight: 0.6, opacity: grainOpacity,
          transform: `scale(${quoteMarkScale})`, transformOrigin: "center center",
          textShadow: `3px 3px 0 rgba(0,0,0,0.3)`,
        }}>
          &ldquo;
        </div>

        {/* Quote text */}
        <div style={{
          fontSize: 42, color: theme18.chalk, lineHeight: 1.4,
          textAlign: "center", opacity: quoteOpacity, maxWidth: "80%",
          transform: `translateY(${quoteY}px)`,
          fontStyle: "italic",
        }}>
          {quote}
        </div>

        {/* Attribution */}
        <div style={{
          marginTop: 30, opacity: authorOpacity, textAlign: "center",
        }}>
          <div style={{
            fontSize: 22, color: theme18.mustard, textTransform: "uppercase",
            letterSpacing: 3,
          }}>
            &mdash; {author}
          </div>
          {role && (
            <div style={{ fontSize: 16, color: theme18.chalk, opacity: 0.5, marginTop: 6 }}>
              {role}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
