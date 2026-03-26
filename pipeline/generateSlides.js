const OpenAI = require("openai");
const { z } = require("zod");

let _openai = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 3 });
  return _openai;
}

const VALID_ICON_NAMES = [
  "Zap", "Globe", "VideoIcon", "Cpu", "BarChart3", "Users",
  "Rocket", "Shield", "TrendingUp", "Layers", "Clock", "Star",
];

// --- Zod schemas per theme (mirrors schema.ts) ---

const IconNameSchema = z.enum(VALID_ICON_NAMES);

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

const THEME_CONFIGS = {
  P1: {
    compositionId: "Presentation",
    name: "Dark Tech",
    vibe: "startup pitch, AI, software, tech product — dark background, neon blues, futuristic",
    transitionFrames: 20,
    slideTypes: `
- title: { title: string, subtitle?: string }
- iconGrid: { title: string, items: [{iconName, label, color}] } — iconName must be one of: ${VALID_ICON_NAMES.join(", ")}
- checklist: { title: string, points: string[] }
- stats: { title: string, stats: [{iconName, value: number, label, suffix?: string, color}] } — iconName must be one of: ${VALID_ICON_NAMES.join(", ")}
- barChart: { title: string, bars: [{label, value: 0-100, color}] }
- timeline: { title: string, milestones: [{date, label, description}] }
- quote: { quote: string, author: string, role?: string }`,
    schema: P1SlideSchema,
  },
  P3: {
    compositionId: "Presentation3",
    name: "Dashboard/KPI",
    vibe: "finance, metrics, data, business review, quarterly reports — dark background, neon green, KPI panels",
    transitionFrames: 10,
    slideTypes: `
- kpiTitle: { title: string, tagline: string, badge?: string }
- bigStat: { label: string, value: string, numericValue: number, unit?: string, trend: "up"|"down"|"neutral", caption?: string }
- metricRow: { title: string, metrics: [{label, value: string, delta?}] } — EXACTLY 3 metrics required
- barRace: { title: string, bars: [{label, value: number}], maxValue: number }
- milestone: { icon: string, headline: string, caption: string, year?: string }`,
    schema: P3SlideSchema,
  },
  P17: {
    compositionId: "Presentation17",
    name: "Prestige Academic",
    vibe: "lectures, education, research, tutorials — deep navy, gold accents, serif typography",
    transitionFrames: 20,
    slideTypes: `
- title17: { title: string, subtitle?: string, course?: string }
- pillars17: { title: string, pillars: string[] }
- prof17: { name: string, role: string, background: string }
- manifesto17: { statement: string, detail: string }
- expect17: { title: string, items: string[] }
- cta17: { headline: string, instruction: string }`,
    schema: P17SlideSchema,
  },
};

async function selectTheme(transcriptText) {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4.1",
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "theme_selection",
        strict: true,
        schema: {
          type: "object",
          properties: {
            themeId: { type: "string", enum: ["P1", "P3", "P17"] },
            reasoning: { type: "string" },
          },
          required: ["themeId", "reasoning"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: "system",
        content: `You are a presentation designer selecting the best visual theme for a video transcript.

Theme options:
- P1 (Dark Tech): startup pitch, AI, software, tech product
- P3 (Dashboard/KPI): finance, metrics, data, business review, quarterly reports
- P17 (Academic): lectures, education, research, tutorials

Select the single best theme for the transcript. Respond with JSON.`,
      },
      { role: "user", content: `Transcript:\n${transcriptText}` },
    ],
  });

  let parsed;
  try {
    parsed = JSON.parse(response.choices[0].message.content);
  } catch (e) {
    throw new Error(`Failed to parse theme selection response: ${e.message}`);
  }
  return parsed;
}

/**
 * Validates that segmentIndices arrays collectively cover every segment
 * exactly once, with no gaps or overlaps.
 */
function validateSegmentCoverage(slides, totalSegments) {
  const covered = new Array(totalSegments).fill(false);
  const errors = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const indices = slide.reuseSlideIndex !== undefined ? slide.segmentIndices : slide.segmentIndices;

    if (!Array.isArray(indices) || indices.length === 0) {
      errors.push(`slide[${i}]: missing or empty segmentIndices`);
      continue;
    }

    for (const idx of indices) {
      if (typeof idx !== "number" || idx < 0 || idx >= totalSegments) {
        errors.push(`slide[${i}]: segmentIndices contains invalid index ${idx} (valid: 0–${totalSegments - 1})`);
        continue;
      }
      if (covered[idx]) {
        errors.push(`slide[${i}]: segment index ${idx} is already assigned to a previous slide`);
      }
      covered[idx] = true;
    }
  }

  const missing = covered.map((v, i) => (!v ? i : null)).filter((v) => v !== null);
  if (missing.length > 0) {
    errors.push(`segments [${missing.join(", ")}] are not assigned to any slide — every segment must appear in exactly one slide`);
  }

  return errors;
}

async function generateSlidesForTheme(themeId, segments, retryError = null) {
  const theme = THEME_CONFIGS[themeId];

  // Numbered segment list with timestamps and text
  const segmentList = segments
    .map((s, i) => `[${i}] ${s.start.toFixed(2)}s–${s.end.toFixed(2)}s: "${s.text.trim()}"`)
    .join("\n");

  const errorNote = retryError
    ? `\n\nPREVIOUS ATTEMPT FAILED — fix these issues:\n${retryError}\n`
    : "";

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4.1",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a presentation designer. Given a transcript with numbered segments and precise timestamps, generate slides perfectly synced to when topics are actually spoken.${errorNote}

THEME: ${theme.name} — ${theme.vibe}

AVAILABLE SLIDE TYPES:
${theme.slideTypes}

SYNC RULES (critical — follow exactly):
- Output JSON: { "slides": [...] }
- Each slide MUST include "segmentIndices": an array of segment indices (the numbers in [brackets]) that this slide covers
- segmentIndices MUST be contiguous (e.g. [3,4,5] not [3,5])
- Every segment index from 0 to ${segments.length - 1} must appear in exactly one slide — no gaps, no overlaps
- Slides will be shown on screen during exactly the segments they reference — the viewer sees this slide while the speaker says those words
- Assign 2–3 contiguous segments per slide — NEVER more than 4. Each slide should be on screen for roughly 10–20 seconds.
- Target approximately 1 slide per 4–5 segments. For ${segments.length} segments you should produce roughly ${Math.round(segments.length / 4)} slides.
- AVOID reuseSlideIndex — only use it if the speaker explicitly returns to a named topic from earlier. Never use it just to fill time. Prefer creating a new slide with fresh content.

CONTENT RULES:
- Each non-reuse slide MUST have a "type" field matching exactly one of the types above
- Do NOT include a "duration" field — it will be calculated from the segment timestamps
- For iconName fields: use ONLY these exact values: ${VALID_ICON_NAMES.join(", ")}
- Write content that reflects what is actually said in those segments
- For iconGrid items, always provide a real iconName from the list above (never null or empty)

TRANSCRIPT SEGMENTS (${segments.length} total — all must be covered):
${segmentList}`,
      },
    ],
  });

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch (parseError) {
    return { _parseError: "GPT response was not valid JSON: " + parseError.message };
  }
}

/**
 * Main entry point.
 * @param {{ text: string, segments: Array<{start,end,text}> }} transcript
 * @returns {{ compositionId: string, themeId: string, slides: Array<object & {duration: number}> }}
 */
async function generateSlides(transcript) {
  const { segments } = transcript;

  // Phase 1: Theme selection
  const { themeId } = await selectTheme(transcript.text);
  const theme = THEME_CONFIGS[themeId];

  // Phase 2: Slide generation with retry
  let rawSlides = null;
  let lastError = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    const result = await generateSlidesForTheme(themeId, segments, lastError);

    if (result._parseError) {
      lastError = result._parseError;
      continue;
    }

    if (!result.slides || !Array.isArray(result.slides)) {
      lastError = "Response must have a 'slides' array";
      continue;
    }

    // Validate segment coverage (no gaps, no overlaps, all indices valid)
    const coverageErrors = validateSegmentCoverage(result.slides, segments.length);
    if (coverageErrors.length > 0) {
      lastError = coverageErrors.join("\n");
      continue;
    }

    // Reject slides with too many segments (> 4) — forces denser slide changes
    const densityErrors = result.slides
      .map((s, i) => s.segmentIndices.length > 4
        ? `slide[${i}] covers ${s.segmentIndices.length} segments — max is 4. Split into multiple slides.`
        : null)
      .filter(Boolean);
    if (densityErrors.length > 0) {
      lastError = densityErrors.join("\n");
      continue;
    }

    // Validate content schema on non-reuse slides
    const schemaErrors = [];
    const resolvedSlides = []; // build as we go so reuseSlideIndex can reference earlier slides

    for (let i = 0; i < result.slides.length; i++) {
      const slide = result.slides[i];

      if (slide.reuseSlideIndex !== undefined) {
        if (slide.reuseSlideIndex < 0 || slide.reuseSlideIndex >= i) {
          schemaErrors.push(`slide[${i}]: reuseSlideIndex ${slide.reuseSlideIndex} is out of range (must be 0–${i - 1})`);
        } else if (resolvedSlides[slide.reuseSlideIndex]._isReuse) {
          schemaErrors.push(`slide[${i}]: reuseSlideIndex ${slide.reuseSlideIndex} points to another reuse slide — not allowed`);
        } else {
          resolvedSlides.push({ ...resolvedSlides[slide.reuseSlideIndex], _isReuse: true, _segmentIndices: slide.segmentIndices });
        }
        continue;
      }

      const parsed = theme.schema.safeParse(slide);
      if (!parsed.success) {
        schemaErrors.push(`slide[${i}] (type="${slide.type}"): ${parsed.error.issues.map((e) => e.message).join("; ")}`);
      }
      resolvedSlides.push({ ...slide, _isReuse: false, _segmentIndices: slide.segmentIndices });
    }

    if (schemaErrors.length > 0) {
      lastError = schemaErrors.join("\n");
      continue;
    }

    rawSlides = result.slides;
    break;
  }

  if (!rawSlides) {
    throw new Error(`generateSlides failed after 3 attempts. Last error:\n${lastError}`);
  }

  // --- Revalidation pass (belt-and-suspenders) ---
  // Re-parse every non-reuse slide through the Zod schema one final time.
  // If any fail here it is fatal — retries have already been exhausted.
  const revalidationErrors = [];
  for (let i = 0; i < rawSlides.length; i++) {
    const slide = rawSlides[i];
    if (slide.reuseSlideIndex !== undefined) continue;
    const parsed = theme.schema.safeParse(slide);
    if (!parsed.success) {
      revalidationErrors.push(
        `slide[${i}] (type="${slide.type}"): ${parsed.error.issues.map((e) => e.message).join("; ")}`
      );
    }
  }
  if (revalidationErrors.length > 0) {
    throw new Error(
      `Post-retry revalidation failed (fatal):\n${revalidationErrors.join("\n")}`
    );
  }

  // Post-process: resolve reuse slides, inject duration from segment timestamps
  const resolvedSlides = [];
  const finalSlides = rawSlides.map((slide, i) => {
    const { segmentIndices, reuseSlideIndex, ...content } = slide;

    // Calculate duration anchored to when the NEXT slide starts (not when this slide's last segment ends).
    // This absorbs inter-segment pauses into the current slide so transitions happen exactly
    // when the speaker begins the next topic.
    const coveredSegments = segmentIndices.map((idx) => segments[idx]);
    // Slide 0 must anchor from frame 0, not from when the first spoken word begins.
    // Whisper segments start at T₀ > 0 (initial silence), so using coveredSegments[0].start
    // for slide 0 shifts every visual transition T₀×30 frames early — most noticeable
    // at the end where segments are shorter.
    const start = (i === 0) ? 0 : coveredSegments[0].start;
    let end;
    if (i < rawSlides.length - 1) {
      // End = start of next slide's first segment
      const nextSegIdx = rawSlides[i + 1].segmentIndices[0];
      end = segments[nextSegIdx].start;
    } else {
      // Last slide: go to end of its last spoken segment
      end = coveredSegments[coveredSegments.length - 1].end;
    }
    // Add transitionFrames to intermediate slides so TransitionSeries' overlap subtraction
    // cancels out exactly — each slide's visual start aligns with its first spoken segment.
    const rawDuration = Math.max(60, Math.round((end - start) * 30));
    const duration = (i < rawSlides.length - 1) ? rawDuration + theme.transitionFrames : rawDuration;

    let slideContent;
    if (reuseSlideIndex !== undefined) {
      // Clone the referenced slide's content with the new duration
      const { duration: _d, ...baseContent } = resolvedSlides[reuseSlideIndex];
      slideContent = { ...baseContent, duration };
    } else {
      slideContent = { ...content, duration };
    }

    resolvedSlides.push(slideContent);
    return slideContent;
  });

  // --- Duration revalidation ---
  if (finalSlides.length === 0) {
    throw new Error("Post-processing produced 0 slides — cannot render an empty presentation");
  }

  for (let i = 0; i < finalSlides.length; i++) {
    const d = finalSlides[i].duration;
    if (d < 60) {
      throw new Error(
        `Slide ${i} duration is ${d} frames (${(d / 30).toFixed(1)}s) — minimum is 60 frames (2s)`
      );
    }
    if (d > 600) {
      console.warn(
        `[generateSlides] WARNING: slide ${i} duration is ${d} frames (${(d / 30).toFixed(1)}s) — may indicate a segment coverage issue`
      );
    }
  }

  const totalEffectiveFrames =
    finalSlides.reduce((sum, s) => sum + s.duration, 0) -
    (finalSlides.length - 1) * theme.transitionFrames;
  if (totalEffectiveFrames <= 0) {
    throw new Error(
      `Total effective frames is ${totalEffectiveFrames} (sum of durations minus ${finalSlides.length - 1} transitions of ${theme.transitionFrames}f each) — must be > 0`
    );
  }

  return { compositionId: theme.compositionId, themeId, slides: finalSlides, transitionFrames: theme.transitionFrames };
}

module.exports = { generateSlides };
