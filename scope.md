# Feedeo — Full Pipeline Scope

**Goal:** User uploads a talking head video → system fully auto-generates a synced presentation video with slides derived from the speech.

---

## What's Already Built (Do Not Rebuild)

| Component | Status | Notes |
|---|---|---|
| 17 Remotion presentation themes | ✅ Done | P1–P17, all in `src/` |
| Talking head overlay | ✅ Done | `OffthreadVideo` circle, bottom-right |
| Express render server | ✅ Done | `server.js`, `POST /render`, `GET /download/:filename` |
| Zod prop schemas | ✅ Done | `src/schema.ts` — all 17 themes |
| Default props | ✅ Done | `src/defaultProps.ts` |

---

## What Needs to Be Built

### Module 1 — Video Upload
**File:** `server.js` (new route)

- `POST /upload` — accepts `multipart/form-data` with a video file
- Saves to `/tmp/uploads/<jobId>.<ext>`
- Returns `{ jobId, videoPath }`
- Validates: video only (mp4/mov/webm), max 500MB
- Library: `multer`

---

### Module 2 — Transcription (Whisper)
**File:** `server.js` (new route) + `pipeline/transcribe.js`

- Extracts audio from video using `ffmpeg` (already required by Remotion)
- Sends audio to **OpenAI Whisper API** (`whisper-1` model)
- Returns word-level timestamps: `[{ word, start, end }, ...]`
- Stores result as `/tmp/uploads/<jobId>.transcript.json`

**Key output shape:**
```json
{
  "text": "full transcript...",
  "words": [
    { "word": "Hello", "start": 0.0, "end": 0.4 },
    { "word": "everyone", "start": 0.5, "end": 1.1 }
  ]
}
```

> Whisper returns `verbose_json` with word timestamps via `timestamp_granularities[]=word`

---

### Module 3 — Slide Generation (GPT-4o)
**File:** `pipeline/generateSlides.js`

- Sends full transcript to **GPT-4o** with a structured system prompt
- GPT picks the best Remotion theme (P1–P17) based on topic/tone
- GPT generates slide content that matches the chosen theme's Zod schema
- Maps each slide to a time window using transcript word timestamps
- Returns valid `inputProps` JSON ready to pass to Remotion

**GPT output shape:**
```json
{
  "compositionId": "Presentation8Demo",
  "slides": [
    {
      "type": "titleSlide",
      "title": "...",
      "subtitle": "...",
      "durationInFrames": 90,
      "talkingHeadStartFrom": 0
    },
    ...
  ],
  "talkingHeadSrc": "<jobId>.mp4"
}
```

**Theme selection rules (in system prompt):**
- Corporate/finance → P6, P17
- Tech/SaaS → P1, P3, P8
- Bold/marketing → P4, P12, P16
- Data-heavy → P3, P11
- Creative/brand → P9, P10, P13
- Academic → P17
- Terminal/eng → P15

---

### Module 4 — Sync Logic
**File:** `pipeline/syncTalkingHead.js`

- Total Remotion duration = talking head video duration (in frames at 30fps)
- Each slide's `durationInFrames` derived from its transcript time window: `(end_ms - start_ms) / 1000 * 30`
- `talkingHeadStartFrom` per slide = `start_ms / 1000 * 30`
- The `OffthreadVideo` for talking head runs across all slides inside `AbsoluteFill` (not inside `TransitionSeries`) — single continuous source, no re-seeking

**Sync formula:**
```js
durationInFrames = Math.round((segment.end - segment.start) * 30)
talkingHeadStartFrom = Math.round(segment.start * 30)
```

---

### Module 5 — Job Orchestrator
**File:** `server.js` (new routes)

New endpoints added to existing Express server:

| Method | Route | Description |
|---|---|---|
| `POST` | `/pipeline/start` | Upload + kick off full pipeline, returns `{ jobId }` |
| `GET` | `/pipeline/:jobId/status` | Poll job progress `{ status, step, progress }` |
| `GET` | `/pipeline/:jobId/download` | Download final MP4 when done |

**Job states:** `uploading` → `transcribing` → `generating_slides` → `rendering` → `done` → `error`

In-memory job store (simple, no Redis):
```js
const jobs = new Map() // jobId → { status, step, videoPath, outputPath, error }
```

Pipeline runs async in background (`process.nextTick` / `async IIFE`), job map updated at each step.

---

## Full Flow

```
POST /pipeline/start (multipart video)
  │
  ├─ 1. Save video → /tmp/uploads/<jobId>.mp4
  ├─ 2. ffmpeg extract audio → /tmp/uploads/<jobId>.wav
  ├─ 3. Whisper API → word timestamps → <jobId>.transcript.json
  ├─ 4. GPT-4o → theme selection + slide JSON → <jobId>.props.json
  ├─ 5. Sync calc → finalize inputProps (durationInFrames, talkingHeadStartFrom per slide)
  └─ 6. Remotion render → /tmp/renders/<jobId>.mp4

GET /pipeline/<jobId>/status  → poll until status = "done"
GET /pipeline/<jobId>/download → serve /tmp/renders/<jobId>.mp4
```

---

## Environment Variables (add to `.env.local`)

```
OPENAI_API_KEY=sk-...          # Used for both Whisper and GPT-4o
RENDER_API_SECRET=...          # Already exists
```

---

## Out of Scope (Phase 1)

- User auth / accounts
- Cloud storage (S3/Supabase) — local `/tmp` only
- PPTX import
- Custom font uploads
- Background music mixing
- Redis / persistent job queue
- Frontend UI (API-only)
