# Feedeo — Frontend UI Plan

**Product:** User uploads a training/course video (or audio) → system auto-generates a themed Remotion presentation with talking head overlay → user previews and downloads the final MP4.

**Backend status:** Complete. API endpoints ready at `/pipeline/start`, `/pipeline/:jobId/status`, `/pipeline/:jobId/download`.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 14+ (App Router)** | File-based routing, SSR for landing page SEO, API proxy to avoid CORS, React Server Components for fast initial load |
| Styling | **Tailwind CSS + shadcn/ui** | Rapid prototyping, consistent design tokens, accessible components out of the box |
| State | **React hooks + Context** | Simple enough for single-page upload flow — no Redux needed |
| File upload | **react-dropzone** | Battle-tested drag-and-drop, file type filtering, progress events |
| HTTP client | **Native fetch** | No axios needed — Next.js extends fetch with caching/revalidation |
| Video player | **HTML5 `<video>`** | No library needed for simple MP4 preview playback |
| Icons | **Lucide React** | Already used in Remotion themes — visual consistency |
| Animations | **Framer Motion** | Smooth step transitions, progress animations, micro-interactions |
| Toast/notifications | **sonner** | Lightweight, works with shadcn/ui |

---

## Pages & Routes

```
app/
├── page.tsx                    # Landing / Upload page (main entry)
├── jobs/
│   └── [jobId]/
│       └── page.tsx            # Job progress + preview + download
├── layout.tsx                  # Root layout (nav, footer, theme provider)
├── api/
│   └── pipeline/
│       ├── start/route.ts      # Proxy POST to backend (avoids CORS + hides API key)
│       ├── [jobId]/
│       │   ├── status/route.ts # Proxy GET status
│       │   └── download/route.ts # Proxy GET download
└── globals.css                 # Tailwind base
```

### Why proxy through Next.js API routes?
- Hides `RENDER_API_SECRET` from client (injected server-side via `X-API-Key` header)
- No CORS configuration needed on Express backend
- Single origin for frontend + API

---

## Screen 1: Upload Page (`/`)

### Layout
```
┌─────────────────────────────────────────────────────┐
│  Feedeo                                    [?] Help │
├─────────────────────────────────────────────────────┤
│                                                     │
│         ┌───────────────────────────────┐           │
│         │                               │           │
│         │    ☁  Drag & drop your        │           │
│         │       video or audio here     │           │
│         │                               │           │
│         │    ─── or ───                  │           │
│         │                               │           │
│         │    [ Browse files ]            │           │
│         │                               │           │
│         │  MP4, MOV, WebM, MP3, WAV     │           │
│         │  Max 500MB · Min 30 seconds   │           │
│         └───────────────────────────────┘           │
│                                                     │
│  ┌─ Options (collapsed by default) ──────────────┐  │
│  │  Theme: [ Auto-detect ▾ ]                     │  │
│  │         P1 Dark Tech · P3 Dashboard ·         │  │
│  │         P17 Academic                          │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│         [ Generate Presentation ]                   │
│              (disabled until file selected)          │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Recent Jobs (from localStorage)                    │
│  ┌──────────────────────────────────────────────┐   │
│  │ 📹 lecture_ch3.mp4  ·  P17  ·  Done  · 2h ago │ │
│  │ 📹 pitch_deck.mov   ·  P1   ·  Done  · 5h ago │ │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Behavior
1. User drops a file → validates client-side (type, size, duration if possible)
2. Clicks "Generate Presentation" → `POST /api/pipeline/start` with multipart form
3. On success (`{ jobId }`) → redirect to `/jobs/[jobId]`
4. Store `{ jobId, filename, timestamp }` in `localStorage` for "Recent Jobs" list

### Components
| Component | File | Props |
|-----------|------|-------|
| `UploadDropzone` | `components/upload-dropzone.tsx` | `onFileSelected(file)`, `isUploading` |
| `ThemeSelector` | `components/theme-selector.tsx` | `value`, `onChange` — dropdown with theme previews |
| `RecentJobs` | `components/recent-jobs.tsx` | Reads from localStorage, links to `/jobs/[jobId]` |

---

## Screen 2: Job Progress (`/jobs/[jobId]`)

### Layout — Processing State
```
┌─────────────────────────────────────────────────────┐
│  Feedeo                              [← Back]       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📹 lecture_chapter3.mp4                             │
│                                                     │
│  ┌─ Pipeline Progress ──────────────────────────┐   │
│  │                                               │   │
│  │  ✅ Preprocessing       Trimmed 3 silences    │   │
│  │  ✅ Transcribing        142 segments          │   │
│  │  ⏳ Generating Slides   Picking theme...      │   │
│  │  ○  Syncing             —                     │   │
│  │  ○  Rendering           —                     │   │
│  │                                               │   │
│  │  ████████████░░░░░░░░  45%                    │   │
│  │                                               │   │
│  └───────────────────────────────────────────────┘   │
│                                                     │
│  Estimated time: ~2-5 minutes                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Layout — Done State
```
┌─────────────────────────────────────────────────────┐
│  Feedeo                              [← Back]       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ✅ Your presentation is ready!                     │
│                                                     │
│  ┌───────────────────────────────────────────┐      │
│  │                                           │      │
│  │            ▶  Video Preview               │      │
│  │         (HTML5 <video> player)            │      │
│  │                                           │      │
│  │  16:9 aspect ratio, controls visible      │      │
│  │                                           │      │
│  └───────────────────────────────────────────┘      │
│                                                     │
│  Theme: P17 Academic Prestige                       │
│  Duration: 4:32  ·  8 slides  ·  1920x1080         │
│                                                     │
│  [ ⬇ Download MP4 ]    [ ↻ Regenerate ]            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Layout — Error State
```
┌─────────────────────────────────────────────────────┐
│  Feedeo                              [← Back]       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ❌ Something went wrong                            │
│                                                     │
│  Error: Extracted audio is 27.3 MB — exceeds        │
│         Whisper 25MB limit.                         │
│                                                     │
│  Step failed: transcribing                          │
│                                                     │
│  [ ↻ Try Again ]    [ ← Upload New ]               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Polling Logic
```typescript
// Poll every 2s while processing, stop on done/error
useEffect(() => {
  if (status === "done" || status === "error") return;

  const interval = setInterval(async () => {
    const res = await fetch(`/api/pipeline/${jobId}/status`);
    const data = await res.json();
    setJob(data);
  }, 2000);

  return () => clearInterval(interval);
}, [jobId, status]);
```

### Components
| Component | File | Props |
|-----------|------|-------|
| `PipelineProgress` | `components/pipeline-progress.tsx` | `steps[]`, `currentStep`, `status` |
| `StepIndicator` | `components/step-indicator.tsx` | `label`, `state: "done" \| "active" \| "pending"`, `detail?` |
| `VideoPreview` | `components/video-preview.tsx` | `src`, `onDownload` |
| `ErrorDisplay` | `components/error-display.tsx` | `error`, `failedStep`, `onRetry` |

---

## Pipeline Steps Mapping

| Backend `status` | UI Label | Progress % | Detail Source |
|------------------|----------|------------|---------------|
| `preprocessing` | Preprocessing | 10% | "Validating & trimming silences..." |
| `transcribing` | Transcribing | 30% | "Extracting speech with Whisper..." |
| `generating_slides` | Generating Slides | 50% | "AI is designing your slides..." |
| `syncing` | Syncing | 70% | "Aligning video with slides..." |
| `rendering` | Rendering | 85% | "Rendering final video..." |
| `done` | Done | 100% | Show preview + download |
| `error` | Error | — | Show error message + retry |

---

## Component Architecture

```
app/layout.tsx
├── <ThemeProvider>            # dark/light mode (shadcn)
├── <Toaster>                  # sonner toast notifications
└── <Navbar>                   # logo, help link
    │
    ├── page.tsx (Upload)
    │   ├── <UploadDropzone>   # react-dropzone wrapper
    │   ├── <ThemeSelector>    # optional theme override
    │   ├── <UploadButton>     # triggers POST, shows spinner
    │   └── <RecentJobs>       # localStorage history
    │
    └── jobs/[jobId]/page.tsx (Progress)
        ├── <PipelineProgress> # step list with indicators
        │   └── <StepIndicator> × 5
        ├── <VideoPreview>     # HTML5 video player (done state)
        ├── <ErrorDisplay>     # error state with retry
        └── <DownloadButton>   # triggers GET download
```

---

## API Proxy Routes (Next.js)

### `POST /api/pipeline/start`
```typescript
// app/api/pipeline/start/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();

  const res = await fetch(`${BACKEND_URL}/pipeline/start`, {
    method: "POST",
    headers: { "X-API-Key": process.env.RENDER_API_SECRET! },
    body: formData,
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
```

### `GET /api/pipeline/[jobId]/status`
```typescript
// app/api/pipeline/[jobId]/status/route.ts
export async function GET(_: Request, { params }: { params: { jobId: string } }) {
  const res = await fetch(`${BACKEND_URL}/pipeline/${params.jobId}/status`, {
    headers: { "X-API-Key": process.env.RENDER_API_SECRET! },
  });

  return Response.json(await res.json(), { status: res.status });
}
```

### `GET /api/pipeline/[jobId]/download`
```typescript
// app/api/pipeline/[jobId]/download/route.ts
export async function GET(_: Request, { params }: { params: { jobId: string } }) {
  const res = await fetch(`${BACKEND_URL}/pipeline/${params.jobId}/download`, {
    headers: { "X-API-Key": process.env.RENDER_API_SECRET! },
  });

  return new Response(res.body, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="feedeo-${params.jobId}.mp4"`,
    },
  });
}
```

---

## Environment Variables (Frontend)

```env
# .env.local (Next.js app)
BACKEND_URL=http://localhost:3100        # Express backend
RENDER_API_SECRET=<same key as backend>  # Injected into X-API-Key header server-side
```

---

## Client-Side Validation

Before upload, validate on the client to avoid wasting bandwidth:

```typescript
const ALLOWED_TYPES = [
  "video/mp4", "video/quicktime", "video/webm",
  "audio/mpeg", "audio/wav", "audio/mp4",
];
const MAX_SIZE = 500 * 1024 * 1024; // 500MB

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return "Unsupported file type";
  if (file.size > MAX_SIZE) return `File too large (${(file.size / 1e6).toFixed(0)}MB, max 500MB)`;
  return null; // valid
}
```

Duration check (min 30s) happens server-side in `preprocessVideo` since reading duration from a File object requires decoding.

---

## Design Tokens (Tailwind)

```typescript
// tailwind.config.ts — extend defaults
{
  colors: {
    feedeo: {
      primary: "#6366f1",    // indigo-500 — main CTA
      surface: "#18181b",    // zinc-900 — card backgrounds (dark mode)
      accent: "#38bdf8",     // sky-400 — progress, links
      success: "#22c55e",    // green-500 — done state
      error: "#ef4444",      // red-500 — error state
      muted: "#71717a",      // zinc-500 — secondary text
    },
  },
}
```

### Dark mode by default
The product processes videos — users will be staring at video previews. Dark mode reduces eye strain and makes video content pop.

---

## Future Enhancements (Not in V1)

| Feature | Priority | Notes |
|---------|----------|-------|
| SSE/WebSocket for real-time progress | P2 | Replace polling with server-sent events from Express |
| Theme preview thumbnails | P2 | Static screenshots of each P1-P17 theme in the selector |
| Batch upload | P3 | Queue multiple videos at once |
| User accounts + history | P3 | Supabase Auth, persistent job history |
| Slide editor | P3 | Edit generated slide content before rendering |
| Mobile responsive | P2 | Upload page works on phone (camera → upload) |
| Share link | P2 | Public URL to view/download rendered video |
| Progress SSE from Remotion | P3 | `--progress` flag streams render % |
| PPTX upload pairing | P3 | Upload audio + existing PPTX for re-theming |
| Background music selector | P3 | Pick from `assets/bgm/` tracks (referenced in roadmap.md) |

---

## Build Order

### Phase 3a — Core Upload + Progress (MVP UI)
1. `npx create-next-app@latest feedeo-ui --typescript --tailwind --app`
2. Install: `shadcn/ui`, `react-dropzone`, `framer-motion`, `sonner`, `lucide-react`
3. Build `UploadDropzone` + `UploadButton` + client validation
4. Build API proxy routes (start, status, download)
5. Build `PipelineProgress` + `StepIndicator` + polling
6. Build `VideoPreview` + `DownloadButton`
7. Build `ErrorDisplay` + retry flow
8. Dark mode theme + responsive layout

### Phase 3b — Polish
9. `ThemeSelector` dropdown with theme descriptions
10. `RecentJobs` localStorage history
11. Loading skeletons + optimistic UI
12. Error boundary + toast notifications
13. Mobile responsive pass

### Phase 3c — Production
14. Deploy Next.js to Vercel (or same server as Express)
15. Configure `BACKEND_URL` for production
16. Add rate limiting on proxy routes
17. Add basic analytics (Vercel Analytics or Plausible)

---

## Deployment Options

| Option | Pros | Cons |
|--------|------|------|
| **Same server** (Express serves Next.js build) | Single deployment, no CORS | Couples frontend + backend deploys |
| **Vercel + separate backend** | Free hosting, edge CDN, auto-deploys | Needs CORS or proxy, two deploys |
| **Docker Compose** | One `docker-compose up`, consistent env | More DevOps overhead |

**Recommended for Phase 3:** Same server — add `next build && next start` to the Express process, or serve the Next.js static export from Express. Simplest path to production.

---

## Key Constraints

- Backend already uses port 3100 — Next.js dev server should use 3000 (default)
- `RENDER_API_SECRET` must never reach the client — all API calls proxied server-side
- Video download is streamed (can be large) — proxy must stream, not buffer
- Polling interval of 2s is a good balance — faster burns server resources, slower feels unresponsive
- No auth in V1 — anyone with the URL can upload (rate limiting + file size cap are the guardrails)
