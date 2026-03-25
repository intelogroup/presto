// src/slides12/KineticClosingSlide12.tsx
// P12 — Kinetic Closing: enormous brand name slams down from top with overshoot, then floats

import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme12 } from "./theme12";

type Props = {
  brand: string;
  call: string;
};

export const KineticClosingSlide12: React.FC<Props> = ({ brand, call }) => {
  const frame = useCurrentFrame();

  // Brand slams from top — frames 0-25 with overshoot (easing out back)
  const brandEntryY = interpolate(frame, [0, 25], [-500, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });

  // After frame 50: floating drift using sin wave
  const floatY = frame > 50 ? Math.sin(frame * 0.05) * 8 : 0;

  const brandY = brandEntryY + floatY;

  // Call to action slides up — frames 28-45
  const callY = interpolate(frame, [28, 45], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const callOpacity = interpolate(frame, [28, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Brand opacity — slam in visible immediately
  const brandOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme12.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Brand — enormous, white, slams from top then floats */}
      <div
        style={{
          transform: `translateY(${brandY}px)`,
          opacity: brandOpacity,
          fontFamily: theme12.display,
          fontSize: 300,
          fontWeight: 900,
          color: theme12.white,
          lineHeight: 1,
          letterSpacing: -10,
          textTransform: "uppercase",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {brand}
      </div>

      {/* Call to action — red, slides up */}
      <div
        style={{
          transform: `translateY(${callY}px)`,
          opacity: callOpacity,
          fontFamily: theme12.display,
          fontSize: 40,
          fontWeight: 900,
          color: theme12.red,
          letterSpacing: 12,
          textTransform: "uppercase",
          textAlign: "center",
          marginTop: 48,
          whiteSpace: "nowrap",
        }}
      >
        {call}
      </div>
    </AbsoluteFill>
  );
};
