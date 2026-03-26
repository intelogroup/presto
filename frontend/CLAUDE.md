# Frontend — Agent Guidelines

@AGENTS.md

## Stack
- Next.js 16.2.1 (App Router) on Vercel
- React 19.2.4 with React Compiler enabled
- TailwindCSS 4 with PostCSS
- shadcn/ui + Base UI components
- TypeScript 5

## Key Files
- `app/page.tsx` — Home page with upload form
- `app/status/[jobId]/page.tsx` — Job progress polling + download
- `app/api/upload-token/route.ts` — HMAC token generation for direct Render upload
- `app/api/status/[jobId]/route.ts` — Proxy to backend status endpoint
- `app/api/download/[jobId]/route.ts` — Proxy to backend download endpoint
- `components/upload-form.tsx` — Drag-drop file input + theme selector
- `components/status-tracker.tsx` — Step progress bar

## Environment Variables
- `RENDER_API_URL` — Backend URL (Render.com)
- `RENDER_API_SECRET` — Shared secret for API auth + HMAC signing

## Testing
- Playwright E2E: `npx playwright test` (26 specs in `tests/`)
- Config: `playwright.config.ts` (headless chromium, HTML reporter)

## Known Issues
- `params` is a Promise in Next.js 16 — use `use(params)` to unwrap in client components
- Google Fonts may fail in sandboxed environments — layout.tsx has a stub fallback
- No `error.tsx` or `not-found.tsx` pages yet
- Dark mode CSS vars defined in `globals.css` but no toggle exists
- `/api/start` route is dead code (replaced by HMAC direct upload flow)
