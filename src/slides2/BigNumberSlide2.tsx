// src/slides2/BigNumberSlide2.tsx
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme2 } from "./theme2";

type Props = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sublabel?: string;
  dark?: boolean; // alternate dark background version
};

export const BigNumberSlide2: React.FC<Props> = ({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  label,
  sublabel,
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bg = dark ? theme2.split : theme2.bg;
  const textColor = dark ? "#FAFAF7" : theme2.text;

  // Number counts up with spring easing
  const animValue = interpolate(frame, [5, 90], [0, value], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const displayValue =
    decimals > 0 ? animValue.toFixed(decimals) : Math.round(animValue).toLocaleString();

  // Red horizontal rule grows left-to-right
  const ruleWidth = interpolate(frame, [0, 30], [0, 700], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  // Number scale in
  const scaleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });

  // Label slides up
  const labelY = interpolate(frame, [20, 50], [40, 0], { extrapolateRight: "clamp" });
  const labelOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });

  // Sublabel
  const sublabelOpacity = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: "clamp" });

  // Background vertical stripe (decorative)
  const stripeOpacity = interpolate(frame, [0, 20], [0, 0.06], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      {/* Decorative background stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          width: "80%",
          height: "100%",
          backgroundColor: dark ? "#FAFAF7" : theme2.split,
          opacity: stripeOpacity,
        }}
      />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          {/* Red rule above number */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <div
              style={{
                width: ruleWidth,
                height: 6,
                backgroundColor: theme2.primary,
                borderRadius: 2,
              }}
            />
          </div>

          {/* The number */}
          <div
            style={{
              transform: `scale(${scaleSpring})`,
              display: "inline-block",
              fontFamily: theme2.mono,
              fontSize: 280,
              fontWeight: "bold",
              color: theme2.primary,
              lineHeight: 1,
              letterSpacing: -8,
            }}
          >
            {prefix}{displayValue}{suffix}
          </div>

          {/* Label */}
          <div
            style={{
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
              fontFamily: theme2.serif,
              fontSize: 44,
              color: textColor,
              marginTop: 40,
              maxWidth: 900,
              lineHeight: 1.3,
              fontStyle: "italic",
            }}
          >
            {label}
          </div>

          {/* Sublabel */}
          {sublabel && (
            <div
              style={{
                opacity: sublabelOpacity,
                fontFamily: theme2.mono,
                fontSize: 22,
                color: theme2.muted,
                marginTop: 20,
                letterSpacing: 2,
              }}
            >
              {sublabel}
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* Corner decoration */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 80,
          fontFamily: theme2.mono,
          fontSize: 16,
          color: theme2.muted,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: sublabelOpacity,
        }}
      >
        DATA POINT
      </div>
    </AbsoluteFill>
  );
};
