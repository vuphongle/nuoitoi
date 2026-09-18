'use client';

import * as React from 'react';
import { Gift, Plus, RefreshCw, Search, Wallet, X } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModalDelete } from '@/components/ui/modal-delete';
import { useNotification } from '@/components/ui/notification';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AdminContentCard,
  AdminEmptyState,
  AdminErrorState,
  AdminListSkeleton,
  AdminMetricCard,
  AdminMetricGrid,
  AdminPageHeader,
  AdminPagination,
  AdminRowActions,
  AdminToolbar,
  ResponsiveDataView,
  useAdminSearchRegistration,
} from '@/features/admin/shared';
import { useDeleteLixiSession, useLixiSessions } from '@/hooks/use-lixi-sessions';
import { useI18n } from '@/hooks/useI18n';
import { getApiErrorMessage } from '@/lib/api-error';
import type { LixiSessionItem } from '@/types';
import { LixiSessionFormDialog } from './lixi-session-form-dialog';

function LixiSessionAvatar({ item }: { item: LixiSessionItem }) {
  return (
    <Avatar className="h-10 w-10 border">
      <AvatarImage src={item.avatar} alt="" />
      <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

function LixiSessionActions({
  item,
  onEdit,
  onDelete,
}: {
  item: LixiSessionItem;
  onEdit: (item: LixiSessionItem) => void;
  onDelete: (item: LixiSessionItem) => void;
}) {
  const { t } = useI18n(['lixiSessions', 'common']);
  return (
    <AdminRowActions
      triggerLabel={t('rowActionsTrigger', { ns: 'lixiSessions', name: item.name })}
      editLabel={t('admin.actions.edit', { ns: 'common' })}
      deleteLabel={t('deleteLabel', { ns: 'lixiSessions' })}
      onEdit={() => onEdit(item)}
      onDelete={() => onDelete(item)}
    />
  );
}

interface LixiSessionViewProps {
  items: LixiSessionItem[];
  onEdit: (item: LixiSessionItem) => void;
  onDelete: (item: LixiSessionItem) => void;
}

function LixiSessionTable({ items, onEdit, onDelete }: LixiSessionViewProps) {
  const { t } = useI18n('lixiSessions');
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.session')}</TableHead>
          <TableHead>{t('table.bankAccount')}</TableHead>
          <TableHead className="text-center">{t('table.sortOrder')}</TableHead>
          <TableHead>{t('table.createdAt')}</TableHead>
          <TableHead className="text-center">{t('table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="min-w-64">
              <div className="flex items-center gap-3">
                <LixiSessionAvatar item={item} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{item.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.tagline}</p>
                  <Badge variant="secondary" className="mt-1 font-mono">
                    {item.code}
                  </Badge>
                </div>
              </div>
            </TableCell>
            <TableCell className="min-w-48 text-sm">
              <p className="font-medium">{item.bank}</p>
              <p className="text-xs text-muted-foreground">
                {item.account} · {item.owner}
              </p>
            </TableCell>
            <TableCell className="text-center">
              <span className="inline-flex items-center rounded-lg bg-muted px-2 py-1 font-mono text-xs">
                {item.sort_order}
              </span>
            </TableCell>
            <TableCell className="min-w-32 text-xs text-muted-foreground">
              {item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : '—'}
            </TableCell>
            <TableCell className="text-center">
              <LixiSessionActions item={item} onEdit={onEdit} onDelete={onDelete} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function LixiSessionMobileCards({ items, onEdit, onDelete }: LixiSessionViewProps) {
  const { t } = useI18n('lixiSessions');
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border bg-card p-4 shadow-sm transition-all hover:border-yellow-300 hover:shadow-md"
        >
          <div className="flex items-start gap-3">
            <LixiSessionAvatar item={item} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold">{item.name}</h2>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{item.tagline}</p>
                </div>
                <LixiSessionActions item={item} onEdit={onEdit} onDelete={onDelete} />
              </div>
              <Badge variant="secondary" className="mt-2 font-mono">
                {item.code}
              </Badge>
            </div>
          </div>
          <dl className="mt-4 grid gap-3 border-t pt-4 text-xs sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">{t('table.bankAccount')}</dt>
              <dd className="mt-1 font-medium">
                {item.bank} · {item.account}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t('table.sortOrder')}</dt>
              <dd className="mt-1 font-medium">{item.sort_order}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">{t('table.createdAt')}</dt>
              <dd className="mt-1 font-medium">
                {item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : '—'}
              </dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

export function LixiSessionList() {
  const { t } = useI18n(['lixiSessions', 'common']);
  const { success, error } = useNotification();
  const searchRef = React.useRef<HTMLInputElement>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [itemToEdit, setItemToEdit] = React.useState<LixiSessionItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<LixiSessionItem | null>(null);

  useAdminSearchRegistration({
    inputRef: searchRef,
    placeholder: t('commandSearchPlaceholder', { ns: 'lixiSessions' }),
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = { page, pageSize, keyword: debouncedSearch || undefined };
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error: queryError,
    refetch,
  } = useLixiSessions(queryParams);
  const items = response?.items || [];
  const totalItem = response?.totalItem ?? 0;
  const totalPage = response?.totalPage ?? 1;

  const deleteMutation = useDeleteLixiSession({
    onSuccess: () => {
      success(t('deleteSuccess', { ns: 'lixiSessions' }));
      setIsDeleteOpen(false);
      setItemToDelete(null);
    },
    onError: (mutationError) =>
      error(getApiErrorMessage(mutationError, t('deleteError', { ns: 'lixiSessions' }))),
  });

  const handleCreate = () => {
    setItemToEdit(null);
    setIsFormOpen(true);
  };
  const handleEdit = (item: LixiSessionItem) => {
    setItemToEdit(item);
    setIsFormOpen(true);
  };
  const handleDelete = (item: LixiSessionItem) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };
  const handleConfirmDelete = () => {
    if (itemToDelete) deleteMutation.mutate(itemToDelete.id);
  };

  const totalSortOrderZero = items.filter((item) => item.sort_order === 0).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        icon={<Gift className="h-5 w-5" aria-hidden="true" />}
        eyebrow={t('pageEyebrow', { ns: 'lixiSessions' })}
        title={t('pageTitle', { ns: 'lixiSessions' })}
        description={t('pageDescription', { ns: 'lixiSessions' })}
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>
              <RefreshCw className={isFetching ? 'animate-spin' : ''} aria-hidden="true" />
              {t('admin.actions.refresh', { ns: 'common' })}
            </Button>
            <Button onClick={handleCreate}>
              <Plus aria-hidden="true" />
              {t('addSession', { ns: 'lixiSessions' })}
            </Button>
          </div>
        }
      />
      <AdminMetricGrid>
        <AdminMetricCard
          title={t('metrics.total', { ns: 'lixiSessions' })}
          value={totalItem}
          icon={Gift}
          trend={t('metrics.totalTrend', { ns: 'lixiSessions' })}
        />
        <AdminMetricCard
          title={t('metrics.onThisPage', { ns: 'lixiSessions' })}
          value={items.length}
          icon={Wallet}
          trend={t('metrics.pageTrend', { ns: 'lixiSessions' })}
        />
        <AdminMetricCard
          title={t('metrics.defaultOrder', { ns: 'lixiSessions' })}
          value={totalSortOrderZero}
          icon={Wallet}
          trend={t('metrics.pageTrend', { ns: 'lixiSessions' })}
        />
      </AdminMetricGrid>
      <AdminToolbar
        primary={
          <div className="relative w-full sm:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              ref={searchRef}
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={t('toolbarSearchPlaceholder', { ns: 'lixiSessions' })}
              aria-label={t('searchAriaLabel', { ns: 'lixiSessions' })}
              className="pr-10 pl-9"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                aria-label={t('admin.actions.clearSearch', { ns: 'common' })}
                className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        }
      />
      <AdminContentCard
        title={t('listTitle', { ns: 'lixiSessions' })}
        description={t('listDescription', { ns: 'lixiSessions', count: totalItem })}
        action={
          isFetching && !isLoading ? (
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              {t('admin.actions.syncing', { ns: 'common' })}
            </span>
          ) : undefined
        }
        contentClassName="p-0"
        footer={
          totalPage > 1 ? (
            <AdminPagination
              currentPage={page}
              totalPages={totalPage}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          ) : undefined
        }
      >
        {isLoading ? (
          <AdminListSkeleton className="p-4" />
        ) : isError ? (
          <AdminErrorState
            description={queryError?.message || t('loadError', { ns: 'lixiSessions' })}
            onRetry={() => void refetch()}
            retryLabel={t('admin.actions.retry', { ns: 'common' })}
          />
        ) : items.length === 0 ? (
          <AdminEmptyState
            icon={Gift}
            title={
              searchInput
                ? t('emptyFilteredTitle', { ns: 'lixiSessions' })
                : t('emptyTitle', { ns: 'lixiSessions' })
            }
            description={
              searchInput
                ? t('emptyFilteredDescription', { ns: 'lixiSessions' })
                : t('emptyDescription', { ns: 'lixiSessions' })
            }
            action={
              <Button onClick={searchInput ? () => setSearchInput('') : handleCreate}>
                {searchInput
                  ? t('admin.actions.clearSearch', { ns: 'common' })
                  : t('addSession', { ns: 'lixiSessions' })}
              </Button>
            }
          />
        ) : (
          <ResponsiveDataView
            desktop={<LixiSessionTable items={items} onEdit={handleEdit} onDelete={handleDelete} />}
            mobile={
              <LixiSessionMobileCards items={items} onEdit={handleEdit} onDelete={handleDelete} />
            }
            mobileClassName="p-4"
          />
        )}
      </AdminContentCard>
      <LixiSessionFormDialog
        key={itemToEdit?.id ?? 'create'}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        lixiSession={itemToEdit}
      />
      <ModalDelete
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title={t('deleteConfirmTitle', { ns: 'lixiSessions' })}
        description={t('deleteConfirmDescription', {
          ns: 'lixiSessions',
          name: itemToDelete?.name || '',
        })}
        cancelText={t('admin.actions.cancel', { ns: 'common' })}
        confirmText={t('deleteConfirmButton', { ns: 'lixiSessions' })}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
