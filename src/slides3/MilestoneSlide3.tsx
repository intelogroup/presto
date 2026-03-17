// src/slides3/MilestoneSlide3.tsx
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme3 } from "./theme3";
import { resolveIcon } from "../iconMap";

type Props = {
  icon: string;       // Lucide icon name from iconMap
  headline: string;
  caption: string;
  year?: string;
};

export const MilestoneSlide3: React.FC<Props> = ({ icon, headline, caption, year }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconScale = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const headlineY = interpolate(frame, [15, 40], [30, 0], { extrapolateRight: "clamp" });
  const headlineOpacity = interpolate(frame, [15, 40], [0, 1], { extrapolateRight: "clamp" });
  const captionOpacity = interpolate(frame, [35, 55], [0, 1], { extrapolateRight: "clamp" });

  // resolveIcon always returns a valid LucideIcon (falls back to Zap for unknown
  // names — see iconMap.ts line 16: `return ICON_MAP[name] ?? Zap`). No null guard needed.
  const IconComponent = resolveIcon(icon);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme3.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: theme3.sans,
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* year badge — top right */}
      {year && (
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 80,
            fontSize: 20,
            fontWeight: 700,
            color: theme3.green,
            letterSpacing: 3,
            textTransform: "uppercase",
            border: `2px solid ${theme3.green}`,
            padding: "8px 20px",
            borderRadius: 6,
          }}
        >
          {year}
        </div>
      )}

      {/* icon */}
      <div
        style={{
          transform: `scale(${iconScale})`,
          backgroundColor: "rgba(34,197,94,0.12)",
          borderRadius: "50%",
          width: 140,
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 50,
          border: `2px solid ${theme3.green}`,
        }}
      >
        <IconComponent size={64} color={theme3.green} />
      </div>

      {/* headline */}
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          fontSize: 80,
          fontWeight: 800,
          color: theme3.text,
          letterSpacing: -2,
          textAlign: "center",
          maxWidth: 1200,
          lineHeight: 1.1,
        }}
      >
        {headline}
      </div>

      {/* caption */}
      <div
        style={{
          opacity: captionOpacity,
          fontSize: 34,
          color: theme3.muted,
          marginTop: 28,
          textAlign: "center",
          maxWidth: 800,
          lineHeight: 1.5,
        }}
      >
        {caption}
      </div>
    </AbsoluteFill>
  );
};
