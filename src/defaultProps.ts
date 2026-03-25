// src/defaultProps.ts
// Default slide data for both compositions — used as Remotion Studio previews
// and as fallback when no inputProps are passed to the render server.

import { P1Slide, P2Slide, P3Slide, P4Slide, P5Slide, P6Slide, P7Slide, P8Slide, P9Slide, P10Slide, P11Slide, P12Slide, P13Slide, P14Slide, P15Slide, P16Slide, P17Slide } from "./schema";

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

// ─── Presentation3 (data dashboard) ─────────────────────────────────────────

export const DEFAULT_P3_SLIDES: P3Slide[] = [
  // 0 — Opener
  { type: "kpiTitle", duration: 60, title: "Feedeo Growth Story", tagline: "Zero → $10M ARR in 24 Months", badge: "2024–2026" },
  // 1
  { type: "bigStat", duration: 60, label: "Annual Recurring Revenue", value: "$10M", numericValue: 10, unit: "$", trend: "up", caption: "Up from $0 in January 2024" },
  // 2
  { type: "bigStat", duration: 60, label: "Active Users", value: "50K", numericValue: 50000, trend: "up", caption: "Across 40+ countries" },
  // 3
  {
    type: "metricRow", duration: 60, title: "Q1 2024 — First Quarter",
    metrics: [
      { label: "ARR", value: "$1.2M", delta: "+100%" },
      { label: "Users", value: "8K", delta: "+8K" },
      { label: "Churn", value: "4.2%", delta: "-0.8%" },
    ],
  },
  // 4
  { type: "bigStat", duration: 60, label: "NPS Score", value: "72", numericValue: 72, trend: "up", caption: "Industry average is 41" },
  // 5
  {
    type: "metricRow", duration: 60, title: "Q2 2024 — Acceleration",
    metrics: [
      { label: "ARR", value: "$2.8M", delta: "+133%" },
      { label: "Users", value: "15K", delta: "+7K" },
      { label: "Churn", value: "3.1%", delta: "-1.1%" },
    ],
  },
  // 6
  {
    type: "barRace", duration: 60, title: "ARR Growth by Quarter ($M)",
    maxValue: 10,
    bars: [
      { label: "Q1 2024", value: 1.2 },
      { label: "Q2 2024", value: 2.8 },
      { label: "Q3 2024", value: 5.1 },
      { label: "Q4 2024", value: 7.4 },
      { label: "Q1 2025", value: 10 },
    ],
  },
  // 7
  { type: "milestone", duration: 60, icon: "Rocket", headline: "Seed Round Closed", caption: "Raised $1.2M to scale the pipeline", year: "2024" },
  // 8
  { type: "bigStat", duration: 60, label: "Team Members", value: "42", numericValue: 42, trend: "up", caption: "Grew 3× in 12 months" },
  // 9
  {
    type: "metricRow", duration: 60, title: "Q3 2024 — Product-Market Fit",
    metrics: [
      { label: "ARR", value: "$5.1M", delta: "+82%" },
      { label: "Users", value: "28K", delta: "+13K" },
      { label: "Churn", value: "2.4%", delta: "-0.7%" },
    ],
  },
  // 10
  {
    type: "barRace", duration: 60, title: "Revenue by Segment ($M)",
    maxValue: 5,
    bars: [
      { label: "Enterprise", value: 4.5 },
      { label: "Mid-Market", value: 2.8 },
      { label: "SMB", value: 1.7 },
      { label: "Agency", value: 1.0 },
    ],
  },
  // 11
  { type: "bigStat", duration: 60, label: "Retention Rate", value: "95%", numericValue: 95, trend: "up", caption: "Best-in-class for SaaS" },
  // 12
  { type: "milestone", duration: 60, icon: "TrendingUp", headline: "Series A — $8M", caption: "Led by Sequoia with 4 co-investors", year: "2025" },
  // 13
  {
    type: "metricRow", duration: 60, title: "Q4 2024 — Milestone Quarter",
    metrics: [
      { label: "ARR", value: "$10M", delta: "+35%" },
      { label: "Users", value: "50K", delta: "+22K" },
      { label: "Churn", value: "1.9%", delta: "-0.5%" },
    ],
  },
  // 14
  { type: "bigStat", duration: 60, label: "Burn Multiple", value: "0.8×", numericValue: 0.8, trend: "neutral", caption: "Efficient growth — industry avg 1.5×" },
  // 15
  { type: "milestone", duration: 60, icon: "VideoIcon", headline: "1M Videos Rendered", caption: "Crossed the milestone in a single quarter", year: "2026" },
  // 16
  {
    type: "barRace", duration: 60, title: "Revenue by Geography ($M)",
    maxValue: 6,
    bars: [
      { label: "North America", value: 5.2 },
      { label: "Europe", value: 2.8 },
      { label: "APAC", value: 1.4 },
      { label: "Rest of World", value: 0.6 },
    ],
  },
  // 17 — Closer
  { type: "kpiTitle", duration: 60, title: "What's Next", tagline: "→ $50M ARR by 2028", badge: "Roadmap" },
];

// ─── Presentation4 (Bold Swiss / Brutalist) ───────────────────────────────────
// 6 slides × ~140 frames avg − 5 transitions × 10 = ~790 frames ≈ 26s

export const DEFAULT_P4_SLIDES: P4Slide[] = [
  // 0 — Hero opener
  {
    type: "brutalistHero",
    duration: 150,
    title: "Feedeo.",
    tag: "Product Launch 2026",
    subtitle: "The fastest way to turn data into video. Automatically.",
  },
  // 1 — Statement
  {
    type: "wordStamp",
    duration: 120,
    words: ["Stop", "Editing.", "Start", "Shipping."],
    keyWordIndex: 1,
    caption: "Feedeo — 2026",
  },
  // 2 — Big three numbers
  {
    type: "triGrid",
    duration: 150,
    headline: "By the Numbers",
    columns: [
      { value: 1000000, suffix: "+", label: "Videos Rendered",   accent: "red"    },
      { value: 800,     suffix: "ms", label: "Avg Render Time",   accent: "yellow" },
      { value: 95,      suffix: "%",  label: "Retention Rate",    accent: "black"  },
    ],
  },
  // 3 — Half bleed stat
  {
    type: "halfBleed",
    duration: 130,
    bigValue: "60%",
    bigLabel: "Faster",
    facts: [
      "60% reduction in average video production time",
      "Zero manual editing — fully automated pipeline",
      "Ships to your CDN in under 5 minutes",
    ],
  },
  // 4 — Bold quote
  {
    type: "boldQuote",
    duration: 150,
    quote: "Feedeo didn't just automate video — it gave our team superpowers we didn't know we needed.",
    author: "Jane Smith",
    role: "VP of Marketing, Acme Corp",
  },
  // 5 — Closing stripe
  {
    type: "closingStripe",
    duration: 150,
    word: "Build.",
    tagline: "feedeo.ai",
  },
];

// ─── Presentation5 (Glassmorphism Dark) ───────────────────────────────────────
// 6 slides × ~140 frames avg − 5 transitions × 15 = ~765 frames ≈ 25.5s

export const DEFAULT_P5_SLIDES: P5Slide[] = [
  // 0 — Hero
  {
    type: "glassHero",
    duration: 150,
    tag: "Feedeo 2026",
    title: "Video, Automated.",
    subtitle: "Turn any data into a polished video in seconds.",
  },
  // 1 — Stats
  {
    type: "glassStats",
    duration: 150,
    title: "Platform Performance",
    stats: [
      { value: "1M+",  label: "Videos Rendered",   accent: "teal"   },
      { value: "800ms", label: "Avg Render Time",   accent: "blue"   },
      { value: "95%",  label: "Customer Retention", accent: "violet" },
    ],
  },
  // 2 — Grid
  {
    type: "glassGrid",
    duration: 150,
    headline: "Why Teams Choose Feedeo",
    items: [
      { label: "Zero Editing",   body: "Fully automated pipeline from data to finished video.",        accent: "teal"   },
      { label: "GPU-Powered",    body: "Parallel GPU rendering delivers videos in under 5 minutes.",   accent: "blue"   },
      { label: "API-First",      body: "Integrate with any data source via our REST API.",             accent: "violet" },
      { label: "Enterprise-Ready", body: "SSO, audit logs, and 99.9% uptime SLA included.",          accent: "white"  },
    ],
  },
  // 3 — Quote
  {
    type: "glassQuote",
    duration: 150,
    quote: "Feedeo replaced an entire video production team — and the output looks better than anything we made manually.",
    author: "Alex Chen",
    role: "Head of Growth, Momentum Labs",
  },
  // 4 — Bar chart
  {
    type: "glassBar",
    duration: 150,
    title: "ARR Growth ($M)",
    bars: [
      { label: "Q1 2025", value: 1.2,  maxValue: 10 },
      { label: "Q2 2025", value: 2.8,  maxValue: 10 },
      { label: "Q3 2025", value: 5.1,  maxValue: 10 },
      { label: "Q4 2025", value: 7.4,  maxValue: 10 },
      { label: "Q1 2026", value: 10,   maxValue: 10 },
    ],
  },
  // 5 — Icon features
  {
    type: "glassIconFeatures",
    duration: 150,
    headline: "Built for Modern Teams",
    features: [
      { iconName: "Zap",       title: "Instant Render",    body: "GPU pipeline converts data to video in under 5 minutes.",        accent: "teal"   },
      { iconName: "Globe",     title: "Global CDN",        body: "Deliver videos anywhere with sub-50ms edge latency worldwide.",   accent: "blue"   },
      { iconName: "Shield",    title: "Enterprise-Grade",  body: "SOC 2 Type II, SSO, audit logs, and 99.9% uptime SLA.",          accent: "violet" },
      { iconName: "TrendingUp", title: "AI-Optimized",    body: "Automatically selects the best style, pacing, and format.",      accent: "teal"   },
    ],
  },
  // 6 — Donut infographic
  {
    type: "glassDonut",
    duration: 150,
    title: "Revenue by Segment",
    centerLabel: "Total ARR",
    centerValue: "$10M",
    segments: [
      { label: "Enterprise",  value: 45, accent: "teal"   },
      { label: "Mid-Market",  value: 30, accent: "blue"   },
      { label: "SMB",         value: 25, accent: "violet" },
    ],
  },
  // 7 — Closing
  {
    type: "glassClosing",
    duration: 150,
    headline: "The Future is Automated.",
    tagline: "feedeo.ai — Start free today",
  },
];

// ─── Presentation6 (Cinematic Gold) ───────────────────────────────────────────
// 6 slides × ~150 frames avg − 5 transitions × 20 = ~800 frames ≈ 26.7s

export const DEFAULT_P6_SLIDES: P6Slide[] = [
  // 0 — Chapter hero
  {
    type: "cinemaHero",
    duration: 150,
    chapter: "01",
    title: "The Opportunity",
    subtitle: "Every brand has a story. Most never get to tell it.",
  },
  // 1 — Big stat
  {
    type: "cinemaStat",
    duration: 150,
    label: "Videos Created Per Day",
    value: "3,200",
    sublabel: "and growing.",
    context: "Up from 400/day in Q1 2025",
  },
  // 2 — Column grid
  {
    type: "cinemaGrid",
    duration: 150,
    headline: "Three Pillars of Growth",
    columns: [
      { title: "Automation",  body: "From raw data to broadcast-quality video with zero human intervention." },
      { title: "Scale",       body: "Render thousands of personalized videos simultaneously across any market." },
      { title: "Intelligence", body: "AI selects the right format, pacing, and style for every audience." },
    ],
  },
  // 3 — Quote
  {
    type: "cinemaQuote",
    duration: 150,
    quote: "We shipped 10,000 personalized video campaigns in the time it used to take to make one.",
    author: "Maria Torres",
    role: "CMO, Elevate Commerce",
  },
  // 4 — Numbered list
  {
    type: "cinemaList",
    duration: 150,
    title: "What We Built in 2025",
    items: [
      "Launched real-time render pipeline with sub-second preview",
      "Shipped native integrations for Salesforce, HubSpot, and Shopify",
      "Reached 1 million videos rendered milestone",
      "Closed Series A — $8M led by Sequoia",
      "Expanded to 14 enterprise accounts across 3 continents",
    ],
  },
  // 5 — Image slide
  {
    type: "cinemaImageFull",
    duration: 150,
    src: "globe.jpg",
    overlay: "OUR REACH",
    title: "Serving Teams Across 40 Countries",
    caption: "Feedeo powers video at scale for global enterprises.",
  },
  // 6 — Icon row
  {
    type: "cinemaIconRow",
    duration: 150,
    headline: "The Platform Stack",
    items: [
      { iconName: "Cpu",       title: "Render Engine",  body: "GPU-accelerated pipeline delivers broadcast-quality video in under 5 minutes." },
      { iconName: "Layers",    title: "AI Director",    body: "Automatically selects layouts, pacing, and visuals for every audience." },
      { iconName: "Globe",     title: "CDN Delivery",   body: "Global edge network ensures instant delivery to any market." },
    ],
  },
  // 7 — Closing
  {
    type: "cinemaClosing",
    duration: 150,
    word: "Onwards.",
    tagline: "feedeo.ai",
  },
];

// ─── Presentation7 (Neon Grid / Cyber) ────────────────────────────────────────
// 6 slides × ~130 frames avg − 5 transitions × 8 = ~740 frames ≈ 24.7s

export const DEFAULT_P7_SLIDES: P7Slide[] = [
  // 0 — Hero
  {
    type: "cyberHero",
    duration: 150,
    systemLabel: "FEEDEO_v2026.exe",
    title: "Video at Scale.",
    subtitle: "AI-powered rendering infrastructure for modern teams.",
  },
  // 1 — Metrics
  {
    type: "cyberMetrics",
    duration: 130,
    title: "SYSTEM_STATUS",
    metrics: [
      { value: "1M+",  label: "Videos Rendered", accent: "cyan"    },
      { value: "800ms", label: "Render Latency",  delta: "↓ 60%", accent: "green"   },
      { value: "99.9%", label: "Uptime SLA",      accent: "magenta" },
    ],
  },
  // 2 — Bar chart
  {
    type: "cyberBar",
    duration: 130,
    title: "ARR_GROWTH_BY_QUARTER",
    bars: [
      { label: "Q1", value: 12 },
      { label: "Q2", value: 28 },
      { label: "Q3", value: 51 },
      { label: "Q4", value: 74 },
      { label: "Q1+", value: 100 },
    ],
  },
  // 3 — List
  {
    type: "cyberList",
    duration: 130,
    title: "CHANGELOG_2025",
    items: [
      "Sub-second render preview shipped to all users",
      "GPU cluster scaled to 512 parallel render nodes",
      "Real-time AI caption sync — 40 languages",
      "Shopify + Salesforce native connectors launched",
      "SOC 2 Type II certification achieved",
    ],
  },
  // 4 — Quote
  {
    type: "cyberQuote",
    duration: 130,
    quote: "Feedeo's API is the cleanest render infrastructure I've ever worked with. It just ships.",
    author: "Dev Patel",
    role: "Staff Engineer, ScaleAI",
  },
  // 5 — Line chart
  {
    type: "cyberLineChart",
    duration: 150,
    title: "ARR_TRAJECTORY",
    yLabel: "$M ARR",
    accent: "cyan",
    points: [
      { label: "Q1'24", value: 12 },
      { label: "Q2'24", value: 28 },
      { label: "Q3'24", value: 51 },
      { label: "Q4'24", value: 74 },
      { label: "Q1'25", value: 100 },
    ],
  },
  // 6 — Icon grid
  {
    type: "cyberIconGrid",
    duration: 150,
    title: "SYSTEM_MODULES",
    items: [
      { iconName: "Cpu",       label: "Render Engine",   value: "512 GPUs",  accent: "cyan"    },
      { iconName: "Zap",       label: "Latency",         value: "800ms",     accent: "green"   },
      { iconName: "Globe",     label: "CDN Nodes",       value: "120+",      accent: "cyan"    },
      { iconName: "Shield",    label: "Uptime SLA",      value: "99.9%",     accent: "magenta" },
      { iconName: "Users",     label: "Active Teams",    value: "500+",      accent: "green"   },
      { iconName: "TrendingUp", label: "Growth Rate",   value: "3.4×",      accent: "cyan"    },
    ],
  },
  // 7 — Closing
  {
    type: "cyberClosing",
    duration: 150,
    word: "EXECUTE.",
    tagline: "feedeo.ai // build the future",
  },
];

// ─── Presentation8 (Clean Minimalist) ─────────────────────────────────────────
// 6 slides × ~140 frames avg − 5 transitions × 15 = ~765 frames ≈ 25.5s

export const DEFAULT_P8_SLIDES: P8Slide[] = [
  // 0 — Hero
  {
    type: "minimalHero",
    duration: 150,
    tag: "Feedeo · 2026",
    title: "Better videos.\nLess work.",
    subtitle: "The automated video platform for teams that ship.",
  },
  // 1 — Stats
  {
    type: "minimalStats",
    duration: 150,
    title: "By the numbers",
    stats: [
      { value: "1M+",   label: "Videos Rendered",   note: "Since launch" },
      { value: "95%",   label: "Retention Rate",     note: "Best-in-class SaaS" },
      { value: "$10M",  label: "ARR",                note: "As of Q4 2025" },
    ],
  },
  // 2 — List
  {
    type: "minimalList",
    duration: 150,
    title: "What we shipped",
    items: [
      "Real-time render pipeline with sub-second preview",
      "Native integrations for Salesforce, HubSpot, Shopify",
      "AI caption sync across 40 languages",
      "Series A — $8M led by Sequoia",
      "SOC 2 Type II certification",
    ],
  },
  // 3 — Quote
  {
    type: "minimalQuote",
    duration: 150,
    quote: "We replaced our entire video production workflow with Feedeo. Our output tripled and our costs halved.",
    author: "Jordan Kim",
    role: "VP Marketing, Apex SaaS",
  },
  // 4 — Grid
  {
    type: "minimalGrid",
    duration: 150,
    headline: "Our platform",
    items: [
      { title: "Render Engine",  body: "GPU-accelerated rendering delivers broadcast-quality video in under 5 minutes." },
      { title: "Data Connectors", body: "Pull from any source — CSV, API, CRM — and transform it into video instantly." },
      { title: "AI Director",    body: "Automatically selects layouts, pacing, and visuals to match your brand." },
      { title: "CDN Delivery",   body: "Global edge network delivers your videos anywhere in the world, instantly." },
    ],
  },
  // 5 — Icon features
  {
    type: "minimalIconFeatures",
    duration: 150,
    headline: "How it works",
    features: [
      { iconName: "Zap",       title: "Connect your data",    body: "Pull from any source — CSV, REST API, CRM, or database — with a single integration." },
      { iconName: "VideoIcon", title: "AI generates the video", body: "Our Director AI selects layouts, pacing, and visuals automatically. No editing required." },
      { iconName: "Globe",     title: "Deliver everywhere",   body: "Rendered videos hit our global CDN and reach your audience in under 5 minutes." },
    ],
  },
  // 6 — Progress bars infographic
  {
    type: "minimalProgressBars",
    duration: 150,
    title: "Product Health",
    bars: [
      { label: "Customer Retention",    value: 95, note: "95/100" },
      { label: "NPS Score",             value: 72, note: "72/100" },
      { label: "Pipeline Uptime",       value: 100, note: "99.9%" },
      { label: "On-Time Delivery",      value: 98, note: "98/100" },
    ],
  },
  // 7 — Closing
  {
    type: "minimalClosing",
    duration: 150,
    headline: "Start today.",
    tagline: "feedeo.ai",
  },
];

// ─── Presentation9 (Vaporwave / Retro-Futurism — WaveAudio) ──────────────────
export const DEFAULT_P9_SLIDES: P9Slide[] = [
  {
    type: "vaporHero",
    duration: 150,
    tag: "WaveAudio · Series A · 2026",
    title: "Music, reimagined.",
    subtitle: "AI-powered streaming that pays artists 10× more — and sounds better doing it.",
  },
  {
    type: "vaporStat",
    duration: 120,
    label: "Monthly Active Listeners",
    value: "4.2M",
    sublabel: "↑ 340% YoY — organic growth only",
    accent: "pink",
  },
  {
    type: "vaporGrid",
    duration: 160,
    headline: "Why WaveAudio wins",
    items: [
      { label: "Lossless AI Mastering", body: "Every track auto-mastered by our in-house model. Listeners notice the difference.", accent: "blue" },
      { label: "Artist-First Royalties", body: "$0.018 per stream vs. Spotify's $0.004. No label cut required.", accent: "pink" },
      { label: "Spatial Audio Engine", body: "Dynamic binaural mixing in real-time for any headphone or speaker.", accent: "purple" },
      { label: "Social Listening Rooms", body: "Live shared sessions with synchronized playback and live reactions.", accent: "yellow" },
      { label: "Mood Intelligence", body: "Proprietary emotion-tagging trains on listener behavior, not just genre.", accent: "blue" },
      { label: "Web3 Collector Drops", body: "Artists release limited plays as collectibles. Fans earn resale royalties.", accent: "pink" },
    ],
  },
  {
    type: "vaporStat",
    duration: 120,
    label: "Annual Recurring Revenue",
    value: "$8.7M",
    sublabel: "Up from $1.1M 18 months ago",
    accent: "blue",
  },
  {
    type: "vaporList",
    duration: 150,
    title: "What we're building",
    items: [
      "Adaptive stems API — license individual instrument tracks",
      "WaveAudio for Labels — B2B analytics dashboard",
      "Hardware partnership with Sony & Bose for spatial audio",
      "Creator Fund: $5M committed for independent artists",
    ],
  },
  {
    type: "vaporQuote",
    duration: 130,
    quote: "WaveAudio doesn't just stream music — it makes me feel like the music was made for me.",
    author: "Elena Vasquez",
    role: "Beta listener, 14 months active",
  },
  {
    type: "vaporTimeline",
    duration: 150,
    title: "Roadmap",
    milestones: [
      { year: "Q1 2025", label: "Public launch", accent: "blue" },
      { year: "Q3 2025", label: "1M listeners", accent: "pink" },
      { year: "Q1 2026", label: "Series A close", accent: "yellow" },
      { year: "Q4 2026", label: "10M listeners", accent: "pink" },
      { year: "2027", label: "Profitability", accent: "blue" },
    ],
  },
  {
    type: "vaporClosing",
    duration: 140,
    word: "WAVE.",
    tagline: "waveaudio.io · hello@waveaudio.io",
  },
];

// ─── Presentation10 (Warm Organic / Editorial — Verdant) ──────────────────────
export const DEFAULT_P10_SLIDES: P10Slide[] = [
  {
    type: "organicHero",
    duration: 180,
    eyebrow: "Series A · 2024",
    title: "Verdant",
    subtitle: "Consumer goods built with the planet in mind — and a brand people actually love.",
  },
  {
    type: "organicStats",
    duration: 180,
    title: "Traction",
    stats: [
      { value: "$4.2M", label: "ARR", note: "↑ 210% YoY" },
      { value: "68k", label: "Active customers", note: "NPS 74" },
      { value: "38%", label: "Repeat purchase rate", note: "Industry avg 19%" },
    ],
  },
  {
    type: "organicList",
    duration: 180,
    title: "Why sustainability wins now",
    items: [
      "72% of Gen Z will pay a premium for verified-sustainable goods",
      "Legislation is tightening: EU Green Claims Directive effective 2026",
      "Carbon-neutral supply chains are a retailer prerequisite by 2027",
      "First-mover certification creates lasting brand equity",
    ],
  },
  {
    type: "organicQuote",
    duration: 160,
    quote: "Verdant is the first brand that made me feel good about buying cleaning products. I haven't looked back.",
    author: "Maya L.",
    role: "Customer since 2022 · Portland, OR",
  },
  {
    type: "organicGrid",
    duration: 200,
    headline: "Four pillars of our model",
    items: [
      { title: "Certified B Corp", body: "Rigorous third-party verification of our social and environmental performance — renewed annually." },
      { title: "Closed-loop packaging", body: "100% compostable or refillable packaging. We reclaimed 42 tonnes of plastic equivalent in 2023." },
      { title: "Direct-to-consumer", body: "No retail margin, full data ownership, and 3× the LTV of category peers. Subscription rate: 61%." },
      { title: "Ingredient transparency", body: "Every ingredient sourced, scored, and published. QR code on pack links to full supply chain map." },
    ],
  },
  {
    type: "organicTimeline",
    duration: 200,
    title: "Our journey",
    milestones: [
      { year: "2020", label: "Founded", body: "Launched with 3 SKUs, $180k pre-seed, and a Shopify store." },
      { year: "2021", label: "B Corp certified", body: "Highest score in household goods category at time of certification." },
      { year: "2022", label: "$1.2M ARR", body: "Crossed 10k subscribers. Zero paid acquisition — all word of mouth." },
      { year: "2023", label: "Retail pilot", body: "500-door rollout with a national grocery chain. 94% reorder rate." },
      { year: "2024", label: "Series A", body: "Raising $8M to expand into personal care and scale DTC infrastructure." },
    ],
  },
  {
    type: "organicClosing",
    duration: 180,
    headline: "The earth is our longest-term investor.",
    tagline: "verdantgoods.co · hello@verdantgoods.co",
  },
];

// ─── Presentation11 (Blueprint — CoreBuilt) ───────────────────────────────────
export const DEFAULT_P11_SLIDES: P11Slide[] = [
  {
    type: "blueprintHero",
    duration: 120,
    projectCode: "PROJ-001 // SERIES-A",
    title: "Build Smarter. Build Safer.",
    subtitle: "CoreBuilt — Construction Intelligence Platform // est. 2021",
  },
  {
    type: "blueprintSpec",
    duration: 130,
    title: "Platform Specifications",
    specs: [
      { key: "ACTIVE_PROJECTS", value: "1,240", unit: "sites" },
      { key: "SENSOR_NODES_DEPLOYED", value: "18,500", unit: "units" },
      { key: "AVG_COST_REDUCTION", value: "23", unit: "%" },
      { key: "SAFETY_INCIDENTS_REDUCED", value: "61", unit: "%" },
      { key: "DATA_PROCESSED_DAILY", value: "4.2", unit: "TB" },
      { key: "UPTIME_SLA", value: "99.97", unit: "%" },
    ],
  },
  {
    type: "blueprintList",
    duration: 120,
    title: "What CoreBuilt Delivers",
    items: [
      "Real-time IoT sensor network across all active job sites",
      "AI-driven schedule risk detection — flags delays 14 days early",
      "Automated compliance reporting for OSHA and local codes",
      "Subcontractor coordination hub with live progress tracking",
      "Cost variance alerts tied directly to procurement data",
    ],
  },
  {
    type: "blueprintQuote",
    duration: 110,
    quote: "We cut our incident rate by more than half in the first year. CoreBuilt is now non-negotiable on every project we run.",
    author: "Marcus Chen",
    role: "VP Operations, Granite Ridge Construction",
  },
  {
    type: "blueprintDiagram",
    duration: 130,
    title: "Traction Metrics",
    bars: [
      { label: "ARR Growth (YoY)", value: 94, unit: "%" },
      { label: "Customer Retention", value: 97, unit: "%" },
      { label: "Site Adoption Rate", value: 82, unit: "%" },
      { label: "NPS Score", value: 76, unit: "/100" },
      { label: "Gross Margin", value: 71, unit: "%" },
    ],
  },
  {
    type: "blueprintGrid",
    duration: 130,
    headline: "Product Modules",
    items: [
      { code: "MOD-01", title: "SiteWatch IoT", body: "Wireless sensor mesh monitors structural loads, temperature, moisture, and worker proximity in real time." },
      { code: "MOD-02", title: "ScheduleAI", body: "Machine learning model trained on 10,000+ projects predicts schedule slippage before it happens." },
      { code: "MOD-03", title: "SafetyOS", body: "Automated hazard detection, near-miss logging, and one-click OSHA incident report generation." },
      { code: "MOD-04", title: "CostLens", body: "Links real-time material consumption to budget lines — flags overruns at the line-item level." },
      { code: "MOD-05", title: "SubConnect", body: "Unified portal for subcontractor scheduling, RFIs, daily logs, and lien waivers." },
      { code: "MOD-06", title: "ComplianceVault", body: "Auto-generates jurisdiction-specific permit packs, inspection checklists, and audit trails." },
    ],
  },
  {
    type: "blueprintClosing",
    duration: 140,
    projectCode: "PROJ-001 // SERIES-A // $18M",
    headline: "Build the Future.",
    tagline: "Raising $18M Series A to expand IoT hardware & international markets",
  },
];

// ─── Presentation13 (Diagonal Split / Color-Block Geometry — Studio Nova) ─────

export const DEFAULT_P13_SLIDES: P13Slide[] = [
  // 0 — Hero
  {
    type: "diagHero",
    duration: 120,
    eyebrow: "Architecture & Interior Design",
    title: "Studio Nova",
    subtitle: "Spaces that hold light, memory, and the way people move through the world.",
    accent: "#1A1A2E",
  },
  // 1 — Stat: years in business
  {
    type: "diagStat",
    duration: 110,
    value: "18",
    label: "Years in Practice",
    context: "Founded in 2007, Studio Nova has grown from a two-person atelier into a 60-person studio with offices in New York, Milan, and Tokyo.",
    accent: "#E63946",
  },
  // 2 — Grid: services / approach
  {
    type: "diagGrid",
    duration: 130,
    headline: "Design at Every Scale",
    items: [
      {
        title: "Architecture",
        body: "From cultural institutions to private residences — we approach every project as an exercise in material honesty and spatial choreography.",
      },
      {
        title: "Interiors",
        body: "We design interiors that earn their age gracefully: rich textures, precise joinery, and furniture conceived for the specific room it inhabits.",
      },
      {
        title: "Urbanism",
        body: "Master planning, public realm design, and adaptive reuse — we believe the most important room is the city itself.",
      },
    ],
    accent: "#2EC4B6",
  },
  // 3 — Quote: client testimonial
  {
    type: "diagQuote",
    duration: 130,
    quote: "Studio Nova gave us a building that people photograph not because it is spectacular, but because it is quietly, unmistakably right.",
    author: "Elena Marchetti",
    role: "Director, Fondazione Arca — Milan",
    accent: "#FF9F1C",
  },
  // 4 — List: notable commissions / awards
  {
    type: "diagList",
    duration: 130,
    title: "Select Work & Recognition",
    items: [
      "Arca Cultural Center, Milan — Pritzker Jury Special Citation 2022",
      "Kiyomi Residence, Kyoto — AIA Housing Award 2021",
      "The Bramble Hotel, Hudson Valley — AHEAD Americas Award, Best New Hotel 2023",
      "Riverside Public Library, Portland — AIA Public Architecture Award 2019",
      "Nova Flagship Offices, New York — Interior Design Hall of Fame, 2024",
    ],
    accent: "#6B2D8B",
  },
  // 5 — Timeline: studio growth milestones
  {
    type: "diagTimeline",
    duration: 140,
    title: "Studio Milestones",
    events: [
      { year: "2007", label: "Founded in Brooklyn, two architects" },
      { year: "2011", label: "First international commission, Copenhagen" },
      { year: "2015", label: "Milan office opens; team reaches 20" },
      { year: "2019", label: "Tokyo studio established" },
      { year: "2024", label: "60 staff across three continents" },
    ],
    accent: "#1A1A2E",
  },
  // 6 — Closing
  {
    type: "diagClosing",
    duration: 130,
    headline: "Space is the argument.",
    sub: "Studio Nova · New York · Milan · Tokyo",
    accent: "#E63946",
  },
];

// ─── Presentation12 (Kinetic Typography — APEX extreme sports brand) ───────────

export const DEFAULT_P12_SLIDES: P12Slide[] = [
  // 0 — Hero: APEX brand identity
  {
    type: "kineticHero",
    duration: 100,
    word1: "APEX",
    word2: "SPORTS",
    tagline: "NO LIMITS. NO EXCUSES. NO STOPPING.",
  },
  // 1 — Counter: member growth
  {
    type: "kineticCounter",
    duration: 110,
    from: 0,
    to: 10000,
    suffix: "+",
    label: "Athletes Worldwide",
    color: "green",
  },
  // 2 — Split: training philosophy
  {
    type: "kineticSplit",
    duration: 100,
    left: "PUSH",
    right: "HARDER",
    connector: "×",
  },
  // 3 — Stat: completion rate
  {
    type: "kineticStat",
    duration: 100,
    value: "94%",
    label: "Program Completion Rate",
    color: "red",
  },
  // 4 — List: what APEX delivers
  {
    type: "kineticList",
    duration: 130,
    items: [
      "ELITE COACHING",
      "LIVE WORKOUTS",
      "NUTRITION PLANS",
      "COMMUNITY",
    ],
  },
  // 5 — Quote: athlete testimonial
  {
    type: "kineticQuote",
    duration: 120,
    quote: "APEX didn't just change my body. It changed what I believe I'm capable of.",
    author: "Jordan Lee — Pro Athlete",
  },
  // 6 — Counter: sessions logged
  {
    type: "kineticCounter",
    duration: 110,
    from: 0,
    to: 2400000,
    suffix: "",
    label: "Training Sessions Logged",
    color: "yellow",
  },
  // 7 — Closing
  {
    type: "kineticClosing",
    duration: 130,
    brand: "APEX",
    call: "JOIN THE MOVEMENT",
  },
];

// ─── P14 Default Props — The Meridian Report / Meridian Tech IPO ─────────────

export const DEFAULT_P14_SLIDES: P14Slide[] = [
  {
    type: "broadHero",
    duration: 130,
    headline: "Meridian Tech Goes Public in Landmark $4.2B Tech IPO",
    deck: "The enterprise AI platform prices above range as institutional investors pile in; shares surge 38% on debut.",
    byline: "Clara Whitmore, Markets Correspondent",
    date: "Tuesday, March 18, 2025",
  },
  {
    type: "broadLead",
    duration: 130,
    section: "Markets & Finance",
    headline: "A Platform Built for the Age of Intelligent Infrastructure",
    body: "Meridian Tech's rise from a San Francisco garage in 2018 to a $4.2 billion public company is the defining technology story of this cycle. The company's core platform — MeridianOS — sits at the intersection of enterprise workflow automation and large-scale AI inference, two of the most capital-intensive problems facing the Fortune 500. Its customers include 9 of the top 20 global banks, three national healthcare systems, and the logistics arms of two of the world's largest retailers. Unlike competitors who resell third-party models, Meridian trains proprietary transformer architectures on client data, keeps weights on-premise, and charges on a per-inference basis — a model that produces sticky, expanding revenue without the cloud dependency risk that plagues SaaS incumbents.",
    pullQuote: "\"Meridian has built the plumbing for the intelligent enterprise. This is the operating system for the next decade of business.\"",
  },
  {
    type: "broadStats",
    duration: 120,
    section: "By the Numbers",
    headline: "The Financial Anatomy of a Landmark Offering",
    stats: [
      { value: "$4.2B", label: "IPO Valuation", delta: "+19% above range" },
      { value: "$312M", label: "Trailing 12-Month ARR", delta: "+94% YoY" },
      { value: "38%", label: "First-Day Share Gain", delta: "Best debut since 2021" },
      { value: "127%", label: "Net Revenue Retention", delta: "Enterprise cohort" },
    ],
  },
  {
    type: "broadQuote",
    duration: 120,
    section: "Executive Perspective",
    title: "A Word from the Founder",
    quote: "We did not build Meridian to be acquired or to chase a valuation. We built it because every enterprise in the world is drowning in data they cannot act on. We are the drain.",
    attribution: "— Elara Voss, Founder & CEO, Meridian Tech",
  },
  {
    type: "broadGrid",
    duration: 130,
    section: "Technology",
    headline: "Three Pillars of the Meridian Platform",
    items: [
      {
        kicker: "Core Infrastructure",
        title: "MeridianOS: The Intelligent Middleware",
        body: "MeridianOS integrates with 200+ enterprise data sources — ERP, CRM, data warehouses, document stores — via a schema-agnostic connector layer. Once connected, the platform continuously indexes, embeds, and reasons over live data without requiring migration or transformation. Customers report a median time-to-value of 11 days, versus 14 months for comparable legacy implementations.",
      },
      {
        kicker: "AI & Models",
        title: "Proprietary Model Architecture",
        body: "Meridian's research team has developed a family of domain-specific transformer models fine-tuned for finance, healthcare, and logistics verticals. Models are deployed on-premise inside customer VPCs, eliminating data egress risk and satisfying the compliance requirements that have historically blocked AI adoption in regulated industries. The company holds 14 patents on inference optimization.",
      },
      {
        kicker: "Revenue Engine",
        title: "Usage-Based Pricing That Scales With Value",
        body: "Rather than per-seat licensing, Meridian charges per inference call, aligning revenue directly to customer value creation. This structure has produced a dollar-based net retention rate of 127% — meaning existing customers expand spend by an average of 27% each year. Gross margins have expanded from 61% in 2022 to 74% in the trailing twelve months, reflecting operating leverage in model serving.",
      },
    ],
  },
  {
    type: "broadTimeline",
    duration: 130,
    section: "Company History",
    headline: "Meridian Tech: Seven Years to the Closing Bell",
    events: [
      {
        date: "Jan 2018",
        headline: "Founded in San Francisco",
        body: "Elara Voss and co-founder Dr. James Okafor leave Google DeepMind to start Meridian with $2.1M in seed funding from Benchmark.",
      },
      {
        date: "Q3 2019",
        headline: "Series A — $18M",
        body: "First enterprise contract signed with JPMorgan Chase. MeridianOS v1.0 enters private beta. Team grows to 34.",
      },
      {
        date: "Q1 2021",
        headline: "Series B — $75M at $420M valuation",
        body: "Expansion into healthcare vertical. Partnership with Epic Systems announced. ARR crosses $28M.",
      },
      {
        date: "Q4 2022",
        headline: "Series C — $160M at $1.1B valuation",
        body: "Meridian achieves unicorn status. International expansion to UK and Singapore. ARR reaches $89M.",
      },
      {
        date: "Q2 2024",
        headline: "ARR crosses $250M — profitability milestone",
        body: "Company reaches positive operating cash flow for the first time. Headcount: 620 globally.",
      },
      {
        date: "Mar 2025",
        headline: "NYSE listing — ticker: MRDX",
        body: "IPO prices at $28/share ($4.2B valuation). Shares close at $38.64 on day one. Market cap: $5.8B.",
      },
    ],
  },
  {
    type: "broadClosing",
    duration: 140,
    edition: "Special IPO Edition · March 2025",
    headline: "The Future Is Intelligent.",
    tagline: "Meridian Tech — trading on the NYSE under the symbol MRDX",
  },
];

// ─── P15 Default Props — Feedeo Internal Engineering Sprint Review ─────────────

export const DEFAULT_P15_SLIDES: P15Slide[] = [
  {
    type: "termHero",
    duration: 180,
    command: "feedeo-cli sprint-review --team=eng --sprint=42",
    output: [
      "Feedeo Engineering Sprint Review — Sprint #42",
      "Date: 2026-03-18  |  Team: Platform & Render",
      "Participants: 8 engineers, 1 EM, 1 PM",
      "Status: READY",
    ],
    tagline: "All systems nominal. Presentation initializing...",
  },
  {
    type: "termLoad",
    duration: 200,
    label: "Running pre-review pipeline checks...",
    steps: [
      { text: "CI build pipeline — all 147 tests passing", done: true },
      { text: "Render worker health — 12/12 nodes online", done: true },
      { text: "Redis queue depth — 0 pending jobs", done: true },
      { text: "Supabase DB — migrations current", done: true },
      { text: "Staging deploy — v2.7.1 live", done: true },
    ],
  },
  {
    type: "termStat",
    duration: 180,
    query: "SELECT metric, value FROM kpis WHERE sprint=42 AND id='RENDERS'",
    key: "Videos Rendered",
    value: "1.2M",
    unit: "total this sprint",
    notes: [
      "Peak throughput: 4,800 renders/hour on Friday",
      "Avg render time: 11.3s per video (down 18% vs Sprint 41)",
      "Zero SLA breaches — all renders completed within 60s",
    ],
  },
  {
    type: "termList",
    duration: 200,
    heading: "Sprint42_Deliverables",
    items: [
      "Async BullMQ render queue — 10x throughput improvement",
      "Remotion Lambda cold-start optimisation — 18% faster",
      "Supabase RLS policies for multi-tenant video isolation",
      "Stripe metered billing integration — per-render pricing",
      "P14 Broadsheet presentation style shipped to production",
      "Admin dashboard: real-time queue depth + worker status",
    ],
  },
  {
    type: "termQuote",
    duration: 180,
    quote: "This sprint we crossed 1M renders. The pipeline held. No drama.",
    author: "Dameus",
    role: "Engineering Lead",
  },
  {
    type: "termBar",
    duration: 200,
    title: "metrics --system --sprint=42",
    bars: [
      { label: "Uptime", value: 99, max: 100 },
      { label: "Render Speed", value: 94, max: 100 },
      { label: "Test Coverage", value: 87, max: 100 },
      { label: "Deploy Freq", value: 100, max: 100 },
    ],
  },
  {
    type: "termClosing",
    duration: 180,
    message: "Sprint 42 complete. Ship it.",
    prompt: "./ship.sh --prod",
  },
];

// ─── Presentation16 (Comic Book / Halftone) — Subject: PixelHero mobile game studio ─

export const DEFAULT_P16_SLIDES: P16Slide[] = [
  // 0 — Hero: LAUNCHED!
  {
    type: "comicHero",
    duration: 120,
    action: "LAUNCHED!",
    hero: "Galaxy Punch",
    tagline: "PixelHero Studios · The Game Has Changed",
  },
  // 1 — Stat: 2M downloads
  {
    type: "comicStat",
    duration: 110,
    exclamation: "WOW!",
    value: "2M",
    label: "Downloads in the First Week",
    color: "red",
  },
  // 2 — Split: Before vs After
  {
    type: "comicSplit",
    duration: 110,
    panel1: { text: "BEFORE\nMobile Gaming", color: "blue" },
    panel2: { text: "AFTER\nGalaxy Punch", color: "yellow" },
    versus: true,
  },
  // 3 — List: Game features
  {
    type: "comicList",
    duration: 130,
    title: "Power-Ups!",
    items: [
      "Real-time 60fps galactic combat engine",
      "50+ unique fighters with combo chains",
      "Cross-platform: iOS, Android & Web",
      "Live PvP tournaments with prize pools",
      "Offline campaign — no internet required",
    ],
  },
  // 4 — Quote: Player testimonial
  {
    type: "comicQuote",
    duration: 120,
    quote: "I haven't put my phone down in three days. Galaxy Punch is the most addictive game I've ever played. The combos, the graphics, the sound — absolute perfection.",
    author: "ZeroGravKai",
    role: "Top-Ranked Player · 1.2M Followers",
  },
  // 5 — Stats Grid
  {
    type: "comicStatsGrid",
    duration: 130,
    headline: "By the Numbers",
    stats: [
      { value: "4.9★", label: "App Store Rating", color: "yellow" },
      { value: "2M+", label: "Downloads Week 1", color: "red" },
      { value: "140+", label: "Countries Reached", color: "blue" },
      { value: "$3.8M", label: "Revenue — Day 7", color: "red" },
    ],
  },
  // 6 — Closing
  {
    type: "comicClosing",
    duration: 130,
    action: "TO BE CONTINUED...",
    tagline: "Galaxy Punch — Free to Download. Impossible to Put Down.",
    cta: "PLAY NOW · galaxypunch.gg",
  },
];

// ─── Presentation17 — Fundamentals of Business (Prestige Academic) ────────────
// Script: ~30s intro by Prof. Elena Markov
// Slide durations account for 5 × 20-frame fade transitions (100 frames total overlap)
// Total raw frames: 930 — net rendered: 830 ≈ 27.7s @ 30fps

export const DEFAULT_P17_SLIDES: P17Slide[] = [
  // 0 — Course title (5s — talking head: talkinghead_clean.mp4)
  {
    type: "title17",
    duration: 150,
    title: "Fundamentals of Business",
    subtitle: "A twelve-week deep dive",
    course: "Course Introduction",
  },
  // 1 — Six pillars (6s)
  {
    type: "pillars17",
    duration: 180,
    title: "One coherent picture",
    pillars: ["Strategy", "Finance", "Marketing", "Operations", "People", "Global Systems"],
  },
  // 2 — Professor bio (5s)
  {
    type: "prof17",
    duration: 150,
    name: "Prof. Elena Markov",
    role: "Former McKinsey Engagement Manager",
    background:
      "Now teaching full-time — bringing real-world deal experience into the classroom.",
  },
  // 3 — Manifesto (6s)
  {
    type: "manifesto17",
    duration: 180,
    statement: "We won't romanticize business.",
    detail:
      "We'll dissect how real value gets created, captured — and far more often — destroyed in messy, uncertain markets.",
  },
  // 4 — What to expect (5s)
  {
    type: "expect17",
    duration: 150,
    title: "No fluff. No shortcuts.",
    items: ["Logic", "Hard trade-offs", "Almost no buzzwords"],
  },
  // 5 — CTA (4s)
  {
    type: "cta17",
    duration: 120,
    headline: "Let's get to work.",
    instruction: "Skim the syllabus · Roll call · Then straight into why 80% of firms fail at executing the basics.",
  },
];
