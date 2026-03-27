import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 motion-safe:animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Project cards grid */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/40 bg-card/50 overflow-hidden animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Thumbnail */}
            <Skeleton className="aspect-video w-full" />
            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA skeleton */}
      <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-border/40 p-8 space-y-3">
        <Skeleton className="h-5 w-52" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-10 w-32 rounded-xl mt-2" />
      </div>
    </div>
  );
}
