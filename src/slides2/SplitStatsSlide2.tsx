// src/slides2/SplitStatsSlide2.tsx
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme2 } from "./theme2";

type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

type Props = {
  title: string;
  stats: [Stat, Stat, Stat, Stat]; // 2 left, 2 right
};

const AnimatedStat: React.FC<{
  stat: Stat;
  startFrame: number;
  numberColor: string;
  textColor: string;
}> = ({ stat, startFrame, numberColor, textColor }) => {
  const frame = useCurrentFrame();

  const animValue = interpolate(frame, [startFrame, startFrame + 80], [0, stat.value], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const displayValue =
    (stat.decimals ?? 0) > 0
      ? animValue.toFixed(stat.decimals)
      : Math.round(animValue).toLocaleString();

  const opacity = interpolate(frame, [startFrame - 10, startFrame + 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [startFrame - 10, startFrame + 20], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        marginBottom: 60,
      }}
    >
      <div
        style={{
          fontFamily: theme2.mono,
          fontSize: 110,
          fontWeight: "bold",
          color: numberColor,
          lineHeight: 1,
          letterSpacing: -4,
        }}
      >
        {stat.prefix ?? ""}{displayValue}{stat.suffix ?? ""}
      </div>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 26,
          color: textColor,
          lineHeight: 1.4,
          marginTop: 12,
          maxWidth: 380,
          opacity: 0.8,
        }}
      >
        {stat.label}
      </div>
    </div>
  );
};

export const SplitStatsSlide2: React.FC<Props> = ({ title, stats }) => {
  const frame = useCurrentFrame();

  // Left panel slides in from left
  const leftX = interpolate(frame, [0, 30], [-960, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  // Right panel slides in from right
  const rightX = interpolate(frame, [8, 38], [960, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  // Title
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme2.bg, overflow: "hidden" }}>
      {/* Title bar at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          backgroundColor: theme2.split,
          display: "flex",
          alignItems: "center",
          paddingLeft: 100,
          opacity: titleOpacity,
          zIndex: 5,
        }}
      >
        <div
          style={{
            fontFamily: theme2.mono,
            fontSize: 22,
            color: theme2.muted,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
        {/* Red accent */}
        <div
          style={{
            width: 40,
            height: 4,
            backgroundColor: theme2.primary,
            marginLeft: 30,
            borderRadius: 2,
          }}
        />
      </div>

      {/* Two panels */}
      <div style={{ display: "flex", flexDirection: "row", height: "100%", paddingTop: 100 }}>
        {/* Left — cream */}
        <div
          style={{
            width: "50%",
            height: "100%",
            backgroundColor: theme2.bg,
            padding: "80px 80px 60px 100px",
            transform: `translateX(${leftX}px)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <AnimatedStat stat={stats[0]} startFrame={25} numberColor={theme2.primary} textColor={theme2.text} />
          <AnimatedStat stat={stats[1]} startFrame={50} numberColor={theme2.primary} textColor={theme2.text} />
        </div>

        {/* Divider */}
        <div
          style={{
            width: 2,
            backgroundColor: theme2.muted,
            opacity: 0.2,
            margin: "100px 0 40px",
          }}
        />

        {/* Right — dark */}
        <div
          style={{
            flex: 1,
            backgroundColor: theme2.split,
            padding: "80px 100px 60px 80px",
            transform: `translateX(${rightX}px)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <AnimatedStat stat={stats[2]} startFrame={35} numberColor={theme2.primary} textColor="#FAFAF7" />
          <AnimatedStat stat={stats[3]} startFrame={60} numberColor={theme2.primary} textColor="#FAFAF7" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
