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
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-muted-foreground [&>svg]:size-12">{icon}</div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action && (
        <Link
          href={action.href}
          className={cn(
            "mt-6 inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all",
            "bg-primary text-primary-foreground",
            "h-8 px-2.5"
          )}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
