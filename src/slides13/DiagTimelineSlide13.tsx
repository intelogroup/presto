// src/slides13/DiagTimelineSlide13.tsx
// P13 timeline — horizontal events above, diagonal accent strip at bottom

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme13 } from "./theme13";

type Event = { year: string; label: string };

type Props = {
  title: string;
  events: Event[];
  accent: string;
};

export const DiagTimelineSlide13: React.FC<Props> = ({ title, events, accent }) => {
  const frame = useCurrentFrame();

  // Title fade in frames 0-20
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Horizontal line grows width 0→100%, frames 8-35
  const lineProgress = interpolate(frame, [8, 35], [0, 100], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Dot scale 0→1, staggered frames 30+i*8
  const dotScales = events.map((_, i) =>
    interpolate(frame, [30 + i * 8, 40 + i * 8], [0, 1], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.5)),
    })
  );

  // Event labels fade in after dot, staggered
  const eventOpacities = events.map((_, i) =>
    interpolate(frame, [35 + i * 8, 48 + i * 8], [0, 1], { extrapolateRight: "clamp" })
  );

  // Bottom diagonal strip slides from translateY 100→0, frames 5-25
  const stripY = interpolate(frame, [5, 25], [100, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const eventCount = events.length;
  const eventsAreaLeft = 100;
  const eventsAreaRight = 100;
  const eventsAreaWidth = 1920 - eventsAreaLeft - eventsAreaRight;

  return (
    <AbsoluteFill style={{ backgroundColor: theme13.bg, overflow: "hidden" }}>
      {/* Bottom diagonal accent strip */}
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -200,
          width: 2400,
          height: 340,
          backgroundColor: accent,
          transform: `rotate(-4deg) translateY(${stripY}px)`,
          transformOrigin: "bottom left",
          zIndex: 1,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 100,
          right: 100,
          opacity: titleOpacity,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: theme13.serif,
            fontSize: 56,
            fontWeight: 400,
            color: theme13.navy,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>
      </div>

      {/* Timeline area */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: eventsAreaLeft,
          right: eventsAreaRight,
          height: 320,
          zIndex: 10,
        }}
      >
        {/* Horizontal connecting line */}
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 0,
            width: `${lineProgress}%`,
            height: 2,
            backgroundColor: theme13.navy,
          }}
        />

        {/* Events */}
        {events.map((event, i) => {
          const xPos = eventCount === 1 ? 0 : (i / (eventCount - 1)) * eventsAreaWidth;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: xPos,
                top: 0,
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Year */}
              <div
                style={{
                  opacity: eventOpacities[i],
                  fontFamily: theme13.serif,
                  fontSize: 48,
                  fontWeight: 700,
                  color: theme13.navy,
                  lineHeight: 1,
                }}
              >
                {event.year}
              </div>

              {/* Dot */}
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: accent,
                  transform: `scale(${dotScales[i]})`,
                  flexShrink: 0,
                }}
              />

              {/* Label */}
              <div
                style={{
                  opacity: eventOpacities[i],
                  fontFamily: theme13.sans,
                  fontSize: 16,
                  fontWeight: 400,
                  color: "#666",
                  textAlign: "center",
                  maxWidth: 160,
                  lineHeight: 1.4,
                }}
              >
                {event.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
