import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme7 } from "./theme7";
import { GridBg7 } from "./GridBg7";
import { resolveIcon } from "../iconMap";

type AccentColor = "cyan" | "magenta" | "green";

type Props = {
  title: string;
  items: Array<{
    iconName: string;
    label: string;
    value?: string;
    accent: AccentColor;
  }>; // 6 items (2 rows × 3 cols)
};

const ACCENT_COLORS: Record<AccentColor, string> = {
  cyan: "#00F0FF",
  magenta: "#FF00FF",
  green: "#00FF88",
};

export const CyberIconGridSlide7: React.FC<Props> = ({ title, items }) => {
  const frame = useCurrentFrame();

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cyan scanline rule grows frame 12→28
  const ruleScaleX = interpolate(frame, [12, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme7.bg }}>
      <GridBg7 />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          fontFamily: theme7.mono,
          fontSize: 36,
          color: theme7.cyan,
          opacity: titleOpacity,
          letterSpacing: 1,
          textShadow: `0 0 16px ${theme7.cyan}`,
        }}
      >
        {title}
      </div>

      {/* Scanline rule */}
      <div
        style={{
          position: "absolute",
          top: 128,
          left: 80,
          right: 80,
          height: 1,
          backgroundColor: theme7.cyan,
          transformOrigin: "left center",
          transform: `scaleX(${ruleScaleX})`,
          boxShadow: `0 0 8px rgba(0,240,255,0.5)`,
        }}
      />

      {/* 2×3 Grid */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 80,
          right: 80,
          bottom: 60,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 24,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {items.map((item, i) => {
          const accentColor = ACCENT_COLORS[item.accent];
          const boxStartFrame = 20 + i * 8;

          const boxOpacity = interpolate(
            frame,
            [boxStartFrame, boxStartFrame + 16],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const boxScale = interpolate(
            frame,
            [boxStartFrame, boxStartFrame + 16],
            [0.9, 1.0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          const Icon = resolveIcon(item.iconName);

          return (
            <div
              key={i}
              style={{
                border: `1px solid ${accentColor}`,
                borderRadius: 8,
                padding: 40,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                backgroundColor:
                  item.accent === "cyan"
                    ? "rgba(0,240,255,0.05)"
                    : item.accent === "magenta"
                    ? "rgba(255,0,255,0.05)"
                    : "rgba(0,255,136,0.05)",
                boxShadow: `0 0 20px rgba(${
                  item.accent === "cyan"
                    ? "0,240,255"
                    : item.accent === "magenta"
                    ? "255,0,255"
                    : "0,255,136"
                },0.15), inset 0 0 20px rgba(${
                  item.accent === "cyan"
                    ? "0,240,255"
                    : item.accent === "magenta"
                    ? "255,0,255"
                    : "0,255,136"
                },0.05)`,
                opacity: boxOpacity,
                transform: `scale(${boxScale})`,
              }}
            >
              {/* Icon */}
              <Icon
                size={48}
                color={accentColor}
                style={{
                  filter: `drop-shadow(0 0 8px ${accentColor})`,
                }}
              />

              {/* Label */}
              <div
                style={{
                  fontFamily: theme7.mono,
                  fontSize: 20,
                  color: theme7.white,
                  letterSpacing: 2,
                  textTransform: "uppercase" as const,
                  marginTop: 16,
                }}
              >
                {item.label}
              </div>

              {/* Value */}
              {item.value && (
                <div
                  style={{
                    fontFamily: theme7.mono,
                    fontSize: 32,
                    fontWeight: 700,
                    color: accentColor,
                    marginTop: 8,
                    textShadow: `0 0 12px ${accentColor}`,
                  }}
                >
                  {item.value}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
