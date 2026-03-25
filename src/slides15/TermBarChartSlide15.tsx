// src/slides15/TermBarChartSlide15.tsx
// Terminal bar chart — block characters grow in per bar, staggered animation

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme15 } from "./theme15";

type Bar = { label: string; value: number; max: number };

type Props = {
  title: string;
  bars: Bar[];
};

function charsAt(text: string, frame: number, startFrame: number, speed = 2): string {
  const elapsed = Math.max(0, frame - startFrame);
  const count = Math.min(text.length, Math.floor(elapsed * speed));
  return text.slice(0, count);
}

function cursor(frame: number): string {
  return Math.floor(frame / 8) % 2 === 0 ? "█" : "";
}

const LABEL_WIDTH = 16;
const BAR_MAX_CHARS = 30;

export const TermBarChartSlide15: React.FC<Props> = ({ title, bars }) => {
  const frame = useCurrentFrame();

  // Title types in at frame 5, speed 3
  const titleTyped = charsAt(title, frame, 5, 3);
  const titleDone = titleTyped.length === title.length;
  const titleFinish = 5 + Math.ceil(title.length / 3);

  // Bars stagger: bar 0 at frame 20, bar 1 at 35, etc. (relative to titleFinish)
  const barStartFrames = bars.map((_, i) => titleFinish + 10 + i * 15);

  const barData = bars.map((bar, i) => {
    const startF = barStartFrames[i];
    const targetChars = Math.round((bar.value / bar.max) * BAR_MAX_CHARS);
    // Animate ▓ count from 0 to targetChars over 20 frames
    const filledChars = Math.round(
      interpolate(frame, [startF, startF + 20], [0, targetChars], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );
    const label = bar.label.padEnd(LABEL_WIDTH).slice(0, LABEL_WIDTH);
    const pct = `${bar.value}%`;
    return { label, filledChars, pct, startF };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme15.bg,
        fontFamily: theme15.mono,
        overflow: "hidden",
      }}
    >
      {/* Terminal header bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: theme15.green,
          opacity: 0.3,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          right: 80,
          bottom: 80,
          fontSize: 22,
          lineHeight: 1.9,
          color: theme15.white,
        }}
      >
        {/* Title / command */}
        <div>
          <span style={{ color: theme15.green }}>$ </span>
          <span style={{ color: theme15.white }}>{titleTyped}</span>
          {!titleDone && <span style={{ color: theme15.green }}>{cursor(frame)}</span>}
        </div>

        {/* Blank line */}
        {titleDone && <div>&nbsp;</div>}

        {/* Bars */}
        {titleDone && barData.map((bar, i) => {
          if (frame < bar.startF) return null;
          const blocks = "▓".repeat(bar.filledChars);
          return (
            <div key={i} style={{ whiteSpace: "pre" }}>
              <span style={{ color: theme15.dim }}>{bar.label}</span>
              <span style={{ color: theme15.white }}>│</span>
              <span style={{ color: theme15.green }}>{blocks}</span>
              <span style={{ color: theme15.amber }}>  {bar.pct}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
