import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme5 } from "./theme5";

type AccentColor = "teal" | "blue" | "violet";

interface Segment {
  label: string;
  value: number;
  accent: AccentColor;
}

interface Props {
  title: string;
  segments: Segment[];
  centerLabel: string;
  centerValue: string;
}

const ACCENT_MAP: Record<AccentColor, string> = {
  teal: theme5.teal,
  blue: theme5.blue,
  violet: theme5.violet,
};

const SVG_SIZE = 480;
const CX = 240;
const CY = 240;
const RADIUS = 180;
const STROKE_WIDTH = 48;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const GlassDonutSlide5: React.FC<Props> = ({
  title,
  segments,
  centerLabel,
  centerValue,
}) => {
  const frame = useCurrentFrame();

  // Title fade in: frame 0 → 18
  const titleOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Center text fade in: frame 50 → 68
  const centerOpacity = interpolate(frame, [50, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  // Calculate each segment's arc length and offset
  let cumulativeOffset = 0;
  const segmentData = segments.map((seg) => {
    const arcLength = (seg.value / total) * CIRCUMFERENCE;
    const offset = cumulativeOffset;
    cumulativeOffset += arcLength;
    return { ...seg, arcLength, offset };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111827",
        fontFamily: theme5.sans,
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: -150,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme5.teal}33 0%, transparent 70%)`,
          filter: "blur(70px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -200,
          right: -150,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme5.violet}28 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 120,
          opacity: titleOpacity,
        }}
      >
        <h2
          style={{
            fontSize: 52,
            fontWeight: 600,
            color: theme5.white,
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>

      {/* Main layout: left = donut, right = legend */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 0,
          right: 0,
          bottom: 80,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* Left half — donut SVG */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            style={{ overflow: "visible" }}
          >
            {/* Background ring */}
            <circle
              cx={CX}
              cy={CY}
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={0}
            />

            {/* Animated segments */}
            {segmentData.map((seg, i) => {
              const segStart = 20 + i * 15;

              const animatedArcLength = interpolate(
                frame,
                [segStart, segStart + 30],
                [0, seg.arcLength],
                {
                  easing: Easing.out(Easing.cubic),
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }
              );

              const color = ACCENT_MAP[seg.accent];

              // SVG starts drawing at 3 o'clock; rotate -90deg to start at 12 o'clock
              // dashoffset: position = CIRCUMFERENCE - offset (because offset shrinks from full)
              const dashOffset = CIRCUMFERENCE - seg.offset;

              return (
                <circle
                  key={i}
                  cx={CX}
                  cy={CY}
                  r={RADIUS}
                  fill="none"
                  stroke={color}
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={`${animatedArcLength} ${CIRCUMFERENCE}`}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="butt"
                  transform={`rotate(-90, ${CX}, ${CY})`}
                  style={{
                    filter: `drop-shadow(0 0 8px ${color})`,
                  }}
                />
              );
            })}

            {/* Center label */}
            <text
              x={CX}
              y={CY - 14}
              textAnchor="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize={20}
              fontFamily={theme5.sans}
              letterSpacing={3}
              textDecoration="none"
              style={{ textTransform: "uppercase", opacity: centerOpacity }}
            >
              {centerLabel.toUpperCase()}
            </text>

            {/* Center value */}
            <text
              x={CX}
              y={CY + 44}
              textAnchor="middle"
              fill={theme5.white}
              fontSize={56}
              fontWeight={700}
              fontFamily={theme5.sans}
              style={{ opacity: centerOpacity }}
            >
              {centerValue}
            </text>
          </svg>
        </div>

        {/* Right half — legend */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 32,
            paddingLeft: 60,
            paddingRight: 120,
          }}
        >
          {segmentData.map((seg, i) => {
            const rowStart = 25 + i * 12;
            const color = ACCENT_MAP[seg.accent];
            const pct = Math.round((seg.value / total) * 100);

            const rowOpacity = interpolate(frame, [rowStart, rowStart + 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const rowX = interpolate(frame, [rowStart, rowStart + 18], [20, 0], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  opacity: rowOpacity,
                  transform: `translateX(${rowX}px)`,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                {/* Colored dot */}
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${color}`,
                  }}
                />

                {/* Label */}
                <div
                  style={{
                    flex: 1,
                    fontSize: 24,
                    color: theme5.white,
                  }}
                >
                  {seg.label}
                </div>

                {/* Percentage */}
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: color,
                    minWidth: 60,
                    textAlign: "right",
                  }}
                >
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
