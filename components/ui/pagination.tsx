import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { buttonVariants, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  )
);
PaginationContent.displayName = 'PaginationContent';

function PaginationItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li className={cn(className)} {...props} />;
}

type PaginationLinkBaseProps = {
  isActive?: boolean;
  size?: ButtonProps['size'];
};

type PaginationAnchorProps = PaginationLinkBaseProps &
  Omit<React.ComponentPropsWithoutRef<'a'>, keyof PaginationLinkBaseProps> & {
    href: string;
  };

type PaginationButtonProps = PaginationLinkBaseProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, keyof PaginationLinkBaseProps> & {
    href?: undefined;
  };

type PaginationLinkProps = PaginationAnchorProps | PaginationButtonProps;

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  href,
  ...props
}: PaginationLinkProps) {
  const controlClassName = cn(
    buttonVariants({ variant: isActive ? 'outline' : 'ghost', size }),
    'disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50',
    className
  );

  return href !== undefined ? (
    <a
      {...(props as Omit<PaginationAnchorProps, keyof PaginationLinkBaseProps | 'href'>)}
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={controlClassName}
    />
  ) : (
    <button
      {...(props as Omit<PaginationButtonProps, keyof PaginationLinkBaseProps | 'href'>)}
      type={(props as PaginationButtonProps).type ?? 'button'}
      aria-current={isActive ? 'page' : undefined}
      className={controlClassName}
    />
  );
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1 pl-2.5', className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1 pr-2.5', className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
      <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
