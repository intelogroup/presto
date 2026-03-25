// src/slides8/MinimalIconFeaturesSlide8.tsx
// Clean Minimalist — icon + text feature rows, staggered slide-in from left

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme8 } from "./theme8";
import { resolveIcon } from "../iconMap";

type Feature = {
  iconName: string;
  title: string;
  body: string;
};

type Props = {
  headline: string;
  features: [Feature, Feature, Feature];
};

export const MinimalIconFeaturesSlide8: React.FC<Props> = ({ headline, features }) => {
  const frame = useCurrentFrame();

  // Headline slides down: translateY -24→0, frame 0→20
  const headlineY = interpolate(frame, [0, 20], [-24, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Thin rule grows frame 18→36 to 320px
  const ruleW = interpolate(frame, [18, 36], [0, 320], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Row animations: row i starts frame 28 + i*16, animates over 20 frames
  const rowAnims = features.map((_, i) => {
    const start = 28 + i * 16;
    return {
      opacity: interpolate(frame, [start, start + 20], [0, 1], { extrapolateRight: "clamp" }),
      x: interpolate(frame, [start, start + 20], [-40, 0], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      }),
    };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme8.bg,
        fontFamily: theme8.sans,
        overflow: "hidden",
      }}
    >
      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 160,
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          fontSize: 64,
          fontWeight: 700,
          color: theme8.charcoal,
          letterSpacing: -2,
          lineHeight: 1.1,
        }}
      >
        {headline}
      </div>

      {/* Thin 2px rule under headline */}
      <div
        style={{
          position: "absolute",
          top: 192,
          left: 160,
          width: ruleW,
          height: 2,
          backgroundColor: theme8.charcoal,
        }}
      />

      {/* Feature rows */}
      <div
        style={{
          position: "absolute",
          top: 272,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          paddingLeft: 160,
          paddingRight: 160,
          boxSizing: "border-box",
        }}
      >
        {features.map((feature, i) => {
          const Icon = resolveIcon(feature.iconName);
          const isLast = i === features.length - 1;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 48,
                padding: "48px 0",
                borderBottom: isLast ? "none" : "1px solid #E5E7EB",
                opacity: rowAnims[i].opacity,
                transform: `translateX(${rowAnims[i].x}px)`,
              }}
            >
              {/* Icon container */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: "#F3F4F6",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={32} color="#1A1A1A" />
              </div>

              {/* Text block */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: theme8.charcoal,
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}
                >
                  {feature.title}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 400,
                    color: "#6B7280",
                    lineHeight: 1.6,
                    maxWidth: 900,
                  }}
                >
                  {feature.body}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
