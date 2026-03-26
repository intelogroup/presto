# Presto — Agent Guidelines

## Project Overview

Presto automates creation of synced presentation videos. User uploads a talking head video, the system transcribes speech (Whisper), generates themed slides (GPT-4o), tracks face position (BlazeFace), and renders a final video (Remotion) with the talking head overlaid.

## Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Backend** | Express 5 on Render.com | `server.js` — job orchestration, pipeline runner, file serving |
| **Frontend** | Next.js 16 on Vercel | App Router, React 19, TailwindCSS 4, shadcn/ui |
| **Video** | Remotion 4, ffmpeg, ffprobe | 17 presentation themes (P1-P17), `OffthreadVideo` for talking head |
| **AI** | OpenAI Whisper + GPT-4o | Transcription + slide content generation |
| **Face Tracking** | TensorFlow.js BlazeFace | Detects face position for talking head overlay |
| **Validation** | Zod 4 | Schema validation for all 17 theme prop types |
| **Auth (planned)** | WorkOS | Not yet implemented — payment deferred |
| **Production (planned)** | AWS Lambda + S3 + DynamoDB | Current dev uses Render.com to test Remotion render capacity |

## Critical Warnings

### Next.js 16 Breaking Changes
This project uses **Next.js 16.2.1** and **React 19.2.4**. APIs, conventions, and file structure differ from typical training data. Read `frontend/AGENTS.md` and check `node_modules/next/dist/docs/` before writing new frontend code. Key difference: `params` is a Promise in page components — use `use(params)` to unwrap.

### Remotion Composition IDs
- P1 = `"Presentation"` (**NOT** `"Presentation1"`)
- P3 = `"Presentation3"`
- P8 = `"Presentation8"`
- P17 = `"Presentation17"`
- All others follow `"PresentationNDemo"` pattern

### Talking Head / Static Headshot
Only P1, P3, P17 have full `talkingHeadSrc` + `faceTrack` in their schemas. P8 has `talkingHeadSrc` but is missing `faceTrack` (known gap). All other themes render slides-only.

**Audio-only uploads** use a static headshot instead of animated talking head. Fallback chain: user-uploaded photo → WorkOS profile avatar → themed generic silhouette placeholder. No animation on static headshots. Component: `StaticHeadshot.tsx` (planned, not yet built).

### Multer Storage
Always use `multer.diskStorage()` — never memory storage. A 500MB video in RAM will OOM.

### Frame Math
- 30fps throughout. `durationInFrames = Math.round((end - start) * 30)`, minimum 60 frames (2s)
- Last slide absorbs rounding drift: `lastSlide.duration += (totalVideoFrames - sumOfAllFrames)`
- Re-enforce min floor after drift: `Math.max(60, lastSlide.duration)`

## Project Structure

```text
presto/
├── server.js                    # Express backend (Render.com) — routes, job orchestrator
├── pipeline/
│   ├── preprocess.js            # Silence detection, trimming, compression
│   ├── transcribe.js            # Whisper API transcription
│   ├── generateSlides.js        # GPT-4o slide + theme generation
│   ├── syncTalkingHead.js       # Duration sync + talking head copy
│   └── faceTrack.js             # BlazeFace face detection keypoints
├── src/
│   ├── Root.tsx                 # Remotion composition registry
│   ├── schema.ts                # Zod schemas for all 17 themes (~1400 lines)
│   ├── defaultProps.ts          # Default slide data (~1400 lines)
│   ├── TalkingHead.tsx          # Shared circular overlay with face tracking
│   ├── iconMap.ts               # Valid Lucide icon names
│   ├── PresentationDemo.tsx     # P1 theme
│   ├── Presentation*Demo.tsx    # P2-P17 themes
│   └── slides*/                 # Per-theme slide components (90+ total)
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Home — upload form
│   │   ├── status/[jobId]/      # Job progress polling + download
│   │   └── api/                 # Proxy routes (start, status, download, upload-token)
│   ├── components/
│   │   ├── upload-form.tsx      # Drag-drop upload with theme selector
│   │   ├── status-tracker.tsx   # Step progress bar
│   │   └── ui/                  # shadcn primitives
│   └── tests/                   # Playwright E2E tests (26 specs)
├── tests/                       # Node.js unit tests (preprocess)
├── scope.md                     # Feature scope document
├── roadmap.md                   # Development phases & checklist
└── pipeline-plan.md             # Detailed pipeline architecture
```

## Environment Variables

| Var | Required | Used By |
|-----|----------|---------|
| `RENDER_API_SECRET` | Yes | Backend auth (API key + HMAC upload tokens) |
| `OPENAI_API_KEY` | Yes | Whisper + GPT-4o |
| `RENDER_API_URL` | Frontend | Backend URL for API proxying |

## Development Workflow

- **Backend**: `node server.js` on Render.com (or locally)
- **Frontend**: `cd frontend && npm run dev` on Vercel (or locally)
- **Tests**: `npm test` (unit via Vitest), `cd frontend && npx playwright test` (E2E)
- **Remotion Studio**: `npx remotion studio` (preview themes)

## Known Gaps (Priority Order)

See `roadmap.md` for the full categorized list. Key items:
- No error boundaries (frontend or Remotion)
- No job persistence (in-memory Map lost on restart)
- No graceful shutdown (orphan processes on deploy)
- API key comparison vulnerable to timing attack
- No rate limiting beyond concurrent job cap
- P8 schema missing `faceTrack` field
- Frontend theme selector out of sync with backend (missing P8)
- No video preview player (download only)
