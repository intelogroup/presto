/**
 * Unit tests for Zod schemas used in generateSlides.js.
 * Tests each theme's slide schema with valid and invalid data.
 *
 * Imports production schemas directly from src/schema.ts to avoid drift.
 */

import { describe, it, expect } from "vitest";
import {
  P1SlideSchema,
  P3SlideSchema,
  P8SlideSchema,
  P17SlideSchema,
} from "../src/schema";
import { VALID_ICON_NAMES } from "../src/iconMap";

// =========================================================================
// P1 Dark Tech
// =========================================================================
describe("P1 (Dark Tech) schema", () => {
  it("validates title slide", () => {
    expect(P1SlideSchema.safeParse({ type: "title", title: "Hello", duration: 300 }).success).toBe(true);
    expect(P1SlideSchema.safeParse({ type: "title", title: "Hello", subtitle: "World", duration: 300 }).success).toBe(true);
  });

  it("validates iconGrid slide with valid icons", () => {
    const slide = {
      type: "iconGrid",
      title: "Features",
      duration: 300,
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
      duration: 300,
      items: [{ iconName: "InvalidIcon", label: "Test", color: "#fff" }],
    };
    expect(P1SlideSchema.safeParse(slide).success).toBe(false);
  });

  it("validates checklist slide", () => {
    expect(P1SlideSchema.safeParse({
      type: "checklist", title: "Todo", points: ["A", "B", "C"], duration: 300,
    }).success).toBe(true);
  });

  it("validates stats slide", () => {
    expect(P1SlideSchema.safeParse({
      type: "stats", title: "Numbers", duration: 300,
      stats: [{ iconName: "Users", value: 100, label: "Users", color: "#fff" }],
    }).success).toBe(true);
  });

  it("validates barChart with values 0-100", () => {
    expect(P1SlideSchema.safeParse({
      type: "barChart", title: "Chart", duration: 300,
      bars: [{ label: "A", value: 50, color: "#f00" }],
    }).success).toBe(true);
  });

  it("rejects barChart with value > 100", () => {
    expect(P1SlideSchema.safeParse({
      type: "barChart", title: "Chart", duration: 300,
      bars: [{ label: "A", value: 150, color: "#f00" }],
    }).success).toBe(false);
  });

  it("validates timeline slide", () => {
    expect(P1SlideSchema.safeParse({
      type: "timeline", title: "History", duration: 300,
      milestones: [{ date: "2024", label: "Launch", description: "We launched" }],
    }).success).toBe(true);
  });

  it("validates quote slide", () => {
    expect(P1SlideSchema.safeParse({
      type: "quote", quote: "Test", author: "Me", duration: 300,
    }).success).toBe(true);
  });

  it("rejects unknown slide type", () => {
    expect(P1SlideSchema.safeParse({ type: "unknown", title: "X", duration: 300 }).success).toBe(false);
  });

  it("rejects missing required fields", () => {
    expect(P1SlideSchema.safeParse({ type: "title", duration: 300 }).success).toBe(false);
    expect(P1SlideSchema.safeParse({ type: "checklist", duration: 300 }).success).toBe(false);
  });

  it("rejects slides without duration (DurationBase enforcement)", () => {
    expect(P1SlideSchema.safeParse({ type: "title", title: "No duration" }).success).toBe(false);
  });

  it("rejects duration below minimum 60 frames", () => {
    expect(P1SlideSchema.safeParse({ type: "title", title: "Too short", duration: 30 }).success).toBe(false);
  });

  it("rejects non-integer duration", () => {
    expect(P1SlideSchema.safeParse({ type: "title", title: "Float", duration: 300.5 }).success).toBe(false);
  });
});

// =========================================================================
// P3 Dashboard/KPI
// =========================================================================
describe("P3 (Dashboard/KPI) schema", () => {
  it("validates kpiTitle", () => {
    expect(P3SlideSchema.safeParse({
      type: "kpiTitle", title: "Q4", tagline: "Strong", duration: 300,
    }).success).toBe(true);
  });

  it("validates bigStat with valid trend", () => {
    expect(P3SlideSchema.safeParse({
      type: "bigStat", label: "Revenue", value: "$2M", numericValue: 2000000, trend: "up", duration: 300,
    }).success).toBe(true);
  });

  it("rejects bigStat with invalid trend", () => {
    expect(P3SlideSchema.safeParse({
      type: "bigStat", label: "X", value: "1", numericValue: 1, trend: "sideways", duration: 300,
    }).success).toBe(false);
  });

  it("validates metricRow with exactly 3 metrics", () => {
    expect(P3SlideSchema.safeParse({
      type: "metricRow", title: "KPIs", duration: 300,
      metrics: [
        { label: "A", value: "1" },
        { label: "B", value: "2" },
        { label: "C", value: "3" },
      ],
    }).success).toBe(true);
  });

  it("rejects metricRow with 2 metrics", () => {
    expect(P3SlideSchema.safeParse({
      type: "metricRow", title: "KPIs", duration: 300,
      metrics: [{ label: "A", value: "1" }, { label: "B", value: "2" }],
    }).success).toBe(false);
  });

  it("rejects metricRow with 4 metrics", () => {
    expect(P3SlideSchema.safeParse({
      type: "metricRow", title: "KPIs", duration: 300,
      metrics: [
        { label: "A", value: "1" }, { label: "B", value: "2" },
        { label: "C", value: "3" }, { label: "D", value: "4" },
      ],
    }).success).toBe(false);
  });

  it("validates barRace", () => {
    expect(P3SlideSchema.safeParse({
      type: "barRace", title: "Race", duration: 300,
      bars: [{ label: "X", value: 50 }], maxValue: 100,
    }).success).toBe(true);
  });
});

// =========================================================================
// P17 Academic
// =========================================================================
describe("P17 (Academic) schema", () => {
  it("validates all slide types", () => {
    expect(P17SlideSchema.safeParse({ type: "title17", title: "Intro", duration: 300 }).success).toBe(true);
    expect(P17SlideSchema.safeParse({ type: "pillars17", title: "Core", pillars: ["A", "B"], duration: 300 }).success).toBe(true);
    expect(P17SlideSchema.safeParse({ type: "prof17", name: "Dr. X", role: "Prof", background: "PhD", duration: 300 }).success).toBe(true);
    expect(P17SlideSchema.safeParse({ type: "manifesto17", statement: "S", detail: "D", duration: 300 }).success).toBe(true);
    expect(P17SlideSchema.safeParse({ type: "expect17", title: "Goals", items: ["A"], duration: 300 }).success).toBe(true);
    expect(P17SlideSchema.safeParse({ type: "cta17", headline: "Next", instruction: "Read", duration: 300 }).success).toBe(true);
  });

  it("rejects prof17 missing background", () => {
    expect(P17SlideSchema.safeParse({ type: "prof17", name: "X", role: "Y", duration: 300 }).success).toBe(false);
  });
});

// =========================================================================
// P8 Clean Minimalist
// =========================================================================
describe("P8 (Clean Minimalist) schema", () => {
  it("validates minimalHero", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalHero", title: "T", subtitle: "S", tag: "v1.0", duration: 300,
    }).success).toBe(true);
  });

  it("validates minimalStats with exactly 3 stats (tuple)", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalStats", title: "Numbers", duration: 300,
      stats: [
        { value: "100", label: "Users" },
        { value: "50", label: "Countries" },
        { value: "99%", label: "Uptime" },
      ],
    }).success).toBe(true);
  });

  it("rejects minimalStats with 2 stats", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalStats", title: "Numbers", duration: 300,
      stats: [
        { value: "100", label: "Users" },
        { value: "50", label: "Countries" },
      ],
    }).success).toBe(false);
  });

  it("validates minimalGrid with exactly 4 items (tuple)", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalGrid", headline: "Features", duration: 300,
      items: [
        { title: "A", body: "a" }, { title: "B", body: "b" },
        { title: "C", body: "c" }, { title: "D", body: "d" },
      ],
    }).success).toBe(true);
  });

  it("rejects minimalGrid with 3 items", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalGrid", headline: "Features", duration: 300,
      items: [
        { title: "A", body: "a" }, { title: "B", body: "b" },
        { title: "C", body: "c" },
      ],
    }).success).toBe(false);
  });

  it("validates minimalProgressBars with 3-5 bars", () => {
    const bars3 = Array.from({ length: 3 }, (_, i) => ({ label: `Bar${i}`, value: i * 25 }));
    const bars5 = Array.from({ length: 5 }, (_, i) => ({ label: `Bar${i}`, value: i * 20 }));
    expect(P8SlideSchema.safeParse({ type: "minimalProgressBars", title: "T", bars: bars3, duration: 300 }).success).toBe(true);
    expect(P8SlideSchema.safeParse({ type: "minimalProgressBars", title: "T", bars: bars5, duration: 300 }).success).toBe(true);
  });

  it("rejects minimalProgressBars with 2 or 6 bars", () => {
    const bars2 = Array.from({ length: 2 }, (_, i) => ({ label: `Bar${i}`, value: 50 }));
    const bars6 = Array.from({ length: 6 }, (_, i) => ({ label: `Bar${i}`, value: 50 }));
    expect(P8SlideSchema.safeParse({ type: "minimalProgressBars", title: "T", bars: bars2, duration: 300 }).success).toBe(false);
    expect(P8SlideSchema.safeParse({ type: "minimalProgressBars", title: "T", bars: bars6, duration: 300 }).success).toBe(false);
  });

  it("rejects minimalProgressBars with value > 100", () => {
    const bars = Array.from({ length: 3 }, () => ({ label: "X", value: 150 }));
    expect(P8SlideSchema.safeParse({ type: "minimalProgressBars", title: "T", bars, duration: 300 }).success).toBe(false);
  });

  it("validates minimalClosing", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalClosing", headline: "Thank you", tagline: "Visit us", duration: 300,
    }).success).toBe(true);
  });

  it("validates minimalIconFeatures with 3 features", () => {
    expect(P8SlideSchema.safeParse({
      type: "minimalIconFeatures", headline: "Features", duration: 300,
      features: [
        { iconName: "Zap", title: "Fast", body: "Quick" },
        { iconName: "Globe", title: "Global", body: "Worldwide" },
        { iconName: "Shield", title: "Secure", body: "Safe" },
      ],
    }).success).toBe(true);
  });
});

// =========================================================================
// IconNameSchema (via VALID_ICON_NAMES from production iconMap)
// =========================================================================
describe("VALID_ICON_NAMES", () => {
  it("contains all expected icon names", () => {
    const expected = ["Zap", "Globe", "VideoIcon", "Cpu", "BarChart3", "Users",
      "Rocket", "Shield", "TrendingUp", "Layers", "Clock", "Star"];
    expected.forEach((name) => {
      expect(VALID_ICON_NAMES).toContain(name);
    });
  });

  it("rejects invalid icon names via P1 schema", () => {
    // Production IconNameSchema uses refine() against VALID_ICON_NAMES
    const slide = {
      type: "iconGrid", title: "Test", duration: 300,
      items: [{ iconName: "Heart", label: "Love", color: "#f00" }],
    };
    expect(P1SlideSchema.safeParse(slide).success).toBe(false);
  });

  it("rejects lowercase icon names (case sensitive)", () => {
    const slide = {
      type: "iconGrid", title: "Test", duration: 300,
      items: [{ iconName: "zap", label: "Fast", color: "#f00" }],
    };
    expect(P1SlideSchema.safeParse(slide).success).toBe(false);
  });

  it("has exactly 12 valid icons", () => {
    expect(VALID_ICON_NAMES).toHaveLength(12);
  });
});
