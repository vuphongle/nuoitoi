import type * as React from 'react';

import { cn } from '@/lib/utils';

export interface AdminPageProps extends React.ComponentProps<'section'> {
  className?: string;
}

export function AdminPage({ className, ...props }: AdminPageProps) {
  return (
    <section
      className={cn('mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8', className)}
      {...props}
    />
  );
}
