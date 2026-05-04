import { Skeleton } from "@/components/ui/skeleton"

export function ResultsSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl bg-muted/60" />
            <Skeleton className="h-4 w-40 bg-muted/60" />
          </div>
          <div className="mt-5 space-y-3">
            <Skeleton className="h-3 w-full bg-muted/60" />
            <Skeleton className="h-3 w-[92%] bg-muted/60" />
            <Skeleton className="h-3 w-[80%] bg-muted/60" />
            <Skeleton className="h-3 w-[88%] bg-muted/60" />
          </div>
        </div>
      ))}
    </div>
  )
}
