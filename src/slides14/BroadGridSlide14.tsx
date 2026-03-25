// src/slides14/BroadGridSlide14.tsx
// 3-column feature grid — kicker, title, body per column

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme14 } from "./theme14";

type GridItem = { kicker: string; title: string; body: string };

type Props = {
  section: string;
  headline: string;
  items: GridItem[];
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

export const BroadGridSlide14: React.FC<Props> = ({ section, headline, items }) => {
  const frame = useCurrentFrame();

  const headlineY = interpolate(frame, [5, 22], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [5, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const translateXValues = [-60, 0, 60];

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
            fontSize: 54,
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
        <div style={{ width: "100%", height: 2, backgroundColor: theme14.ink, marginBottom: 20 }} />

        {/* 3-column grid */}
        <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden" }}>
          {items.slice(0, 3).map((item, i) => {
            const colOpacity = interpolate(frame, [22 + i * 8, 40 + i * 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const colX = interpolate(frame, [22 + i * 8, 40 + i * 8], [translateXValues[i], 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });

            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div
                    style={{
                      width: 1,
                      backgroundColor: theme14.ink,
                      opacity: 0.3,
                      margin: "0 24px",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div
                  style={{
                    flex: 1,
                    opacity: colOpacity,
                    transform: `translateX(${colX}px)`,
                  }}
                >
                  {/* Kicker */}
                  <div
                    style={{
                      fontFamily: theme14.sans,
                      fontSize: 10,
                      letterSpacing: 3,
                      textTransform: "uppercase" as const,
                      color: theme14.red,
                      marginBottom: 8,
                    }}
                  >
                    {item.kicker}
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontFamily: theme14.serif,
                      fontSize: 20,
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: theme14.ink,
                      marginBottom: 10,
                    }}
                  >
                    {item.title}
                  </div>

                  {/* Rule under title */}
                  <div style={{ width: "100%", height: 1, backgroundColor: theme14.ink, opacity: 0.3, marginBottom: 10 }} />

                  {/* Body */}
                  <div
                    style={{
                      fontFamily: theme14.serif,
                      fontSize: 13,
                      lineHeight: 1.7,
                      color: theme14.ink,
                    }}
                  >
                    {item.body}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <Footer />
    </AbsoluteFill>
  );
};
