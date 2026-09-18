'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpDown, Plus, RefreshCw, Search, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AdminContentCard } from './admin-content-card';
import { AdminEmptyState, AdminErrorState } from './admin-states';
import { AdminListSkeleton } from './admin-list-skeleton';
import { AdminPageHeader } from './admin-page-header';
import { AdminPagination } from './admin-pagination';
import { AdminRowActions } from './admin-row-actions';
import { AdminToolbar } from './admin-toolbar';
import { ResponsiveDataView } from './responsive-data-view';
import { useAdminSearchRegistration } from './admin-search-context';
import { useI18n } from '@/hooks/useI18n';

export interface AdminCategoryViewItem {
  id: number;
  code: string;
  primaryName: string;
  secondaryName: string;
  sortOrder: number;
  createdAt?: string;
}

interface AdminCategoryManagerProps {
  title: string;
  description: string;
  emptyTitle: string;
  icon: LucideIcon;
  items: AdminCategoryViewItem[];
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
  onRetry: () => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
}

export function AdminCategoryManager({
  title,
  description,
  emptyTitle,
  icon: Icon,
  items,
  search,
  onSearchChange,
  onCreate,
  onEdit,
  onDelete,
  onRefresh,
  onRetry,
  page,
  totalPages,
  total,
  onPageChange,
  isLoading,
  isFetching,
  isError,
  errorMessage,
}: AdminCategoryManagerProps) {
  const { t } = useI18n();
  const searchRef = React.useRef<HTMLInputElement>(null);
  useAdminSearchRegistration({
    inputRef: searchRef,
    placeholder: t('admin.categoryManager.searchAriaLabel', { title: title.toLowerCase() }),
  });

  const table = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('admin.categoryManager.tableCode')}</TableHead>
          <TableHead>{t('admin.categoryManager.tableName')}</TableHead>
          <TableHead className="text-center">{t('admin.categoryManager.tableOrder')}</TableHead>
          <TableHead>{t('admin.categoryManager.tableCreatedAt')}</TableHead>
          <TableHead className="text-right">{t('admin.categoryManager.tableActions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Badge variant="secondary" className="font-mono">
                {item.code}
              </Badge>
            </TableCell>
            <TableCell className="min-w-64">
              <p className="font-semibold">{item.primaryName}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.secondaryName}</p>
            </TableCell>
            <TableCell className="text-center">
              <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2 py-1 font-mono text-xs">
                <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                {item.sortOrder}
              </span>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—'}
            </TableCell>
            <TableCell className="text-right">
              <AdminRowActions
                triggerLabel={t('admin.categoryManager.rowActionsTrigger', { code: item.code })}
                editLabel={t('admin.actions.edit')}
                deleteLabel={t('admin.categoryManager.deleteLabel')}
                onEdit={() => onEdit(item.id)}
                onDelete={() => onDelete(item.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const mobile = (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border bg-card p-4 shadow-sm transition-all hover:border-yellow-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Badge variant="secondary" className="font-mono">
                {item.code}
              </Badge>
              <h2 className="mt-3 truncate text-sm font-semibold">{item.primaryName}</h2>
              <p className="mt-1 truncate text-xs text-muted-foreground">{item.secondaryName}</p>
            </div>
            <AdminRowActions
              triggerLabel={t('admin.categoryManager.rowActionsTrigger', { code: item.code })}
              editLabel={t('admin.actions.edit')}
              deleteLabel={t('admin.categoryManager.deleteLabel')}
              onEdit={() => onEdit(item.id)}
              onDelete={() => onDelete(item.id)}
            />
          </div>
          <dl className="mt-4 grid grid-cols-2 border-t pt-4 text-xs">
            <div>
              <dt className="text-muted-foreground">Thứ tự</dt>
              <dd className="mt-1 font-medium">{item.sortOrder}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Ngày tạo</dt>
              <dd className="mt-1 font-medium">
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—'}
              </dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        icon={<Icon className="h-5 w-5" aria-hidden="true" />}
        eyebrow={t('admin.categoryManager.eyebrow')}
        title={title}
        description={description}
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button variant="outline" onClick={onRefresh} disabled={isFetching}>
              <RefreshCw className={isFetching ? 'animate-spin' : ''} aria-hidden="true" />
              {t('admin.actions.refresh')}
            </Button>
            <Button onClick={onCreate}>
              <Plus aria-hidden="true" />
              {t('admin.categoryManager.addCategory')}
            </Button>
          </div>
        }
      />
      <AdminToolbar
        primary={
          <div className="relative w-full sm:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              ref={searchRef}
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t('admin.categoryManager.searchPlaceholder')}
              aria-label={t('admin.categoryManager.searchAriaLabel', { title })}
              className="pr-10 pl-9"
            />
            {search ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label={t('admin.actions.clearSearch')}
                className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        }
      />
      <AdminContentCard
        title={t('admin.categoryManager.listTitle')}
        description={t('admin.categoryManager.listDescription', { total })}
        contentClassName="p-0"
        footer={
          totalPages > 1 ? (
            <AdminPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
              isLoading={isLoading}
            />
          ) : undefined
        }
      >
        {isLoading ? (
          <AdminListSkeleton className="p-4" />
        ) : isError ? (
          <AdminErrorState
            description={errorMessage}
            onRetry={onRetry}
            retryLabel={t('admin.actions.retry')}
          />
        ) : items.length === 0 ? (
          <AdminEmptyState
            icon={Icon}
            title={search ? t('admin.categoryManager.notFoundTitle') : emptyTitle}
            description={
              search
                ? t('admin.categoryManager.notFoundDescription')
                : t('admin.categoryManager.emptyDescription')
            }
            action={
              <Button onClick={search ? () => onSearchChange('') : onCreate}>
                {search ? t('admin.actions.clearSearch') : t('admin.categoryManager.addCategory')}
              </Button>
            }
          />
        ) : (
          <ResponsiveDataView desktop={table} mobile={mobile} mobileClassName="p-4" />
        )}
      </AdminContentCard>
    </div>
  );
}
