import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface AdminListSkeletonProps {
  rows?: number;
  className?: string;
}

export function AdminListSkeleton({ rows = 5, className }: AdminListSkeletonProps) {
  const items = Array.from({ length: rows }, (_, index) => index);

  return (
    <div className={cn('space-y-4', className)} role="status" aria-label="Loading list">
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {items.map((item) => (
          <div key={item} className="space-y-3 rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="size-8" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-2xl border md:block">
        <div className="grid grid-cols-4 gap-4 border-b bg-muted/40 p-4">
          {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-4" />)}
        </div>
        {items.map((item) => (
          <div key={item} className="grid grid-cols-4 gap-4 border-b p-4 last:border-b-0">
            <Skeleton className="h-5" />
            <Skeleton className="h-5" />
            <Skeleton className="h-5" />
            <Skeleton className="h-5" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
