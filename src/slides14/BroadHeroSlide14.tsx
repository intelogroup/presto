// src/slides14/BroadHeroSlide14.tsx
// Broadsheet front page — masthead, dateline, full-width headline, 3-column body

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme14 } from "./theme14";

type Props = {
  headline: string;
  deck: string;
  byline: string;
  date: string;
};

const Masthead: React.FC = () => (
  <div style={{ width: "100%", paddingTop: 18, paddingBottom: 0 }}>
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
    <div
      style={{
        fontFamily: theme14.sans,
        fontSize: 10,
        color: theme14.ink,
        opacity: 0.6,
      }}
    >
      Vol. XIV · No. 29 · meridianreport.com
    </div>
  </div>
);

const FakeTextLines: React.FC<{ opacity: number }> = ({ opacity }) => {
  const widths = [100, 88, 95, 78, 100, 82, 91, 70, 97, 85];
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

export const BroadHeroSlide14: React.FC<Props> = ({ headline, deck, byline, date }) => {
  const frame = useCurrentFrame();

  const headlineY = interpolate(frame, [5, 30], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [5, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const deckOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bylineOpacity = interpolate(frame, [38, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bodyOpacity = interpolate(frame, [45, 60], [0, 1], {
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
        {/* Masthead */}
        <Masthead />

        {/* Dateline row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          <div
            style={{
              fontFamily: theme14.sans,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase" as const,
              color: theme14.red,
            }}
          >
            Special Edition
          </div>
          <div
            style={{
              fontFamily: theme14.sans,
              fontSize: 11,
              color: theme14.ink,
              opacity: 0.7,
            }}
          >
            {date}
          </div>
        </div>

        {/* Thick rule below dateline */}
        <div style={{ width: "100%", height: 3, backgroundColor: theme14.ink }} />

        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontFamily: theme14.serif,
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: -2,
            color: theme14.ink,
            marginTop: 12,
            marginBottom: 12,
          }}
        >
          {headline}
        </div>

        {/* Rule below headline */}
        <div style={{ width: "100%", height: 1, backgroundColor: theme14.ink }} />

        {/* Deck */}
        <div
          style={{
            opacity: deckOpacity,
            fontFamily: theme14.serif,
            fontStyle: "italic",
            fontSize: 22,
            lineHeight: 1.5,
            color: "#444",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          {deck}
        </div>

        {/* Rule below deck */}
        <div style={{ width: "100%", height: 1, backgroundColor: theme14.ink }} />

        {/* Byline */}
        <div
          style={{
            opacity: bylineOpacity,
            fontFamily: theme14.sans,
            fontSize: 12,
            letterSpacing: 1,
            color: theme14.ink,
            marginTop: 8,
            marginBottom: 14,
          }}
        >
          By {byline}
        </div>

        {/* 3-column body */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            gap: 0,
            overflow: "hidden",
          }}
        >
          {[0, 1, 2].map((col) => (
            <React.Fragment key={col}>
              {col > 0 && (
                <div
                  style={{
                    width: 1,
                    backgroundColor: theme14.ink,
                    opacity: 0.3,
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
