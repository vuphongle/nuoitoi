import type * as React from 'react';
import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type AdminMetricGridProps = React.ComponentProps<'div'>;

export function AdminMetricGrid({ className, ...props }: AdminMetricGridProps) {
  return <div className={cn('grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4', className)} {...props} />;
}

export interface AdminMetricCardProps extends Omit<React.ComponentProps<typeof Card>, 'title'> {
  title: string;
  value: React.ReactNode;
  icon: LucideIcon;
  trend?: React.ReactNode;
  progress?: number;
  progressLabel?: string;
  isLoading?: boolean;
}

export function AdminMetricCard({
  title,
  value,
  icon: Icon,
  trend,
  progress,
  progressLabel,
  isLoading = false,
  className,
  ...props
}: AdminMetricCardProps) {
  const progressValue = progress === undefined ? undefined : Math.min(100, Math.max(0, progress));

  return (
    <Card className={cn('min-w-0', className)} {...props}>
      <CardContent className="p-4 sm:p-5">
        {isLoading ? (
          <div className="space-y-3" aria-label="Loading metric">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-9 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-medium text-muted-foreground">{title}</div>
              <span className="rounded-xl bg-primary/15 p-2 text-foreground">
                <Icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <div className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{value}</div>
            {trend ? <div className="text-xs text-muted-foreground">{trend}</div> : null}
            {progressValue !== undefined ? (
              <div
                className="h-1.5 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label={progressLabel ?? `${title} progress`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressValue}
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width]"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
