export interface Theme {
  id: string;
  label: string;
  color: string;
  hasTalkingHead: boolean;
}

// Hardcoded Tailwind colors are intentional here — these are preview swatches
// representing actual Remotion theme visuals. They don't map to design tokens
// because each theme has its own unique color identity (P1-P17).
export const THEMES: Theme[] = [
  { id: "", label: "Auto-select", color: "bg-muted", hasTalkingHead: false },
  { id: "P1", label: "Dark Tech", color: "bg-gray-900", hasTalkingHead: true },
  { id: "P2", label: "Gradient", color: "bg-gradient-to-br from-indigo-500 to-purple-600", hasTalkingHead: false },
  { id: "P3", label: "Dashboard / KPI", color: "bg-emerald-700", hasTalkingHead: true },
  { id: "P4", label: "Minimal Light", color: "bg-gray-200", hasTalkingHead: false },
  { id: "P5", label: "Bold Color", color: "bg-orange-500", hasTalkingHead: false },
  { id: "P6", label: "Corporate", color: "bg-blue-900", hasTalkingHead: false },
  { id: "P7", label: "Neon", color: "bg-fuchsia-600", hasTalkingHead: false },
  { id: "P8", label: "Infographic", color: "bg-sky-500", hasTalkingHead: false },
  { id: "P9", label: "Retro", color: "bg-amber-600", hasTalkingHead: false },
  { id: "P10", label: "Nature", color: "bg-green-700", hasTalkingHead: false },
  { id: "P11", label: "Monochrome", color: "bg-neutral-600", hasTalkingHead: false },
  { id: "P12", label: "Pastel", color: "bg-pink-300", hasTalkingHead: false },
  { id: "P13", label: "Geometric", color: "bg-violet-600", hasTalkingHead: false },
  { id: "P14", label: "Timeline", color: "bg-cyan-700", hasTalkingHead: false },
  { id: "P15", label: "Magazine", color: "bg-rose-600", hasTalkingHead: false },
  { id: "P16", label: "Glassmorphism", color: "bg-slate-500/80", hasTalkingHead: false },
  { id: "P17", label: "Academic", color: "bg-stone-700", hasTalkingHead: true },
];
