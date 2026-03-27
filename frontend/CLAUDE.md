# Frontend — Agent Guidelines

@AGENTS.md

## Stack
- Next.js 16.2.1 (App Router) on Vercel
- React 19.2.4 with React Compiler enabled
- TailwindCSS 4 with PostCSS
- shadcn/ui + Base UI components
- TypeScript 5

## Key Files
- `app/page.tsx` — Landing page with upload form
- `app/app/layout.tsx` — App shell layout with AppHeader
- `app/app/page.tsx` — Dashboard (project list with empty state)
- `app/status/[jobId]/page.tsx` — Job progress polling + download (legacy route)
- `app/error.tsx` — Global error boundary
- `app/not-found.tsx` — 404 page
- `app/loading.tsx` — Root loading skeleton
- `app/api/upload-token/route.ts` — HMAC token generation for direct Render upload
- `app/api/status/[jobId]/route.ts` — Proxy to backend status endpoint
- `app/api/download/[jobId]/route.ts` — Proxy to backend download endpoint
- `components/site-header.tsx` — Landing page header with nav
- `components/app-header.tsx` — Dashboard header with avatar menu
- `components/footer.tsx` — Landing page footer
- `components/empty-state.tsx` — Reusable empty state pattern
- `components/upload-form.tsx` — Drag-drop file input + theme selector
- `components/status-tracker.tsx` — Step progress bar

## Environment Variables
- `RENDER_API_URL` — Backend URL (Render.com)
- `RENDER_API_SECRET` — Shared secret for API auth + HMAC signing

## Testing
- Playwright E2E: `npx playwright test` (26 specs in `tests/`)
- Config: `playwright.config.ts` (headless chromium, HTML reporter)

## Design System
- Indigo (`oklch(0.55 0.19 260)`) primary + teal (`oklch(0.72 0.13 170)`) accent
- OKLCH color tokens in `globals.css` — use `bg-primary`, `text-accent`, etc. not hardcoded colors
- shadcn `base-nova` style with `neutral` base color
- All UI components use design tokens, not hardcoded Tailwind color classes

## Known Issues
- `params` is a Promise in Next.js 16 — use `use(params)` to unwrap in client components
- Google Fonts may fail in sandboxed environments — layout.tsx has a stub fallback
- Dark mode CSS vars defined in `globals.css` but no toggle exists
