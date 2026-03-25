// src/slides17/TitleSlide17.tsx
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme17 } from "./theme17";

interface Props {
  title: string;
  subtitle?: string;
  course?: string;
}

export const TitleSlide17: React.FC<Props> = ({ title, subtitle, course }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineW = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [20, 45], [30, 0], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: "clamp" });
  const courseOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme17.bg,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 120,
        paddingRight: 120,
      }}
    >
      {/* Vertical gold bar accent */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 8,
          backgroundColor: theme17.gold,
        }}
      />

      {/* Top corner ornament */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 120,
          opacity: courseOpacity,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ width: 40, height: 2, backgroundColor: theme17.gold }} />
        <span
          style={{
            fontFamily: theme17.body,
            fontSize: 22,
            color: theme17.gold,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          {course ?? "Course Introduction"}
        </span>
      </div>

      <div style={{ maxWidth: 1100 }}>
        {/* Horizontal divider line (animated width) */}
        <div
          style={{
            width: `${lineW * 100}%`,
            height: 2,
            backgroundColor: theme17.gold,
            marginBottom: 48,
          }}
        />

        {/* Main title */}
        <h1
          style={{
            fontFamily: theme17.display,
            fontSize: 110,
            fontWeight: "normal",
            color: theme17.text,
            margin: 0,
            lineHeight: 1.05,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              fontFamily: theme17.body,
              fontSize: 36,
              color: theme17.textMuted,
              margin: "40px 0 0",
              opacity: subtitleOpacity,
              letterSpacing: "0.04em",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom right decoration */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 120,
          opacity: subtitleOpacity,
          textAlign: "right",
        }}
      >
        <div style={{ width: 60, height: 60, border: `2px solid ${theme17.border}`, borderRadius: "50%", marginLeft: "auto" }} />
      </div>
    </AbsoluteFill>
  );
};
