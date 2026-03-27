"use client";

import { cn } from "@/lib/utils";

const THEMES = [
  { id: "", label: "Auto-select", color: "bg-muted" },
  { id: "P1", label: "Dark Tech", color: "bg-gray-900" },
  { id: "P2", label: "Gradient", color: "bg-gradient-to-br from-indigo-500 to-purple-600" },
  { id: "P3", label: "Dashboard / KPI", color: "bg-emerald-700" },
  { id: "P4", label: "Minimal Light", color: "bg-gray-100" },
  { id: "P5", label: "Bold Color", color: "bg-orange-500" },
  { id: "P6", label: "Corporate", color: "bg-blue-900" },
  { id: "P7", label: "Neon", color: "bg-fuchsia-600" },
  { id: "P8", label: "Infographic", color: "bg-sky-500" },
  { id: "P9", label: "Retro", color: "bg-amber-600" },
  { id: "P10", label: "Nature", color: "bg-green-700" },
  { id: "P11", label: "Monochrome", color: "bg-neutral-600" },
  { id: "P12", label: "Pastel", color: "bg-pink-300" },
  { id: "P13", label: "Geometric", color: "bg-violet-600" },
  { id: "P14", label: "Timeline", color: "bg-cyan-700" },
  { id: "P15", label: "Magazine", color: "bg-rose-600" },
  { id: "P16", label: "Glassmorphism", color: "bg-slate-400/80" },
  { id: "P17", label: "Academic", color: "bg-stone-700" },
];

interface ThemeGridProps {
  value: string;
  onChange: (themeId: string) => void;
}

export function ThemeGrid({ value, onChange }: ThemeGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {THEMES.map((theme) => {
        const isSelected = value === theme.id;
        const isAuto = theme.id === "";
        return (
          <button
            key={theme.id || "auto"}
            type="button"
            onClick={() => onChange(theme.id)}
            className={cn(
              "group flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground"
            )}
          >
            <div
              className={cn(
                "aspect-video w-full rounded-md flex items-center justify-center",
                theme.color
              )}
            >
              {isAuto && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 text-muted-foreground"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                  />
                </svg>
              )}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}
            >
              {theme.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
