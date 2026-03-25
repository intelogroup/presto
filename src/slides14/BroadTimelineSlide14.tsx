// src/slides14/BroadTimelineSlide14.tsx
// Newspaper "year in review" chronology — vertical timeline of dated events

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme14 } from "./theme14";

type Event = { date: string; headline: string; body?: string };

type Props = {
  section: string;
  headline: string;
  events: Event[];
};

const Masthead: React.FC = () => (
  <div style={{ width: "100%", paddingTop: 18 }}>
    <div style={{ width: "100%", height: 2, backgroundColor: theme14.red }} />
    <div
      style={{
        fontFamily: theme14.sans,
        fontSize: 11,
        letterSpacing: 3,
        textTransform: "uppercase" as const,
        color: theme14.ink,
        textAlign: "center" as const,
        paddingTop: 6,
        paddingBottom: 6,
      }}
    >
      The Meridian Report
    </div>
    <div style={{ width: "100%", height: 1, backgroundColor: theme14.red }} />
  </div>
);

const Footer: React.FC = () => (
  <div
    style={{
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      padding: "0 60px 14px",
    }}
  >
    <div style={{ width: "100%", height: 1, backgroundColor: theme14.ink, marginBottom: 8 }} />
    <div style={{ fontFamily: theme14.sans, fontSize: 10, color: theme14.ink, opacity: 0.6 }}>
      Vol. XIV · No. 29 · meridianreport.com
    </div>
  </div>
);

export const BroadTimelineSlide14: React.FC<Props> = ({ section, headline, events }) => {
  const frame = useCurrentFrame();

  const headlineY = interpolate(frame, [5, 20], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme14.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: "0 60px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Masthead />

        {/* Section */}
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              fontFamily: theme14.sans,
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase" as const,
              color: theme14.red,
              marginBottom: 6,
            }}
          >
            {section}
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontFamily: theme14.serif,
            fontSize: 50,
            fontWeight: 700,
            lineHeight: 1.1,
            color: theme14.ink,
            marginTop: 6,
            marginBottom: 10,
          }}
        >
          {headline}
        </div>

        {/* Rule */}
        <div style={{ width: "100%", height: 2, backgroundColor: theme14.ink, marginBottom: 10 }} />

        {/* Events list */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {events.map((event, i) => {
            const evOpacity = interpolate(frame, [15 + i * 8, 23 + i * 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div key={i} style={{ opacity: evOpacity }}>
                {/* Thin rule between events */}
                {i > 0 && (
                  <div
                    style={{
                      width: "100%",
                      height: 1,
                      backgroundColor: theme14.ink,
                      opacity: 0.25,
                      marginBottom: 10,
                    }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 10,
                    gap: 24,
                  }}
                >
                  {/* Date */}
                  <div
                    style={{
                      fontFamily: theme14.sans,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 2,
                      textTransform: "uppercase" as const,
                      color: theme14.red,
                      minWidth: 140,
                      paddingTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    {event.date}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: theme14.serif,
                        fontSize: 18,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: theme14.ink,
                        marginBottom: event.body ? 4 : 0,
                      }}
                    >
                      {event.headline}
                    </div>
                    {event.body && (
                      <div
                        style={{
                          fontFamily: theme14.serif,
                          fontSize: 13,
                          lineHeight: 1.6,
                          color: theme14.ink,
                          opacity: 0.8,
                        }}
                      >
                        {event.body}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </AbsoluteFill>
  );
};
