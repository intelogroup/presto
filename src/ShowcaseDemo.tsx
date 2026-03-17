import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig, Video, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

const theme = {
  bg: "#111827",
  primary: "#10b981", // Emerald green
  text: "#f9fafb",
};

// --- New Slide Components ---

// 1. Advanced Ken Burns (Pan + Zoom)
const KenBurnsSlide: React.FC<{ title: string; src: string; duration: number }> = ({ title, src, duration }) => {
  const frame = useCurrentFrame();
  
  // Scale up
  const scale = interpolate(frame, [0, duration], [1, 1.3]);
  // Pan diagonally (move X and Y)
  const translateX = interpolate(frame, [0, duration], [0, -10]);
  const translateY = interpolate(frame, [0, duration], [0, -5]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translateX(${translateX}%) translateY(${translateY}%)`,
          transformOrigin: "bottom right",
        }}
      >
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: 80 }}>
        <h1 style={{ fontSize: 100, color: "white", textShadow: "0 10px 30px rgba(0,0,0,0.8)", fontFamily: "sans-serif", margin: 0 }}>
          {title}
        </h1>
        <p style={{ fontSize: 40, color: theme.primary, fontFamily: "sans-serif", margin: 0, marginTop: 20 }}>
          Advanced Pan & Zoom Effects
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 2. Animated SVG Chart
const ChartSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animate the stroke-dasharray to make the line "draw" itself
  const pathLength = 1500; // approximate length of the SVG path
  const strokeDashoffset = interpolate(frame, [15, 60], [pathLength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, padding: 100, color: theme.text, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 80, opacity: titleOpacity }}>Growth Metrics (Animated SVG)</h1>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
        {/* Axes */}
        <div style={{ position: "absolute", bottom: 100, left: 100, width: "80%", height: 10, backgroundColor: "#374151" }} />
        <div style={{ position: "absolute", bottom: 100, left: 100, width: 10, height: "80%", backgroundColor: "#374151" }} />
        
        <svg width="80%" height="80%" viewBox="0 0 1000 500" style={{ position: "absolute", bottom: 100, left: 100, overflow: "visible" }}>
          <path
            d="M 0,500 C 200,400 300,500 500,250 C 700,0 800,200 1000,50"
            fill="none"
            stroke={theme.primary}
            strokeWidth="15"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={strokeDashoffset}
            style={{
               filter: `drop-shadow(0px 10px 10px ${theme.primary})`
            }}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// 3. Video Integration Slide
const VideoIntegrationSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const slideUp = spring({ frame, fps, config: { damping: 14 } });
  const translateY = interpolate(slideUp, [0, 1], [500, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, justifyContent: "center", alignItems: "center" }}>
      {/* Background blurred video */}
      <AbsoluteFill style={{ opacity: 0.3, filter: "blur(20px)", transform: "scale(1.1)" }}>
        <Video src={staticFile("dummy_video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      
      {/* Foreground Video in a stylized frame */}
      <div
        style={{
          width: 1200,
          height: 675,
          backgroundColor: "black",
          borderRadius: 40,
          overflow: "hidden",
          border: `8px solid ${theme.primary}`,
          boxShadow: `0 30px 60px rgba(0,0,0,0.8)`,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <Video src={staticFile("dummy_video.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      
      <AbsoluteFill style={{ justifyContent: "flex-end", paddingBottom: 50, alignItems: "center" }}>
         <h2 style={{ color: "white", fontFamily: "sans-serif", fontSize: 60, textShadow: "0 5px 10px black", opacity: slideUp }}>Seamless Video Embedding</h2>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ShowcaseDemo: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: Advanced Ken Burns */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <KenBurnsSlide 
          title="Cinematic Motion" 
          src="https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1920&auto=format&fit=crop" 
          duration={120} 
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 20 })}
      />

      {/* Scene 2: Animated SVG Chart */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <ChartSlide />
      </TransitionSeries.Sequence>
      
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />

      {/* Scene 3: Video embedded in video */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <VideoIntegrationSlide />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};