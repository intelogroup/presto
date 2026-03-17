// src/slides2/MagazineGridSlide2.tsx
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme2 } from "./theme2";

type Item = {
  title: string;
  body: string;
};

type Props = {
  headline: string;
  items: [Item, Item, Item];
};

export const MagazineGridSlide2: React.FC<Props> = ({ headline, items }) => {
  const frame = useCurrentFrame();

  // Header slides down from top
  const headerY = interpolate(frame, [0, 25], [-120, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const headerOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  // Underline grows
  const lineWidth = interpolate(frame, [20, 55], [0, 1680], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  // Items stagger in from right
  const itemDelays = [40, 65, 90];
  const itemAnims = itemDelays.map((delay) => ({
    opacity: interpolate(frame, [delay, delay + 25], [0, 1], { extrapolateRight: "clamp" }),
    x: interpolate(frame, [delay, delay + 30], [80, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: theme2.bg, padding: "80px 100px", overflow: "hidden" }}>
      {/* Headline */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: 0,
        }}
      >
        <h1
          style={{
            fontFamily: theme2.serif,
            fontSize: 80,
            fontWeight: "bold",
            color: theme2.text,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {headline}
        </h1>
      </div>

      {/* Animated underline */}
      <div style={{ marginTop: 24, marginBottom: 60 }}>
        <div
          style={{
            width: lineWidth,
            height: 5,
            backgroundColor: theme2.primary,
            maxWidth: "100%",
          }}
        />
      </div>

      {/* 3-column grid */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 60,
          flex: 1,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              opacity: itemAnims[i].opacity,
              transform: `translateX(${itemAnims[i].x}px)`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Editorial number */}
            <div
              style={{
                fontFamily: theme2.mono,
                fontSize: 90,
                fontWeight: "bold",
                color: theme2.primary,
                lineHeight: 1,
                marginBottom: 20,
                opacity: 0.25,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>

            {/* Thin separator */}
            <div
              style={{
                width: "100%",
                height: 2,
                backgroundColor: theme2.text,
                marginBottom: 28,
                opacity: 0.15,
              }}
            />

            {/* Item title */}
            <div
              style={{
                fontFamily: theme2.serif,
                fontSize: 36,
                fontWeight: "bold",
                color: theme2.text,
                lineHeight: 1.25,
                marginBottom: 20,
              }}
            >
              {item.title}
            </div>

            {/* Item body */}
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 26,
                color: theme2.muted,
                lineHeight: 1.55,
                flex: 1,
              }}
            >
              {item.body}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
