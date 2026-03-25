// src/slides14/BroadStatsSlide14.tsx
// Key financial figures in newspaper broadsheet stat layout

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme14 } from "./theme14";

type Stat = { value: string; label: string; delta?: string };

type Props = {
  section: string;
  headline: string;
  stats: Stat[];
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

const FakeTextLines: React.FC<{ opacity: number }> = ({ opacity }) => {
  const widths = [100, 88, 94, 76, 100, 83, 91, 69];
  return (
    <div style={{ opacity }}>
      {widths.map((w, i) => (
        <div
          key={i}
          style={{
            height: 8,
            backgroundColor: "rgba(0,0,0,0.12)",
            marginBottom: 6,
            width: `${w}%`,
          }}
        />
      ))}
    </div>
  );
};

export const BroadStatsSlide14: React.FC<Props> = ({ section, headline, stats }) => {
  const frame = useCurrentFrame();

  const headlineY = interpolate(frame, [5, 22], [-25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [5, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bodyOpacity = interpolate(frame, [50, 65], [0, 1], {
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

        {/* Section label */}
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
            marginTop: 8,
            marginBottom: 10,
          }}
        >
          {headline}
        </div>

        {/* 2px rule */}
        <div style={{ width: "100%", height: 2, backgroundColor: theme14.ink, marginBottom: 20 }} />

        {/* Stats row */}
        <div style={{ display: "flex", flexDirection: "row", marginBottom: 20 }}>
          {stats.map((stat, i) => {
            const statOpacity = interpolate(frame, [20 + i * 10, 38 + i * 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const statY = interpolate(frame, [20 + i * 10, 38 + i * 10], [15, 0], {
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
                      margin: "0 28px",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div
                  style={{
                    flex: 1,
                    opacity: statOpacity,
                    transform: `translateY(${statY}px)`,
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                >
                  <div
                    style={{
                      fontFamily: theme14.serif,
                      fontSize: 70,
                      fontWeight: 700,
                      color: theme14.ink,
                      lineHeight: 1.0,
                      marginBottom: 8,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: theme14.sans,
                      fontSize: 12,
                      color: "#666",
                      letterSpacing: 1,
                      textTransform: "uppercase" as const,
                      marginBottom: stat.delta ? 4 : 0,
                    }}
                  >
                    {stat.label}
                  </div>
                  {stat.delta && (
                    <div
                      style={{
                        fontFamily: theme14.sans,
                        fontSize: 12,
                        color: theme14.red,
                        letterSpacing: 1,
                      }}
                    >
                      {stat.delta}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Rule below stats */}
        <div style={{ width: "100%", height: 1, backgroundColor: theme14.ink, marginBottom: 16 }} />

        {/* Decorative fake article text */}
        <div style={{ flex: 1, display: "flex", gap: 0 }}>
          {[0, 1, 2].map((col) => (
            <React.Fragment key={col}>
              {col > 0 && (
                <div
                  style={{
                    width: 1,
                    backgroundColor: theme14.ink,
                    opacity: 0.25,
                    margin: "0 20px",
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <FakeTextLines opacity={bodyOpacity} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <Footer />
    </AbsoluteFill>
  );
};
