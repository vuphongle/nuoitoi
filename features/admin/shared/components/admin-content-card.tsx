import type * as React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface AdminContentCardProps extends Omit<React.ComponentProps<typeof Card>, 'title'> {
  title?: string;
  description?: string | number;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
}

export function AdminContentCard({
  title,
  description,
  action,
  footer,
  children,
  className,
  contentClassName,
  ...props
}: AdminContentCardProps) {
  const hasHeader = title || description || action;

  return (
    <Card className={className} {...props}>
      {hasHeader ? (
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1.5">
            {title ? <CardTitle className="text-lg">{title}</CardTitle> : null}
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </CardHeader>
      ) : null}
      <CardContent className={cn(hasHeader ? undefined : 'pt-6', contentClassName)}>
        {children}
      </CardContent>
      {footer ? <CardFooter className="border-t bg-muted/20 px-6 py-4">{footer}</CardFooter> : null}
    </Card>
  );
}
