'use client';

import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface AdminRowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  triggerLabel?: string;
  className?: string;
}

export function AdminRowActions({
  onView,
  onEdit,
  onDelete,
  viewLabel = 'View',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  triggerLabel = 'Open row actions',
  className,
}: AdminRowActionsProps) {
  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn('cursor-pointer', className)}
                aria-label={triggerLabel}
              >
                <MoreHorizontal className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>{triggerLabel}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-44">
          {onView ? (
            <DropdownMenuItem className="cursor-pointer" onSelect={onView}>
              <Eye aria-hidden="true" />
              {viewLabel}
            </DropdownMenuItem>
          ) : null}
          {onEdit ? (
            <DropdownMenuItem className="cursor-pointer" onSelect={onEdit}>
              <Pencil aria-hidden="true" />
              {editLabel}
            </DropdownMenuItem>
          ) : null}
          {onDelete && (onView || onEdit) ? <DropdownMenuSeparator /> : null}
          {onDelete ? (
            <DropdownMenuItem
              className="cursor-pointer"
              variant="destructive"
              onSelect={onDelete}
            >
              <Trash2 aria-hidden="true" />
              {deleteLabel}
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
