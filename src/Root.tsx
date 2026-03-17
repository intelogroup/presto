import React from "react";
import { Composition, staticFile } from "remotion";
import { PanZoomDemo } from "./PanZoomDemo";
import { AdvancedDemo } from "./AdvancedDemo";
import { PresentationDemo } from "./PresentationDemo";
import { Presentation2Demo } from "./Presentation2Demo";
import { ShowcaseDemo } from "./ShowcaseDemo";
import { PictureInPictureDemo } from "./PictureInPictureDemo";
import { Presentation1PropsSchema, Presentation2PropsSchema } from "./schema";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PanZoom"
        component={PanZoomDemo}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Advanced"
        component={AdvancedDemo}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Presentation"
        component={PresentationDemo}
        durationInFrames={8470}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation1PropsSchema}
        defaultProps={{
          logoSrc: staticFile("google.png"),
          talkingHeadSrc: staticFile("talkinghead_clean.mp4"),
          slides: [
            // 0 — Title
            { type: "title" as const, duration: 360, title: "Year in Review 2026", subtitle: "Feedeo Automated Video Agent" },
            // 1 — What We Do
            {
              type: "iconGrid" as const, duration: 480, title: "What We Do",
              items: [
                { iconName: "VideoIcon", label: "AI Video Generation", color: "#38bdf8" },
                { iconName: "Zap",       label: "Real-Time Rendering",  color: "#f59e0b" },
                { iconName: "Globe",     label: "Global CDN Delivery",  color: "#34d399" },
                { iconName: "Cpu",       label: "GPU Pipeline",         color: "#a78bfa" },
                { iconName: "Users",     label: "Team Collaboration",   color: "#f87171" },
                { iconName: "Shield",    label: "Enterprise Security",  color: "#38bdf8" },
              ],
            },
            // 2 — Key Metrics
            { type: "checklist" as const, duration: 600, title: "Key Metrics 2026", points: ["Over 1M videos rendered programmatically", "Pipeline latency reduced by 60%", "99.9% uptime across all rendering nodes", "Achieved positive ROI in Q2", "Expanded to 14 new enterprise accounts"] },
            // 3 — Platform Numbers
            {
              type: "stats" as const, duration: 510, title: "Platform Numbers",
              stats: [
                { iconName: "VideoIcon",  value: 1000000, label: "Videos Rendered",  suffix: "+", color: "#38bdf8" },
                { iconName: "TrendingUp", value: 60,      label: "Latency Reduction", suffix: "%", color: "#34d399" },
                { iconName: "Users",      value: 14,      label: "New Enterprises",   suffix: "",  color: "#a78bfa" },
              ],
            },
            // 4 — Customer Impact
            {
              type: "stats" as const, duration: 480, title: "Customer Impact",
              stats: [
                { iconName: "Users",      value: 500, label: "Active Customers", suffix: "+",  color: "#38bdf8" },
                { iconName: "Star",       value: 4.9, label: "Avg Satisfaction", suffix: "/5", color: "#f59e0b" },
                { iconName: "TrendingUp", value: 95,  label: "Retention Rate",   suffix: "%",  color: "#34d399" },
              ],
            },
            // 5 — Our Infrastructure
            { type: "image" as const, duration: 420, title: "Our Infrastructure", src: staticFile("infra.jpg") },
            // 6 — Product Updates
            { type: "checklist" as const, duration: 600, title: "Product Updates", points: ["Launched Veo 3.1 & Imagen 3.0 integration", "Rolled out dynamic audio-synced subtitles", "Introduced Co-Pilot & Autopilot workflows", "New real-time preview in Remotion Studio"] },
            // 7 — Revenue Growth
            { type: "barChart" as const, duration: 600, title: "Revenue Growth by Quarter", bars: [{ label: "Q1 2026", value: 55, color: "#38bdf8" }, { label: "Q2 2026", value: 68, color: "#34d399" }, { label: "Q3 2026", value: 80, color: "#f59e0b" }, { label: "Q4 2026", value: 94, color: "#a78bfa" }] },
            // 8 — Market Share by Segment
            { type: "barChart" as const, duration: 510, title: "Market Share by Segment", bars: [{ label: "Enterprise", value: 88, color: "#38bdf8" }, { label: "Mid-Market", value: 72, color: "#34d399" }, { label: "SMB", value: 54, color: "#f59e0b" }, { label: "Agency", value: 41, color: "#a78bfa" }] },
            // 9 — Global Expansion
            { type: "image" as const, duration: 420, title: "Global Expansion", src: staticFile("globe.jpg") },
            // 10 — How It Works
            {
              type: "iconFeatures" as const, duration: 600, title: "How It Works",
              features: [
                { iconName: "Layers", title: "Define Story", body: "Feed a script or prompt into the AI pipeline and get a structured scene plan.", color: "#38bdf8" },
                { iconName: "Zap",    title: "Auto-Render",  body: "Frames, voiceover, music and transitions are generated and assembled automatically.", color: "#f59e0b" },
                { iconName: "Rocket", title: "Deliver",      body: "Finished video is encoded and published to your CDN in under 5 minutes.", color: "#34d399" },
              ],
            },
            // 11 — Milestones
            { type: "timeline" as const, duration: 660, title: "Milestones 2025–2026", milestones: [{ date: "Q1 2025", label: "Alpha Launch", description: "Internal beta with 3 clients" }, { date: "Q3 2025", label: "Public Beta", description: "100 paying customers" }, { date: "Q1 2026", label: "v1.0 Release", description: "Full feature parity" }, { date: "Q3 2026", label: "1M Videos", description: "Scale milestone hit" }, { date: "Q4 2026", label: "Series A", description: "$8M funding round" }] },
            // 12 — Future Roadmap
            { type: "checklist" as const, duration: 600, title: "Future Roadmap", points: ["Real-time 3D rendering with WebGL", "Integration with more TTS voice models", "Automated personalized ad generation", "Multi-language subtitle pipeline"] },
            // 13 — Growing Team
            {
              type: "iconGrid" as const, duration: 540, title: "Growing Team",
              items: [
                { iconName: "Users",      label: "42 Full-Time Engineers",   color: "#38bdf8" },
                { iconName: "Globe",      label: "12 Countries Represented", color: "#34d399" },
                { iconName: "Rocket",     label: "3 New Offices Opened",     color: "#f59e0b" },
                { iconName: "Star",       label: "Top 50 AI Employer",       color: "#a78bfa" },
                { iconName: "TrendingUp", label: "Team Grew 3× in 2026",     color: "#f87171" },
                { iconName: "Shield",     label: "ISO 27001 Certified",      color: "#38bdf8" },
              ],
            },
            // 14 — 2027 Vision
            {
              type: "iconFeatures" as const, duration: 570, title: "Looking Ahead: 2027",
              features: [
                { iconName: "Cpu",      title: "Real-Time AI",       body: "Sub-second AI video generation for live events and dynamic personalization at scale.", color: "#38bdf8" },
                { iconName: "Globe",    title: "Global Reach",       body: "Expand to 50+ countries with localized voices, subtitles, and cultural contexts.", color: "#34d399" },
                { iconName: "BarChart3", title: "Smarter Analytics", body: "Deep engagement analytics to optimize video content for maximum conversion rates.", color: "#a78bfa" },
              ],
            },
            // 15 — Quote
            { type: "quote" as const, duration: 420, quote: "Feedeo didn't just automate video — it gave our team superpowers we didn't know we needed.", author: "Jane Smith", role: "VP of Marketing, Acme Corp" },
            // 16 — Thank You
            { type: "title" as const, duration: 420, title: "Thank You", subtitle: "Let's build the future of video." },
          ],
        }}
      />
      <Composition
        id="Presentation2"
        component={Presentation2Demo}
        durationInFrames={9100}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Showcase"
        component={ShowcaseDemo}
        // Duration: 120 + 120 + 90 - 20 - 15 = 295 frames
        durationInFrames={295}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PictureInPicture"
        component={PictureInPictureDemo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};