import type * as React from 'react';

import { cn } from '@/lib/utils';

export interface AdminToolbarProps extends React.ComponentProps<'div'> {
  primary?: React.ReactNode;
  secondary?: React.ReactNode;
}

export function AdminToolbar({
  primary,
  secondary,
  children,
  className,
  ...props
}: AdminToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border bg-card p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between',
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {primary ?? children}
      </div>
      {secondary ? <div className="flex flex-wrap items-center gap-2">{secondary}</div> : null}
    </div>
  );
}
