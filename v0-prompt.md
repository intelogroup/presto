# Presto — V0 UI Prompt

## Overview

Build a complete, modern web application UI for **Presto** — an AI-powered tool that converts talking-head videos into polished presentation videos. The user uploads a video (or audio file), and the system automatically transcribes speech, generates themed slides using AI, tracks the speaker's face, and renders a final synced presentation video.

The design should feel like a **premium SaaS product** — think Linear, Vercel, Resend, or Raycast. Dark mode by default with a light mode toggle. Clean typography, generous whitespace, subtle animations, glass effects, and a confident color palette.

**Tech stack:** Next.js 16 App Router, React 19, TailwindCSS 4, shadcn/ui, Lucide icons, Framer Motion for animations.

---

## Brand & Design System

### Identity
- **Name:** Presto
- **Tagline:** "Turn any video into a stunning presentation — automatically."
- **Tone:** Confident, modern, creative-professional. Not corporate. Not playful.

### Colors
- **Primary:** Electric indigo `#6366F1` (buttons, links, accents)
- **Primary hover:** `#4F46E5`
- **Secondary accent:** Cyan `#22D3EE` (progress indicators, highlights)
- **Success:** Emerald `#10B981`
- **Warning:** Amber `#F59E0B`
- **Error:** Rose `#F43F5E`
- **Dark background:** `#09090B` (zinc-950)
- **Dark surface:** `#18181B` (zinc-900)
- **Dark card:** `#27272A` (zinc-800) with subtle `border border-zinc-700/50`
- **Dark text primary:** `#FAFAFA`
- **Dark text secondary:** `#A1A1AA` (zinc-400)
- **Light background:** `#FAFAFA`
- **Light surface:** `#FFFFFF`
- **Light text:** `#18181B`

### Typography
- **Headings:** Inter (font-semibold to font-bold)
- **Body:** Inter (font-normal)
- **Mono/code:** JetBrains Mono or Geist Mono (for technical labels, stats)

### Design Tokens
- Border radius: `rounded-xl` for cards, `rounded-lg` for buttons, `rounded-full` for avatars/badges
- Shadows: Subtle `shadow-sm` on cards in light mode; no box-shadow in dark mode (use borders instead)
- Glass effect for floating elements: `bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50`
- Micro-animations: 200ms ease transitions on hover states, subtle spring animations on mount

---

## Page Structure

### 1. Landing Page (`/`)

A single-page marketing + upload experience. No separate "app" — the upload IS the product.

#### 1.1 Navigation Bar (sticky, glass effect)
- **Left:** Presto logo (stylized text logo, font-bold text-xl with a small lightning bolt icon or gradient accent on the "P")
- **Center:** Nav links — "How It Works", "Themes", "Pricing" (anchor links scrolling to sections below)
- **Right:** Theme toggle (sun/moon icon), "Sign In" text button (disabled/placeholder), "Get Started" primary button (scrolls to upload section)
- Glass background: `bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50`

#### 1.2 Hero Section
- **Layout:** Centered text with a large visual below
- **Headline:** "Turn Any Video Into a Stunning Presentation" (text-5xl md:text-7xl font-bold, with gradient text on "Stunning Presentation" using `bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent`)
- **Subheadline:** "Upload your talking-head video. Presto transcribes your speech, generates beautiful slides, and renders a polished presentation video — all automatically." (text-lg text-zinc-400 max-w-2xl mx-auto)
- **CTA buttons:** "Start Creating — Free" (primary, large), "Watch Demo" (secondary/outline with play icon)
- **Hero visual:** A stylized browser mockup or 3D-ish card showing a before/after — left side shows a simple webcam talking-head frame, right side shows a gorgeous presentation slide with the talking head in a circle overlay in the corner. Use CSS gradients and shapes to mock this, not actual images. Subtle floating animation.
- **Trust badges below hero:** "No account required", "17 premium themes", "AI-powered", "30fps HD output" — displayed as small pill badges with icons

#### 1.3 "How It Works" Section (3-step process)
- **Section title:** "How It Works" with a subtle "Simple as 1-2-3" badge above it
- **Layout:** 3 cards in a row (stacked on mobile), each with:
  - Step number in a gradient circle
  - Icon (Upload, Sparkles, Download)
  - Title + description
- **Step 1 — Upload:** "Drop your video or audio file. MP4, WebM, MP3, WAV — up to 500MB. Minimum 30 seconds."
- **Step 2 — AI Magic:** "Presto transcribes your speech with Whisper, picks the perfect theme, generates slides with GPT-4o, and tracks your face for a natural overlay."
- **Step 3 — Download:** "Get a polished 1080p presentation video at 30fps. Your talking head synced perfectly with AI-generated slides."
- Subtle connecting line or arrow between the 3 steps

#### 1.4 Theme Gallery Section
- **Section title:** "17 Stunning Themes" with subtitle "AI picks the best one for your content — or choose your own."
- **Layout:** Scrollable horizontal carousel (with drag) OR a grid of theme preview cards (responsive: 2 cols mobile, 3 cols tablet, 4 cols desktop)
- **Each theme card:**
  - A rectangular preview area (16:9 aspect ratio) showing a **CSS-only mock** of the theme's visual style using the actual color palette:
    - Background color from theme
    - A fake title text in the theme's font style
    - Small colored rectangles/shapes suggesting slide content
    - A small circle in bottom-right corner suggesting the talking head overlay (only for P1, P3, P8, P17)
  - Theme name below the preview
  - A category tag/badge (e.g. "Tech", "Finance", "Creative", "Academic")
  - Hover: subtle scale-up + glow effect in the theme's accent color

**Theme data for the cards (use these exact colors for CSS mocks):**

| ID | Name | Category | BG Color | Accent Color | Text Color | Style Keywords |
|----|------|----------|----------|-------------|------------|----------------|
| P1 | Dark Tech | Tech | `#0f172a` | `#38bdf8` | `#f8fafc` | Cyan glow, grid |
| P2 | Editorial | Creative | `#FAFAF7` | `#E84C1E` | `#1A1A1A` | Serif, magazine |
| P3 | Dashboard | Finance | `#0d1117` | `#22c55e` | `#e6edf3` | Green metrics, data |
| P4 | Bold Swiss | Marketing | `#FFFFFF` | `#E8002D` | `#0A0A0A` | Brutalist, geometric |
| P5 | Glassmorphism | Creative | `#111827` | `#2DD4BF` | `#f9fafb` | Frosted glass, teal |
| P6 | Cinematic Gold | Corporate | `#0A0A0A` | `#E8B84B` | `#F0EDE6` | Luxury, gold |
| P7 | Neon Cyber | Tech | `#050510` | `#00F0FF` | `#e0e0e0` | Neon grid, cyan/magenta |
| P8 | Clean Minimal | Tech | `#FAFAFA` | `#6366F1` | `#1A1A1A` | Apple/Vercel, minimal |
| P9 | Vaporwave | Creative | `#0D0019` | `#FF2D87` | `#e0e0e0` | Retro neon, pink/blue |
| P10 | Warm Organic | Creative | `#F9F4EE` | `#C4622D` | `#2D2D2D` | Terracotta, editorial |
| P11 | Blueprint | Tech | `#071220` | `#3B9FE8` | `#d0d8e0` | CAD grid, technical |
| P12 | Kinetic | Marketing | `#000000` | `#FF3D00` | `#FFFFFF` | Bold type, sports |
| P13 | Diagonal Split | Creative | `#F2F2F0` | `#E63946` | `#1A1A2E` | Color-block geometry |
| P14 | Broadsheet | Corporate | `#F5F0E8` | `#CC2200` | `#0D0D0D` | Newspaper serif |
| P15 | Terminal | Tech | `#0C0C0C` | `#00FF41` | `#00FF41` | CLI monospace, green |
| P16 | Comic Book | Marketing | `#FEDD00` | `#E31E24` | `#0A0A0A` | Halftone, pop art |
| P17 | Academic | Academic | `#0D1B2A` | `#D4A017` | `#F4F1E8` | Gold serif, prestige |

#### 1.5 Upload Section (THE core interaction)
- **Section title:** "Create Your Presentation" with a glowing accent
- **Layout:** Large centered card (max-w-2xl) with generous padding
- **Upload zone:**
  - Large dashed-border drop zone (`border-2 border-dashed border-zinc-700 hover:border-indigo-500 transition-colors`)
  - Center: Upload cloud icon (large, zinc-500), "Drag & drop your video or audio file" text, "or" divider, "Browse Files" button
  - Accepted formats shown below: "MP4, WebM, MOV, MP3, M4A, WAV — up to 500MB, minimum 30 seconds"
  - On file drop/select: zone transforms to show file info (name, size, format icon) with an "X" remove button
  - If audio file detected (MP3, M4A, WAV): show an additional optional "Upload a headshot photo" dropzone below (smaller), with explanation text "Audio files use a static headshot instead of video. Upload a photo, or we'll use a placeholder."

- **Theme selector** (below upload zone):
  - Label: "Theme" with a "(optional — AI picks the best match)" hint
  - Default state: "Auto-detect" selected
  - Dropdown or horizontal pill selector showing: Auto-detect, then all 17 themes with their color dot + name
  - Each option shows a small color swatch circle matching the theme's accent color

- **Submit button:**
  - Full-width primary button: "Generate Presentation" with a sparkles icon
  - Disabled state when no file selected (opacity-50, cursor-not-allowed)
  - Loading state: spinner + "Uploading..." text, with upload progress bar above the button (thin indigo bar, 0-100%)

#### 1.6 Social Proof / Stats Section
- **Layout:** 4 stats in a row
- "10,000+ videos processed" | "17 premium themes" | "30fps HD output" | "< 5 min average"
- Use mock numbers. Animated count-up on scroll into view.

#### 1.7 Pricing Section (placeholder)
- **Section title:** "Pricing"
- 3 cards: Free (current — "5 videos/month, 720p, watermark"), Pro ($19/mo — "Unlimited, 1080p, no watermark, priority"), Team ($49/mo — "Everything in Pro + shared workspace, analytics")
- All mock/placeholder. "Coming Soon" overlay on Pro and Team. Free card has "Get Started" button.

#### 1.8 Footer
- Logo + tagline on the left
- Links: Product, Themes, Pricing, Docs, GitHub
- Right: "Built with Remotion, Whisper, GPT-4o"
- Bottom: copyright line

---

### 2. Status / Processing Page (`/status/[jobId]`)

After upload, the user is redirected here. This page polls for status every 2 seconds.

#### 2.1 Layout
- Centered card (max-w-xl), vertically centered on the page
- Clean, focused, no distractions

#### 2.2 Pipeline Progress Stepper
- **Vertical stepper** showing all 6 pipeline stages with real-time status:

| Step | Label | Description | Icon |
|------|-------|-------------|------|
| 1 | Uploading | "Transferring your file..." | Upload |
| 2 | Preprocessing | "Trimming silences, optimizing video..." | Scissors |
| 3 | Transcribing | "Converting speech to text with AI..." | Mic |
| 4 | Generating Slides | "Creating themed slides from your content..." | Sparkles |
| 5 | Syncing | "Tracking face position, syncing audio..." | ScanFace |
| 6 | Rendering | "Building your final presentation video..." | Film |

- **Step states:**
  - **Completed:** Green checkmark circle, muted text, line connects to next step (solid green)
  - **In Progress:** Pulsing indigo dot with ring animation, bold text, spinning loader icon, line is dashed/animated downward
  - **Pending:** Gray dot, muted text, gray dashed line
  - **Error:** Red X circle, error message below in red text

- **Current step detail:** Below the active step, show a subtle description like "This usually takes 30-60 seconds" in zinc-500 text
- **Elapsed time:** Small "Started 2m 34s ago" timer at the top of the card

#### 2.3 Completion State
When status = "done", the stepper is replaced/overlaid with:
- **Success animation:** Confetti burst or a checkmark circle animation (Framer Motion)
- **Title:** "Your presentation is ready!" (text-2xl font-bold)
- **Video preview:** Embedded `<video>` player with controls, showing the rendered MP4 (mock with a placeholder gradient thumbnail)
- **Action buttons:**
  - "Download MP4" primary button (Download icon)
  - "Copy Link" secondary button (Link icon)
  - "Create Another" ghost button (Plus icon, navigates back to `/`)
- **File info:** "1080p · 30fps · 3:42 duration · 48MB" in small text

#### 2.4 Error State
When status = "error":
- Red alert card replacing the stepper
- Error icon + "Something went wrong" title
- Error message from the API (e.g., "Pipeline stalled: no progress for 30 minutes")
- "Try Again" button (navigates back to `/`)
- "Contact Support" link

---

### 3. Shared Components

#### 3.1 Toast Notifications
- Use sonner-style toasts (bottom-right)
- Success: green left border
- Error: red left border
- Info: indigo left border

#### 3.2 Loading Skeleton
- Used on the status page while initial fetch happens
- Pulse animation on card-shaped placeholder blocks

#### 3.3 Mobile Responsiveness
- All pages must be fully responsive
- Landing page: single column stacked on mobile, hero text scales down to text-3xl
- Theme gallery: 1 column on mobile, horizontal scroll
- Upload zone: full width, same interaction
- Status page: same layout, just narrower

---

## Mock Data

Use this mock data for placeholder content and demonstrations:

### Mock Job Status Response (for status page)
```json
{
  "jobId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "generating_slides",
  "step": "generating_slides",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

### Mock Completed Job
```json
{
  "jobId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "done",
  "step": "done",
  "outputFilename": "presentation-final.mp4"
}
```

### Mock Status Progression (for demo/animation)
```
uploading → preprocessing → transcribing → generating_slides → syncing → rendering → done
```

### Mock Theme for Preview
```json
{
  "themeId": "P1",
  "name": "Dark Tech",
  "compositionId": "Presentation",
  "category": "Tech",
  "bgColor": "#0f172a",
  "accentColor": "#38bdf8",
  "textColor": "#f8fafc",
  "hasTalkingHead": true,
  "slideTypes": ["title", "iconGrid", "checklist", "stats", "barChart", "timeline", "quote", "iconFeatures"]
}
```

### Mock Upload Constraints
```
Max file size: 500MB
Min duration: 30 seconds
Accepted video: .mp4, .webm, .mov, .m4v
Accepted audio: .mp3, .m4a, .wav, .ogg, .webm
```

---

## Animations & Micro-interactions

1. **Hero section:** Subtle floating animation on the preview visual (translateY oscillation over 6s)
2. **Theme cards:** Scale 1.02 on hover with box-shadow glow in theme accent color
3. **Upload zone:** Border color transitions to indigo on drag-over, subtle pulse
4. **File selected:** Slide-in animation for file info card
5. **Pipeline stepper:** Each step transition animates smoothly — check circle grows from center, line draws downward
6. **Completion:** Spring animation on the success checkmark, staggered fade-in on download buttons
7. **Stats counter:** Count-up animation from 0 to target number when section scrolls into view
8. **Page transitions:** Fade + subtle slide-up on route change

---

## Accessibility Requirements

- All interactive elements must be keyboard accessible
- Focus rings visible on tab navigation (`ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-950`)
- Upload zone activatable via keyboard (Enter/Space)
- Proper aria-labels on icon-only buttons
- Status stepper uses `aria-current="step"` on active step
- Reduced motion: respect `prefers-reduced-motion` — disable floating animations, use simple opacity transitions
- Color contrast: all text meets WCAG AA (4.5:1 ratio minimum)

---

## Important Implementation Notes

1. **This is a mock UI** — no real API calls. Use `setTimeout` to simulate upload progress and status polling. The status page should auto-advance through pipeline steps every 3-4 seconds for demo purposes.
2. **No authentication** — the "Sign In" button is a placeholder.
3. **No real file upload** — simulate with a file input that captures the file name/size and shows it in the UI.
4. **Theme selector** should be fully functional in the UI (selecting a theme highlights it) but doesn't connect to any backend.
5. **Video player** on the completion page should show a placeholder (gradient thumbnail or mock frame) since there's no real video.
6. **Dark mode should be the default.** Light mode toggle should work via `next-themes` or a simple React state + CSS class approach.
7. Use **shadcn/ui** components as the base (Button, Card, Badge, DropdownMenu, Select, Progress, Tooltip) and customize them to match the design system.
8. All 17 theme cards in the gallery must be rendered with their actual color schemes as described in the theme table above.
