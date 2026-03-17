// src/defaultProps.ts
// Default slide data for both compositions — used as Remotion Studio previews
// and as fallback when no inputProps are passed to the render server.

import { P1Slide, P2Slide } from "./schema";

// ─── Presentation1 (dark tech) ────────────────────────────────────────────────

export const DEFAULT_P1_SLIDES: P1Slide[] = [
  // 0 — Title
  { type: "title", duration: 360, title: "Year in Review 2026", subtitle: "Feedeo Automated Video Agent" },
  // 1 — What We Do
  {
    type: "iconGrid", duration: 480, title: "What We Do",
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
  {
    type: "checklist", duration: 600, title: "Key Metrics 2026",
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
    type: "stats", duration: 510, title: "Platform Numbers",
    stats: [
      { iconName: "VideoIcon",  value: 1000000, label: "Videos Rendered",   suffix: "+", color: "#38bdf8" },
      { iconName: "TrendingUp", value: 60,      label: "Latency Reduction",  suffix: "%", color: "#34d399" },
      { iconName: "Users",      value: 14,      label: "New Enterprises",    suffix: "",  color: "#a78bfa" },
    ],
  },
  // 4 — Customer Impact
  {
    type: "stats", duration: 480, title: "Customer Impact",
    stats: [
      { iconName: "Users",      value: 500, label: "Active Customers", suffix: "+",  color: "#38bdf8" },
      { iconName: "Star",       value: 4.9, label: "Avg Satisfaction", suffix: "/5", color: "#f59e0b" },
      { iconName: "TrendingUp", value: 95,  label: "Retention Rate",   suffix: "%",  color: "#34d399" },
    ],
  },
  // 5 — Our Infrastructure
  { type: "image", duration: 420, title: "Our Infrastructure", src: "infra.jpg" },
  // 6 — Product Updates
  {
    type: "checklist", duration: 600, title: "Product Updates",
    points: [
      "Launched Veo 3.1 & Imagen 3.0 integration",
      "Rolled out dynamic audio-synced subtitles",
      "Introduced Co-Pilot & Autopilot workflows",
      "New real-time preview in Remotion Studio",
    ],
  },
  // 7 — Revenue Growth
  {
    type: "barChart", duration: 600, title: "Revenue Growth by Quarter",
    bars: [
      { label: "Q1 2026", value: 55, color: "#38bdf8" },
      { label: "Q2 2026", value: 68, color: "#34d399" },
      { label: "Q3 2026", value: 80, color: "#f59e0b" },
      { label: "Q4 2026", value: 94, color: "#a78bfa" },
    ],
  },
  // 8 — Market Share by Segment
  {
    type: "barChart", duration: 510, title: "Market Share by Segment",
    bars: [
      { label: "Enterprise", value: 88, color: "#38bdf8" },
      { label: "Mid-Market", value: 72, color: "#34d399" },
      { label: "SMB",        value: 54, color: "#f59e0b" },
      { label: "Agency",     value: 41, color: "#a78bfa" },
    ],
  },
  // 9 — Global Expansion
  { type: "image", duration: 420, title: "Global Expansion", src: "globe.jpg" },
  // 10 — How It Works
  {
    type: "iconFeatures", duration: 600, title: "How It Works",
    features: [
      { iconName: "Layers", title: "Define Story", body: "Feed a script or prompt into the AI pipeline and get a structured scene plan.", color: "#38bdf8" },
      { iconName: "Zap",    title: "Auto-Render",  body: "Frames, voiceover, music and transitions are generated and assembled automatically.", color: "#f59e0b" },
      { iconName: "Rocket", title: "Deliver",      body: "Finished video is encoded and published to your CDN in under 5 minutes.", color: "#34d399" },
    ],
  },
  // 11 — Milestones
  {
    type: "timeline", duration: 660, title: "Milestones 2025–2026",
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
    type: "checklist", duration: 600, title: "Future Roadmap",
    points: [
      "Real-time 3D rendering with WebGL",
      "Integration with more TTS voice models",
      "Automated personalized ad generation",
      "Multi-language subtitle pipeline",
    ],
  },
  // 13 — Growing Team
  {
    type: "iconGrid", duration: 540, title: "Growing Team",
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
    type: "iconFeatures", duration: 570, title: "Looking Ahead: 2027",
    features: [
      { iconName: "Cpu",       title: "Real-Time AI",       body: "Sub-second AI video generation for live events and dynamic personalization at scale.", color: "#38bdf8" },
      { iconName: "Globe",     title: "Global Reach",       body: "Expand to 50+ countries with localized voices, subtitles, and cultural contexts.", color: "#34d399" },
      { iconName: "BarChart3", title: "Smarter Analytics",  body: "Deep engagement analytics to optimize video content for maximum conversion rates.", color: "#a78bfa" },
    ],
  },
  // 15 — Quote
  {
    type: "quote", duration: 420,
    quote: "Feedeo didn't just automate video — it gave our team superpowers we didn't know we needed.",
    author: "Jane Smith", role: "VP of Marketing, Acme Corp",
  },
  // 16 — Thank You
  { type: "title", duration: 420, title: "Thank You", subtitle: "Let's build the future of video." },
];

// ─── Presentation2 (editorial magazine) ─────────────────────────────────────

export const DEFAULT_P2_SLIDES: P2Slide[] = [
  // 0 — Cover
  { type: "splitTitle", duration: 480, tag: "SPECIAL REPORT", title: "The AI Revolution", subtitle: "By the Numbers — 2026" },
  // 1 — Typewriter intro
  { type: "typewriter", duration: 540, text: "In 2026, artificial intelligence stopped being a promise and became the infrastructure of modern business.", author: "Feedeo Research" },
  // 2 — Big number: videos rendered
  { type: "bigNumber", duration: 420, value: 1, suffix: "B+", label: "AI-generated videos published globally in 2026", dark: false },
  // 3 — Magazine grid: key themes
  {
    type: "magazineGrid", duration: 540, headline: "Three Forces Reshaping Media",
    items: [
      { title: "Generative Video", body: "Text-to-video models crossed the photorealism threshold, enabling brands to produce broadcast-quality content in minutes." },
      { title: "Hyper-Personalisation", body: "Dynamic rendering pipelines now tailor every frame to the viewer — name, location, product, and language all resolved at render time." },
      { title: "Real-Time Delivery", body: "Edge-native CDN integration collapsed the gap between render and play — average latency under 800 ms globally." },
    ],
  },
  // 4 — Big number: latency
  { type: "bigNumber", duration: 360, value: 800, suffix: "ms", label: "Average global render-to-play latency", dark: true },
  // 5 — Pull quote
  { type: "pullQuote", duration: 480, quote: "The bottleneck is no longer production — it's imagination.", author: "Dr. Aisha Patel", role: "Head of AI Research, Feedeo" },
  // 6 — Split stats
  {
    type: "splitStats", duration: 540, title: "Platform at a Glance — 2026",
    stats: [
      { value: 1,  suffix: "M+", label: "Videos Rendered" },
      { value: 99.9, suffix: "%", label: "Uptime SLA" },
      { value: 60, suffix: "%",  label: "Latency Reduction" },
      { value: 14, suffix: "",   label: "New Enterprises" },
    ],
  },
  // 7 — Typewriter close
  { type: "typewriter", duration: 480, text: "The future of video is not filmed. It is computed.", author: "Feedeo 2026 Annual Report" },
  // 8 — Big number: retention
  { type: "bigNumber", duration: 360, value: 95, suffix: "%", label: "Customer retention rate", dark: false },
  // 9 — Closing split title
  { type: "splitTitle", duration: 420, tag: "FEEDEO", title: "What Will You Build?", subtitle: "feedeo.ai" },
];
