// src/slides/ImageSlide.tsx
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "./theme";

type Props = { title: string; src: string; duration: number };

export const ImageSlide: React.FC<Props> = ({ title, src, duration }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1, 1.1]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <h1 style={{ fontSize: 120, color: "white", textShadow: "0 10px 30px rgba(0,0,0,0.8)", fontFamily: "sans-serif", fontWeight: "bold" }}>
          {title}
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
