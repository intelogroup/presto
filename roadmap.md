# Feedeo — Development Roadmap

**Stack:** Node.js + Express (`server.js`) · OpenAI Whisper + GPT-4o · Remotion · ffmpeg · multer

---

## Phase 1 — Full Pipeline MVP
**Target:** Working end-to-end: upload video → synced presentation video output

### Step 1 · Video Upload Endpoint
**File:** `server.js`
**Effort:** ~2h

- [ ] Install `multer` (`npm install multer`)
- [ ] Add `POST /upload` route — save to `/tmp/uploads/<jobId>.<ext>`
- [ ] Validate file type (video only) and size (500MB max)
- [ ] Return `{ jobId, videoPath }`
- [ ] Create `/tmp/uploads/` and `/tmp/renders/` on startup if not exist

---

### Step 2 · Transcription Module
**File:** `pipeline/transcribe.js`
**Effort:** ~3h

- [ ] Use `fluent-ffmpeg` to extract WAV audio from video (`ffmpeg -i input.mp4 -vn -ar 16000 -ac 1 output.wav`)
- [ ] Call OpenAI Whisper API with `verbose_json` + `timestamp_granularities: ["word"]`
- [ ] Parse response into `{ text, words: [{word, start, end}] }`
- [ ] Save to `/tmp/uploads/<jobId>.transcript.json`
- [ ] Handle errors: audio extraction fail, API timeout, empty transcript

**API call:**
```js
const response = await openai.audio.transcriptions.create({
  file: fs.createReadStream(audioPath),
  model: 'whisper-1',
  response_format: 'verbose_json',
  timestamp_granularities: ['word']
})
```

---

### Step 3 · Slide Generation Module
**File:** `pipeline/generateSlides.js`
**Effort:** ~4h

- [ ] Build GPT-4o system prompt:
  - Provide full list of 17 themes with descriptions + tone keywords
  - Provide the target theme's Zod schema as JSON (so GPT outputs valid props)
  - Instruct GPT to: pick theme, split transcript into 5–10 slides, assign time windows
- [ ] Parse GPT response, validate against schema
- [ ] Save to `/tmp/uploads/<jobId>.props.json`
- [ ] Add retry (1 retry on JSON parse failure, with "fix your JSON" follow-up message)

**Themes reference for prompt** (from `scope.md`):
- Corporate/finance → P6, P17
- Tech/SaaS → P1, P3, P8
- Bold/marketing → P4, P12, P16
- Data → P3, P11
- Creative/brand → P9, P10, P13
- Academic → P17
- Engineering/terminal → P15

---

### Step 4 · Sync Calculation
**File:** `pipeline/syncTalkingHead.js`
**Effort:** ~2h

- [ ] Get video duration in seconds via `ffprobe`
- [ ] For each slide: `durationInFrames = Math.round((seg.end - seg.start) * 30)`
- [ ] For each slide: `talkingHeadStartFrom = Math.round(seg.start * 30)`
- [ ] Copy uploaded video to `/tmp/renders/<jobId>_talkinghead.mp4` (Remotion staticFile access)
- [ ] Ensure sum of all slide frames = total video frames (adjust last slide if rounding drift)
- [ ] Set `talkingHeadSrc` in inputProps to the copied filename

---

### Step 5 · Job Orchestrator
**File:** `server.js` (new routes)
**Effort:** ~3h

- [ ] In-memory `jobs` Map: `jobId → { status, step, videoPath, outputPath, error }`
- [ ] `POST /pipeline/start` — accepts multipart, starts pipeline async, returns `{ jobId }`
- [ ] `GET /pipeline/:jobId/status` — returns current job state
- [ ] `GET /pipeline/:jobId/download` — serves MP4 if `status === 'done'`
- [ ] Pipeline runs as async IIFE, updates `jobs` map at each step
- [ ] On any error: set `{ status: 'error', error: message }`

**Job steps in order:**
```
uploading → transcribing → generating_slides → syncing → rendering → done
```

---

### Step 6 · Integration Test
**Effort:** ~2h

- [ ] Test with a 2-minute talking head video (clear speech)
- [ ] Verify transcript word timestamps are accurate
- [ ] Verify GPT picks correct theme and generates valid Zod-compliant props
- [ ] Verify slide durations sum to total video duration
- [ ] Verify talking head plays in sync with slides in output MP4
- [ ] Test error case: non-video file upload
- [ ] Test error case: silent/no-speech video

---

## Phase 2 — Hardening (Post-MVP)
> Do not start until Phase 1 is fully working and tested.

- [ ] Replace in-memory job store with SQLite (`better-sqlite3`) for persistence across restarts
- [ ] Add Supabase Storage for video/output files (remove `/tmp` dependency)
- [ ] Add `POST /pipeline/start` rate limiting (max 3 concurrent renders)
- [ ] Stream render progress via SSE (`GET /pipeline/:jobId/progress`)
- [ ] Add cleanup cron: delete `/tmp` files older than 24h
- [ ] Add Helmet.js for HTTP security headers
- [ ] Add GPT prompt for background music selection from existing `assets/bgm/` tracks

---

## Phase 3 — Frontend
> Depends on Phase 2 complete.

- [ ] Simple upload UI (drag-and-drop video)
- [ ] Job progress bar (polls `/pipeline/:jobId/status`)
- [ ] Preview player for output video
- [ ] Theme override option (user can force a specific P1–P17)

---

## File Structure After Phase 1

```
remotion-test/
├── server.js                    # Express server (modified — new pipeline routes)
├── pipeline/
│   ├── transcribe.js            # NEW — Whisper transcription
│   ├── generateSlides.js        # NEW — GPT-4o slide + theme generation
│   └── syncTalkingHead.js       # NEW — timing/sync calculation
├── src/                         # Remotion (unchanged)
├── .env.local                   # Add OPENAI_API_KEY
├── scope.md                     # This feature's scope doc
└── roadmap.md                   # This file
```

---

## Dependencies to Install

```bash
npm install multer openai fluent-ffmpeg
```

> `ffmpeg` binary must be available in PATH (already installed for Remotion)

---

## Key Constraints

- All storage is local `/tmp` — no cloud in Phase 1
- Remotion render server must have access to talking head video via `staticFile()` — copy to project's `public/` or `/tmp/renders/` before render call
- Whisper word timestamps require `verbose_json` format + `timestamp_granularities: ['word']` — do not use `json` format
- GPT-4o must receive the exact Zod schema of the chosen theme — otherwise output will not pass validation
- Total frame count must match exactly — off-by-one causes A/V drift at end
