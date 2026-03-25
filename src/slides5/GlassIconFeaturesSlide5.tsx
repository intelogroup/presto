import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme5 } from "./theme5";
import { resolveIcon } from "../iconMap";

type AccentColor = "teal" | "blue" | "violet";

interface Feature {
  iconName: string;
  title: string;
  body: string;
  accent: AccentColor;
}

interface Props {
  headline: string;
  features: Feature[];
}

const ACCENT_MAP: Record<AccentColor, string> = {
  teal: theme5.teal,
  blue: theme5.blue,
  violet: theme5.violet,
};

export const GlassIconFeaturesSlide5: React.FC<Props> = ({ headline, features }) => {
  const frame = useCurrentFrame();

  // Background orb pulse
  const orbScale = interpolate(frame, [0, 120], [0.85, 1.0], {
    easing: Easing.inOut(Easing.sin),
    extrapolateRight: "clamp",
  });

  // Headline fade in: frame 0 → 18
  const headlineOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111827",
        fontFamily: theme5.sans,
        overflow: "hidden",
      }}
    >
      {/* Teal orb */}
      <div
        style={{
          position: "absolute",
          top: -250,
          left: -200,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme5.teal}44 0%, transparent 70%)`,
          transform: `scale(${orbScale})`,
          filter: "blur(70px)",
        }}
      />
      {/* Violet orb */}
      <div
        style={{
          position: "absolute",
          bottom: -250,
          right: -200,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme5.violet}33 0%, transparent 70%)`,
          transform: `scale(${orbScale})`,
          filter: "blur(90px)",
        }}
      />

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: headlineOpacity,
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: theme5.white,
            letterSpacing: -2,
            margin: 0,
          }}
        >
          {headline}
        </h1>
      </div>

      {/* Feature cards row */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 80,
          right: 80,
          bottom: 80,
          display: "flex",
          flexDirection: "row",
          gap: 32,
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {features.map((feature, i) => {
          const accentColor = ACCENT_MAP[feature.accent];
          const cardStart = 20 + i * 12;

          const cardOpacity = interpolate(frame, [cardStart, cardStart + 22], [0, 1], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const cardY = interpolate(frame, [cardStart, cardStart + 22], [50, 0], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Thin accent bar width: grows from cardStart to cardStart + 14
          const barWidth = interpolate(frame, [cardStart, cardStart + 14], [0, 96], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const Icon = resolveIcon(feature.iconName);

          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
                flex: 1,
                maxWidth: 360,
                borderRadius: 20,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "48px 40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: `${accentColor}26`,
                  border: `1px solid ${accentColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon
                  size={48}
                  color={accentColor}
                  style={{ filter: `drop-shadow(0 0 8px ${accentColor})` }}
                />
              </div>

              {/* Thin accent bar below icon */}
              <div
                style={{
                  width: barWidth,
                  height: 2,
                  background: accentColor,
                  borderRadius: 1,
                  marginTop: 16,
                }}
              />

              {/* Feature title */}
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: theme5.white,
                  marginTop: 28,
                }}
              >
                {feature.title}
              </div>

              {/* Feature body */}
              <div
                style={{
                  fontSize: 20,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.6,
                  marginTop: 12,
                }}
              >
                {feature.body}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
