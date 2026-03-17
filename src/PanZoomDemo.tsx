import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const PanZoomDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scale from 1 to 1.5 over the video duration
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.5], {
    extrapolateRight: "clamp",
  });

  // Pan left by translating X from 0 to -10%
  const translateX = interpolate(frame, [0, durationInFrames], [0, -10], {
    extrapolateRight: "clamp",
  });

  // Pan up by translating Y from 0 to -10%
  const translateY = interpolate(frame, [0, durationInFrames], [0, -10], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translateX(${translateX}%) translateY(${translateY}%)`,
          transformOrigin: 'center',
        }}
      >
        <Img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </AbsoluteFill>
      
      {/* Overlay Text for debugging */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <h1 style={{ color: "white", fontSize: 100, fontFamily: "sans-serif", textShadow: "0 0 20px black" }}>
          Remotion Pan & Zoom
        </h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};