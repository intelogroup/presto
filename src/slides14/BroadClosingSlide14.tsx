// src/slides14/BroadClosingSlide14.tsx
// Closing edition — enormous headline, double rule, end mark

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme14 } from "./theme14";

type Props = {
  headline: string;
  edition: string;
  tagline: string;
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

export const BroadClosingSlide14: React.FC<Props> = ({ headline, edition, tagline }) => {
  const frame = useCurrentFrame();

  const headlineY = interpolate(frame, [0, 28], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [0, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const endMarkOpacity = interpolate(frame, [45, 58], [0, 1], {
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

        {/* Edition label */}
        <div style={{ marginTop: 18, textAlign: "center" as const }}>
          <div
            style={{
              fontFamily: theme14.sans,
              fontSize: 12,
              letterSpacing: 4,
              textTransform: "uppercase" as const,
              color: theme14.red,
              marginBottom: 10,
            }}
          >
            {edition}
          </div>
          {/* 3px full-width red rule */}
          <div style={{ width: "100%", height: 3, backgroundColor: theme14.red }} />
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontFamily: theme14.serif,
            fontSize: 108,
            fontWeight: 700,
            lineHeight: 1.0,
            color: theme14.ink,
            textAlign: "center" as const,
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          {headline}
        </div>

        {/* Double rule — 2px + 1px */}
        <div style={{ width: "100%", height: 2, backgroundColor: theme14.ink, marginBottom: 4 }} />
        <div style={{ width: "100%", height: 1, backgroundColor: theme14.ink, marginBottom: 20 }} />

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            fontFamily: theme14.serif,
            fontStyle: "italic",
            fontSize: 20,
            color: "#555",
            textAlign: "center" as const,
          }}
        >
          {tagline}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* End mark — 3 stacked rules: 2px, 1px, 2px */}
        <div
          style={{
            opacity: endMarkOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            paddingBottom: 70,
          }}
        >
          <div style={{ width: 80, height: 2, backgroundColor: theme14.ink }} />
          <div style={{ width: 80, height: 1, backgroundColor: theme14.ink }} />
          <div style={{ width: 80, height: 2, backgroundColor: theme14.ink }} />
        </div>
      </div>

      <Footer />
    </AbsoluteFill>
  );
};
