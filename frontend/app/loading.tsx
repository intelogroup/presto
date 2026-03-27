import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 motion-safe:animate-fade-in">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="mt-16 flex flex-col items-center text-center space-y-4">
        <Skeleton className="h-10 w-80 rounded-lg" />
        <Skeleton className="h-5 w-64 rounded-lg" />
        <div className="flex gap-3 mt-4">
          <Skeleton className="h-11 w-36 rounded-xl" />
          <Skeleton className="h-11 w-28 rounded-xl" />
        </div>
      </div>

      {/* Product mock skeleton */}
      <div className="mt-16 mx-auto max-w-3xl">
        <Skeleton className="aspect-video w-full rounded-2xl" />
      </div>

      {/* Features skeleton */}
      <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-xl border border-border/40 p-5">
            <Skeleton className="size-12 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
