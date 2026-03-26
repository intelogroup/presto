# Presto — Frontend UI Production Plan

## Current State

2 pages, 7 components, functional but bare MVP. Upload form → status tracker → download. No navigation, no auth UI, no dashboard, no empty states, no error boundaries, no payment flow.

**What works well (keep):**
- HMAC upload flow (secure, bypasses Vercel limit)
- Status tracker with step dots + progress bar
- shadcn `base-nova` style with `neutral` base color
- Geist Sans / Geist Mono fonts
- OKLCH color tokens in globals.css
- Tailwind 4 + PostCSS inline theming

**What needs fixing:**
- Hardcoded Tailwind classes (`bg-gray-50`, `border-blue-400`) bypass the design token system
- No shared layout shell (header, footer)
- Current achromatic palette has zero brand identity
- Theme selector is a dropdown — should be visual grid for 17 themes
- Metadata still says "Create Next App"
- No `error.tsx`, `not-found.tsx`, or `loading.tsx`

---

## Design System

### Philosophy

Flat, minimal, light-mode-first. White backgrounds, generous whitespace, soft borders. Two accent colors only — everything else is grayscale.

### Color Palette

Replace the current achromatic-only tokens. Keep OKLCH color space (already in globals.css).

| Token | OKLCH Value | Hex Approx | Use |
|-------|-------------|------------|-----|
| `--primary` | `oklch(0.55 0.19 260)` | `#4F46E5` | Buttons, links, focus rings, active states |
| `--primary-foreground` | `oklch(0.99 0 0)` | `#FAFAFA` | Text on primary buttons |
| `--accent` | `oklch(0.72 0.13 170)` | `#14B8A6` | Success states, secondary actions, badges |
| `--accent-foreground` | `oklch(0.99 0 0)` | `#FAFAFA` | Text on accent |
| `--background` | `oklch(0.985 0 0)` | `#FAFAFA` | Page background |
| `--card` | `oklch(1 0 0)` | `#FFFFFF` | Cards, modals, popovers |
| `--foreground` | `oklch(0.18 0 0)` | `#1A1A1A` | Body text |
| `--muted` | `oklch(0.965 0 0)` | `#F5F5F5` | Empty states, disabled areas, secondary bg |
| `--muted-foreground` | `oklch(0.50 0 0)` | `#737373` | Placeholder text, secondary labels |
| `--border` | `oklch(0.92 0 0)` | `#E5E5E5` | Card borders, dividers |
| `--destructive` | `oklch(0.58 0.22 25)` | `#DC2626` | Errors, delete actions |
| `--ring` | `oklch(0.55 0.19 260)` | matches primary | Focus outlines |

**Rule**: Primary (indigo) for actions the user should take. Accent (teal) for positive feedback. Gray for everything structural. Red for errors only.

### Typography

Keep Geist Sans (already configured). Three weights only:
- 400 — body text
- 500 — labels, table headers, badges
- 600 — headings, buttons

### Spacing & Layout

- 4px base grid (Tailwind default)
- Cards: `p-6` (24px padding)
- Section gaps: `gap-12` to `gap-16` (48-64px)
- Max content width: `max-w-6xl` for dashboard, `max-w-lg` for single-column forms
- Border radius: keep current `0.625rem` (10px)

### Shadows

One level only: `shadow-sm` (`0 1px 2px oklch(0 0 0 / 0.05)`). No stacked elevations.

### Token Migration

Current pages use hardcoded Tailwind colors (`bg-gray-50`, `text-blue-700`, `border-blue-400`). Migrate all to token classes:
- `bg-gray-50` → `bg-background`
- `text-gray-900` → `text-foreground`
- `text-gray-500` → `text-muted-foreground`
- `border-gray-200` → `border-border`
- `bg-blue-500` → `bg-primary`
- `text-blue-700` → `text-primary`
- `bg-green-500` → `bg-accent` (success contexts)
- `text-red-600` → `text-destructive`

---

## Route Map

| Route | Purpose | Auth | Priority |
|-------|---------|------|----------|
| `/` | Landing page (marketing + pricing) | Public | Phase B |
| `/login` | WorkOS login/signup | Public | Phase D |
| `/app` | Dashboard — project list | Protected | Phase C |
| `/app/new` | Upload + theme selection | Protected | Phase C |
| `/app/project/[jobId]` | Status → preview → download | Protected | Phase C |
| `/app/settings` | Profile + billing tabs | Protected | Phase D-E |

6 routes total. The current `/` upload page moves to `/app/new`. Current `/status/[jobId]` moves to `/app/project/[jobId]`.

---

## Page Specifications

### 1. Landing Page (`/`)

Single scrollable page. No sidebar.

**Sections:**
1. **Header** — Logo left, "Login" + "Get Started" buttons right. Sticky on scroll.
2. **Hero** — Headline: "Turn any talk into a presentation video". Subtitle. Primary CTA → `/login`. Product screenshot placeholder (16:9 gray rounded rect with play icon).
3. **How it works** — 3 cards in a row: Upload (cloud-upload icon) → AI generates slides (sparkles icon) → Download video (download icon). Numbers 1-2-3 in primary-colored circles.
4. **Features** — 2x2 grid: "17 presentation themes", "AI transcription", "Face tracking overlay", "One-click export". Each card has icon + heading + one sentence.
5. **Pricing** — Two cards side by side. Free (3 presentations/month, 720p) vs Pro ($X/month, unlimited, 1080p, priority renders). Feature checklist under each. Pro card has primary-colored border.
6. **Footer** — Logo, copyright, links: Pricing, Login, Terms, Privacy.

**Responsive**: All sections stack to single column below `md` breakpoint.

### 2. Login (`/login`)

Centered card, max-w-sm. Logo above card. Two buttons:
- "Continue with Google" (outline)
- "Continue with email" (primary)

Both redirect to WorkOS hosted auth page. Below buttons: "By continuing you agree to our Terms and Privacy Policy" in muted text.

Redirect to `/app` on successful auth callback.

### 3. Dashboard (`/app`)

**Layout shell** (shared across all `/app/*` routes):
- **AppHeader**: Logo (links to `/app`), "New Project" primary button, avatar dropdown (right)
- **Avatar dropdown**: Display name, email (muted), separator, "Settings", "Billing", separator, "Sign out"
- No sidebar. Top nav only.

**Empty state** (no projects):
- Centered: Upload-cloud icon (48px, muted), "No projects yet" heading, "Upload a video or audio file to create your first presentation" description, "New Project" primary button → `/app/new`

**With projects** (grid):
- 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Each `ProjectCard`: thumbnail placeholder (gray rect, 16:9 aspect), title (filename truncated), status badge, theme label (muted), relative date ("2h ago"), overflow menu (three dots → Download, Delete)
- Status badges: "Processing" (primary bg, pulse animation), "Ready" (accent bg), "Failed" (destructive bg)

### 4. New Project (`/app/new`)

Relocated upload form. Same HMAC flow, improved layout:

- **Section 1: File upload** — Same drag-drop zone, migrated to token colors. Accepted formats listed below the zone.
- **Section 2: Theme selection** — Visual grid replacing the dropdown. Each theme is a card showing a mini preview frame (placeholder colored rectangle per theme) + theme name below. 4 columns desktop, 2 mobile. Click to select (primary border on selected). "Auto-select" option as first card with sparkles icon.
- **Section 3: Headshot (conditional)** — Only visible when uploaded file is audio-only (MP3/M4A/WAV). "Optional: Add a headshot photo" with small drop zone. Muted text: "If skipped, we'll use your profile photo or a placeholder."
- **Submit button** — Full width at bottom: "Generate Presentation". Disabled until file selected.

On submit → redirect to `/app/project/[jobId]`.

### 5. Project Detail (`/app/project/[jobId]`)

Three states:

**Processing:**
- Keep current StatusTracker component (migrated to token colors)
- Add estimated time text below progress bar: "Usually takes 2-5 minutes"
- "Cancel" outline button at bottom

**Ready:**
- 16:9 video player (native `<video>` element with `controls`, or a black placeholder with play icon if no URL)
- Below video: row of slide thumbnails (horizontal scroll, read-only). Each thumbnail is a small colored rect with slide type label. Shows duration in seconds overlay.
- Action bar: "Download MP4" primary button, "Create Another" outline button
- Metadata: Theme, duration, slide count, created date

**Failed:**
- Error card (destructive background): error message from server
- "Try Again" primary button → `/app/new`
- "Back to Dashboard" outline link

### 6. Settings (`/app/settings`)

Two tabs via shadcn `Tabs` component:

**Profile tab:**
- Avatar (from WorkOS, read-only for now, circle with initials fallback)
- Display name (text input, editable)
- Email (text input, disabled/read-only)
- "Save Changes" primary button (disabled until dirty)
- Separator
- Danger zone: "Delete Account" destructive outline button → confirmation dialog

**Billing tab:**
- Current plan card: "Free Plan" or "Pro Plan" with badge
- Usage: "X of Y presentations this month" with progress bar
- "Upgrade to Pro" primary button (Free users) → Stripe Checkout redirect
- Payment method: "Visa ending in 4242" (Pro users)
- Invoice history: simple table (date, amount, status, download PDF link)
- "Cancel Subscription" destructive link at bottom (Pro users)

---

## Shared Components

### Install from shadcn/ui

```bash
npx shadcn@latest add input label textarea dialog dropdown-menu tabs tooltip avatar skeleton separator table accordion sonner
```

These are compatible with the existing `base-nova` style and `neutral` base color in `components.json`.

### Build Custom

| Component | Location | Description |
|-----------|----------|-------------|
| `SiteHeader` | `components/site-header.tsx` | Landing page: logo + nav links + CTA |
| `AppHeader` | `components/app-header.tsx` | Dashboard: logo + "New Project" + avatar menu |
| `Footer` | `components/footer.tsx` | Landing page footer |
| `EmptyState` | `components/empty-state.tsx` | Reusable: icon + heading + description + CTA. Props: `icon`, `title`, `description`, `action` |
| `ProjectCard` | `components/project-card.tsx` | Dashboard grid item |
| `StatusBadge` | `components/status-badge.tsx` | Processing/Ready/Failed with correct colors |
| `ThemeGrid` | `components/theme-grid.tsx` | Visual theme selector for upload page |
| `HeadshotUpload` | `components/headshot-upload.tsx` | Small drop zone for optional photo |
| `SlideStrip` | `components/slide-strip.tsx` | Horizontal scrollable slide thumbnails |
| `PricingCard` | `components/pricing-card.tsx` | Plan card with feature list + CTA |

---

## User Journey States

Every page must handle all applicable states:

| State | Pattern | Component |
|-------|---------|-----------|
| Loading | Skeleton placeholders (no spinners) | shadcn `Skeleton` |
| Empty | Icon + heading + description + CTA button | `EmptyState` |
| Error | Destructive card with message + retry action | Inline or `error.tsx` |
| Success | Toast notification (auto-dismiss 5s) | `sonner` |
| Offline | Top banner: "You're offline" | Custom banner in layout |

**Required boundary files:**
- `app/error.tsx` — Global error boundary with retry button
- `app/not-found.tsx` — 404 page with "Go home" link
- `app/loading.tsx` — Root loading skeleton
- `app/app/loading.tsx` — Dashboard loading skeleton

**Toast triggers:**
- Upload complete → "Your presentation is rendering!"
- Render done → "Your video is ready to download"
- Payment success → "Welcome to Pro!"
- Delete confirm → "Project deleted"
- Error → "Something went wrong. Please try again."

---

## Payment Flow (Stripe)

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/checkout` | POST | Create Stripe Checkout Session, return URL |
| `/api/webhooks/stripe` | POST | Handle `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted` |
| `/api/subscription` | GET | Return current user's plan + usage |

### Flow

1. User clicks "Upgrade to Pro" → `POST /api/checkout`
2. Backend creates Stripe Checkout Session with `success_url` and `cancel_url`
3. Frontend redirects to Stripe hosted checkout
4. On success, Stripe redirects to `/app/settings?payment=success`
5. Stripe webhook fires → backend updates DynamoDB subscription record
6. Frontend shows success toast, refreshes plan card

### UI States

- **Free**: "Upgrade" CTA on settings billing tab + subtle badge in AppHeader
- **Checkout in progress**: Loading state on button, "Redirecting to payment..."
- **Pro active**: Usage stats, payment method, invoice history visible
- **Payment failed**: Destructive banner on billing tab with retry link
- **Cancellation**: Confirmation dialog → "Your Pro access continues until [date]"

---

## Implementation Phases

### Phase A — Design System + App Shell (3-5 days)

- [ ] Update `globals.css` with indigo/teal accent palette
- [ ] Install shadcn components: `input`, `label`, `dialog`, `dropdown-menu`, `tabs`, `avatar`, `skeleton`, `separator`, `table`, `sonner`
- [ ] Build `SiteHeader`, `AppHeader`, `Footer`, `EmptyState`
- [ ] Create `/app` layout with `AppHeader`
- [ ] Add `error.tsx`, `not-found.tsx`, `loading.tsx` boundaries
- [ ] Update metadata (title: "Presto", description, OG image placeholder)
- [ ] Migrate existing pages from hardcoded gray/blue classes to token classes

### Phase B — Landing Page (2-3 days)

- [ ] Hero section with headline + CTA + product screenshot placeholder
- [ ] "How it works" 3-step section
- [ ] Feature grid (2x2)
- [ ] Pricing section (Free vs Pro cards)
- [ ] Footer
- [ ] Mobile responsive pass

### Phase C — Dashboard + Project Flow (4-5 days)

- [ ] Dashboard page (`/app`) with `ProjectCard` grid + empty state
- [ ] Move upload form to `/app/new` with `ThemeGrid` (visual theme picker)
- [ ] Add conditional `HeadshotUpload` for audio-only files
- [ ] Move status page to `/app/project/[jobId]`
- [ ] Add "Ready" state: video player + `SlideStrip` + download actions
- [ ] Add "Failed" state with retry
- [ ] Loading skeletons for dashboard and project detail

### Phase D — Auth (2-3 days)

- [ ] `/login` page with WorkOS redirect buttons
- [ ] Auth callback handler
- [ ] Next.js middleware protecting `/app/*` routes
- [ ] `AvatarMenu` in `AppHeader` with sign out
- [ ] Settings profile tab (avatar, name, email)

### Phase E — Payment + Billing (3-4 days)

- [ ] `POST /api/checkout` — Stripe Checkout Session creation
- [ ] `POST /api/webhooks/stripe` — webhook handler
- [ ] `GET /api/subscription` — plan status endpoint
- [ ] Settings billing tab: plan card, usage bar, invoice table
- [ ] Pricing cards on landing page wired to checkout
- [ ] Success/failure toasts and redirects

### Phase F — Polish + Testing (ongoing)

- [ ] Skeleton loading states on every page
- [ ] Toast notifications for all user actions
- [ ] Keyboard navigation audit
- [ ] Mobile responsive pass on all pages
- [ ] Playwright E2E tests for new routes (dashboard, settings, login, landing)
- [ ] Accessibility audit (ARIA labels, focus management, color contrast)
- [ ] SEO: OG tags, structured data, sitemap

---

## Dependencies to Add

```bash
# shadcn components (run from frontend/)
npx shadcn@latest add input label textarea dialog dropdown-menu tabs tooltip avatar skeleton separator table accordion sonner

# Payment
npm install stripe @stripe/stripe-js

# Auth (when ready)
npm install @workos-inc/node
```

No new state management library needed — React 19 `use()` + server components + URL search params cover all cases. No form library needed — native form actions + server validation is sufficient for the few forms we have.

---

## File Structure (Target)

```text
frontend/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout (metadata, fonts)
│   ├── error.tsx                     # Global error boundary
│   ├── not-found.tsx                 # 404 page
│   ├── loading.tsx                   # Root loading skeleton
│   ├── globals.css                   # Design tokens (updated palette)
│   ├── login/
│   │   └── page.tsx                  # WorkOS login
│   ├── app/
│   │   ├── layout.tsx                # App shell (AppHeader)
│   │   ├── loading.tsx               # Dashboard skeleton
│   │   ├── page.tsx                  # Dashboard (project grid)
│   │   ├── new/
│   │   │   └── page.tsx              # Upload + theme selection
│   │   ├── project/
│   │   │   └── [jobId]/
│   │   │       └── page.tsx          # Status → preview → download
│   │   └── settings/
│   │       └── page.tsx              # Profile + billing tabs
│   ├── api/
│   │   ├── upload-token/route.ts     # (existing)
│   │   ├── status/[jobId]/route.ts   # (existing)
│   │   ├── download/[jobId]/route.ts # (existing)
│   │   ├── checkout/route.ts         # Stripe session creation
│   │   ├── subscription/route.ts     # Plan status
│   │   └── webhooks/
│   │       └── stripe/route.ts       # Stripe webhooks
├── components/
│   ├── site-header.tsx               # Landing nav
│   ├── app-header.tsx                # Dashboard nav + avatar menu
│   ├── footer.tsx                    # Landing footer
│   ├── empty-state.tsx               # Reusable empty state
│   ├── project-card.tsx              # Dashboard grid card
│   ├── status-badge.tsx              # Processing/Ready/Failed
│   ├── theme-grid.tsx                # Visual theme picker
│   ├── headshot-upload.tsx           # Optional photo upload
│   ├── slide-strip.tsx              # Horizontal slide thumbnails
│   ├── pricing-card.tsx              # Plan card
│   ├── upload-form.tsx               # (existing, updated)
│   ├── status-tracker.tsx            # (existing, updated)
│   └── ui/                           # shadcn primitives (existing + new)
├── lib/
│   ├── utils.ts                      # (existing)
│   └── render-api.ts                 # (existing)
└── middleware.ts                      # Auth route protection
```
