// src/slides/TimelineSlide.tsx
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

type Milestone = { date: string; label: string; description: string };
type Props = { title: string; milestones: Milestone[] };

export const TimelineSlide: React.FC<Props> = ({ title, milestones }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const lineScale = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, padding: 100, color: theme.text, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 80, borderBottom: `4px solid ${theme.primary}`, paddingBottom: 20, marginBottom: 0, opacity: titleOpacity }}>
        {title}
      </h1>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Central line */}
        <div style={{ position: "relative", height: 6, backgroundColor: theme.card }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "100%", backgroundColor: theme.primary, transformOrigin: "left center", transform: `scaleX(${lineScale})` }} />
        </div>

        {/* Milestones */}
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          {milestones.map((m, i) => {
            const startFrame = 30 + i * 20;
            const dotScale = spring({ frame: frame - startFrame, fps, config: { damping: 12 } });
            const dotVisible = frame >= startFrame;
            const labelOpacity = interpolate(frame, [startFrame + 10, startFrame + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const labelY = interpolate(frame, [startFrame + 10, startFrame + 25], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: `${100 / milestones.length}%` }}>
                <div style={{ fontSize: 28, color: theme.primary, marginBottom: 20, opacity: labelOpacity, transform: `translateY(${-labelY}px)` }}>
                  {m.date}
                </div>
                <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: theme.primary, border: `4px solid ${theme.bg}`, marginTop: -19, transform: `scale(${dotVisible ? dotScale : 0})`, zIndex: 2 }} />
                <div style={{ textAlign: "center", marginTop: 20, opacity: labelOpacity, transform: `translateY(${labelY}px)` }}>
                  <div style={{ fontSize: 34, fontWeight: "bold", marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 26, color: theme.muted }}>{m.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
