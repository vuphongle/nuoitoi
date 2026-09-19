import type * as React from 'react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { getAdminStatusConfig, normalizeAdminStatus } from '@/features/admin/shared/admin-status';
import { cn } from '@/lib/utils';

export interface AdminStatusBadgeProps extends Omit<BadgeProps, 'children'> {
  status: unknown;
  label?: React.ReactNode;
}

export function AdminStatusBadge({ status, label, className, ...props }: AdminStatusBadgeProps) {
  const config = getAdminStatusConfig(status);
  const normalizedStatus = normalizeAdminStatus(status);

  return (
    <Badge variant="outline" className={cn('capitalize', config.className, className)} {...props}>
      {(label ?? normalizedStatus) || 'Unknown'}
    </Badge>
  );
}
