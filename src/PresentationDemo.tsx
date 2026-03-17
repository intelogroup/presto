// src/PresentationDemo.tsx
import React from "react";
import { AbsoluteFill, Img, Sequence, Video, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import {
  Zap, Globe, Video as VideoIcon, Cpu, BarChart3, Users,
  Rocket, Shield, TrendingUp, Layers, Clock, Star,
} from "lucide-react";

import { TitleSlide } from "./slides/TitleSlide";
import { ImageSlide } from "./slides/ImageSlide";
import { ChecklistSlide } from "./slides/ChecklistSlide";
import { StatsSlide } from "./slides/StatsSlide";
import { IconGridSlide } from "./slides/IconGridSlide";
import { BarChartSlide } from "./slides/BarChartSlide";
import { TimelineSlide } from "./slides/TimelineSlide";
import { QuoteSlide } from "./slides/QuoteSlide";
import { IconFeaturesSlide } from "./slides/IconFeaturesSlide";
import { theme } from "./slides/theme";

// ─── Slide Data ───────────────────────────────────────────────────────────────

const slides = [
  // 0 — Title
  {
    type: "title" as const,
    duration: 360,
    title: "Year in Review 2026",
    subtitle: "Feedeo Automated Video Agent",
  },
  // 1 — What We Do
  {
    type: "iconGrid" as const,
    duration: 480,
    title: "What We Do",
    items: [
      { icon: VideoIcon, label: "AI Video Generation", color: "#38bdf8" },
      { icon: Zap,       label: "Real-Time Rendering",  color: "#f59e0b" },
      { icon: Globe,     label: "Global CDN Delivery",  color: "#34d399" },
      { icon: Cpu,       label: "GPU Pipeline",         color: "#a78bfa" },
      { icon: Users,     label: "Team Collaboration",   color: "#f87171" },
      { icon: Shield,    label: "Enterprise Security",  color: "#38bdf8" },
    ],
  },
  // 2 — Key Metrics
  {
    type: "checklist" as const,
    duration: 600,
    title: "Key Metrics 2026",
    points: [
      "Over 1M videos rendered programmatically",
      "Pipeline latency reduced by 60%",
      "99.9% uptime across all rendering nodes",
      "Achieved positive ROI in Q2",
      "Expanded to 14 new enterprise accounts",
    ],
  },
  // 3 — Platform Numbers
  {
    type: "stats" as const,
    duration: 510,
    title: "Platform Numbers",
    stats: [
      { icon: VideoIcon,  value: 1000000, label: "Videos Rendered",   suffix: "+", color: "#38bdf8" },
      { icon: TrendingUp, value: 60,      label: "Latency Reduction",  suffix: "%", color: "#34d399" },
      { icon: Users,      value: 14,      label: "New Enterprises",    suffix: "",  color: "#a78bfa" },
    ],
  },
  // 4 — Customer Impact (NEW)
  {
    type: "stats" as const,
    duration: 480,
    title: "Customer Impact",
    stats: [
      { icon: Users,      value: 500, label: "Active Customers",  suffix: "+", color: "#38bdf8" },
      { icon: Star,       value: 4.9, label: "Avg Satisfaction",  suffix: "/5", color: "#f59e0b" },
      { icon: TrendingUp, value: 95,  label: "Retention Rate",    suffix: "%", color: "#34d399" },
    ],
  },
  // 5 — Our Infrastructure
  {
    type: "image" as const,
    duration: 420,
    title: "Our Infrastructure",
    src: staticFile("infra.jpg"),
  },
  // 6 — Product Updates
  {
    type: "checklist" as const,
    duration: 600,
    title: "Product Updates",
    points: [
      "Launched Veo 3.1 & Imagen 3.0 integration",
      "Rolled out dynamic audio-synced subtitles",
      "Introduced Co-Pilot & Autopilot workflows",
      "New real-time preview in Remotion Studio",
    ],
  },
  // 7 — Revenue Growth
  {
    type: "barChart" as const,
    duration: 600,
    title: "Revenue Growth by Quarter",
    bars: [
      { label: "Q1 2026", value: 55, color: "#38bdf8" },
      { label: "Q2 2026", value: 68, color: "#34d399" },
      { label: "Q3 2026", value: 80, color: "#f59e0b" },
      { label: "Q4 2026", value: 94, color: "#a78bfa" },
    ],
  },
  // 8 — Market Share by Segment (NEW)
  {
    type: "barChart" as const,
    duration: 510,
    title: "Market Share by Segment",
    bars: [
      { label: "Enterprise",  value: 88, color: "#38bdf8" },
      { label: "Mid-Market",  value: 72, color: "#34d399" },
      { label: "SMB",         value: 54, color: "#f59e0b" },
      { label: "Agency",      value: 41, color: "#a78bfa" },
    ],
  },
  // 9 — Global Expansion
  {
    type: "image" as const,
    duration: 420,
    title: "Global Expansion",
    src: staticFile("globe.jpg"),
  },
  // 10 — How It Works
  {
    type: "iconFeatures" as const,
    duration: 600,
    title: "How It Works",
    features: [
      { icon: Layers,  title: "Define Story", body: "Feed a script or prompt into the AI pipeline and get a structured scene plan.", color: "#38bdf8" },
      { icon: Zap,     title: "Auto-Render",  body: "Frames, voiceover, music and transitions are generated and assembled automatically.", color: "#f59e0b" },
      { icon: Rocket,  title: "Deliver",      body: "Finished video is encoded and published to your CDN in under 5 minutes.", color: "#34d399" },
    ],
  },
  // 11 — Milestones
  {
    type: "timeline" as const,
    duration: 660,
    title: "Milestones 2025–2026",
    milestones: [
      { date: "Q1 2025", label: "Alpha Launch",  description: "Internal beta with 3 clients" },
      { date: "Q3 2025", label: "Public Beta",   description: "100 paying customers" },
      { date: "Q1 2026", label: "v1.0 Release",  description: "Full feature parity" },
      { date: "Q3 2026", label: "1M Videos",     description: "Scale milestone hit" },
      { date: "Q4 2026", label: "Series A",      description: "$8M funding round" },
    ],
  },
  // 12 — Future Roadmap
  {
    type: "checklist" as const,
    duration: 600,
    title: "Future Roadmap",
    points: [
      "Real-time 3D rendering with WebGL",
      "Integration with more TTS voice models",
      "Automated personalized ad generation",
      "Multi-language subtitle pipeline",
    ],
  },
  // 13 — Growing Team (NEW)
  {
    type: "iconGrid" as const,
    duration: 540,
    title: "Growing Team",
    items: [
      { icon: Users,      label: "42 Full-Time Engineers",   color: "#38bdf8" },
      { icon: Globe,      label: "12 Countries Represented", color: "#34d399" },
      { icon: Rocket,     label: "3 New Offices Opened",     color: "#f59e0b" },
      { icon: Star,       label: "Top 50 AI Employer",       color: "#a78bfa" },
      { icon: TrendingUp, label: "Team Grew 3× in 2026",     color: "#f87171" },
      { icon: Shield,     label: "ISO 27001 Certified",      color: "#38bdf8" },
    ],
  },
  // 14 — 2027 Vision (NEW)
  {
    type: "iconFeatures" as const,
    duration: 570,
    title: "Looking Ahead: 2027",
    features: [
      { icon: Cpu,      title: "Real-Time AI",       body: "Sub-second AI video generation for live events and dynamic personalization at scale.", color: "#38bdf8" },
      { icon: Globe,    title: "Global Reach",       body: "Expand to 50+ countries with localized voices, subtitles, and cultural contexts.", color: "#34d399" },
      { icon: BarChart3,title: "Smarter Analytics", body: "Deep engagement analytics to optimize video content for maximum conversion rates.", color: "#a78bfa" },
    ],
  },
  // 15 — Quote
  {
    type: "quote" as const,
    duration: 420,
    quote: "Feedeo didn't just automate video — it gave our team superpowers we didn't know we needed.",
    author: "Jane Smith",
    role: "VP of Marketing, Acme Corp",
  },
  // 16 — Thank You
  {
    type: "title" as const,
    duration: 420,
    title: "Thank You",
    subtitle: "Let's build the future of video.",
  },
];

// ─── Transition map ───────────────────────────────────────────────────────────
// Index N = transition BEFORE slide N. Slide 0 has no incoming transition (null).
const transitions: (ReturnType<typeof fade> | ReturnType<typeof wipe> | ReturnType<typeof flip> | ReturnType<typeof clockWipe> | ReturnType<typeof slide> | null)[] = [
  null,                                    // 0 Title
  fade(),                                  // 1 What We Do
  wipe({ direction: "from-left" }),        // 2 Key Metrics
  flip(),                                  // 3 Platform Numbers
  clockWipe({ width: 1920, height: 1080 }),// 4 Customer Impact (NEW)
  slide({ direction: "from-top" }),        // 5 Our Infrastructure
  fade(),                                  // 6 Product Updates
  wipe({ direction: "from-right" }),       // 7 Revenue Growth
  slide({ direction: "from-right" }),      // 8 Market Share (NEW)
  flip(),                                  // 9 Global Expansion
  clockWipe({ width: 1920, height: 1080 }),// 10 How It Works
  fade(),                                  // 11 Milestones
  slide({ direction: "from-left" }),       // 12 Future Roadmap
  flip(),                                  // 13 Growing Team (NEW)
  wipe({ direction: "from-left" }),        // 14 2027 Vision (NEW)
  fade(),                                  // 15 Quote
  clockWipe({ width: 1920, height: 1080 }),// 16 Thank You
];

// ─── Composition ──────────────────────────────────────────────────────────────
// IMPORTANT: TransitionSeries children must be a FLAT array.
// React.Fragment wrappers break TransitionSeries internal child traversal.

export const PresentationDemo: React.FC = () => {
  const timelineChildren: React.ReactElement[] = [];

  slides.forEach((slideData, index) => {
    const transition = transitions[index];

    if (transition) {
      timelineChildren.push(
        <TransitionSeries.Transition
          key={`t-${index}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          presentation={transition as any}
          timing={linearTiming({ durationInFrames: 20 })}
        />
      );
    }

    let SlideComponent: React.ReactElement;

    if (slideData.type === "title") {
      const s = slideData as { type: "title"; title: string; subtitle?: string; duration: number };
      SlideComponent = <TitleSlide title={s.title} subtitle={s.subtitle} />;
    } else if (slideData.type === "image") {
      const s = slideData as { type: "image"; title: string; src: string; duration: number };
      SlideComponent = <ImageSlide title={s.title} src={s.src} duration={s.duration} />;
    } else if (slideData.type === "checklist") {
      const s = slideData as { type: "checklist"; title: string; points: string[]; duration: number };
      SlideComponent = <ChecklistSlide title={s.title} points={s.points} duration={s.duration} />;
    } else if (slideData.type === "stats") {
      const s = slideData as { type: "stats"; title: string; stats: any[]; duration: number };
      SlideComponent = <StatsSlide title={s.title} stats={s.stats} />;
    } else if (slideData.type === "iconGrid") {
      const s = slideData as { type: "iconGrid"; title: string; items: any[]; duration: number };
      SlideComponent = <IconGridSlide title={s.title} items={s.items} />;
    } else if (slideData.type === "barChart") {
      const s = slideData as { type: "barChart"; title: string; bars: any[]; duration: number };
      SlideComponent = <BarChartSlide title={s.title} bars={s.bars} />;
    } else if (slideData.type === "timeline") {
      const s = slideData as { type: "timeline"; title: string; milestones: any[]; duration: number };
      SlideComponent = <TimelineSlide title={s.title} milestones={s.milestones} />;
    } else if (slideData.type === "quote") {
      const s = slideData as { type: "quote"; quote: string; author: string; role?: string; duration: number };
      SlideComponent = <QuoteSlide quote={s.quote} author={s.author} role={s.role} />;
    } else {
      const s = slideData as { type: "iconFeatures"; title: string; features: any[]; duration: number };
      SlideComponent = <IconFeaturesSlide title={s.title} features={s.features} />;
    }

    timelineChildren.push(
      <TransitionSeries.Sequence key={`s-${index}`} durationInFrames={slideData.duration}>
        {SlideComponent}
      </TransitionSeries.Sequence>
    );
  });

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {timelineChildren}
      </TransitionSeries>

      {/* Logo — top right */}
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: 40, pointerEvents: "none" }}>
        <Img src={staticFile("google.png")} style={{ width: 120, objectFit: "contain" }} />
      </AbsoluteFill>

      {/* Talking head circle — bottom right, looping */}
      <Sequence from={-30}>
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: 60, pointerEvents: "none" }}>
          <div style={{ width: 300, height: 300, borderRadius: "50%", overflow: "hidden", border: `6px solid ${theme.primary}`, boxShadow: "0 10px 30px rgba(0,0,0,0.5)", backgroundColor: "black", transform: "translateZ(0)", willChange: "transform" }}>
            <Video
              loop
              src={staticFile("talkinghead_clean.mp4")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
