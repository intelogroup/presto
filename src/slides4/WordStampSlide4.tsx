// src/slides4/WordStampSlide4.tsx
// Words slam in one-by-one on a black background — typographic poster effect
// One optional "key word" index renders in red instead of white

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme4 } from "./theme4";

type Props = {
  words: string[];       // each word appears sequentially
  keyWordIndex?: number; // which word gets the red treatment
  caption?: string;      // small line at bottom
};

export const WordStampSlide4: React.FC<Props> = ({ words, keyWordIndex, caption }) => {
  const frame = useCurrentFrame();

  // Stagger: each word starts 10 frames after the previous
  const wordAnims = words.map((_, i) => {
    const start = i * 10;
    const scaleIn = interpolate(frame, [start, start + 8], [1.3, 1], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const opacity = interpolate(frame, [start, start + 8], [0, 1], { extrapolateRight: "clamp" });
    return { scaleIn, opacity };
  });

  // Caption fades in after all words
  const captionStart = words.length * 10 + 10;
  const captionOpacity = interpolate(frame, [captionStart, captionStart + 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Yellow underline on key word grows in
  const keyUnderlineW = keyWordIndex !== undefined
    ? interpolate(frame, [keyWordIndex * 10 + 8, keyWordIndex * 10 + 22], [0, 100], {
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme4.black,
        fontFamily: theme4.sans,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Red accent bar — left edge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 12,
          height: "100%",
          backgroundColor: theme4.red,
        }}
      />

      {/* Words laid out centered in a flex-wrap row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          gap: "0 28px",
          maxWidth: 1500,
          padding: "0 80px",
        }}
      >
        {words.map((word, i) => (
          <div key={i} style={{ position: "relative", display: "inline-block" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 110,
                fontWeight: 900,
                letterSpacing: -3,
                textTransform: "uppercase",
                lineHeight: 1.05,
                color: i === keyWordIndex ? theme4.red : theme4.white,
                opacity: wordAnims[i].opacity,
                transform: `scale(${wordAnims[i].scaleIn})`,
                transformOrigin: "center bottom",
              }}
            >
              {word}
            </span>
            {/* Yellow underline for key word */}
            {i === keyWordIndex && (
              <div
                style={{
                  position: "absolute",
                  bottom: -4,
                  left: 0,
                  width: `${keyUnderlineW}%`,
                  height: 8,
                  backgroundColor: theme4.yellow,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Caption */}
      {caption && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 100,
            opacity: captionOpacity,
            fontSize: 24,
            fontWeight: 600,
            color: theme4.yellow,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {caption}
        </div>
      )}
    </AbsoluteFill>
  );
};
