import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import React from "react";
import { theme6 } from "./theme6";
import { resolveIcon } from "../iconMap";

type Item = {
  iconName: string;
  title: string;
  body: string;
};

type Props = {
  headline: string;
  items: [Item, Item, Item];
};

export const CinemaIconRowSlide6: React.FC<Props> = ({ headline, items }) => {
  const frame = useCurrentFrame();

  // Headline slides down: translateY -28→0, frame 0→22
  const headlineY = interpolate(frame, [0, 22], [-28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headlineOpacity = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gold rule grows from center outward: frame 20→38
  const ruleProgress = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const ruleWidth = ruleProgress * 200;

  // Vertical dividers fade in: frame 45→60
  const dividerOpacity = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme6.bg, overflow: "hidden" }}>
      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: theme6.serif,
          fontSize: 68,
          fontWeight: 400,
          color: "#F0EDE6",
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        {headline}
      </div>

      {/* Thin gold rule under headline */}
      <div
        style={{
          position: "absolute",
          top: 210,
          left: "50%",
          height: 1,
          width: ruleWidth,
          backgroundColor: theme6.gold,
          transform: "translateX(-50%)",
        }}
      />

      {/* 3-column layout */}
      <div
        style={{
          position: "absolute",
          top: 310,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {items.map((item, i) => {
          const Icon = resolveIcon(item.iconName);

          // Icon circle: fades in + scales 0.8→1.0, starts frame 28 + i*14
          const iconStart = 28 + i * 14;
          const iconOpacity = interpolate(frame, [iconStart, iconStart + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const iconScale = interpolate(frame, [iconStart, iconStart + 20], [0.8, 1.0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.2)),
          });

          // Connector line height: grows from 0, frame 42+i*14 → 54+i*14
          const lineStart = 42 + i * 14;
          const lineHeight = interpolate(frame, [lineStart, lineStart + 12], [0, 40], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Column title: fades in frame 48+i*14 → 62+i*14
          const titleStart = 48 + i * 14;
          const titleOpacity = interpolate(frame, [titleStart, titleStart + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // Body: fades in frame 58+i*14 → 72+i*14
          const bodyStart = 58 + i * 14;
          const bodyOpacity = interpolate(frame, [bodyStart, bodyStart + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <React.Fragment key={i}>
              {/* Vertical divider before columns 1 and 2 */}
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 160,
                    backgroundColor: theme6.gold,
                    alignSelf: "center",
                    opacity: dividerOpacity,
                    flexShrink: 0,
                  }}
                />
              )}

              {/* Column */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 60px",
                }}
              >
                {/* Gold icon circle */}
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    border: `2px solid ${theme6.gold}`,
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: iconOpacity,
                    transform: `scale(${iconScale})`,
                  }}
                >
                  <Icon size={44} color={theme6.gold} />
                </div>

                {/* Connector line */}
                <div
                  style={{
                    width: 2,
                    height: lineHeight,
                    backgroundColor: theme6.gold,
                    marginTop: 0,
                  }}
                />

                {/* Item title */}
                <div
                  style={{
                    fontFamily: theme6.serif,
                    fontSize: 32,
                    fontStyle: "italic",
                    color: theme6.gold,
                    marginTop: 8,
                    opacity: titleOpacity,
                  }}
                >
                  {item.title}
                </div>

                {/* Item body */}
                <div
                  style={{
                    fontFamily: theme6.sans,
                    fontSize: 22,
                    color: "rgba(240,237,230,0.65)",
                    lineHeight: 1.7,
                    marginTop: 16,
                    opacity: bodyOpacity,
                  }}
                >
                  {item.body}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
