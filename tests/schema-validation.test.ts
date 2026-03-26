/**
 * Unit tests for Zod schemas used in generateSlides.js.
 * Tests each theme's slide schema with valid and invalid data.
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";

// Re-create the schemas from generateSlides.js to test them in isolation
const VALID_ICON_NAMES = [
  "Zap", "Globe", "VideoIcon", "Cpu", "BarChart3", "Users",
  "Rocket", "Shield", "TrendingUp", "Layers", "Clock", "Star",
];

const IconNameSchema = z.enum(VALID_ICON_NAMES as [string, ...string[]]);

const P1SlideSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("title"), title: z.string(), subtitle: z.string().optional() }),
  z.object({
    type: z.literal("iconGrid"), title: z.string(),
    items: z.array(z.object({ iconName: IconNameSchema, label: z.string(), color: z.string() })),
  }),
  z.object({ type: z.literal("checklist"), title: z.string(), points: z.array(z.string()) }),
  z.object({
    type: z.literal("stats"), title: z.string(),
    stats: z.array(z.object({ iconName: IconNameSchema, value: z.number(), label: z.string(), suffix: z.string().optional(), color: z.string() })),
  }),
  z.object({
    type: z.literal("barChart"), title: z.string(),
    bars: z.array(z.object({ label: z.string(), value: z.number().min(0).max(100), color: z.string() })),
  }),
  z.object({
    type: z.literal("timeline"), title: z.string(),
    milestones: z.array(z.object({ date: z.string(), label: z.string(), description: z.string() })),
  }),
  z.object({ type: z.literal("quote"), quote: z.string(), author: z.string(), role: z.string().optional() }),
]);

const P3SlideSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("kpiTitle"), title: z.string(), tagline: z.string(), badge: z.string().optional() }),
  z.object({
    type: z.literal("bigStat"), label: z.string(), value: z.string(), numericValue: z.number(),
    unit: z.string().optional(), trend: z.enum(["up", "down", "neutral"]), caption: z.string().optional(),
  }),
  z.object({
    type: z.literal("metricRow"), title: z.string(),
    metrics: z.array(z.object({ label: z.string(), value: z.string(), delta: z.string().optional() })).length(3),
  }),
  z.object({
    type: z.literal("barRace"), title: z.string(),
    bars: z.array(z.object({ label: z.string(), value: z.number() })),
    maxValue: z.number(),
  }),
  z.object({ type: z.literal("milestone"), icon: z.string(), headline: z.string(), caption: z.string(), year: z.string().optional() }),
]);

const P17SlideSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("title17"), title: z.string(), subtitle: z.string().optional(), course: z.string().optional() }),
  z.object({ type: z.literal("pillars17"), title: z.string(), pillars: z.array(z.string()) }),
  z.object({ type: z.literal("prof17"), name: z.string(), role: z.string(), background: z.string() }),
  z.object({ type: z.literal("manifesto17"), statement: z.string(), detail: z.string() }),
  z.object({ type: z.literal("expect17"), title: z.string(), items: z.array(z.string()) }),
  z.object({ type: z.literal("cta17"), headline: z.string(), instruction: z.string() }),
]);

const P8SlideSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("minimalHero"), title: z.string(), subtitle: z.string(), tag: z.string() }),
  z.object({
    type: z.literal("minimalStats"), title: z.string(),
    stats: z.tuple([
      z.object({ value: z.string(), label: z.string(), note: z.string().optional() }),
      z.object({ value: z.string(), label: z.string(), note: z.string().optional() }),
      z.object({ value: z.string(), label: z.string(), note: z.string().optional() }),
    ]),
  }),
  z.object({ type: z.literal("minimalList"), title: z.string(), items: z.array(z.string()) }),
  z.object({ type: z.literal("minimalQuote"), quote: z.string(), author: z.string(), role: z.string().optional() }),
  z.object({
    type: z.literal("minimalGrid"), headline: z.string(),
    items: z.tuple([
      z.object({ title: z.string(), body: z.string() }),
      z.object({ title: z.string(), body: z.string() }),
      z.object({ title: z.string(), body: z.string() }),
      z.object({ title: z.string(), body: z.string() }),
    ]),
  }),
  z.object({ type: z.literal("minimalClosing"), headline: z.string(), tagline: z.string() }),
  z.object({
    type: z.literal("minimalIconFeatures"), headline: z.string(),
    features: z.tuple([
      z.object({ iconName: z.string(), title: z.string(), body: z.string() }),
      z.object({ iconName: z.string(), title: z.string(), body: z.string() }),
      z.object({ iconName: z.string(), title: z.string(), body: z.string() }),
    ]),
  }),
  z.object({
    type: z.literal("minimalProgressBars"), title: z.string(),
    bars: z.array(z.object({ label: z.string(), value: z.number().min(0).max(100), note: z.string().optional() })).min(3).max(5),
  }),
]);

// =========================================================================
// P1 Dark Tech
// =========================================================================
describe("P1 (Dark Tech) schema", () => {
  it("validates title slide", () => {
    expect(P1SlideSchema.safeParse({ type: "title", title: "Hello" }).success).toBe(true);
    expect(P1SlideSchema.safeParse({ type: "title", title: "Hello", subtitle: "World" }).success).toBe(true);
  });

  it("validates iconGrid slide with valid icons", () => {
    const slide = {
      type: "iconGrid",
      title: "Features",
      items: [
        { iconName: "Zap", label: "Fast", color: "#00f" },
        { iconName: "Globe", label: "Global", color: "#0f0" },
      ],
    };
    expect(P1SlideSchema.safeParse(slide).success).toBe(true);
  });

  it("rejects iconGrid with invalid iconName", () => {
    const slide = {
      type: "iconGrid",
      title: "Features",
      items: [{ iconName: "InvalidIcon", label: "Test", color: "#fff" }],
    };
    expect(P1SlideSchema.safeParse(slide).success).toBe(false);
  });

  it("validates checklist slide", () => {
    expect(P1SlideSchema.safeParse({
      type: "checklist", title: "Todo", points: ["A", "B", "C"],
    }).success).toBe(true);
  });

  it("validates stats slide", () => {
    expect(P1SlideSchema.safeParse({
      type: "stats", title: "Numbers",
      stats: [{ iconName: "Users", value: 100, label: "Users", color: "#fff" }],
    }).success).toBe(true);
  });

  it("validates barChart with values 0-100", () => {
    expect(P1SlideSchema.safeParse({
      type: "barChart", title: "Chart",
      bars: [{ label: "A", value: 50, color: "#f00" }],
    }).success).toBe(true);
  });

  it("rejects barChart with value > 100", () => {
    expect(P1SlideSchema.safeParse({
      type: "barChart", title: "Chart",
      bars: [{ label: "A", value: 150, color: "#f00" }],
    }).success).toBe(false);
  });

  it("validates timeline slide", () => {
    expect(P1SlideSchema.safeParse({
      type: "timeline", title: "History",
      milestones: [{ date: "2024", label: "Launch", description: "We launched" }],
    }).success).toBe(true);
  });

  it("validates quote slide", () => {
    expect(P1SlideSchema.safeParse({
      type: "quote", quote: "Test", author: "Me",
    }).success).toBe(true);
  });

  it("rejects unknown slide type", () => {
    expect(P1SlideSchema.safeParse({ type: "unknown", title: "X" }).success).toBe(false);
  });

  it("rejects missing required fields", () => {
    expect(P1SlideSchema.safeParse({ type: "title" }).success).toBe(false);
    expect(P1SlideSchema.safeParse({ type: "checklist" }).success).toBe(false);
  });
});

// =========================================================================
// P3 Dashboard/KPI
// =========================================================================
describe("P3 (Dashboard/KPI) schema", () => {
  it("validates kpiTitle", () => {
    expect(P3SlideSchema.safeParse({
      type: "kpiTitle", title: "Q4", tagline: "Strong",
    }).success).toBe(true);
  });

  it("validates bigStat with valid trend", () => {
    expect(P3SlideSchema.safeParse({
      type: "bigStat", label: "Revenue", value: "$2M", numericValue: 2000000, trend: "up",
    }).success).toBe(true);
  });

  it("rejects bigStat with invalid trend", () => {
    expect(P3SlideSchema.safeParse({
      type: "bigStat", label: "X", value: "1", numericValue: 1, trend: "sideways",
    }).success).toBe(false);
  });

  it("validates metricRow with exactly 3 metrics", () => {
    expect(P3SlideSchema.safeParse({
      type: "metricRow", title: "KPIs",
      metrics: [
        { label: "A", value: "1" },
        { label: "B", value: "2" },
        { label: "C", value: "3" },
      ],
    }).success).toBe(true);
  });

  it("rejects metricRow with 2 metrics", () => {
    expect(P3SlideSchema.safeParse({
      type: "metricRow", title: "KPIs",
      metrics: [{ label: "A", value: "1" }, { label: "B", value: "2" }],
    }).success).toBe(false);
  });

  it("rejects metricRow with 4 metrics", () => {
    expect(P3SlideSchema.safeParse({
      type: "metricRow", title: "KPIs",
      metrics: [
        { label: "A", value: "1" }, { label: "B", value: "2" },
        { label: "C", value: "3" }, { label: "D", value: "4" },
      ],
    }).success).toBe(false);
  });

  it("validates barRace", () => {
    expect(P3SlideSchema.safeParse({
      type: "barRace", title: "Race",
      bars: [{ label: "X", value: 50 }], maxValue: 100,
    }).success).toBe(true);
  });
});

// =========================================================================
// P17 Academic
// =========================================================================
describe("P17 (Academic) schema", () => {
  it("validates all slide types", () => {
    expect(P17SlideSchema.safeParse({ type: "title17", title: "Intro" }).success).toBe(true);
    expect(P17SlideSchema.safeParse({ type: "pillars17", title: "Core", pillars: ["A", "B"] }).success).toBe(true);
    expect(P17SlideSchema.safeParse({ type: "prof17", name: "Dr. X", role: "Prof", background: "PhD" }).success).toBe(true);
    expect(P17SlideSchema.safeParse({ type: "manifesto17", statement: "S", detail: "D" }).success).toBe(true);
    expect(P17SlideSchema.safeParse({ type: "expect17", title: "Goals", items: ["A"] }).success).toBe(true);
    expect(P17SlideSchema.safeParse({ type: "cta17", headline: "Next", instruction: "Read" }).success).toBe(true);
  });

  it("rejects prof17 missing background", () => {
    expect(P17SlideSchema.safeParse({ type: "prof17", name: "X", role: "Y" }).success).toBe(false);
  });
});

// =========================================================================
// P8 Clean Minimalist
// =========================================================================
describe("P8 (Clean Minimalist) schema", () => {
  it("validates minimalHero", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalHero", title: "T", subtitle: "S", tag: "v1.0",
    }).success).toBe(true);
  });

  it("validates minimalStats with exactly 3 stats (tuple)", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalStats", title: "Numbers",
      stats: [
        { value: "100", label: "Users" },
        { value: "50", label: "Countries" },
        { value: "99%", label: "Uptime" },
      ],
    }).success).toBe(true);
  });

  it("rejects minimalStats with 2 stats", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalStats", title: "Numbers",
      stats: [
        { value: "100", label: "Users" },
        { value: "50", label: "Countries" },
      ],
    }).success).toBe(false);
  });

  it("validates minimalGrid with exactly 4 items (tuple)", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalGrid", headline: "Features",
      items: [
        { title: "A", body: "a" }, { title: "B", body: "b" },
        { title: "C", body: "c" }, { title: "D", body: "d" },
      ],
    }).success).toBe(true);
  });

  it("rejects minimalGrid with 3 items", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalGrid", headline: "Features",
      items: [
        { title: "A", body: "a" }, { title: "B", body: "b" },
        { title: "C", body: "c" },
      ],
    }).success).toBe(false);
  });

  it("validates minimalProgressBars with 3-5 bars", () => {
    const bars3 = Array.from({ length: 3 }, (_, i) => ({ label: `Bar${i}`, value: i * 25 }));
    const bars5 = Array.from({ length: 5 }, (_, i) => ({ label: `Bar${i}`, value: i * 20 }));
    expect(P8SlideSchema.safeParse({ type: "minimalProgressBars", title: "T", bars: bars3 }).success).toBe(true);
    expect(P8SlideSchema.safeParse({ type: "minimalProgressBars", title: "T", bars: bars5 }).success).toBe(true);
  });

  it("rejects minimalProgressBars with 2 or 6 bars", () => {
    const bars2 = Array.from({ length: 2 }, (_, i) => ({ label: `Bar${i}`, value: 50 }));
    const bars6 = Array.from({ length: 6 }, (_, i) => ({ label: `Bar${i}`, value: 50 }));
    expect(P8SlideSchema.safeParse({ type: "minimalProgressBars", title: "T", bars: bars2 }).success).toBe(false);
    expect(P8SlideSchema.safeParse({ type: "minimalProgressBars", title: "T", bars: bars6 }).success).toBe(false);
  });

  it("rejects minimalProgressBars with value > 100", () => {
    const bars = Array.from({ length: 3 }, () => ({ label: "X", value: 150 }));
    expect(P8SlideSchema.safeParse({ type: "minimalProgressBars", title: "T", bars }).success).toBe(false);
  });

  it("validates minimalClosing", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalClosing", headline: "Thank you", tagline: "Visit us",
    }).success).toBe(true);
  });

  it("validates minimalIconFeatures with 3 features", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalIconFeatures", headline: "Features",
      features: [
        { iconName: "Zap", title: "Fast", body: "Quick" },
        { iconName: "Globe", title: "Global", body: "Worldwide" },
        { iconName: "Shield", title: "Secure", body: "Safe" },
      ],
    }).success).toBe(true);
  });
});

// =========================================================================
// IconNameSchema
// =========================================================================
describe("IconNameSchema", () => {
  it("accepts all valid icon names", () => {
    VALID_ICON_NAMES.forEach((name) => {
      expect(IconNameSchema.safeParse(name).success).toBe(true);
    });
  });

  it("rejects invalid icon names", () => {
    expect(IconNameSchema.safeParse("Heart").success).toBe(false);
    expect(IconNameSchema.safeParse("").success).toBe(false);
    expect(IconNameSchema.safeParse("zap").success).toBe(false); // case sensitive
    expect(IconNameSchema.safeParse(123).success).toBe(false);
  });

  it("has exactly 12 valid icons", () => {
    expect(VALID_ICON_NAMES).toHaveLength(12);
  });
});
