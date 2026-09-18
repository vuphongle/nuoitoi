import type * as React from 'react';

import { cn } from '@/lib/utils';

export interface AdminPageHeaderProps extends Omit<React.ComponentProps<'header'>, 'title'> {
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  icon,
  eyebrow,
  actions,
  className,
  ...props
}: AdminPageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon ? (
          <span className="mt-0.5 flex shrink-0 items-center justify-center rounded-xl bg-primary/15 p-2 text-foreground">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0 space-y-2">
          {eyebrow ? (
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {description ? (
            <div className="max-w-3xl text-sm text-muted-foreground">{description}</div>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
