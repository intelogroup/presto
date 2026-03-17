import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig, Video, staticFile, Sequence } from "remotion";

export const PictureInPictureDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Background sliding animation (sliding left infinitely)
  const translateX = interpolate(frame, [0, durationInFrames], [0, -50], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#111827", overflow: "hidden" }}>
      
      {/* Sliding Background */}
      <AbsoluteFill
        style={{
          transform: `translateX(${translateX}%)`,
          width: "200%", // Double width to allow sliding
          flexDirection: "row",
          display: "flex",
        }}
      >
        <Img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop" 
          style={{ width: "50%", height: "100%", objectFit: "cover", opacity: 0.5 }} 
        />
        <Img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop" 
          style={{ width: "50%", height: "100%", objectFit: "cover", opacity: 0.5 }} 
        />
      </AbsoluteFill>

      {/* Main Content Title */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
         <h1 style={{ color: "white", fontSize: 100, fontFamily: "sans-serif", textShadow: "0 10px 20px black", fontWeight: "bold" }}>
           Sliding Background
         </h1>
      </AbsoluteFill>

      {/* Picture-in-Picture Video (Bottom Right) */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: 60 }}>
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: "50%", // Circular frame
            overflow: "hidden",
            border: "8px solid white",
            boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
            backgroundColor: "black",
          }}
        >
          <Video 
            src={staticFile("real_video_30fps.mp4")} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            muted={false}
          />
        </div>
      </AbsoluteFill>
      
    </AbsoluteFill>
  );
};
