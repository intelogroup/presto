// src/slides/QuoteSlide.tsx
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

type Props = { quote: string; author: string; role?: string };

export const QuoteSlide: React.FC<Props> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const quoteMarkScale = spring({ frame, fps, config: { damping: 14 } });
  const words = quote.split(" ");
  const lastWordStart = words.length * 3;
  const authorOpacity = interpolate(frame, [lastWordStart + 20, lastWordStart + 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, padding: 140, color: theme.text, fontFamily: "sans-serif", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ fontSize: 240, color: theme.primary, lineHeight: 0.6, marginBottom: 40, transform: `scale(${quoteMarkScale})`, transformOrigin: "left top", fontFamily: "Georgia, serif", opacity: 0.4 }}>
        "
      </div>
      <div style={{ fontSize: 64, lineHeight: 1.5, fontStyle: "italic" }}>
        {words.map((word, i) => {
          const wordOpacity = interpolate(frame, [i * 3, i * 3 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <span key={i} style={{ opacity: wordOpacity }}>{word}{" "}</span>;
        })}
      </div>
      <div style={{ marginTop: 60, opacity: authorOpacity }}>
        <div style={{ fontSize: 44, fontWeight: "bold", color: theme.primary }}>— {author}</div>
        {role && <div style={{ fontSize: 34, color: theme.muted, marginTop: 10 }}>{role}</div>}
      </div>
    </AbsoluteFill>
  );
};
