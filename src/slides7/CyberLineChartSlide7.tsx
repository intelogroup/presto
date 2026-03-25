import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme7 } from "./theme7";
import { GridBg7 } from "./GridBg7";

type Props = {
  title: string;
  points: Array<{ label: string; value: number }>; // 4-7 points, values 0-100
  yLabel?: string; // e.g. "$M ARR"
  accent: "cyan" | "magenta" | "green";
};

const ACCENT_COLORS: Record<Props["accent"], string> = {
  cyan: "#00F0FF",
  magenta: "#FF00FF",
  green: "#00FF88",
};

// Chart geometry
const SVG_W = 1400;
const SVG_H = 500;
const CHART_X1 = 80;
const CHART_X2 = 1360;
const CHART_Y1 = 40;
const CHART_Y2 = 460;

export const CyberLineChartSlide7: React.FC<Props> = ({
  title,
  points,
  yLabel,
  accent,
}) => {
  const frame = useCurrentFrame();
  const accentColor = ACCENT_COLORS[accent];

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Compute chart coords
  const maxVal = Math.max(...points.map((p) => p.value), 1);
  const minVal = 0;
  const chartW = CHART_X2 - CHART_X1;
  const chartH = CHART_Y2 - CHART_Y1;

  const toX = (i: number) =>
    CHART_X1 + (i / (points.length - 1)) * chartW;
  const toY = (v: number) =>
    CHART_Y2 - ((v - minVal) / (maxVal - minVal)) * chartH;

  // Build path string
  const coords = points.map((p, i) => ({ x: toX(i), y: toY(p.value) }));
  const linePath =
    coords.length > 0
      ? coords
          .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
          .join(" ")
      : "";

  // Area fill path (close at bottom)
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${CHART_Y2} L ${coords[0].x} ${CHART_Y2} Z`
      : "";

  // Estimate total path length for dasharray animation
  let totalLength = 0;
  for (let i = 1; i < coords.length; i++) {
    const dx = coords[i].x - coords[i - 1].x;
    const dy = coords[i].y - coords[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }

  const dashOffset = interpolate(frame, [20, 80], [totalLength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Y-axis gridlines & labels — 5 steps
  const ySteps = 5;
  const yGridLines = Array.from({ length: ySteps }, (_, i) => {
    const fraction = i / (ySteps - 1);
    const val = Math.round(minVal + fraction * (maxVal - minVal));
    const yPos = CHART_Y2 - fraction * chartH;
    return { val, yPos };
  });

  // Status bar values
  const rangeMin = Math.min(...points.map((p) => p.value));
  const rangeMax = Math.max(...points.map((p) => p.value));

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
          fontSize: 40,
          color: accentColor,
          opacity: titleOpacity,
          letterSpacing: 1,
          textShadow: `0 0 16px ${accentColor}`,
        }}
      >
        {title}
      </div>

      {/* Y-axis label */}
      {yLabel && (
        <div
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            fontFamily: theme7.mono,
            fontSize: 18,
            color: theme7.muted,
            whiteSpace: "nowrap",
            transformOrigin: "center center",
          }}
        >
          {yLabel}
        </div>
      )}

      {/* SVG Chart */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ overflow: "visible" }}
        >
          {/* Horizontal gridlines */}
          {yGridLines.map(({ yPos, val }, i) => (
            <g key={i}>
              <line
                x1={CHART_X1}
                y1={yPos}
                x2={CHART_X2}
                y2={yPos}
                stroke="rgba(0,240,255,0.1)"
                strokeWidth={1}
              />
              <text
                x={CHART_X1 - 10}
                y={yPos + 5}
                textAnchor="end"
                fontFamily={theme7.mono}
                fontSize={16}
                fill={theme7.muted}
              >
                {val}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path
            d={areaPath}
            fill={accentColor}
            fillOpacity={0.08}
          />

          {/* Animated line */}
          <path
            d={linePath}
            stroke={accentColor}
            strokeWidth={3}
            fill="none"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOffset}
            style={{
              filter: `drop-shadow(0 0 8px ${accentColor})`,
            }}
          />

          {/* X-axis labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={toX(i)}
              y={CHART_Y2 + 36}
              textAnchor="middle"
              fontFamily={theme7.mono}
              fontSize={18}
              fill={theme7.muted}
            >
              {p.label}
            </text>
          ))}

          {/* Dots at each data point */}
          {points.map((p, i) => {
            const dotStartFrame = 20 + i * (60 / points.length);
            const dotOpacity = interpolate(
              frame,
              [dotStartFrame, dotStartFrame + 10],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <circle
                key={i}
                cx={toX(i)}
                cy={toY(p.value)}
                r={8}
                fill={accentColor}
                opacity={dotOpacity}
                style={{
                  filter: `drop-shadow(0 0 8px ${accentColor})`,
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Status bar */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 80,
          fontFamily: theme7.mono,
          fontSize: 14,
          color: theme7.muted,
          letterSpacing: 2,
        }}
      >
        {`DATA_POINTS: ${points.length} // RANGE: ${rangeMin}-${rangeMax}`}
      </div>
    </AbsoluteFill>
  );
};
