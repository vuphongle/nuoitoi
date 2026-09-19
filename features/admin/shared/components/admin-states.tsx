import type * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { CircleAlert, Inbox } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdminEmptyStateProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  icon?: LucideIcon;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function AdminEmptyState({
  icon: Icon = Inbox,
  title = 'No items found',
  description,
  action,
  className,
  ...props
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn('flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center', className)}
      {...props}
    >
      <span className="mb-4 rounded-2xl bg-muted p-3 text-muted-foreground">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export interface AdminErrorStateProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
}

export function AdminErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  retryLabel = 'Try again',
  className,
  ...props
}: AdminErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn('flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center', className)}
      {...props}
    >
      <span className="mb-4 rounded-2xl bg-destructive/10 p-3 text-destructive">
        <CircleAlert className="size-6" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      {description ? <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {onRetry ? (
        <Button type="button" variant="outline" className="mt-5" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
