// src/slides3/BigStatSlide3.tsx
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme3 } from "./theme3";

type Props = {
  label: string;
  value: string;       // display string e.g. "$10M", "95%"
  numericValue: number; // drives animation 0 → numericValue
  unit?: string;
  trend: "up" | "down" | "neutral";
  caption?: string;
};

export const BigStatSlide3: React.FC<Props> = ({
  label,
  value,
  numericValue,
  unit = "",
  trend,
  caption,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animNum = interpolate(frame, [5, 55], [0, numericValue], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const numberScale = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const labelOpacity = interpolate(frame, [15, 40], [0, 1], { extrapolateRight: "clamp" });
  const labelY = interpolate(frame, [15, 40], [20, 0], { extrapolateRight: "clamp" });
  const captionOpacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" });

  const trendArrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  const trendColor = trend === "up" ? theme3.green : trend === "down" ? "#ef4444" : theme3.muted;

  // show animated number during count-up, switch to display string at end
  const showDisplay = animNum >= numericValue * 0.98;
  const displayNum = showDisplay
    ? value
    : `${unit}${Math.round(animNum).toLocaleString()}`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme3.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: theme3.sans,
        overflow: "hidden",
      }}
    >
      {/* corner accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 6,
          height: "100%",
          backgroundColor: theme3.green,
          opacity: 0.7,
        }}
      />

      <div style={{ textAlign: "center" }}>
        {/* label */}
        <div
          style={{
            opacity: labelOpacity,
            transform: `translateY(${labelY}px)`,
            fontSize: 28,
            fontWeight: 600,
            color: theme3.muted,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 30,
          }}
        >
          {label}
        </div>

        {/* big number */}
        <div
          style={{
            transform: `scale(${numberScale})`,
            display: "inline-block",
            fontSize: 260,
            fontWeight: 800,
            color: theme3.green,
            lineHeight: 1,
            letterSpacing: -8,
          }}
        >
          {displayNum}
        </div>

        {/* trend */}
        <div
          style={{
            marginTop: 20,
            fontSize: 52,
            fontWeight: 700,
            color: trendColor,
          }}
        >
          {trendArrow}
        </div>

        {/* caption */}
        {caption && (
          <div
            style={{
              opacity: captionOpacity,
              fontSize: 26,
              color: theme3.muted,
              marginTop: 16,
              maxWidth: 800,
              lineHeight: 1.5,
            }}
          >
            {caption}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
