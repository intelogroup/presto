import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme7 } from "./theme7";
import { GridBg7 } from "./GridBg7";

interface Bar {
  label: string;
  value: number; // 0–100
}

interface Props {
  title: string;
  bars: Bar[];
}

const MAX_BAR_HEIGHT = 400;

export const CyberBarSlide7: React.FC<Props> = ({ title, bars }) => {
  const frame = useCurrentFrame();

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Baseline grows
  const baselineScaleX = interpolate(frame, [15, 25], [0, 1], {
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
          top: 80,
          left: 80,
          fontFamily: theme7.mono,
          fontSize: 40,
          color: theme7.cyan,
          opacity: titleOpacity,
          letterSpacing: 1,
        }}
      >
        {title}
      </div>

      {/* Chart area */}
      <div
        style={{
          position: "absolute",
          top: 160,
          bottom: 120,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {/* Bars row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 32,
            paddingBottom: 0,
          }}
        >
          {bars.map((bar, i) => {
            const startFrame = 20 + i * 8;
            const endFrame = startFrame + 30;

            const barH = interpolate(
              frame,
              [startFrame, endFrame],
              [0, (bar.value / 100) * MAX_BAR_HEIGHT],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );

            const barOpacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const valueOpacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 80,
                }}
              >
                {/* Value label above bar */}
                <div
                  style={{
                    fontFamily: theme7.mono,
                    fontSize: 22,
                    color: theme7.cyan,
                    opacity: valueOpacity,
                    marginBottom: 8,
                    textShadow: `0 0 10px rgba(0,240,255,0.5)`,
                    minHeight: 30,
                  }}
                >
                  {bar.value}
                </div>

                {/* Bar */}
                <div
                  style={{
                    width: 80,
                    height: barH,
                    background: `linear-gradient(to bottom, ${theme7.cyan}, rgba(0,240,255,0.3))`,
                    borderRadius: "4px 4px 0 0",
                    opacity: barOpacity,
                    boxShadow: `0 0 20px rgba(0,240,255,0.5), 0 -4px 20px rgba(0,240,255,0.3)`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Baseline */}
        <div
          style={{
            height: 2,
            backgroundColor: theme7.cyan,
            transformOrigin: "left center",
            transform: `scaleX(${baselineScaleX})`,
            boxShadow: `0 0 8px rgba(0,240,255,0.5)`,
            marginTop: 0,
          }}
        />

        {/* Bar labels below baseline */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 32,
            marginTop: 12,
          }}
        >
          {bars.map((bar, i) => {
            const startFrame = 20 + i * 8;
            const labelOpacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  width: 80,
                  fontFamily: theme7.mono,
                  fontSize: 16,
                  color: theme7.muted,
                  letterSpacing: 1,
                  opacity: labelOpacity,
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {bar.label}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
