// src/slides14/BroadLeadSlide14.tsx
// Lead article layout — section label, full-width headline, body + pull quote

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme14 } from "./theme14";

type Props = {
  section: string;
  headline: string;
  body: string;
  pullQuote: string;
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

export const BroadLeadSlide14: React.FC<Props> = ({ section, headline, body, pullQuote }) => {
  const frame = useCurrentFrame();

  const headlineY = interpolate(frame, [5, 25], [-25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bodyOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pullOpacity = interpolate(frame, [35, 50], [0, 1], {
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
          <div style={{ width: "100%", height: 2, backgroundColor: theme14.red }} />
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            fontFamily: theme14.serif,
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.1,
            color: theme14.ink,
            marginTop: 14,
            marginBottom: 10,
          }}
        >
          {headline}
        </div>

        {/* Rule below headline */}
        <div style={{ width: "100%", height: 1, backgroundColor: theme14.ink, marginBottom: 14 }} />

        {/* Body + pull quote layout */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            gap: 0,
            overflow: "hidden",
          }}
        >
          {/* Body text — 65% */}
          <div style={{ flex: "0 0 65%", opacity: bodyOpacity, paddingRight: 20 }}>
            <div
              style={{
                fontFamily: theme14.serif,
                fontSize: 16,
                lineHeight: 1.8,
                color: theme14.ink,
              }}
            >
              {body}
            </div>
          </div>

          {/* Vertical rule */}
          <div
            style={{
              width: 1,
              backgroundColor: theme14.ink,
              opacity: 0.3,
              flexShrink: 0,
            }}
          />

          {/* Pull quote — 35% */}
          <div
            style={{
              flex: "0 0 35%",
              opacity: pullOpacity,
              paddingLeft: 28,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ width: "100%" }}>
              <div style={{ width: "100%", height: 2, backgroundColor: theme14.ink, marginBottom: 20 }} />
              <div
                style={{
                  fontFamily: theme14.serif,
                  fontStyle: "italic",
                  fontSize: 20,
                  lineHeight: 1.6,
                  color: theme14.ink,
                  textAlign: "center" as const,
                  padding: "0 20px",
                }}
              >
                {pullQuote}
              </div>
              <div style={{ width: "100%", height: 2, backgroundColor: theme14.ink, marginTop: 20 }} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </AbsoluteFill>
  );
};
