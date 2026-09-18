import { Skeleton } from '@/components/ui/skeleton';

export function AdminShellSkeleton({ label = 'Loading administrator area' }: { label?: string }) {
  return (
    <div
      className="admin-shell flex min-h-screen bg-background text-foreground"
      role="status"
      aria-label={label}
    >
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar-background p-4 md:block">
        <div className="flex h-12 items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
        <div className="mt-8 space-y-3">
          {Array.from({ length: 7 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="hidden h-10 w-64 rounded-xl md:block" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
