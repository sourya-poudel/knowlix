import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-dvh flex-col gap-6 bg-background px-4 py-8 sm:px-6">
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    </div>
  )
}
