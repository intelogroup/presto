import { type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  /** Optional hint text below description */
  hint?: string;
}

export function EmptyState({ icon, title, description, action, hint }: EmptyStateProps) {
  return (
    <div className="relative flex flex-col items-center justify-center py-24 text-center">
      {/* Ambient glow behind icon */}
      <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 h-40 w-64 rounded-full bg-primary/6 blur-[80px]" />

      <div className="relative mb-5 flex size-20 items-center justify-center rounded-3xl bg-primary/8 ring-1 ring-primary/15 text-primary [&>svg]:size-9">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {hint && (
        <p className="mt-1.5 text-xs text-muted-foreground/50">{hint}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className={cn(
            "mt-8 inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all",
            "bg-primary text-primary-foreground shadow-md shadow-primary/25",
            "hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5",
            "h-11 px-6"
          )}
        >
          {action.label}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="ml-2 size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </Link>
      )}
    </div>
  );
}
