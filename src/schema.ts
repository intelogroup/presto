// src/schema.ts
import { z } from "zod";
import { VALID_ICON_NAMES } from "./iconMap";

// Validates that iconName strings are known keys — fails fast before render
const IconNameSchema = z.string().refine(
  (v: string) => VALID_ICON_NAMES.includes(v),
  { message: `iconName must be one of: ${VALID_ICON_NAMES.join(", ")}` }
);

// ─── Presentation1 Slide Schemas ─────────────────────────────────────────────

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
