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
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/8 text-primary [&>svg]:size-8">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
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
