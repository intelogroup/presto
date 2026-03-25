import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import React from "react";
import { theme6 } from "./theme6";

type Props = {
  src: string;
  title: string;
  caption?: string;
  overlay?: string;
};

export const CinemaImageFullSlide6: React.FC<Props> = ({ src, title, caption, overlay }) => {
  const frame = useCurrentFrame();

  // Top letterbox bar slides down: translateY -80→0, frame 0→20
  const topBarY = interpolate(frame, [0, 20], [-80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Bottom letterbox bar slides up: translateY 120→0, frame 0→20
  const bottomBarY = interpolate(frame, [0, 20], [120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Gold left-accent rule fades in, frame 18→32
  const accentOpacity = interpolate(frame, [18, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title slides up: translateY 30→0, frame 22→48
  const titleY = interpolate(frame, [22, 48], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [22, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Caption fades in, frame 40→58
  const captionOpacity = interpolate(frame, [40, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme6.bg, overflow: "hidden" }}>
      {/* Full-bleed image */}
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* Top letterbox bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          backgroundColor: "#0A0A0A",
          transform: `translateY(${topBarY}px)`,
          display: "flex",
          alignItems: "center",
        }}
      >
        {overlay && (
          <div
            style={{
              marginLeft: 120,
              fontFamily: theme6.sans,
              fontSize: 13,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: theme6.gold,
            }}
          >
            {overlay}
          </div>
        )}
      </div>

      {/* Bottom letterbox bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          backgroundColor: "#0A0A0A",
          transform: `translateY(${bottomBarY}px)`,
        }}
      />

      {/* Content block */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 120,
          right: 120,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        {/* Gold left-accent rule */}
        <div
          style={{
            width: 4,
            height: 60,
            backgroundColor: theme6.gold,
            marginRight: 32,
            flexShrink: 0,
            opacity: accentOpacity,
            marginTop: 4,
          }}
        />

        <div style={{ flex: 1 }}>
          {/* Title */}
          <div
            style={{
              fontFamily: theme6.serif,
              fontSize: 64,
              fontWeight: 400,
              color: "#F0EDE6",
              lineHeight: 1.15,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
            }}
          >
            {title}
          </div>

          {/* Caption */}
          {caption && (
            <div
              style={{
                fontFamily: theme6.sans,
                fontSize: 26,
                color: "rgba(240,237,230,0.65)",
                fontStyle: "italic",
                marginTop: 16,
                opacity: captionOpacity,
              }}
            >
              {caption}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
