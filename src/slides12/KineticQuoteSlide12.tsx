// src/slides12/KineticQuoteSlide12.tsx
// P12 — Kinetic Quote: quote splits into 3 chunks entering from 3 different directions

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme12 } from "./theme12";

type Props = {
  quote: string;
  author: string;
};

function splitIntoChunks(text: string, n: number): string[] {
  const words = text.split(" ");
  const size = Math.ceil(words.length / n);
  const chunks: string[] = [];
  for (let i = 0; i < n; i++) {
    const chunk = words.slice(i * size, (i + 1) * size).join(" ");
    if (chunk) chunks.push(chunk);
  }
  return chunks;
}

export const KineticQuoteSlide12: React.FC<Props> = ({ quote, author }) => {
  const frame = useCurrentFrame();

  const chunks = splitIntoChunks(quote, 3);

  // Chunk 1: from left, frames 0-20
  const chunk1X = interpolate(frame, [0, 20], [-300, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const chunk1Opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Chunk 2: from right, frames 12-32
  const chunk2X = interpolate(frame, [12, 32], [300, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const chunk2Opacity = interpolate(frame, [12, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Chunk 3: from bottom, frames 24-44
  const chunk3Y = interpolate(frame, [24, 44], [200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const chunk3Opacity = interpolate(frame, [24, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Author: bottom-right, frames 50-65
  const authorOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chunkStyle: React.CSSProperties = {
    fontFamily: theme12.display,
    fontSize: 80,
    fontWeight: 900,
    color: theme12.white,
    lineHeight: 1.15,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: -2,
    maxWidth: 1600,
    margin: "0 auto",
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme12.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "0 160px",
      }}
    >
      {/* Chunk 1 — from left */}
      <div
        style={{
          ...chunkStyle,
          transform: `translateX(${chunk1X}px)`,
          opacity: chunk1Opacity,
          marginBottom: 16,
        }}
      >
        {chunks[0] ?? ""}
      </div>

      {/* Chunk 2 — from right */}
      <div
        style={{
          ...chunkStyle,
          transform: `translateX(${chunk2X}px)`,
          opacity: chunk2Opacity,
          marginBottom: 16,
          color: theme12.white,
        }}
      >
        {chunks[1] ?? ""}
      </div>

      {/* Chunk 3 — from bottom */}
      {chunks[2] && (
        <div
          style={{
            ...chunkStyle,
            transform: `translateY(${chunk3Y}px)`,
            opacity: chunk3Opacity,
          }}
        >
          {chunks[2]}
        </div>
      )}

      {/* Author — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 120,
          opacity: authorOpacity,
          fontFamily: theme12.display,
          fontSize: 20,
          fontWeight: 700,
          color: theme12.red,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        — {author}
      </div>
    </AbsoluteFill>
  );
};
