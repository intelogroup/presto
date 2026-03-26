// src/schema.ts
import { z } from "zod";
import { VALID_ICON_NAMES } from "./iconMap";

// Validates that iconName strings are known keys — fails fast before render
const IconNameSchema = z.string().refine(
  (v: string) => VALID_ICON_NAMES.includes(v),
  { message: `iconName must be one of: ${VALID_ICON_NAMES.join(", ")}` }
);

// ─── Presentation1 Slide Schemas ─────────────────────────────────────────────

// Face tracking keypoint: normalized position of speaker's face at a given time
export const FaceTrackPointSchema = z.object({
  t: z.number(), // timestamp in seconds
  x: z.number().min(0).max(1), // horizontal center (0=left, 1=right)
  y: z.number().min(0).max(1), // vertical center (0=top, 1=bottom)
});

export const FaceTrackSchema = z.array(FaceTrackPointSchema).optional();

export type FaceTrackPoint = z.infer<typeof FaceTrackPointSchema>;

// duration is in frames at 30fps (min 60 = 2 seconds)
const DurationBase = z.object({ duration: z.number().int().min(60) });

export const TitleSlideSchema = DurationBase.extend({
  type: z.literal("title"),
  title: z.string(),
  subtitle: z.string().optional(),
});

export const IconGridItemSchema = z.object({
  iconName: IconNameSchema,
  label: z.string(),
  color: z.string(),
});

export const IconGridSlideSchema = DurationBase.extend({
  type: z.literal("iconGrid"),
  title: z.string(),
  items: z.array(IconGridItemSchema),
});

export const ChecklistSlideSchema = DurationBase.extend({
  type: z.literal("checklist"),
  title: z.string(),
  points: z.array(z.string()),
});

export const StatItemSchema = z.object({
  iconName: IconNameSchema,
  value: z.number(),
  label: z.string(),
  suffix: z.string().default(""),
  color: z.string(),
});

export const StatsSlideSchema = DurationBase.extend({
  type: z.literal("stats"),
  title: z.string(),
  stats: z.array(StatItemSchema),
});

export const ImageSlideSchema = DurationBase.extend({
  type: z.literal("image"),
  title: z.string(),
  src: z.string(),
});

export const BarSchema = z.object({
  label: z.string(),
  value: z.number().min(0).max(100),
  color: z.string(),
});

export const BarChartSlideSchema = DurationBase.extend({
  type: z.literal("barChart"),
  title: z.string(),
  bars: z.array(BarSchema),
});

export const MilestoneSchema = z.object({
  date: z.string(),
  label: z.string(),
  description: z.string(),
});

export const TimelineSlideSchema = DurationBase.extend({
  type: z.literal("timeline"),
  title: z.string(),
  milestones: z.array(MilestoneSchema),
});

export const QuoteSlideSchema = DurationBase.extend({
  type: z.literal("quote"),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

export const FeatureItemSchema = z.object({
  iconName: IconNameSchema,
  title: z.string(),
  body: z.string(),
  color: z.string(),
});

export const IconFeaturesSlideSchema = DurationBase.extend({
  type: z.literal("iconFeatures"),
  title: z.string(),
  features: z.array(FeatureItemSchema),
});

export const P1SlideSchema = z.discriminatedUnion("type", [
  TitleSlideSchema,
  IconGridSlideSchema,
  ChecklistSlideSchema,
  StatsSlideSchema,
  ImageSlideSchema,
  BarChartSlideSchema,
  TimelineSlideSchema,
  QuoteSlideSchema,
  IconFeaturesSlideSchema,
]);

export type P1Slide = z.infer<typeof P1SlideSchema>;

export const Presentation1PropsSchema = z.object({
  slides: z.array(P1SlideSchema),
  logoSrc: z.string().optional(),
  talkingHeadSrc: z.string().optional(),
  faceTrack: FaceTrackSchema,
});

export type Presentation1Props = z.infer<typeof Presentation1PropsSchema>;

// ─── Presentation2 Slide Schemas (Editorial) ─────────────────────────────────

export const SplitTitleSlide2Schema = DurationBase.extend({
  type: z.literal("splitTitle"),
  title: z.string(),
  subtitle: z.string().optional(),
  tag: z.string().optional(),
});

export const TypewriterSlide2Schema = DurationBase.extend({
  type: z.literal("typewriter"),
  text: z.string(),
  author: z.string().optional(),
  typingEndFrame: z.number().int().optional(),
});

export const BigNumberSlide2Schema = DurationBase.extend({
  type: z.literal("bigNumber"),
  value: z.number(),
  decimals: z.number().int().min(0).max(6).optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  label: z.string(),
  sublabel: z.string().optional(),
  dark: z.boolean().optional(),
});

export const MagazineItemSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export const MagazineGridSlide2Schema = DurationBase.extend({
  type: z.literal("magazineGrid"),
  headline: z.string(),
  items: z.tuple([MagazineItemSchema, MagazineItemSchema, MagazineItemSchema]),
});

export const PullQuoteSlide2Schema = DurationBase.extend({
  type: z.literal("pullQuote"),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

export const StatItem2Schema = z.object({
  value: z.number(),
  decimals: z.number().int().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  label: z.string(),
});

export const SplitStatsSlide2Schema = DurationBase.extend({
  type: z.literal("splitStats"),
  title: z.string(),
  stats: z.tuple([StatItem2Schema, StatItem2Schema, StatItem2Schema, StatItem2Schema]),
});

export const P2SlideSchema = z.discriminatedUnion("type", [
  SplitTitleSlide2Schema,
  TypewriterSlide2Schema,
  BigNumberSlide2Schema,
  MagazineGridSlide2Schema,
  PullQuoteSlide2Schema,
  SplitStatsSlide2Schema,
]);

export type P2Slide = z.infer<typeof P2SlideSchema>;

export const Presentation2PropsSchema = z.object({
  slides: z.array(P2SlideSchema),
});

export type Presentation2Props = z.infer<typeof Presentation2PropsSchema>;

// ─── Presentation3 Slide Schemas (Dashboard) ─────────────────────────────────

export const KpiTitleSlide3Schema = DurationBase.extend({
  type: z.literal("kpiTitle"),
  title: z.string(),
  tagline: z.string(),
  badge: z.string().optional(),
});

export const BigStatSlide3Schema = DurationBase.extend({
  type: z.literal("bigStat"),
  label: z.string(),
  value: z.string(),
  numericValue: z.number(),
  unit: z.string().optional(),
  trend: z.enum(["up", "down", "neutral"]),
  caption: z.string().optional(),
});

export const MetricItem3Schema = z.object({
  label: z.string(),
  value: z.string(),
  delta: z.string().optional(),
});

export const MetricRowSlide3Schema = DurationBase.extend({
  type: z.literal("metricRow"),
  title: z.string(),
  metrics: z.tuple([MetricItem3Schema, MetricItem3Schema, MetricItem3Schema]),
});

export const Bar3Schema = z.object({
  label: z.string(),
  value: z.number(),
});

export const BarRaceSlide3Schema = DurationBase.extend({
  type: z.literal("barRace"),
  title: z.string(),
  bars: z.array(Bar3Schema),
  maxValue: z.number(),
});

export const MilestoneSlide3Schema = DurationBase.extend({
  type: z.literal("milestone"),
  icon: z.string(),
  headline: z.string(),
  caption: z.string(),
  year: z.string().optional(),
});

export const P3SlideSchema = z.discriminatedUnion("type", [
  KpiTitleSlide3Schema,
  BigStatSlide3Schema,
  MetricRowSlide3Schema,
  BarRaceSlide3Schema,
  MilestoneSlide3Schema,
]);

export type P3Slide = z.infer<typeof P3SlideSchema>;

// talkingHeadSrc is intentionally optional (matching P1 pattern) — composition
// renders slides-only when omitted. The spec draft showed it as required, but
// optional matches the P1 convention and allows rendering without a video file.
export const Presentation3PropsSchema = z.object({
  slides: z.array(P3SlideSchema),
  talkingHeadSrc: z.string().optional(),
  faceTrack: FaceTrackSchema,
});

export type Presentation3Props = z.infer<typeof Presentation3PropsSchema>;

// ─── Presentation4 Slide Schemas (Bold Swiss / Brutalist) ────────────────────

export const BrutalistHeroSlide4Schema = DurationBase.extend({
  type: z.literal("brutalistHero"),
  title: z.string(),
  tag: z.string(),
  subtitle: z.string(),
});

export const WordStampSlide4Schema = DurationBase.extend({
  type: z.literal("wordStamp"),
  words: z.array(z.string()),
  keyWordIndex: z.number().int().optional(),
  caption: z.string().optional(),
});

const ColumnAccentSchema = z.enum(["red", "yellow", "black"]);

const TriColumnSchema = z.object({
  value: z.number(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  label: z.string(),
  accent: ColumnAccentSchema,
});

export const TriGridSlide4Schema = DurationBase.extend({
  type: z.literal("triGrid"),
  headline: z.string(),
  columns: z.tuple([TriColumnSchema, TriColumnSchema, TriColumnSchema]),
});

export const HalfBleedSlide4Schema = DurationBase.extend({
  type: z.literal("halfBleed"),
  bigValue: z.string(),
  bigLabel: z.string(),
  facts: z.array(z.string()),
});

export const BoldQuoteSlide4Schema = DurationBase.extend({
  type: z.literal("boldQuote"),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

export const ClosingStripeSlide4Schema = DurationBase.extend({
  type: z.literal("closingStripe"),
  word: z.string(),
  tagline: z.string(),
});

export const P4SlideSchema = z.discriminatedUnion("type", [
  BrutalistHeroSlide4Schema,
  WordStampSlide4Schema,
  TriGridSlide4Schema,
  HalfBleedSlide4Schema,
  BoldQuoteSlide4Schema,
  ClosingStripeSlide4Schema,
]);

export type P4Slide = z.infer<typeof P4SlideSchema>;

export const Presentation4PropsSchema = z.object({
  slides: z.array(P4SlideSchema),
});

export type Presentation4Props = z.infer<typeof Presentation4PropsSchema>;

// ─── Presentation5 Slide Schemas (Glassmorphism Dark) ────────────────────────

const P5AccentSchema = z.enum(["teal", "blue", "violet"]);

export const GlassHeroSlide5Schema = DurationBase.extend({
  type: z.literal("glassHero"),
  title: z.string(),
  subtitle: z.string(),
  tag: z.string(),
});

const GlassStat5Schema = z.object({
  value: z.string(),
  label: z.string(),
  accent: P5AccentSchema,
});

export const GlassStatsSlide5Schema = DurationBase.extend({
  type: z.literal("glassStats"),
  title: z.string(),
  stats: z.array(GlassStat5Schema),
});

const GlassGridItem5Schema = z.object({
  label: z.string(),
  body: z.string(),
  accent: z.enum(["teal", "blue", "violet", "white"]),
});

export const GlassGridSlide5Schema = DurationBase.extend({
  type: z.literal("glassGrid"),
  headline: z.string(),
  items: z.tuple([GlassGridItem5Schema, GlassGridItem5Schema, GlassGridItem5Schema, GlassGridItem5Schema]),
});

export const GlassQuoteSlide5Schema = DurationBase.extend({
  type: z.literal("glassQuote"),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

const GlassBar5Schema = z.object({
  label: z.string(),
  value: z.number(),
  maxValue: z.number(),
});

export const GlassBarSlide5Schema = DurationBase.extend({
  type: z.literal("glassBar"),
  title: z.string(),
  bars: z.array(GlassBar5Schema),
});

export const GlassClosingSlide5Schema = DurationBase.extend({
  type: z.literal("glassClosing"),
  headline: z.string(),
  tagline: z.string(),
});

const GlassIconFeature5Schema = z.object({
  iconName: IconNameSchema,
  title: z.string(),
  body: z.string(),
  accent: P5AccentSchema,
});

export const GlassIconFeaturesSlide5Schema = DurationBase.extend({
  type: z.literal("glassIconFeatures"),
  headline: z.string(),
  features: z.array(GlassIconFeature5Schema),
});

const GlassDonutSegment5Schema = z.object({
  label: z.string(),
  value: z.number(),
  accent: P5AccentSchema,
});

export const GlassDonutSlide5Schema = DurationBase.extend({
  type: z.literal("glassDonut"),
  title: z.string(),
  segments: z.array(GlassDonutSegment5Schema),
  centerLabel: z.string(),
  centerValue: z.string(),
});

export const P5SlideSchema = z.discriminatedUnion("type", [
  GlassHeroSlide5Schema,
  GlassStatsSlide5Schema,
  GlassGridSlide5Schema,
  GlassQuoteSlide5Schema,
  GlassBarSlide5Schema,
  GlassClosingSlide5Schema,
  GlassIconFeaturesSlide5Schema,
  GlassDonutSlide5Schema,
]);

export type P5Slide = z.infer<typeof P5SlideSchema>;

export const Presentation5PropsSchema = z.object({
  slides: z.array(P5SlideSchema),
});

export type Presentation5Props = z.infer<typeof Presentation5PropsSchema>;

// ─── Presentation6 Slide Schemas (Cinematic Gold) ────────────────────────────

const CinemaColumn6Schema = z.object({
  title: z.string(),
  body: z.string(),
});

export const CinemaHeroSlide6Schema = DurationBase.extend({
  type: z.literal("cinemaHero"),
  chapter: z.string(),
  title: z.string(),
  subtitle: z.string(),
});

export const CinemaStatSlide6Schema = DurationBase.extend({
  type: z.literal("cinemaStat"),
  label: z.string(),
  value: z.string(),
  sublabel: z.string().optional(),
  context: z.string().optional(),
});

export const CinemaGridSlide6Schema = DurationBase.extend({
  type: z.literal("cinemaGrid"),
  headline: z.string(),
  columns: z.tuple([CinemaColumn6Schema, CinemaColumn6Schema, CinemaColumn6Schema]),
});

export const CinemaQuoteSlide6Schema = DurationBase.extend({
  type: z.literal("cinemaQuote"),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

export const CinemaListSlide6Schema = DurationBase.extend({
  type: z.literal("cinemaList"),
  title: z.string(),
  items: z.array(z.string()),
});

export const CinemaClosingSlide6Schema = DurationBase.extend({
  type: z.literal("cinemaClosing"),
  word: z.string(),
  tagline: z.string(),
});

export const CinemaImageFullSlide6Schema = DurationBase.extend({
  type: z.literal("cinemaImageFull"),
  src: z.string(),
  title: z.string(),
  caption: z.string().optional(),
  overlay: z.string().optional(),
});

export const CinemaIconItem6Schema = z.object({
  iconName: z.string(),
  title: z.string(),
  body: z.string(),
});

export const CinemaIconRowSlide6Schema = DurationBase.extend({
  type: z.literal("cinemaIconRow"),
  headline: z.string(),
  items: z.tuple([CinemaIconItem6Schema, CinemaIconItem6Schema, CinemaIconItem6Schema]),
});

export const P6SlideSchema = z.discriminatedUnion("type", [
  CinemaHeroSlide6Schema,
  CinemaStatSlide6Schema,
  CinemaGridSlide6Schema,
  CinemaQuoteSlide6Schema,
  CinemaListSlide6Schema,
  CinemaClosingSlide6Schema,
  CinemaImageFullSlide6Schema,
  CinemaIconRowSlide6Schema,
]);

export type P6Slide = z.infer<typeof P6SlideSchema>;

export const Presentation6PropsSchema = z.object({
  slides: z.array(P6SlideSchema),
});

export type Presentation6Props = z.infer<typeof Presentation6PropsSchema>;

// ─── Presentation7 Slide Schemas (Neon Grid / Cyber) ─────────────────────────

const CyberAccent7Schema = z.enum(["cyan", "magenta", "green"]);

const CyberMetric7Schema = z.object({
  value: z.string(),
  label: z.string(),
  delta: z.string().optional(),
  accent: CyberAccent7Schema,
});

const CyberBar7Schema = z.object({
  label: z.string(),
  value: z.number().min(0).max(100),
});

export const CyberHeroSlide7Schema = DurationBase.extend({
  type: z.literal("cyberHero"),
  title: z.string(),
  subtitle: z.string(),
  systemLabel: z.string(),
});

export const CyberMetricsSlide7Schema = DurationBase.extend({
  type: z.literal("cyberMetrics"),
  title: z.string(),
  metrics: z.array(CyberMetric7Schema),
});

export const CyberBarSlide7Schema = DurationBase.extend({
  type: z.literal("cyberBar"),
  title: z.string(),
  bars: z.array(CyberBar7Schema),
});

export const CyberListSlide7Schema = DurationBase.extend({
  type: z.literal("cyberList"),
  title: z.string(),
  items: z.array(z.string()),
});

export const CyberQuoteSlide7Schema = DurationBase.extend({
  type: z.literal("cyberQuote"),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

export const CyberClosingSlide7Schema = DurationBase.extend({
  type: z.literal("cyberClosing"),
  word: z.string(),
  tagline: z.string(),
});

const CyberLinePoint7Schema = z.object({
  label: z.string(),
  value: z.number().min(0).max(100),
});

export const CyberLineChartSlide7Schema = DurationBase.extend({
  type: z.literal("cyberLineChart"),
  title: z.string(),
  points: z.array(CyberLinePoint7Schema),
  yLabel: z.string().optional(),
  accent: CyberAccent7Schema,
});

const CyberIconGridItem7Schema = z.object({
  iconName: z.string(),
  label: z.string(),
  value: z.string().optional(),
  accent: CyberAccent7Schema,
});

export const CyberIconGridSlide7Schema = DurationBase.extend({
  type: z.literal("cyberIconGrid"),
  title: z.string(),
  items: z.array(CyberIconGridItem7Schema),
});

export const P7SlideSchema = z.discriminatedUnion("type", [
  CyberHeroSlide7Schema,
  CyberMetricsSlide7Schema,
  CyberBarSlide7Schema,
  CyberListSlide7Schema,
  CyberQuoteSlide7Schema,
  CyberClosingSlide7Schema,
  CyberLineChartSlide7Schema,
  CyberIconGridSlide7Schema,
]);

export type P7Slide = z.infer<typeof P7SlideSchema>;

export const Presentation7PropsSchema = z.object({
  slides: z.array(P7SlideSchema),
});

export type Presentation7Props = z.infer<typeof Presentation7PropsSchema>;

// ─── Presentation8 Slide Schemas (Clean Minimalist) ──────────────────────────

const MinimalStat8Schema = z.object({
  value: z.string(),
  label: z.string(),
  note: z.string().optional(),
});

const MinimalGridItem8Schema = z.object({
  title: z.string(),
  body: z.string(),
});

export const MinimalHeroSlide8Schema = DurationBase.extend({
  type: z.literal("minimalHero"),
  title: z.string(),
  subtitle: z.string(),
  tag: z.string(),
});

export const MinimalStatsSlide8Schema = DurationBase.extend({
  type: z.literal("minimalStats"),
  title: z.string(),
  stats: z.tuple([MinimalStat8Schema, MinimalStat8Schema, MinimalStat8Schema]),
});

export const MinimalListSlide8Schema = DurationBase.extend({
  type: z.literal("minimalList"),
  title: z.string(),
  items: z.array(z.string()),
});

export const MinimalQuoteSlide8Schema = DurationBase.extend({
  type: z.literal("minimalQuote"),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

export const MinimalGridSlide8Schema = DurationBase.extend({
  type: z.literal("minimalGrid"),
  headline: z.string(),
  items: z.tuple([MinimalGridItem8Schema, MinimalGridItem8Schema, MinimalGridItem8Schema, MinimalGridItem8Schema]),
});

export const MinimalClosingSlide8Schema = DurationBase.extend({
  type: z.literal("minimalClosing"),
  headline: z.string(),
  tagline: z.string(),
});

const MinimalIconFeature8Schema = z.object({
  iconName: z.string(),
  title: z.string(),
  body: z.string(),
});

export const MinimalIconFeaturesSlide8Schema = DurationBase.extend({
  type: z.literal("minimalIconFeatures"),
  headline: z.string(),
  features: z.tuple([MinimalIconFeature8Schema, MinimalIconFeature8Schema, MinimalIconFeature8Schema]),
});

const MinimalBar8Schema = z.object({
  label: z.string(),
  value: z.number().min(0).max(100),
  note: z.string().optional(),
});

export const MinimalProgressBarsSlide8Schema = DurationBase.extend({
  type: z.literal("minimalProgressBars"),
  title: z.string(),
  bars: z.array(MinimalBar8Schema).min(3).max(5),
});

export const P8SlideSchema = z.discriminatedUnion("type", [
  MinimalHeroSlide8Schema,
  MinimalStatsSlide8Schema,
  MinimalListSlide8Schema,
  MinimalQuoteSlide8Schema,
  MinimalGridSlide8Schema,
  MinimalClosingSlide8Schema,
  MinimalIconFeaturesSlide8Schema,
  MinimalProgressBarsSlide8Schema,
]);

export type P8Slide = z.infer<typeof P8SlideSchema>;

export const Presentation8PropsSchema = z.object({
  slides: z.array(P8SlideSchema),
});

export type Presentation8Props = z.infer<typeof Presentation8PropsSchema>;

// ─── Presentation9 Slide Schemas (Vaporwave / Retro-Futurism) ────────────────

const VaporAccent9Schema = z.enum(["pink", "blue", "yellow", "purple"]);
const VaporAccent3Schema = z.enum(["pink", "blue", "yellow"]);

export const VaporHeroSlide9Schema = DurationBase.extend({
  type: z.literal("vaporHero"),
  title: z.string(),
  subtitle: z.string(),
  tag: z.string(),
});

export const VaporStatSlide9Schema = DurationBase.extend({
  type: z.literal("vaporStat"),
  label: z.string(),
  value: z.string(),
  sublabel: z.string().optional(),
  accent: VaporAccent3Schema,
});

export const VaporGridSlide9Schema = DurationBase.extend({
  type: z.literal("vaporGrid"),
  headline: z.string(),
  items: z.array(
    z.object({
      label: z.string(),
      body: z.string(),
      accent: VaporAccent9Schema,
    })
  ),
});

export const VaporListSlide9Schema = DurationBase.extend({
  type: z.literal("vaporList"),
  title: z.string(),
  items: z.array(z.string()),
});

export const VaporQuoteSlide9Schema = DurationBase.extend({
  type: z.literal("vaporQuote"),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

export const VaporTimelineSlide9Schema = DurationBase.extend({
  type: z.literal("vaporTimeline"),
  title: z.string(),
  milestones: z.array(
    z.object({
      year: z.string(),
      label: z.string(),
      accent: VaporAccent3Schema,
    })
  ),
});

export const VaporClosingSlide9Schema = DurationBase.extend({
  type: z.literal("vaporClosing"),
  word: z.string(),
  tagline: z.string(),
});

export const P9SlideSchema = z.discriminatedUnion("type", [
  VaporHeroSlide9Schema,
  VaporStatSlide9Schema,
  VaporGridSlide9Schema,
  VaporListSlide9Schema,
  VaporQuoteSlide9Schema,
  VaporTimelineSlide9Schema,
  VaporClosingSlide9Schema,
]);

export type P9Slide = z.infer<typeof P9SlideSchema>;

export const Presentation9PropsSchema = z.object({
  slides: z.array(P9SlideSchema),
});

export type Presentation9Props = z.infer<typeof Presentation9PropsSchema>;

// ─── Presentation10 Slide Schemas (Warm Organic / Editorial) ──────────────────

export const OrganicHeroSlide10Schema = DurationBase.extend({
  type: z.literal("organicHero"),
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
});

export const OrganicStatsSlide10Schema = DurationBase.extend({
  type: z.literal("organicStats"),
  title: z.string(),
  stats: z.tuple([
    z.object({ value: z.string(), label: z.string(), note: z.string().optional() }),
    z.object({ value: z.string(), label: z.string(), note: z.string().optional() }),
    z.object({ value: z.string(), label: z.string(), note: z.string().optional() }),
  ]),
});

export const OrganicListSlide10Schema = DurationBase.extend({
  type: z.literal("organicList"),
  title: z.string(),
  items: z.array(z.string()),
});

export const OrganicQuoteSlide10Schema = DurationBase.extend({
  type: z.literal("organicQuote"),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

export const OrganicGridSlide10Schema = DurationBase.extend({
  type: z.literal("organicGrid"),
  headline: z.string(),
  items: z.tuple([
    z.object({ title: z.string(), body: z.string() }),
    z.object({ title: z.string(), body: z.string() }),
    z.object({ title: z.string(), body: z.string() }),
    z.object({ title: z.string(), body: z.string() }),
  ]),
});

export const OrganicTimelineSlide10Schema = DurationBase.extend({
  type: z.literal("organicTimeline"),
  title: z.string(),
  milestones: z.array(
    z.object({ year: z.string(), label: z.string(), body: z.string().optional() })
  ),
});

export const OrganicClosingSlide10Schema = DurationBase.extend({
  type: z.literal("organicClosing"),
  headline: z.string(),
  tagline: z.string(),
});

export const P10SlideSchema = z.discriminatedUnion("type", [
  OrganicHeroSlide10Schema,
  OrganicStatsSlide10Schema,
  OrganicListSlide10Schema,
  OrganicQuoteSlide10Schema,
  OrganicGridSlide10Schema,
  OrganicTimelineSlide10Schema,
  OrganicClosingSlide10Schema,
]);

export type P10Slide = z.infer<typeof P10SlideSchema>;
export const Presentation10PropsSchema = z.object({ slides: z.array(P10SlideSchema) });
export type Presentation10Props = z.infer<typeof Presentation10PropsSchema>;

// ─── Presentation11 Slide Schemas (Blueprint) ────────────────────────────────

export const BlueprintHeroSlide11Schema = DurationBase.extend({
  type: z.literal("blueprintHero"),
  projectCode: z.string(),
  title: z.string(),
  subtitle: z.string(),
});

export const BlueprintSpecSlide11Schema = DurationBase.extend({
  type: z.literal("blueprintSpec"),
  title: z.string(),
  specs: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
      unit: z.string().optional(),
    })
  ),
});

export const BlueprintListSlide11Schema = DurationBase.extend({
  type: z.literal("blueprintList"),
  title: z.string(),
  items: z.array(z.string()),
});

export const BlueprintQuoteSlide11Schema = DurationBase.extend({
  type: z.literal("blueprintQuote"),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

export const BlueprintDiagramSlide11Schema = DurationBase.extend({
  type: z.literal("blueprintDiagram"),
  title: z.string(),
  bars: z.array(
    z.object({
      label: z.string(),
      value: z.number().min(0).max(100),
      unit: z.string().optional(),
    })
  ),
});

export const BlueprintGridSlide11Schema = DurationBase.extend({
  type: z.literal("blueprintGrid"),
  headline: z.string(),
  items: z.array(
    z.object({
      code: z.string(),
      title: z.string(),
      body: z.string(),
    })
  ),
});

export const BlueprintClosingSlide11Schema = DurationBase.extend({
  type: z.literal("blueprintClosing"),
  projectCode: z.string(),
  headline: z.string(),
  tagline: z.string(),
});

export const P11SlideSchema = z.discriminatedUnion("type", [
  BlueprintHeroSlide11Schema,
  BlueprintSpecSlide11Schema,
  BlueprintListSlide11Schema,
  BlueprintQuoteSlide11Schema,
  BlueprintDiagramSlide11Schema,
  BlueprintGridSlide11Schema,
  BlueprintClosingSlide11Schema,
]);
export type P11Slide = z.infer<typeof P11SlideSchema>;
export const Presentation11PropsSchema = z.object({ slides: z.array(P11SlideSchema) });
export type Presentation11Props = z.infer<typeof Presentation11PropsSchema>;

// ─── Presentation13 Slide Schemas (Diagonal Split / Color-Block Geometry) ────

const DiagGridItem13Schema = z.object({
  title: z.string(),
  body: z.string(),
});

const DiagEvent13Schema = z.object({
  year: z.string(),
  label: z.string(),
});

export const DiagHeroSlide13Schema = DurationBase.extend({
  type: z.literal("diagHero"),
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  accent: z.string(),
});

export const DiagStatSlide13Schema = DurationBase.extend({
  type: z.literal("diagStat"),
  value: z.string(),
  label: z.string(),
  context: z.string(),
  accent: z.string(),
});

export const DiagGridSlide13Schema = DurationBase.extend({
  type: z.literal("diagGrid"),
  headline: z.string(),
  items: z.tuple([DiagGridItem13Schema, DiagGridItem13Schema, DiagGridItem13Schema]),
  accent: z.string(),
});

export const DiagQuoteSlide13Schema = DurationBase.extend({
  type: z.literal("diagQuote"),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
  accent: z.string(),
});

export const DiagListSlide13Schema = DurationBase.extend({
  type: z.literal("diagList"),
  title: z.string(),
  items: z.array(z.string()),
  accent: z.string(),
});

export const DiagTimelineSlide13Schema = DurationBase.extend({
  type: z.literal("diagTimeline"),
  title: z.string(),
  events: z.array(DiagEvent13Schema),
  accent: z.string(),
});

export const DiagClosingSlide13Schema = DurationBase.extend({
  type: z.literal("diagClosing"),
  headline: z.string(),
  sub: z.string(),
  accent: z.string(),
});

export const P13SlideSchema = z.discriminatedUnion("type", [
  DiagHeroSlide13Schema,
  DiagStatSlide13Schema,
  DiagGridSlide13Schema,
  DiagQuoteSlide13Schema,
  DiagListSlide13Schema,
  DiagTimelineSlide13Schema,
  DiagClosingSlide13Schema,
]);
export type P13Slide = z.infer<typeof P13SlideSchema>;
export const Presentation13PropsSchema = z.object({ slides: z.array(P13SlideSchema) });
export type Presentation13Props = z.infer<typeof Presentation13PropsSchema>;

// ─── Presentation12 Slide Schemas (Kinetic Typography / Motion-First) ─────────

const P12AccentSchema = z.enum(["red", "green", "yellow"]);

export const KineticHeroSlide12Schema = DurationBase.extend({
  type: z.literal("kineticHero"),
  word1: z.string(),
  word2: z.string(),
  tagline: z.string(),
});

export const KineticStatSlide12Schema = DurationBase.extend({
  type: z.literal("kineticStat"),
  value: z.string(),
  label: z.string(),
  color: P12AccentSchema,
});

export const KineticSplitSlide12Schema = DurationBase.extend({
  type: z.literal("kineticSplit"),
  left: z.string(),
  right: z.string(),
  connector: z.string(),
});

export const KineticListSlide12Schema = DurationBase.extend({
  type: z.literal("kineticList"),
  items: z.array(z.string()).min(1).max(4),
});

export const KineticQuoteSlide12Schema = DurationBase.extend({
  type: z.literal("kineticQuote"),
  quote: z.string(),
  author: z.string(),
});

export const KineticCounterSlide12Schema = DurationBase.extend({
  type: z.literal("kineticCounter"),
  from: z.number(),
  to: z.number(),
  suffix: z.string(),
  label: z.string(),
  color: P12AccentSchema,
});

export const KineticClosingSlide12Schema = DurationBase.extend({
  type: z.literal("kineticClosing"),
  brand: z.string(),
  call: z.string(),
});

export const P12SlideSchema = z.discriminatedUnion("type", [
  KineticHeroSlide12Schema,
  KineticStatSlide12Schema,
  KineticSplitSlide12Schema,
  KineticListSlide12Schema,
  KineticQuoteSlide12Schema,
  KineticCounterSlide12Schema,
  KineticClosingSlide12Schema,
]);
export type P12Slide = z.infer<typeof P12SlideSchema>;
export const Presentation12PropsSchema = z.object({ slides: z.array(P12SlideSchema) });
export type Presentation12Props = z.infer<typeof Presentation12PropsSchema>;

// ─── Presentation14 Slide Schemas (Broadsheet / Newspaper) ───────────────────

export const BroadHeroSlide14Schema = DurationBase.extend({
  type: z.literal("broadHero"),
  headline: z.string(),
  deck: z.string(),
  byline: z.string(),
  date: z.string(),
});

export const BroadLeadSlide14Schema = DurationBase.extend({
  type: z.literal("broadLead"),
  section: z.string(),
  headline: z.string(),
  body: z.string(),
  pullQuote: z.string(),
});

export const BroadStatsSlide14Schema = DurationBase.extend({
  type: z.literal("broadStats"),
  section: z.string(),
  headline: z.string(),
  stats: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
      delta: z.string().optional(),
    })
  ),
});

export const BroadQuoteSlide14Schema = DurationBase.extend({
  type: z.literal("broadQuote"),
  section: z.string(),
  quote: z.string(),
  attribution: z.string(),
  title: z.string(),
});

export const BroadGridSlide14Schema = DurationBase.extend({
  type: z.literal("broadGrid"),
  section: z.string(),
  headline: z.string(),
  items: z.array(
    z.object({
      kicker: z.string(),
      title: z.string(),
      body: z.string(),
    })
  ),
});

export const BroadTimelineSlide14Schema = DurationBase.extend({
  type: z.literal("broadTimeline"),
  section: z.string(),
  headline: z.string(),
  events: z.array(
    z.object({
      date: z.string(),
      headline: z.string(),
      body: z.string().optional(),
    })
  ),
});

export const BroadClosingSlide14Schema = DurationBase.extend({
  type: z.literal("broadClosing"),
  headline: z.string(),
  edition: z.string(),
  tagline: z.string(),
});

export const P14SlideSchema = z.discriminatedUnion("type", [
  BroadHeroSlide14Schema,
  BroadLeadSlide14Schema,
  BroadStatsSlide14Schema,
  BroadQuoteSlide14Schema,
  BroadGridSlide14Schema,
  BroadTimelineSlide14Schema,
  BroadClosingSlide14Schema,
]);
export type P14Slide = z.infer<typeof P14SlideSchema>;
export const Presentation14PropsSchema = z.object({ slides: z.array(P14SlideSchema) });

// ─── Presentation15 Slide Schemas (Terminal / CLI) ────────────────────────────

export const TermHeroSlide15Schema = DurationBase.extend({
  type: z.literal("termHero"),
  command: z.string(),
  output: z.array(z.string()),
  tagline: z.string(),
});

export const TermLoadSlide15Schema = DurationBase.extend({
  type: z.literal("termLoad"),
  label: z.string(),
  steps: z.array(z.object({ text: z.string(), done: z.boolean() })),
});

export const TermStatSlide15Schema = DurationBase.extend({
  type: z.literal("termStat"),
  query: z.string(),
  key: z.string(),
  value: z.string(),
  unit: z.string(),
  notes: z.array(z.string()),
});

export const TermListSlide15Schema = DurationBase.extend({
  type: z.literal("termList"),
  heading: z.string(),
  items: z.array(z.string()),
});

export const TermQuoteSlide15Schema = DurationBase.extend({
  type: z.literal("termQuote"),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

export const TermBarSlide15Schema = DurationBase.extend({
  type: z.literal("termBar"),
  title: z.string(),
  bars: z.array(z.object({ label: z.string(), value: z.number(), max: z.number() })),
});

export const TermClosingSlide15Schema = DurationBase.extend({
  type: z.literal("termClosing"),
  message: z.string(),
  prompt: z.string(),
});

export const P15SlideSchema = z.discriminatedUnion("type", [
  TermHeroSlide15Schema,
  TermLoadSlide15Schema,
  TermStatSlide15Schema,
  TermListSlide15Schema,
  TermQuoteSlide15Schema,
  TermBarSlide15Schema,
  TermClosingSlide15Schema,
]);
export type P15Slide = z.infer<typeof P15SlideSchema>;
export const Presentation15PropsSchema = z.object({ slides: z.array(P15SlideSchema) });
export type Presentation15Props = z.infer<typeof Presentation15PropsSchema>;
export type Presentation14Props = z.infer<typeof Presentation14PropsSchema>;

// ─── Presentation16 (Comic Book / Halftone) ───────────────────────────────────

const PanelColor16 = z.enum(["red", "blue", "yellow"]);

export const ComicHeroSlide16Schema = DurationBase.extend({
  type: z.literal("comicHero"),
  action: z.string(),
  hero: z.string(),
  tagline: z.string(),
});

export const ComicStatSlide16Schema = DurationBase.extend({
  type: z.literal("comicStat"),
  label: z.string(),
  value: z.string(),
  exclamation: z.string(),
  color: PanelColor16,
});

export const ComicSplitSlide16Schema = DurationBase.extend({
  type: z.literal("comicSplit"),
  panel1: z.object({ text: z.string(), color: PanelColor16 }),
  panel2: z.object({ text: z.string(), color: PanelColor16 }),
  versus: z.boolean(),
});

export const ComicListSlide16Schema = DurationBase.extend({
  type: z.literal("comicList"),
  title: z.string(),
  items: z.array(z.string()),
});

export const ComicQuoteSlide16Schema = DurationBase.extend({
  type: z.literal("comicQuote"),
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
});

export const ComicStatsGridSlide16Schema = DurationBase.extend({
  type: z.literal("comicStatsGrid"),
  headline: z.string(),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
    color: PanelColor16,
  })),
});

export const ComicClosingSlide16Schema = DurationBase.extend({
  type: z.literal("comicClosing"),
  action: z.string(),
  tagline: z.string(),
  cta: z.string(),
});

export const P16SlideSchema = z.discriminatedUnion("type", [
  ComicHeroSlide16Schema,
  ComicStatSlide16Schema,
  ComicSplitSlide16Schema,
  ComicListSlide16Schema,
  ComicQuoteSlide16Schema,
  ComicStatsGridSlide16Schema,
  ComicClosingSlide16Schema,
]);
export type P16Slide = z.infer<typeof P16SlideSchema>;
export const Presentation16PropsSchema = z.object({ slides: z.array(P16SlideSchema) });
export type Presentation16Props = z.infer<typeof Presentation16PropsSchema>;

// ─── Presentation17 (Prestige Academic) ───────────────────────────────────────

export const TitleSlide17Schema = DurationBase.extend({
  type: z.literal("title17"),
  title: z.string(),
  subtitle: z.string().optional(),
  course: z.string().optional(),
});

export const PillarsSlide17Schema = DurationBase.extend({
  type: z.literal("pillars17"),
  title: z.string(),
  pillars: z.array(z.string()),
});

export const ProfSlide17Schema = DurationBase.extend({
  type: z.literal("prof17"),
  name: z.string(),
  role: z.string(),
  background: z.string(),
});

export const ManifestoSlide17Schema = DurationBase.extend({
  type: z.literal("manifesto17"),
  statement: z.string(),
  detail: z.string(),
});

export const ExpectSlide17Schema = DurationBase.extend({
  type: z.literal("expect17"),
  title: z.string(),
  items: z.array(z.string()),
});

export const CTASlide17Schema = DurationBase.extend({
  type: z.literal("cta17"),
  headline: z.string(),
  instruction: z.string(),
});

export const P17SlideSchema = z.discriminatedUnion("type", [
  TitleSlide17Schema,
  PillarsSlide17Schema,
  ProfSlide17Schema,
  ManifestoSlide17Schema,
  ExpectSlide17Schema,
  CTASlide17Schema,
]);
export type P17Slide = z.infer<typeof P17SlideSchema>;
export const Presentation17PropsSchema = z.object({
  slides: z.array(P17SlideSchema),
  talkingHeadSrc: z.string().optional(),
  faceTrack: FaceTrackSchema,
});
export type Presentation17Props = z.infer<typeof Presentation17PropsSchema>;
