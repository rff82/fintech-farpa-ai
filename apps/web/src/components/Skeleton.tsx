"use client";

interface SkeletonProps {
  className?: string;
  "aria-label"?: string;
}

export function Skeleton({ className = "", "aria-label": ariaLabel }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={ariaLabel ?? "Loading…"}
      aria-busy="true"
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      style={{ background: "var(--color-border)" }}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard…" aria-busy="true" className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" aria-label="Loading title" />
        <Skeleton className="h-8 w-32" aria-label="Loading date" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl p-4 space-y-3" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-xl" aria-label="Loading chart" />
      <span className="sr-only">Carregando painel clínico…</span>
    </div>
  );
}
