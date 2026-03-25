# Pipeline Implementation Plan

## What We Know

### Themes + talkingHeadSrc support
Only 3 themes natively accept `talkingHeadSrc` in their PropsSchema:
- **P1** — Dark Tech
- **P3** — Dashboard / KPI
- **P17** — Prestige Academic

**Phase 1 constraint: only generate for P1, P3, P17.** All other themes render slides-only (no talking head overlay).

### Whisper output shape (confirmed working)
```json
{
  "text": "full transcript...",
  "segments": [{ "start": 0.0, "end": 5.68, "text": "Hello..." }],
  "words": [{ "word": "Hello", "start": 0.0, "end": 0.4 }]
}
```

### Duration rule (from schema.ts)
`duration` = frames at 30fps, minimum 60 (2 seconds).
Formula: `Math.round((segment.end - segment.start) * 30)`
GPT must NOT set duration — pipeline injects it from Whisper timestamps.

---

## Architecture: 3 Pipeline Files

### `pipeline/transcribe.js`
Simple wrapper around what we already tested.

**Input:** videoPath (string)
**Output:** `{ text, segments: [{start, end, text}], words: [{word, start, end}] }`

Steps:
1. `ffmpeg` extracts WAV audio → `/tmp/<jobId>.wav`
2. Whisper API call with `verbose_json` + `timestamp_granularities: ['word', 'segment']`
3. Save to `/tmp/<jobId>.transcript.json`
4. Return parsed object

---

### `pipeline/generateSlides.js`
This is the hard one. Two-phase GPT approach:

#### Phase 1 — Theme Selection
Single GPT call. Input: transcript text. Output: `{ themeId: "P1" | "P3" | "P17", reasoning: string }`.

Use `response_format: { type: "json_schema", strict: true }` with a tiny schema:
```json
{
  "type": "object",
  "properties": {
    "themeId": { "type": "string", "enum": ["P1", "P3", "P17"] },
    "reasoning": { "type": "string" }
  },
  "required": ["themeId", "reasoning"],
  "additionalProperties": false
}
```

Theme selection rules in system prompt:
- P1 (Dark Tech): startup pitch, AI, software, tech product
- P3 (Dashboard/KPI): finance, metrics, data, business review, quarterly reports
- P17 (Academic): lectures, education, research, tutorials

#### Phase 2 — Slide Content Generation
Use `response_format: { type: "json_object" }` (NOT strict mode).

Why NOT strict mode here: discriminated unions with `anyOf` in strict mode require every optional field to be nullable with `["type", "null"]` union — 17 themes × ~7 slide types × multiple optional fields = enormous schema that degrades output quality. JSON object mode + Zod validation + retry is more reliable.

Input to GPT:
- Whisper segments (with timestamps)
- Selected theme's slide types (as plain-English descriptions, NOT raw Zod)
- Instruction: output `{ slides: [...] }` with one slide per logical topic segment

System prompt structure:
```
You are a presentation designer. Given a transcript with timestamps,
generate slides for a [THEME_NAME] presentation.

THEME: [theme name + vibe description]

AVAILABLE SLIDE TYPES:
[plain-english list of slide types + their required fields]

RULES:
- Output JSON: { "slides": [...] }
- Each slide MUST have a "type" field matching exactly one of the types above
- Do NOT include a "duration" field — it will be injected later
- Generate 5–10 slides total
- Each slide covers one logical section of the transcript
- Include "segmentStart" and "segmentEnd" (in seconds) on each slide so
  the pipeline knows which transcript segment it maps to

TRANSCRIPT SEGMENTS:
[array of {index, start, end, text}]
```

**Output shape from GPT:**
```json
{
  "slides": [
    { "type": "title", "title": "...", "subtitle": "...", "segmentStart": 0, "segmentEnd": 15.8 },
    ...
  ]
}
```

**Post-processing:**
1. Strip `segmentStart`/`segmentEnd` from each slide
2. Calculate `duration = Math.round((segmentEnd - segmentStart) * 30)`, enforce min 60
3. Validate each slide against the theme's Zod schema
4. If any slide fails: retry Phase 2 with error message ("slide at index N failed validation: [error]")
5. Max 2 retries, then throw

**Plain-English Slide Type Descriptions** (pre-written, not auto-generated from Zod):

P1 Dark Tech:
```
- title: { title: string, subtitle?: string }
- iconGrid: { title: string, items: [{iconName, label, color}] } — iconName must be a valid Lucide icon
- checklist: { title: string, points: string[] }
- stats: { title: string, stats: [{iconName, value: number, label, suffix?, color}] }
- barChart: { title: string, bars: [{label, value: 0-100, color}] }
- timeline: { title: string, milestones: [{date, label, description}] }
- quote: { quote: string, author: string, role?: string }
```

P3 Dashboard/KPI:
```
- kpiTitle: { title: string, tagline: string, badge?: string }
- bigStat: { label, value: string, numericValue: number, unit?, trend: "up"|"down"|"neutral", caption? }
- metricRow: { title, metrics: [{label, value: string, delta?}] } — exactly 3 metrics
- barRace: { title, bars: [{label, value: number}], maxValue: number }
- milestone: { icon: string, headline, caption, year? }
```

P17 Academic:
```
- title17: { title, subtitle?, course? }
- pillars17: { title, pillars: string[] }
- prof17: { name, role, background }
- manifesto17: { statement, detail }
- expect17: { title, items: string[] }
- cta17: { headline, instruction }
```

**Valid iconName values** — must come from `src/iconMap.ts`. Need to read and include the valid list in prompt.

---

### `pipeline/syncTalkingHead.js`
**Input:** transcript (segments + words), slides (with segmentStart/segmentEnd stripped), videoPath
**Output:** final inputProps ready for Remotion render

Steps:
1. `ffprobe` to get exact video duration in frames
2. For each slide, duration is already calculated in generateSlides.js
3. Adjust last slide to absorb rounding drift: `lastSlide.duration += (totalVideoFrames - sumOfAllFrames)`
   - **THEN**: `lastSlide.duration = Math.max(60, lastSlide.duration)` — re-enforce min floor after drift adjustment
4. Set `talkingHeadSrc` = copied video filename (must be in `public/` for Remotion staticFile)
5. Copy video to `public/<jobId>_talkinghead.mp4`
6. Return `{ compositionId, inputProps: { slides, talkingHeadSrc } }`
   - **compositionId mapping (CRITICAL — do not use wrong IDs):**
     - P1 → `"Presentation"` (**NOT** `"Presentation1"`)
     - P3 → `"Presentation3"`
     - P17 → `"Presentation17"`

---

## server.js Changes

### New routes to add:
```
POST /pipeline/start     — multipart upload, starts pipeline async, returns { jobId }
GET  /pipeline/:jobId/status   — { status, step, error? }
GET  /pipeline/:jobId/download — serves MP4 when status === "done"
```

### In-memory job store:
```js
const jobs = new Map()
// jobId → { status, step, videoPath, outputPath, error }
// steps: uploading → transcribing → generating_slides → syncing → rendering → done
```

### Error propagation (REQUIRED):
Every pipeline step must be wrapped so errors reach the client:
```js
async function runPipeline(jobId, videoPath) {
  try {
    jobs.set(jobId, { status: 'transcribing', step: 'transcribing' })
    const transcript = await transcribe(videoPath)

    jobs.set(jobId, { ...jobs.get(jobId), status: 'generating_slides', step: 'generating_slides' })
    const { compositionId, inputProps } = await generateSlides(transcript)

    jobs.set(jobId, { ...jobs.get(jobId), status: 'syncing', step: 'syncing' })
    const finalProps = await syncTalkingHead(transcript, inputProps.slides, videoPath)

    jobs.set(jobId, { ...jobs.get(jobId), status: 'rendering', step: 'rendering' })
    const outputPath = await renderVideo(compositionId, finalProps)

    jobs.set(jobId, { status: 'done', step: 'done', outputPath })
  } catch (e) {
    jobs.set(jobId, { status: 'error', step: jobs.get(jobId)?.step, error: e.message })
  }
}
```
Without this, any thrown error leaves the job permanently stuck at the last step — client polls forever.

### Render call changes:
Current `POST /render` passes no `inputProps`. New pipeline call needs:
```js
execFile(remotionBin, [
  "render", compositionId, outputPath,
  "--props", JSON.stringify(inputProps),
  "--concurrency=1"
], ...)
```

---

## Dependencies to Install
```bash
npm install multer fluent-ffmpeg
```
(`openai` already installed)

### Multer configuration (REQUIRED — use diskStorage):
```js
const upload = multer({
  storage: multer.diskStorage({
    destination: '/tmp',
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  }),
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
})
```
**Do NOT use default (memory) storage** — a 500MB video in RAM will OOM the process.

---

## Build Order

1. **`pipeline/transcribe.js`** — trivial, already proven
2. **Read `src/iconMap.ts`** — use exported `VALID_ICON_NAMES` directly (already exported, no manual extraction needed)
3. **`pipeline/generateSlides.js`** — theme selection + slide generation + Zod validation
4. **`pipeline/syncTalkingHead.js`** — frame math + video copy
5. **`pipeline/syncTalkingHead.test.js`** — unit tests for frame math + last-slide drift adjustment
6. **`pipeline/generateSlides.test.js`** — unit tests for Zod validation + retry logic (mock OpenAI)
7. **`server.js`** — multer upload + job orchestrator + new routes
8. **Integration test** with `yt_test.mp4`

---

## File Cleanup — TTL on /status poll

All pipeline jobs accumulate temp files. Clean up on `/pipeline/:jobId/status` when job is >1hr old:
```js
function maybeCleanup(job, jobId) {
  if (job.createdAt && Date.now() - job.createdAt > 60 * 60 * 1000) {
    const files = [
      job.wavPath,
      job.transcriptPath,
      job.outputPath,
      job.talkingHeadPublicPath,
    ].filter(Boolean)
    files.forEach(f => fs.unlink(f, () => {}))
    jobs.delete(jobId)
  }
}
```
Store `createdAt`, `wavPath`, `transcriptPath`, and `talkingHeadPublicPath` on the job object when created.
The `public/<jobId>_talkinghead.mp4` files are especially important to clean — Remotion's file watcher scans `public/` and accumulates video files.

---

## Key Risks

| Risk | Mitigation |
|------|-----------|
| GPT uses invalid iconName | Include full valid list in prompt |
| GPT generates wrong slide type field | Zod validation + retry with error |
| Frame rounding drift | Last-slide adjustment in syncTalkingHead + Math.max(60, ...) floor |
| Whisper returns empty transcript | Throw early with clear error |
| Video too large for /tmp | 500MB multer diskStorage limit + size check |
| Pipeline step throws, job hangs | Top-level try/catch in runPipeline updates job to `{ status: 'error' }` |
| Wrong composition ID for P1 | Use `"Presentation"` not `"Presentation1"` — see compositionId mapping above |
| OOM on large upload | Use multer diskStorage (NOT memory storage) |
