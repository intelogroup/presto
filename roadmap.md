# Presto — Development Roadmap

**Stack:** Express 5 (Render.com) · Next.js 16 (Vercel) · OpenAI Whisper + GPT-4o · Remotion 4 · ffmpeg · TensorFlow.js BlazeFace
**Production (planned):** AWS Lambda + S3 + DynamoDB · WorkOS auth

---

## Phase 1 — Full Pipeline MVP
**Status: COMPLETE**

- [x] Video upload endpoint (`POST /pipeline/start` with multer diskStorage, 500MB max)
- [x] Preprocessing (`pipeline/preprocess.js` — silence detection, trimming, compression)
- [x] Transcription (`pipeline/transcribe.js` — Whisper API, word-level timestamps)
- [x] Slide generation (`pipeline/generateSlides.js` — GPT-4o theme selection + content, Zod validation)
- [x] Sync + face tracking (`pipeline/syncTalkingHead.js` + `pipeline/faceTrack.js` — BlazeFace, duration sync)
- [x] Job orchestrator (`server.js` — in-memory Map, async pipeline, status polling, download)
- [x] HMAC upload tokens (browser → Render direct upload, bypasses Vercel 4.5MB limit)
- [x] CORS + API key auth (hardcoded Vercel origin, X-API-Key header)
- [x] Temp file cleanup (24h TTL sweep + per-poll cleanup)
- [x] Frontend upload UI (drag-drop, theme override selector)
- [x] Frontend status polling (step progress bar, 2s interval, error display)
- [x] Frontend download (direct MP4 link)
- [x] Unit tests — preprocess (44/44 pass)
- [x] Playwright E2E tests (26/26 pass — home, upload, status, responsive, a11y)

---

## Phase 2 — Critical Fixes & Error Handling
**Status: NOT STARTED** | Priority: Immediate

### 2.1 Error Boundaries & Recovery
- [ ] Add `frontend/app/error.tsx` — catch unhandled React errors with retry button
- [ ] Add `frontend/app/not-found.tsx` — custom 404 page
- [ ] Add `frontend/app/status/[jobId]/error.tsx` — catch `use(params)` failures
- [ ] Add React `ErrorBoundary` wrapper for Remotion slide components (prevent single bad slide from crashing entire render)

### 2.2 Backend Security (Critical)
- [ ] Fix timing-attack: replace `===` with `crypto.timingSafeEqual` for API key comparison (`server.js:59`)
- [ ] Add graceful shutdown handlers (`SIGTERM`/`SIGINT`) — stop accepting requests, wait for in-flight pipelines, kill child processes
- [ ] Server must refuse to start if `RENDER_API_SECRET` is unset in production
- [ ] Stop leaking stderr and internal file paths in `/render` error responses
- [ ] Add Helmet.js for security headers (CSP, HSTS, X-Frame-Options)

### 2.3 Frontend Reliability
- [ ] Add MIME type validation on file drop (not just OS picker `accept` attribute)
- [ ] Add polling retry limit (max ~15 retries = ~1 min, then show manual retry button)
- [ ] Handle non-OK responses from `/api/status` (404 = "Job not found", stop polling)
- [ ] Clear `fetchError` state on successful poll
- [ ] Sanitize `jobId` parameter (UUID regex) before URL interpolation
- [ ] Add upload cancel button with `AbortController`
- [ ] Pause polling when browser tab is hidden (`visibilitychange` event)

### 2.4 Backend Reliability
- [ ] Add per-IP rate limiting (`express-rate-limit`) on `/pipeline/start` and `/api/upload-token`
- [ ] Add request logging middleware (morgan or pino with jobId correlation)
- [ ] Cap in-memory job Map size (reject new jobs if > 1000 entries)
- [ ] Add inter-stage validation (check file exists + segments non-empty between pipeline steps)
- [ ] Fix `transcript._mp3Path` field name mismatch (currently undefined, MP3 never cleaned)
- [ ] Clean intermediate files on success (trimmed file, original upload after preprocess)
- [ ] Add overall pipeline timeout (60 min AbortController)
- [ ] Add dead job watchdog (mark as error if no progress in 30 min)
- [ ] Add HMAC nonce tracking to prevent token replay

---

## Phase 3 — UX Polish
**Status: NOT STARTED** | Priority: After Phase 2

### 3.1 Upload Experience
- [ ] Upload progress bar (replace `fetch()` with `XMLHttpRequest` for `upload.onprogress`)
- [ ] File clear/remove button after selection
- [ ] Check token expiry client-side before upload; auto-refresh if expired
- [ ] Toast/notification system (sonner or react-hot-toast)

### 3.2 Status & Download
- [ ] Video preview player on completion (embed `<video>` with download URL)
- [ ] Forward `content-length` header on download proxy for browser progress
- [ ] Share/copy-link button
- [ ] Estimated time remaining or elapsed time per step
- [ ] Back navigation from status page (logo link or back button)

### 3.3 Branding & SEO
- [ ] Fix metadata: title → "Presto", description → real product description
- [ ] Add favicon and branding assets to `frontend/public/`
- [ ] Add Open Graph tags for social sharing

### 3.4 Theme System
- [ ] Dark mode: add `next-themes` toggle or use `prefers-color-scheme` media query
- [ ] Replace hardcoded `bg-gray-50` / `text-gray-900` with theme tokens (`bg-background`, `text-foreground`)

### 3.5 Cleanup Dead Code
- [ ] Remove unused `/api/start` route (replaced by HMAC direct upload flow)
- [ ] Remove unused `Card` component
- [ ] Remove `fluent-ffmpeg` from dependencies (all ffmpeg calls use `child_process.execFile`)

---

## Phase 4 — Remotion Hardening
**Status: NOT STARTED** | Priority: After Phase 2

### 4.1 Schema Fixes
- [ ] Add `faceTrack: FaceTrackSchema` to `Presentation8PropsSchema`
- [ ] Replace `z.string()` with `IconNameSchema` in P6/P7/P8 schemas (CinemaIconItem6, CyberIconGridItem7, MinimalIconFeature8)
- [ ] Add `.min(1)` to all `slides` arrays across all 17 theme schemas
- [ ] Add `Math.max(1, ...)` guard in `calcDuration` to prevent zero/negative duration

### 4.2 P8 Theme Alignment
- [ ] Replace inline talking head in `Presentation8Demo.tsx` with shared `<TalkingHead>` component
- [ ] Add P8 to auto-selection prompt in `generateSlides.js`
- [ ] Add P8 to frontend theme selector dropdown
- [ ] Add `talkingHeadSrc` to P8 default props in `Root.tsx`

### 4.3 Consistency
- [ ] Refactor all 13 inline `reduce`/overlap calculations to use shared `calcDuration` helper
- [ ] Fix P17 TalkingHead border color (uses P1 blue `#38bdf8` instead of theme accent)
- [ ] Replace hardcoded hex colors in slide components with theme object references
- [ ] Add `delayRender`/`continueRender` guard in `TalkingHead.tsx` for missing video files
- [ ] Define shared `ThemeBase` interface for theme objects

---

## Phase 5 — Production Migration (AWS)
**Status: NOT STARTED** | Priority: After core logic fully tested

### 5.1 Infrastructure
- [ ] Set up AWS Lambda functions (API routes)
- [ ] Set up S3 buckets (upload, output) with lifecycle policies
- [ ] Set up DynamoDB table (jobId partition key, TTL attribute for auto-cleanup)
- [ ] Pre-signed URL upload flow (replace HMAC tokens)
- [ ] Pre-signed URL download flow (replace file streaming)

### 5.2 Compute for Renders
- [ ] Evaluate Remotion Lambda (`@remotion/lambda`) for render jobs
- [ ] If renders exceed Lambda limits (15 min / 10GB): set up ECS Fargate for render tasks
- [ ] Render.com stays as fallback/staging environment

### 5.3 Auth
- [ ] Integrate WorkOS (login, sessions, user management)
- [ ] Associate jobs with WorkOS `user_id` in DynamoDB
- [ ] Add auth middleware to all API routes

### 5.4 Payment
- [ ] Payment integration (deferred until core logic fully tested and production infra ready)

---

## Test Coverage

| Area | Framework | Tests | Status |
|------|-----------|-------|--------|
| Preprocess logic | Node.js (plain) | 44 | Pass |
| Input validation | Node.js (plain) | ~10 | Needs ffmpeg |
| Preprocess integration | Node.js (plain) | ~8 | Needs ffmpeg |
| Frontend E2E | Playwright | 26 | Pass |
| generateSlides | — | 0 | Not written |
| syncTalkingHead | — | 0 | Not written |
| faceTrack | — | 0 | Not written |
| server.js routes | — | 0 | Not written |
| Remotion render | — | 0 | Not written |

**Test framework:** Currently plain Node.js scripts. Vitest recommended for new tests (see testing notes below).

---

## Key Constraints

- Render.com is the current dev/staging host for testing Remotion render capacity under load
- All storage is local `/tmp` in dev — S3 in production
- Remotion render requires talking head video via `staticFile()` — copy to `public/` before render
- Whisper word timestamps require `verbose_json` + `timestamp_granularities: ['word']`
- GPT-4o receives plain-English slide type descriptions (not raw Zod) for better output quality
- Total frame count must match exactly — off-by-one causes A/V drift
- Max concurrent jobs: 10 (in-memory cap)
- Max upload size: 500MB
- Min video duration: 30 seconds
