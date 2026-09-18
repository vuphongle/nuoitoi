import type * as React from 'react';

import { cn } from '@/lib/utils';

export interface ResponsiveDataViewProps {
  desktop: React.ReactNode;
  mobile: React.ReactNode;
  className?: string;
  desktopClassName?: string;
  mobileClassName?: string;
}

export function ResponsiveDataView({
  desktop,
  mobile,
  className,
  desktopClassName,
  mobileClassName,
}: ResponsiveDataViewProps) {
  return (
    <div className={className}>
      <div className={cn('hidden md:block', desktopClassName)}>
        <div className="w-full overflow-x-auto">{desktop}</div>
      </div>
      <div className={cn('md:hidden', mobileClassName)}>{mobile}</div>
    </div>
  );
}
