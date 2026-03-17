// src/slides2/TypewriterSlide2.tsx
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme2 } from "./theme2";

type Props = {
  text: string;
  author?: string;
  typingEndFrame?: number; // frame at which all chars are shown (default 420)
};

export const TypewriterSlide2: React.FC<Props> = ({ text, author, typingEndFrame = 420 }) => {
  const frame = useCurrentFrame();

  const startFrame = 10;
  const charsToShow = Math.floor(
    interpolate(frame, [startFrame, typingEndFrame], [0, text.length], {
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.linear),
    })
  );

  const displayText = text.slice(0, charsToShow);
  const showCursor = frame < typingEndFrame || Math.floor(frame / 15) % 2 === 0;

  // Background fills in from left
  const bgWidth = interpolate(frame, [0, 20], [0, 1920], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Accent line at bottom grows in after typing
  const lineWidth = interpolate(frame, [typingEndFrame, typingEndFrame + 40], [0, 1920], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Author fades in after typing
  const authorOpacity = interpolate(frame, [typingEndFrame + 20, typingEndFrame + 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme2.split, overflow: "hidden" }}>
      {/* Animated background fill */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: bgWidth,
          height: "100%",
          backgroundColor: theme2.split,
        }}
      />

      {/* Terminal-style prompt */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 100,
          fontFamily: theme2.mono,
          fontSize: 20,
          color: theme2.primary,
          letterSpacing: 3,
        }}
      >
        &gt; INSIGHT_{String(Math.floor(frame / 10) % 100).padStart(2, "0")}
      </div>

      {/* Main text */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "120px 140px",
        }}
      >
        <div
          style={{
            fontFamily: theme2.serif,
            fontSize: 72,
            color: "#FAFAF7",
            lineHeight: 1.35,
            maxWidth: 1480,
            fontStyle: "italic",
          }}
        >
          {displayText}
          {showCursor && (
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 72,
                backgroundColor: theme2.primary,
                marginLeft: 6,
                verticalAlign: "text-bottom",
              }}
            />
          )}
        </div>

        {/* Author */}
        {author && (
          <div
            style={{
              position: "absolute",
              bottom: 120,
              right: 140,
              opacity: authorOpacity,
              fontFamily: theme2.mono,
              fontSize: 24,
              color: theme2.muted,
              textAlign: "right",
            }}
          >
            — {author}
          </div>
        )}
      </AbsoluteFill>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: lineWidth,
          height: 6,
          backgroundColor: theme2.primary,
        }}
      />
    </AbsoluteFill>
  );
};
