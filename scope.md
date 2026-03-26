# Presto — Full Pipeline Scope

**Goal:** User uploads a talking head video → system fully auto-generates a synced presentation video with slides derived from the speech.

---

## What's Already Built

| Component | Status | Notes |
|---|---|---|
| 17 Remotion presentation themes | Done | P1-P17, all in `src/` with Zod schemas |
| Talking head overlay | Done | `OffthreadVideo` circle with face tracking (`TalkingHead.tsx`) |
| Express backend + job orchestrator | Done | `server.js` on Render.com — upload, pipeline, status, download |
| Pipeline: preprocessing | Done | `pipeline/preprocess.js` — silence detection, trimming, compression |
| Pipeline: transcription | Done | `pipeline/transcribe.js` — Whisper API with word-level timestamps |
| Pipeline: slide generation | Done | `pipeline/generateSlides.js` — GPT-4o theme selection + content |
| Pipeline: sync + face tracking | Done | `pipeline/syncTalkingHead.js` + `pipeline/faceTrack.js` (BlazeFace) |
| Zod prop schemas | Done | `src/schema.ts` — all 17 themes validated |
| Default props | Done | `src/defaultProps.ts` — demo data for all themes |
| Frontend: upload UI | Done | Drag-drop with theme override (P1, P3, P17) |
| Frontend: status polling | Done | Step progress bar, 2s polling, error display |
| Frontend: download | Done | Direct MP4 download link on completion |
| HMAC upload tokens | Done | Browser → Render direct upload (bypasses Vercel 4.5MB limit) |
| CORS + API key auth | Done | Hardcoded Vercel origin, `X-API-Key` header |
| Temp file cleanup | Done | 24h TTL sweep + per-poll cleanup |
| Playwright E2E tests | Done | 26 specs (home, upload, status, responsive, a11y) |
| Preprocess unit tests | Done | 44 tests for `buildKeepSegments` logic |

---

## What Needs to Be Built / Fixed

### Critical (Blocks Reliability)

| # | Gap | Details |
|---|-----|---------|
| 1 | **Error boundaries** | No `error.tsx` in frontend, no React ErrorBoundary in Remotion slides. Unhandled errors crash entire app/render. |
| 2 | **Timing-safe API key comparison** | `server.js:59` uses `===` — vulnerable to timing attacks. Use `crypto.timingSafeEqual`. |
| 3 | **Graceful shutdown** | No `SIGTERM`/`SIGINT` handlers. Deploy/crash orphans ffmpeg/Remotion child processes, loses all jobs. |
| 4 | **Job persistence** | In-memory `Map` — all state lost on restart. Need SQLite or DynamoDB. |
| 5 | **Pipeline cancellation** | No way to stop in-flight jobs. Long ffmpeg/Remotion runs continue even if client disconnects. |

### High (Affects User Experience)

| # | Gap | Area | Details |
|---|-----|------|---------|
| 6 | MIME validation on drag-drop | Frontend | `accept` attr only filters OS picker, not dropped files |
| 7 | Polling retry limit | Frontend | Polls forever on error — no max retry cap |
| 8 | 404 handling for invalid jobIds | Frontend | Non-OK responses treated as valid data, polls forever |
| 9 | Upload token rate limiting | Frontend | `/api/upload-token` has no rate limit |
| 10 | jobId sanitization | Frontend | Path traversal possible via URL interpolation |
| 11 | Per-IP rate limiting | Backend | Only 10-job cap, no per-IP throttle |
| 12 | Request logging | Backend | No morgan/pino — no audit trail |
| 13 | Memory leak in job Map | Backend | Grows unbounded for 24h under load |
| 14 | `/render` leaks stderr + file paths | Backend | Internal errors exposed to client |
| 15 | Intermediate file cleanup | Backend | Trimmed files not deleted on success; original upload kept until 24h sweep |
| 16 | Inter-stage validation | Backend | No checks that stage output exists/is valid before next stage |
| 17 | `transcript._mp3Path` undefined | Backend | Field name mismatch — MP3 never cleaned up |
| 18 | iconName validation inconsistent | Remotion | P6/P7/P8 use `z.string()` instead of `IconNameSchema` |
| 19 | HMAC token replay | Backend | No nonce tracking — valid tokens replayable within TTL |

### Medium (Polish & Hardening)

| # | Gap | Area |
|---|-----|------|
| 20 | No upload progress bar | Frontend |
| 21 | No cancel upload button | Frontend |
| 22 | No tab visibility handling for polling | Frontend |
| 23 | Stale `fetchError` never cleared | Frontend |
| 24 | Placeholder SEO metadata ("Create Next App") | Frontend |
| 25 | No favicon or public/ assets | Frontend |
| 26 | No toast/notification system | Frontend |
| 27 | `content-length` not forwarded on download | Frontend |
| 28 | Dead `/api/start` route (replaced by HMAC flow) | Frontend |
| 29 | CORS origin hardcoded (no staging/dev) | Backend |
| 30 | No Helmet.js security headers | Backend |
| 31 | No overall pipeline timeout | Backend |
| 32 | No disk space monitoring during pipeline | Backend |
| 33 | No dead job detection watchdog | Backend |
| 34 | No idempotency on job submission | Backend |
| 35 | P8 excluded from auto theme selection | Backend |
| 36 | P8 schema missing `faceTrack` field | Remotion |
| 37 | P8 bypasses shared TalkingHead component | Remotion |
| 38 | No fallback for empty slides arrays | Remotion |
| 39 | `calcDuration` can return 0 or negative | Remotion |
| 40 | 13 compositions duplicate inline duration calc | Remotion |
| 41 | TalkingHead has no loading/error state | Remotion |

### Low (Nice-to-Have)

| # | Gap | Area |
|---|-----|------|
| 42 | No file clear/remove button | Frontend |
| 43 | No ETA on status page | Frontend |
| 44 | No share/copy-link button | Frontend |
| 45 | No video preview before download | Frontend |
| 46 | No custom 404 page | Frontend |
| 47 | No loading.tsx skeleton | Frontend |
| 48 | Dark mode CSS defined but no toggle | Frontend |
| 49 | Hardcoded `bg-gray-50` instead of theme tokens | Frontend |
| 50 | No back navigation from status page | Frontend |
| 51 | StatusTracker `step` prop loosely typed | Frontend |
| 52 | Output never cleaned (filename vs path mismatch) | Backend |
| 53 | Sweep misses `mp3Path` | Backend |
| 54 | `generateSlides` retry has no backoff | Backend |
| 55 | Dead code in `validateSegmentCoverage` ternary | Backend |
| 56 | `fluent-ffmpeg` dependency unused | Backend |
| 57 | P17 uses wrong border color (P1 blue) | Remotion |
| 58 | No shared theme interface across themes | Remotion |
| 59 | Hardcoded 1920x1080 in clockWipe transitions | Remotion |
| 60 | TalkingHead fixed bottom-right, no position prop | Remotion |

---

## Architecture

### Current (Development — Render.com)

```
Browser (Vercel)
  ├─ GET /api/upload-token → Next.js generates HMAC token
  ├─ PUT directly to Render (video upload with x-upload-token)
  ├─ POST /pipeline/start → Express creates job, runs pipeline async
  ├─ GET /pipeline/:jobId/status → poll every 2s
  └─ GET /pipeline/:jobId/download → stream MP4

Pipeline on Render:
  preprocess → transcribe (Whisper) → generateSlides (GPT-4o)
  → faceTrack (BlazeFace) → syncTalkingHead → Remotion render
```

### Planned (Production — AWS)

```
Browser
  ├─ WorkOS login → JWT
  ├─ GET /api/upload-url → Lambda returns S3 pre-signed URL
  ├─ PUT to S3 (direct upload)
  ├─ POST /api/start → Lambda creates DynamoDB job record
  │   └─ Triggers pipeline (Lambda or ECS Fargate for renders)
  ├─ GET /api/status/:jobId → Lambda reads DynamoDB
  └─ GET /api/download/:jobId → Lambda returns S3 pre-signed download URL

Storage: S3 (videos) + DynamoDB (job metadata)
Auth: WorkOS
Compute: Lambda (API + light pipeline) + ECS Fargate (Remotion renders)
```

---

## Talking Head Theme Support

| Theme | talkingHeadSrc | faceTrack | Uses shared TalkingHead.tsx |
|-------|---------------|-----------|---------------------------|
| P1 Dark Tech | Yes | Yes | Yes |
| P3 Dashboard/KPI | Yes | Yes | Yes |
| P8 Minimal/SaaS | Yes | **No (gap)** | **No — inlines own (gap)** |
| P17 Academic | Yes | Yes | Yes |
| All others | No | No | N/A |

---

## Theme Auto-Selection Rules

| Topic/Tone | Themes |
|------------|--------|
| Corporate/finance | P6, P17 |
| Tech/SaaS | P1, P3, P8 |
| Bold/marketing | P4, P12, P16 |
| Data-heavy | P3, P11 |
| Creative/brand | P9, P10, P13 |
| Academic | P17 |
| Terminal/engineering | P15 |

**Note:** P8 is defined in `THEME_CONFIGS` but excluded from auto-selection prompt. Only available via `themeOverride`.

---

## Out of Scope (Deferred)

- Payment integration (deferred until core logic fully tested)
- User auth / accounts (WorkOS planned)
- Cloud storage migration (S3/DynamoDB planned for production)
- PPTX import
- Custom font uploads
- Background music mixing
- SSE progress streaming (polling is adequate for now)
