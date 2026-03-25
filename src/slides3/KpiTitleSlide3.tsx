// src/slides3/KpiTitleSlide3.tsx
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme3 } from "./theme3";

type Props = {
  title: string;
  tagline: string;
  badge?: string;
};

export const KpiTitleSlide3: React.FC<Props> = ({ title, tagline, badge }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleScale = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const taglineY = interpolate(frame, [20, 45], [30, 0], { extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: "clamp" });

  // animated green underline grows left to right
  const underlineWidth = interpolate(frame, [10, 40], [0, 420], {
    extrapolateRight: "clamp",
  });

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
      {/* subtle grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {badge && (
          <div
            style={{
              opacity: badgeOpacity,
              display: "inline-block",
              backgroundColor: theme3.green,
              color: "#000",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              padding: "6px 20px",
              borderRadius: 4,
              marginBottom: 36,
            }}
          >
            {badge}
          </div>
        )}

        <div
          style={{
            transform: `scale(${titleScale})`,
            display: "inline-block",
            fontSize: 110,
            fontWeight: 800,
            color: theme3.text,
            lineHeight: 1.1,
            letterSpacing: -3,
            maxWidth: 1400,
          }}
        >
          {title}
        </div>

        {/* green underline */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20, marginBottom: 28 }}>
          <div
            style={{
              width: underlineWidth,
              height: 5,
              backgroundColor: theme3.green,
              borderRadius: 3,
            }}
          />
        </div>

        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            fontSize: 44,
            color: theme3.green,
            fontWeight: 500,
          }}
        >
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
