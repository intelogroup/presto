/**
 * Unit tests for Zod schemas: P2, P4–P16 (the themes NOT covered by
 * schema-validation.test.ts which tests P1, P3, P8, P17).
 *
 * Imports production schemas directly from src/schema.ts to avoid drift.
 * Each theme tests: one valid slide per type, duration minimum enforcement,
 * and invalid type rejection.
 */

import { describe, it, expect } from "vitest";
import {
  P2SlideSchema,
  P4SlideSchema,
  P5SlideSchema,
  P6SlideSchema,
  P7SlideSchema,
  P9SlideSchema,
  P10SlideSchema,
  P11SlideSchema,
  P12SlideSchema,
  P13SlideSchema,
  P14SlideSchema,
  P15SlideSchema,
  P16SlideSchema,
  P18SlideSchema,
  P19SlideSchema,
  P20SlideSchema,
} from "../src/schema";

const D = 120; // default duration (4s @ 30fps) — above 60-frame minimum

// ─── Helpers ────────────────────────────────────────────────────────────────
function ok(schema: { safeParse: (d: unknown) => { success: boolean } }, data: unknown) {
  const r = schema.safeParse(data);
  if (!r.success) console.error("Unexpected failure:", (r as any).error?.issues);
  return r.success;
}

function fail(schema: { safeParse: (d: unknown) => { success: boolean } }, data: unknown) {
  return !schema.safeParse(data).success;
}

// ═══════════════════════════════════════════════════════════════════════════════
// P2 — Editorial
// ═══════════════════════════════════════════════════════════════════════════════
describe("P2 (Editorial) schema", () => {
  it("validates splitTitle slide", () => {
    expect(ok(P2SlideSchema, { type: "splitTitle", title: "Hello", duration: D })).toBe(true);
  });

  it("validates splitTitle with optional fields", () => {
    expect(ok(P2SlideSchema, { type: "splitTitle", title: "Hi", subtitle: "Sub", tag: "Tag", duration: D })).toBe(true);
  });

  it("validates typewriter slide", () => {
    expect(ok(P2SlideSchema, { type: "typewriter", text: "Some text", duration: D })).toBe(true);
  });

  it("validates bigNumber slide", () => {
    expect(ok(P2SlideSchema, { type: "bigNumber", value: 42, label: "Users", duration: D })).toBe(true);
  });

  it("validates bigNumber with optional fields", () => {
    expect(ok(P2SlideSchema, {
      type: "bigNumber", value: 99.5, decimals: 1, prefix: "$", suffix: "M", label: "Revenue", sublabel: "YoY", dark: true, duration: D,
    })).toBe(true);
  });

  it("validates magazineGrid slide (3-item tuple)", () => {
    const items = [
      { title: "A", body: "a" },
      { title: "B", body: "b" },
      { title: "C", body: "c" },
    ];
    expect(ok(P2SlideSchema, { type: "magazineGrid", headline: "H", items, duration: D })).toBe(true);
  });

  it("rejects magazineGrid with wrong item count", () => {
    const items = [{ title: "A", body: "a" }, { title: "B", body: "b" }];
    expect(fail(P2SlideSchema, { type: "magazineGrid", headline: "H", items, duration: D })).toBe(true);
  });

  it("validates pullQuote slide", () => {
    expect(ok(P2SlideSchema, { type: "pullQuote", quote: "Q", author: "A", duration: D })).toBe(true);
  });

  it("validates splitStats slide (4-item tuple)", () => {
    const stats = Array(4).fill({ value: 1, label: "L" });
    expect(ok(P2SlideSchema, { type: "splitStats", title: "T", stats, duration: D })).toBe(true);
  });

  it("rejects duration below 60", () => {
    expect(fail(P2SlideSchema, { type: "splitTitle", title: "Hi", duration: 59 })).toBe(true);
  });

  it("rejects unknown slide type", () => {
    expect(fail(P2SlideSchema, { type: "unknown", title: "X", duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P4 — Bold Swiss / Brutalist
// ═══════════════════════════════════════════════════════════════════════════════
describe("P4 (Brutalist) schema", () => {
  it("validates brutalistHero", () => {
    expect(ok(P4SlideSchema, { type: "brutalistHero", title: "T", tag: "TAG", subtitle: "S", duration: D })).toBe(true);
  });

  it("validates wordStamp", () => {
    expect(ok(P4SlideSchema, { type: "wordStamp", words: ["A", "B", "C"], duration: D })).toBe(true);
  });

  it("validates triGrid (3-column tuple)", () => {
    const columns = [
      { value: 1, label: "A", accent: "red" },
      { value: 2, label: "B", accent: "yellow" },
      { value: 3, label: "C", accent: "black" },
    ];
    expect(ok(P4SlideSchema, { type: "triGrid", headline: "H", columns, duration: D })).toBe(true);
  });

  it("rejects triGrid with invalid accent", () => {
    const columns = [
      { value: 1, label: "A", accent: "purple" },
      { value: 2, label: "B", accent: "yellow" },
      { value: 3, label: "C", accent: "black" },
    ];
    expect(fail(P4SlideSchema, { type: "triGrid", headline: "H", columns, duration: D })).toBe(true);
  });

  it("validates halfBleed", () => {
    expect(ok(P4SlideSchema, { type: "halfBleed", bigValue: "99%", bigLabel: "Uptime", facts: ["Fast"], duration: D })).toBe(true);
  });

  it("validates boldQuote", () => {
    expect(ok(P4SlideSchema, { type: "boldQuote", quote: "Q", author: "A", duration: D })).toBe(true);
  });

  it("validates closingStripe", () => {
    expect(ok(P4SlideSchema, { type: "closingStripe", word: "GO", tagline: "T", duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P5 — Glassmorphism Dark
// ═══════════════════════════════════════════════════════════════════════════════
describe("P5 (Glassmorphism) schema", () => {
  it("validates glassHero", () => {
    expect(ok(P5SlideSchema, { type: "glassHero", title: "T", subtitle: "S", tag: "TAG", duration: D })).toBe(true);
  });

  it("validates glassStats", () => {
    const stats = [{ value: "99%", label: "Uptime", accent: "teal" }];
    expect(ok(P5SlideSchema, { type: "glassStats", title: "T", stats, duration: D })).toBe(true);
  });

  it("rejects glassStats with invalid accent", () => {
    const stats = [{ value: "99%", label: "Uptime", accent: "red" }];
    expect(fail(P5SlideSchema, { type: "glassStats", title: "T", stats, duration: D })).toBe(true);
  });

  it("validates glassGrid (4-item tuple)", () => {
    const items = [
      { label: "A", body: "a", accent: "teal" },
      { label: "B", body: "b", accent: "blue" },
      { label: "C", body: "c", accent: "violet" },
      { label: "D", body: "d", accent: "white" },
    ];
    expect(ok(P5SlideSchema, { type: "glassGrid", headline: "H", items, duration: D })).toBe(true);
  });

  it("validates glassQuote", () => {
    expect(ok(P5SlideSchema, { type: "glassQuote", quote: "Q", author: "A", duration: D })).toBe(true);
  });

  it("validates glassBar", () => {
    const bars = [{ label: "L", value: 50, maxValue: 100 }];
    expect(ok(P5SlideSchema, { type: "glassBar", title: "T", bars, duration: D })).toBe(true);
  });

  it("validates glassClosing", () => {
    expect(ok(P5SlideSchema, { type: "glassClosing", headline: "H", tagline: "T", duration: D })).toBe(true);
  });

  it("validates glassIconFeatures", () => {
    const features = [{ iconName: "Zap", title: "T", body: "B", accent: "teal" }];
    expect(ok(P5SlideSchema, { type: "glassIconFeatures", headline: "H", features, duration: D })).toBe(true);
  });

  it("validates glassDonut", () => {
    const segments = [{ label: "A", value: 50, accent: "blue" }];
    expect(ok(P5SlideSchema, { type: "glassDonut", title: "T", segments, centerLabel: "CL", centerValue: "CV", duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P6 — Cinematic Gold
// ═══════════════════════════════════════════════════════════════════════════════
describe("P6 (Cinematic Gold) schema", () => {
  it("validates cinemaHero", () => {
    expect(ok(P6SlideSchema, { type: "cinemaHero", chapter: "I", title: "T", subtitle: "S", duration: D })).toBe(true);
  });

  it("validates cinemaStat", () => {
    expect(ok(P6SlideSchema, { type: "cinemaStat", label: "L", value: "V", duration: D })).toBe(true);
  });

  it("validates cinemaGrid (3-column tuple)", () => {
    const columns = [{ title: "A", body: "a" }, { title: "B", body: "b" }, { title: "C", body: "c" }];
    expect(ok(P6SlideSchema, { type: "cinemaGrid", headline: "H", columns, duration: D })).toBe(true);
  });

  it("validates cinemaQuote", () => {
    expect(ok(P6SlideSchema, { type: "cinemaQuote", quote: "Q", author: "A", duration: D })).toBe(true);
  });

  it("validates cinemaList", () => {
    expect(ok(P6SlideSchema, { type: "cinemaList", title: "T", items: ["A", "B"], duration: D })).toBe(true);
  });

  it("validates cinemaClosing", () => {
    expect(ok(P6SlideSchema, { type: "cinemaClosing", word: "FIN", tagline: "T", duration: D })).toBe(true);
  });

  it("validates cinemaImageFull", () => {
    expect(ok(P6SlideSchema, { type: "cinemaImageFull", src: "img.jpg", title: "T", duration: D })).toBe(true);
  });

  it("validates cinemaIconRow (3-item tuple)", () => {
    const items = [
      { iconName: "Zap", title: "A", body: "a" },
      { iconName: "Globe", title: "B", body: "b" },
      { iconName: "Cpu", title: "C", body: "c" },
    ];
    expect(ok(P6SlideSchema, { type: "cinemaIconRow", headline: "H", items, duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P7 — Neon Grid / Cyber
// ═══════════════════════════════════════════════════════════════════════════════
describe("P7 (Cyber) schema", () => {
  it("validates cyberHero", () => {
    expect(ok(P7SlideSchema, { type: "cyberHero", title: "T", subtitle: "S", systemLabel: "SYS", duration: D })).toBe(true);
  });

  it("validates cyberMetrics", () => {
    const metrics = [{ value: "99", label: "L", accent: "cyan" }];
    expect(ok(P7SlideSchema, { type: "cyberMetrics", title: "T", metrics, duration: D })).toBe(true);
  });

  it("rejects cyberMetrics with invalid accent", () => {
    const metrics = [{ value: "99", label: "L", accent: "red" }];
    expect(fail(P7SlideSchema, { type: "cyberMetrics", title: "T", metrics, duration: D })).toBe(true);
  });

  it("validates cyberBar (0-100 value)", () => {
    const bars = [{ label: "L", value: 75 }];
    expect(ok(P7SlideSchema, { type: "cyberBar", title: "T", bars, duration: D })).toBe(true);
  });

  it("rejects cyberBar value over 100", () => {
    const bars = [{ label: "L", value: 101 }];
    expect(fail(P7SlideSchema, { type: "cyberBar", title: "T", bars, duration: D })).toBe(true);
  });

  it("validates cyberList", () => {
    expect(ok(P7SlideSchema, { type: "cyberList", title: "T", items: ["A"], duration: D })).toBe(true);
  });

  it("validates cyberQuote", () => {
    expect(ok(P7SlideSchema, { type: "cyberQuote", quote: "Q", author: "A", duration: D })).toBe(true);
  });

  it("validates cyberClosing", () => {
    expect(ok(P7SlideSchema, { type: "cyberClosing", word: "END", tagline: "T", duration: D })).toBe(true);
  });

  it("validates cyberLineChart", () => {
    const points = [{ label: "Q1", value: 50 }];
    expect(ok(P7SlideSchema, { type: "cyberLineChart", title: "T", points, accent: "magenta", duration: D })).toBe(true);
  });

  it("validates cyberIconGrid", () => {
    const items = [{ iconName: "Zap", label: "L", accent: "green" }];
    expect(ok(P7SlideSchema, { type: "cyberIconGrid", title: "T", items, duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P9 — Vaporwave
// ═══════════════════════════════════════════════════════════════════════════════
describe("P9 (Vaporwave) schema", () => {
  it("validates vaporHero", () => {
    expect(ok(P9SlideSchema, { type: "vaporHero", title: "T", subtitle: "S", tag: "TAG", duration: D })).toBe(true);
  });

  it("validates vaporStat", () => {
    expect(ok(P9SlideSchema, { type: "vaporStat", label: "L", value: "V", accent: "pink", duration: D })).toBe(true);
  });

  it("rejects vaporStat with invalid accent", () => {
    expect(fail(P9SlideSchema, { type: "vaporStat", label: "L", value: "V", accent: "purple", duration: D })).toBe(true);
  });

  it("validates vaporGrid", () => {
    const items = [{ label: "L", body: "B", accent: "pink" }];
    expect(ok(P9SlideSchema, { type: "vaporGrid", headline: "H", items, duration: D })).toBe(true);
  });

  it("validates vaporList", () => {
    expect(ok(P9SlideSchema, { type: "vaporList", title: "T", items: ["A"], duration: D })).toBe(true);
  });

  it("validates vaporQuote", () => {
    expect(ok(P9SlideSchema, { type: "vaporQuote", quote: "Q", author: "A", duration: D })).toBe(true);
  });

  it("validates vaporTimeline", () => {
    const milestones = [{ year: "2024", label: "L", accent: "blue" }];
    expect(ok(P9SlideSchema, { type: "vaporTimeline", title: "T", milestones, duration: D })).toBe(true);
  });

  it("validates vaporClosing", () => {
    expect(ok(P9SlideSchema, { type: "vaporClosing", word: "END", tagline: "T", duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P10 — Warm Organic
// ═══════════════════════════════════════════════════════════════════════════════
describe("P10 (Organic) schema", () => {
  it("validates organicHero", () => {
    expect(ok(P10SlideSchema, { type: "organicHero", eyebrow: "E", title: "T", subtitle: "S", duration: D })).toBe(true);
  });

  it("validates organicStats (3-stat tuple)", () => {
    const stats = [
      { value: "A", label: "L" },
      { value: "B", label: "L" },
      { value: "C", label: "L" },
    ];
    expect(ok(P10SlideSchema, { type: "organicStats", title: "T", stats, duration: D })).toBe(true);
  });

  it("rejects organicStats with 2 items", () => {
    const stats = [{ value: "A", label: "L" }, { value: "B", label: "L" }];
    expect(fail(P10SlideSchema, { type: "organicStats", title: "T", stats, duration: D })).toBe(true);
  });

  it("validates organicList", () => {
    expect(ok(P10SlideSchema, { type: "organicList", title: "T", items: ["A"], duration: D })).toBe(true);
  });

  it("validates organicQuote", () => {
    expect(ok(P10SlideSchema, { type: "organicQuote", quote: "Q", author: "A", duration: D })).toBe(true);
  });

  it("validates organicGrid (4-item tuple)", () => {
    const items = [
      { title: "A", body: "a" }, { title: "B", body: "b" },
      { title: "C", body: "c" }, { title: "D", body: "d" },
    ];
    expect(ok(P10SlideSchema, { type: "organicGrid", headline: "H", items, duration: D })).toBe(true);
  });

  it("validates organicTimeline", () => {
    const milestones = [{ year: "2024", label: "L" }];
    expect(ok(P10SlideSchema, { type: "organicTimeline", title: "T", milestones, duration: D })).toBe(true);
  });

  it("validates organicClosing", () => {
    expect(ok(P10SlideSchema, { type: "organicClosing", headline: "H", tagline: "T", duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P11 — Blueprint
// ═══════════════════════════════════════════════════════════════════════════════
describe("P11 (Blueprint) schema", () => {
  it("validates blueprintHero", () => {
    expect(ok(P11SlideSchema, { type: "blueprintHero", projectCode: "PRJ-01", title: "T", subtitle: "S", duration: D })).toBe(true);
  });

  it("validates blueprintSpec", () => {
    const specs = [{ key: "K", value: "V" }];
    expect(ok(P11SlideSchema, { type: "blueprintSpec", title: "T", specs, duration: D })).toBe(true);
  });

  it("validates blueprintList", () => {
    expect(ok(P11SlideSchema, { type: "blueprintList", title: "T", items: ["A"], duration: D })).toBe(true);
  });

  it("validates blueprintQuote", () => {
    expect(ok(P11SlideSchema, { type: "blueprintQuote", quote: "Q", author: "A", duration: D })).toBe(true);
  });

  it("validates blueprintDiagram (0-100 bar values)", () => {
    const bars = [{ label: "L", value: 50 }];
    expect(ok(P11SlideSchema, { type: "blueprintDiagram", title: "T", bars, duration: D })).toBe(true);
  });

  it("rejects blueprintDiagram bar value over 100", () => {
    const bars = [{ label: "L", value: 101 }];
    expect(fail(P11SlideSchema, { type: "blueprintDiagram", title: "T", bars, duration: D })).toBe(true);
  });

  it("validates blueprintGrid", () => {
    const items = [{ code: "C", title: "T", body: "B" }];
    expect(ok(P11SlideSchema, { type: "blueprintGrid", headline: "H", items, duration: D })).toBe(true);
  });

  it("validates blueprintClosing", () => {
    expect(ok(P11SlideSchema, { type: "blueprintClosing", projectCode: "P", headline: "H", tagline: "T", duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P12 — Kinetic Typography
// ═══════════════════════════════════════════════════════════════════════════════
describe("P12 (Kinetic) schema", () => {
  it("validates kineticHero", () => {
    expect(ok(P12SlideSchema, { type: "kineticHero", word1: "W1", word2: "W2", tagline: "T", duration: D })).toBe(true);
  });

  it("validates kineticStat", () => {
    expect(ok(P12SlideSchema, { type: "kineticStat", value: "99", label: "L", color: "red", duration: D })).toBe(true);
  });

  it("rejects kineticStat with invalid color", () => {
    expect(fail(P12SlideSchema, { type: "kineticStat", value: "99", label: "L", color: "blue", duration: D })).toBe(true);
  });

  it("validates kineticSplit", () => {
    expect(ok(P12SlideSchema, { type: "kineticSplit", left: "L", right: "R", connector: "vs", duration: D })).toBe(true);
  });

  it("validates kineticList (1-4 items)", () => {
    expect(ok(P12SlideSchema, { type: "kineticList", items: ["A", "B"], duration: D })).toBe(true);
  });

  it("rejects kineticList with 0 items", () => {
    expect(fail(P12SlideSchema, { type: "kineticList", items: [], duration: D })).toBe(true);
  });

  it("rejects kineticList with 5 items", () => {
    expect(fail(P12SlideSchema, { type: "kineticList", items: ["A", "B", "C", "D", "E"], duration: D })).toBe(true);
  });

  it("validates kineticQuote", () => {
    expect(ok(P12SlideSchema, { type: "kineticQuote", quote: "Q", author: "A", duration: D })).toBe(true);
  });

  it("validates kineticCounter", () => {
    expect(ok(P12SlideSchema, { type: "kineticCounter", from: 0, to: 100, suffix: "%", label: "L", color: "green", duration: D })).toBe(true);
  });

  it("validates kineticClosing", () => {
    expect(ok(P12SlideSchema, { type: "kineticClosing", brand: "B", call: "C", duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P13 — Diagonal Split
// ═══════════════════════════════════════════════════════════════════════════════
describe("P13 (Diagonal) schema", () => {
  it("validates diagHero", () => {
    expect(ok(P13SlideSchema, { type: "diagHero", eyebrow: "E", title: "T", subtitle: "S", accent: "#f00", duration: D })).toBe(true);
  });

  it("validates diagStat", () => {
    expect(ok(P13SlideSchema, { type: "diagStat", value: "V", label: "L", context: "C", accent: "#0f0", duration: D })).toBe(true);
  });

  it("validates diagGrid (3-item tuple)", () => {
    const items = [{ title: "A", body: "a" }, { title: "B", body: "b" }, { title: "C", body: "c" }];
    expect(ok(P13SlideSchema, { type: "diagGrid", headline: "H", items, accent: "#00f", duration: D })).toBe(true);
  });

  it("validates diagQuote", () => {
    expect(ok(P13SlideSchema, { type: "diagQuote", quote: "Q", author: "A", accent: "#fff", duration: D })).toBe(true);
  });

  it("validates diagList", () => {
    expect(ok(P13SlideSchema, { type: "diagList", title: "T", items: ["A"], accent: "#000", duration: D })).toBe(true);
  });

  it("validates diagTimeline", () => {
    const events = [{ year: "2024", label: "L" }];
    expect(ok(P13SlideSchema, { type: "diagTimeline", title: "T", events, accent: "#abc", duration: D })).toBe(true);
  });

  it("validates diagClosing", () => {
    expect(ok(P13SlideSchema, { type: "diagClosing", headline: "H", sub: "S", accent: "#def", duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P14 — Broadsheet / Newspaper
// ═══════════════════════════════════════════════════════════════════════════════
describe("P14 (Broadsheet) schema", () => {
  it("validates broadHero", () => {
    expect(ok(P14SlideSchema, { type: "broadHero", headline: "H", deck: "D", byline: "B", date: "2024", duration: D })).toBe(true);
  });

  it("validates broadLead", () => {
    expect(ok(P14SlideSchema, { type: "broadLead", section: "S", headline: "H", body: "B", pullQuote: "PQ", duration: D })).toBe(true);
  });

  it("validates broadStats", () => {
    const stats = [{ value: "V", label: "L" }];
    expect(ok(P14SlideSchema, { type: "broadStats", section: "S", headline: "H", stats, duration: D })).toBe(true);
  });

  it("validates broadQuote", () => {
    expect(ok(P14SlideSchema, { type: "broadQuote", section: "S", quote: "Q", attribution: "A", title: "T", duration: D })).toBe(true);
  });

  it("validates broadGrid", () => {
    const items = [{ kicker: "K", title: "T", body: "B" }];
    expect(ok(P14SlideSchema, { type: "broadGrid", section: "S", headline: "H", items, duration: D })).toBe(true);
  });

  it("validates broadTimeline", () => {
    const events = [{ date: "2024", headline: "H" }];
    expect(ok(P14SlideSchema, { type: "broadTimeline", section: "S", headline: "H", events, duration: D })).toBe(true);
  });

  it("validates broadClosing", () => {
    expect(ok(P14SlideSchema, { type: "broadClosing", headline: "H", edition: "E", tagline: "T", duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P15 — Terminal / CLI
// ═══════════════════════════════════════════════════════════════════════════════
describe("P15 (Terminal) schema", () => {
  it("validates termHero", () => {
    expect(ok(P15SlideSchema, { type: "termHero", command: "$ run", output: ["OK"], tagline: "T", duration: D })).toBe(true);
  });

  it("validates termLoad", () => {
    const steps = [{ text: "Loading...", done: true }];
    expect(ok(P15SlideSchema, { type: "termLoad", label: "L", steps, duration: D })).toBe(true);
  });

  it("validates termStat", () => {
    expect(ok(P15SlideSchema, { type: "termStat", query: "Q", key: "K", value: "V", unit: "U", notes: ["N"], duration: D })).toBe(true);
  });

  it("validates termList", () => {
    expect(ok(P15SlideSchema, { type: "termList", heading: "H", items: ["A"], duration: D })).toBe(true);
  });

  it("validates termQuote", () => {
    expect(ok(P15SlideSchema, { type: "termQuote", quote: "Q", author: "A", duration: D })).toBe(true);
  });

  it("validates termBar", () => {
    const bars = [{ label: "L", value: 50, max: 100 }];
    expect(ok(P15SlideSchema, { type: "termBar", title: "T", bars, duration: D })).toBe(true);
  });

  it("validates termClosing", () => {
    expect(ok(P15SlideSchema, { type: "termClosing", message: "M", prompt: "$", duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P16 — Comic Book
// ═══════════════════════════════════════════════════════════════════════════════
describe("P16 (Comic) schema", () => {
  it("validates comicHero", () => {
    expect(ok(P16SlideSchema, { type: "comicHero", action: "BAM", hero: "H", tagline: "T", duration: D })).toBe(true);
  });

  it("validates comicStat", () => {
    expect(ok(P16SlideSchema, { type: "comicStat", label: "L", value: "V", exclamation: "WOW", color: "red", duration: D })).toBe(true);
  });

  it("rejects comicStat with invalid panel color", () => {
    expect(fail(P16SlideSchema, { type: "comicStat", label: "L", value: "V", exclamation: "!", color: "green", duration: D })).toBe(true);
  });

  it("validates comicSplit", () => {
    expect(ok(P16SlideSchema, {
      type: "comicSplit",
      panel1: { text: "A", color: "red" },
      panel2: { text: "B", color: "blue" },
      versus: true,
      duration: D,
    })).toBe(true);
  });

  it("validates comicList", () => {
    expect(ok(P16SlideSchema, { type: "comicList", title: "T", items: ["A"], duration: D })).toBe(true);
  });

  it("validates comicQuote", () => {
    expect(ok(P16SlideSchema, { type: "comicQuote", quote: "Q", author: "A", duration: D })).toBe(true);
  });

  it("validates comicStatsGrid", () => {
    const stats = [{ value: "V", label: "L", color: "yellow" }];
    expect(ok(P16SlideSchema, { type: "comicStatsGrid", headline: "H", stats, duration: D })).toBe(true);
  });

  it("validates comicClosing", () => {
    expect(ok(P16SlideSchema, { type: "comicClosing", action: "POW", tagline: "T", cta: "C", duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Cross-theme: duration enforcement
// ═══════════════════════════════════════════════════════════════════════════════
describe("duration enforcement across all schemas", () => {
  const schemas = [
    { name: "P2", schema: P2SlideSchema, slide: { type: "splitTitle", title: "T" } },
    { name: "P4", schema: P4SlideSchema, slide: { type: "brutalistHero", title: "T", tag: "X", subtitle: "S" } },
    { name: "P5", schema: P5SlideSchema, slide: { type: "glassHero", title: "T", subtitle: "S", tag: "X" } },
    { name: "P6", schema: P6SlideSchema, slide: { type: "cinemaHero", chapter: "I", title: "T", subtitle: "S" } },
    { name: "P7", schema: P7SlideSchema, slide: { type: "cyberHero", title: "T", subtitle: "S", systemLabel: "SYS" } },
    { name: "P9", schema: P9SlideSchema, slide: { type: "vaporHero", title: "T", subtitle: "S", tag: "X" } },
    { name: "P10", schema: P10SlideSchema, slide: { type: "organicHero", eyebrow: "E", title: "T", subtitle: "S" } },
    { name: "P11", schema: P11SlideSchema, slide: { type: "blueprintHero", projectCode: "P", title: "T", subtitle: "S" } },
    { name: "P12", schema: P12SlideSchema, slide: { type: "kineticHero", word1: "W1", word2: "W2", tagline: "T" } },
    { name: "P13", schema: P13SlideSchema, slide: { type: "diagHero", eyebrow: "E", title: "T", subtitle: "S", accent: "#f00" } },
    { name: "P14", schema: P14SlideSchema, slide: { type: "broadHero", headline: "H", deck: "D", byline: "B", date: "2024" } },
    { name: "P15", schema: P15SlideSchema, slide: { type: "termHero", command: "$", output: ["OK"], tagline: "T" } },
    { name: "P16", schema: P16SlideSchema, slide: { type: "comicHero", action: "A", hero: "H", tagline: "T" } },
    { name: "P18", schema: P18SlideSchema, slide: { type: "grungeHero", title: "T", subtitle: "S", tag: "X" } },
    { name: "P19", schema: P19SlideSchema, slide: { type: "dataHero", title: "T", subtitle: "S", badge: "B" } },
    { name: "P20", schema: P20SlideSchema, slide: { type: "kineticSplash", word: "W", accent: "pink" } },
  ];

  for (const { name, schema, slide } of schemas) {
    it(`${name} rejects duration below 60`, () => {
      expect(fail(schema, { ...slide, duration: 59 })).toBe(true);
    });

    it(`${name} accepts duration of exactly 60`, () => {
      expect(ok(schema, { ...slide, duration: 60 })).toBe(true);
    });

    it(`${name} rejects non-integer duration`, () => {
      expect(fail(schema, { ...slide, duration: 60.5 })).toBe(true);
    });

    it(`${name} rejects missing duration`, () => {
      expect(fail(schema, { ...slide })).toBe(true);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// P18 — Grunge / Textured Raw
// ═══════════════════════════════════════════════════════════════════════════════
describe("P18 (Grunge) schema", () => {
  it("validates grungeHero", () => {
    expect(ok(P18SlideSchema, { type: "grungeHero", title: "T", subtitle: "S", tag: "TAG", duration: D })).toBe(true);
  });

  it("validates grungeStat", () => {
    expect(ok(P18SlideSchema, { type: "grungeStat", value: "73%", label: "L", context: "C", duration: D })).toBe(true);
  });

  it("validates grungeList", () => {
    expect(ok(P18SlideSchema, { type: "grungeList", title: "T", items: ["A", "B"], duration: D })).toBe(true);
  });

  it("validates grungeQuote", () => {
    expect(ok(P18SlideSchema, { type: "grungeQuote", quote: "Q", author: "A", duration: D })).toBe(true);
  });

  it("validates grungeQuote with optional role", () => {
    expect(ok(P18SlideSchema, { type: "grungeQuote", quote: "Q", author: "A", role: "R", duration: D })).toBe(true);
  });

  it("validates grungeClosing", () => {
    expect(ok(P18SlideSchema, { type: "grungeClosing", word: "GO", tagline: "T", duration: D })).toBe(true);
  });

  it("rejects unknown slide type", () => {
    expect(fail(P18SlideSchema, { type: "unknown", title: "X", duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P19 — Data Infographic
// ═══════════════════════════════════════════════════════════════════════════════
describe("P19 (Data Infographic) schema", () => {
  it("validates dataHero", () => {
    expect(ok(P19SlideSchema, { type: "dataHero", title: "T", subtitle: "S", badge: "B", duration: D })).toBe(true);
  });

  it("validates dataCounter", () => {
    expect(ok(P19SlideSchema, { type: "dataCounter", value: 1000, suffix: "+", label: "L", duration: D })).toBe(true);
  });

  it("validates dataCounter with optional sublabel", () => {
    expect(ok(P19SlideSchema, { type: "dataCounter", value: 500, suffix: "%", label: "L", sublabel: "SL", duration: D })).toBe(true);
  });

  it("validates dataBar", () => {
    const bars = [{ label: "L", value: 50, max: 100 }];
    expect(ok(P19SlideSchema, { type: "dataBar", title: "T", bars, duration: D })).toBe(true);
  });

  it("validates dataDonut", () => {
    const segments = [{ label: "A", value: 50, color: "#00d4aa" }];
    expect(ok(P19SlideSchema, { type: "dataDonut", title: "T", segments, centerValue: "CV", centerLabel: "CL", duration: D })).toBe(true);
  });

  it("validates dataClosing", () => {
    expect(ok(P19SlideSchema, { type: "dataClosing", headline: "H", tagline: "T", duration: D })).toBe(true);
  });

  it("rejects unknown slide type", () => {
    expect(fail(P19SlideSchema, { type: "unknown", title: "X", duration: D })).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// P20 — Kinetic Typography
// ═══════════════════════════════════════════════════════════════════════════════
describe("P20 (Kinetic Typography) schema", () => {
  it("validates kineticSplash", () => {
    expect(ok(P20SlideSchema, { type: "kineticSplash", word: "STOP", accent: "pink", duration: D })).toBe(true);
  });

  it("validates kineticSplash with all accent values", () => {
    for (const accent of ["pink", "cyan", "yellow", "white"]) {
      expect(ok(P20SlideSchema, { type: "kineticSplash", word: "W", accent, duration: D })).toBe(true);
    }
  });

  it("rejects kineticSplash with invalid accent", () => {
    expect(fail(P20SlideSchema, { type: "kineticSplash", word: "W", accent: "red", duration: D })).toBe(true);
  });

  it("validates kineticReveal (1-6 words)", () => {
    expect(ok(P20SlideSchema, { type: "kineticReveal", words: ["A", "B", "C"], accent: "cyan", duration: D })).toBe(true);
  });

  it("rejects kineticReveal with 0 words", () => {
    expect(fail(P20SlideSchema, { type: "kineticReveal", words: [], accent: "cyan", duration: D })).toBe(true);
  });

  it("rejects kineticReveal with 7 words", () => {
    expect(fail(P20SlideSchema, { type: "kineticReveal", words: ["A", "B", "C", "D", "E", "F", "G"], accent: "cyan", duration: D })).toBe(true);
  });

  it("validates kineticQuote20", () => {
    expect(ok(P20SlideSchema, { type: "kineticQuote20", quote: "Q", author: "A", duration: D })).toBe(true);
  });

  it("validates kineticClosing20", () => {
    expect(ok(P20SlideSchema, { type: "kineticClosing20", line1: "L1", line2: "L2", duration: D })).toBe(true);
  });

  it("rejects unknown slide type", () => {
    expect(fail(P20SlideSchema, { type: "unknown", word: "X", duration: D })).toBe(true);
  });
});
