// src/slides17/ExpectSlide17.tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme17 } from "./theme17";

interface Props {
  title: string;
  items: string[];
}

export const ExpectSlide17: React.FC<Props> = ({ title, items }) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme17.bg2,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 120,
        paddingRight: 120,
      }}
    >
      {/* Gold bar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8, backgroundColor: theme17.gold }} />

      <div style={{ width: "100%" }}>
        {/* Label */}
        <p
          style={{
            fontFamily: theme17.body,
            fontSize: 20,
            color: theme17.gold,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            margin: "0 0 24px",
            opacity: titleOpacity,
          }}
        >
          What to Expect
        </p>

        {/* Title */}
        <h2
          style={{
            fontFamily: theme17.display,
            fontSize: 72,
            fontWeight: "normal",
            color: theme17.text,
            margin: "0 0 72px",
            opacity: titleOpacity,
          }}
        >
          {title}
        </h2>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {items.map((item, i) => {
            const delay = 20 + i * 18;
            const op = interpolate(frame, [delay, delay + 25], [0, 1], { extrapolateRight: "clamp" });
            const x = interpolate(frame, [delay, delay + 25], [-30, 0], { extrapolateRight: "clamp" });

            return (
              <div
                key={item}
                style={{
                  opacity: op,
                  transform: `translateX(${x}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                }}
              >
                {/* Gold bullet dot */}
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: theme17.gold,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: theme17.display,
                    fontSize: 48,
                    color: theme17.text,
                  }}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
