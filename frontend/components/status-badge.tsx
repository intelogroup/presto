import { cn } from "@/lib/utils";

type Status = "processing" | "ready" | "failed";

const styles: Record<Status, string> = {
  processing: "bg-primary/15 text-primary animate-pulse",
  ready: "bg-accent/15 text-accent",
  failed: "bg-destructive/15 text-destructive",
};

const labels: Record<Status, string> = {
  processing: "Processing",
  ready: "Ready",
  failed: "Failed",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}
