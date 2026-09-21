'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getAdminPaginationModel } from '@/features/admin/shared/admin-pagination-model';
import { cn } from '@/lib/utils';

export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className,
}: AdminPaginationProps) {
  const model = getAdminPaginationModel(currentPage, totalPages);

  if (model.totalPages <= 1) return null;

  const previousDisabled = isLoading || !model.hasPrevious;
  const nextDisabled = isLoading || !model.hasNext;

  return (
    <Pagination className={className}>
      <PaginationContent className="hidden md:flex">
        <PaginationItem>
          <PaginationPrevious
            disabled={previousDisabled}
            onClick={() => onPageChange(model.currentPage - 1)}
          />
        </PaginationItem>
        {model.items.map((item, index) =>
          item === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                isActive={item === model.currentPage}
                disabled={isLoading}
                aria-label={`Go to page ${item}`}
                className={cn(
                  item === model.currentPage &&
                    'border-yellow-400 bg-yellow-400 text-zinc-950 hover:bg-yellow-400'
                )}
                onClick={() => onPageChange(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            disabled={nextDisabled}
            onClick={() => onPageChange(model.currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
      <PaginationContent className="flex w-full justify-between md:hidden">
        <PaginationItem>
          <PaginationPrevious
            disabled={previousDisabled}
            onClick={() => onPageChange(model.currentPage - 1)}
          />
        </PaginationItem>
        <PaginationItem
          className="flex items-center text-sm text-muted-foreground"
          aria-live="polite"
        >
          {model.currentPage} / {model.totalPages}
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            disabled={nextDisabled}
            onClick={() => onPageChange(model.currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
