// src/slides14/BroadQuoteSlide14.tsx
// Large editorial pull-quote slide — full-width oversized quote

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme14 } from "./theme14";

type Props = {
  section: string;
  quote: string;
  attribution: string;
  title: string;
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

export const BroadQuoteSlide14: React.FC<Props> = ({ section, quote, attribution, title }) => {
  const frame = useCurrentFrame();

  const titleY = interpolate(frame, [5, 20], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const quoteOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const attrOpacity = interpolate(frame, [38, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme14.bg, overflow: "hidden" }}>
      {/* Decorative large quote mark */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center" as const,
          fontFamily: theme14.serif,
          fontSize: 180,
          lineHeight: 1,
          color: theme14.ink,
          opacity: 0.08,
          pointerEvents: "none",
          userSelect: "none" as const,
        }}
      >
        &ldquo;
      </div>

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

        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: theme14.serif,
            fontSize: 46,
            fontWeight: 700,
            lineHeight: 1.1,
            color: theme14.ink,
            marginTop: 6,
            marginBottom: 10,
          }}
        >
          {title}
        </div>

        {/* 2px rule below title */}
        <div style={{ width: "100%", height: 2, backgroundColor: theme14.ink, marginBottom: 20 }} />

        {/* Quote */}
        <div style={{ opacity: quoteOpacity, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Top rule */}
          <div style={{ width: "100%", height: 2, backgroundColor: theme14.ink, marginBottom: 30 }} />

          <div
            style={{
              fontFamily: theme14.serif,
              fontStyle: "italic",
              fontSize: 34,
              lineHeight: 1.7,
              color: theme14.ink,
              textAlign: "center" as const,
              maxWidth: 1400,
              margin: "0 auto",
              paddingBottom: 30,
            }}
          >
            &ldquo;{quote}&rdquo;
          </div>

          {/* Bottom rule */}
          <div style={{ width: "100%", height: 2, backgroundColor: theme14.ink }} />
        </div>

        {/* Attribution */}
        <div
          style={{
            opacity: attrOpacity,
            fontFamily: theme14.sans,
            fontSize: 14,
            letterSpacing: 2,
            textTransform: "uppercase" as const,
            color: theme14.ink,
            textAlign: "center" as const,
            paddingTop: 20,
            paddingBottom: 50,
          }}
        >
          {attribution}
        </div>
      </div>

      <Footer />
    </AbsoluteFill>
  );
};
