import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  lines?: number
}

/** Animated loading skeleton */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('skeleton rounded-lg', className)} aria-hidden="true" />
  )
}

/** Calculator result skeleton while tax data loads */
export function CalculatorSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]" aria-busy="true" aria-label="Loading calculator">
      {/* Input panel skeleton */}
      <div className="wp-card p-6 space-y-5">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-11 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </div>
      </div>

      {/* Results skeleton */}
      <div className="space-y-4">
        <div className="wp-card p-6 space-y-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-56" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-20" />
          </div>
        </div>
        <div className="wp-card p-0 overflow-hidden">
          <div className="border-b border-border px-5 py-3">
            <Skeleton className="h-4 w-32" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex justify-between border-b border-border px-5 py-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Blog card skeleton */
export function BlogCardSkeleton() {
  return (
    <div className="wp-card p-5 space-y-3">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}
