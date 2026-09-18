'use client';

import * as React from 'react';
import { MessageSquare, Plus, RefreshCw, Search, Sparkles, X } from 'lucide-react';

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
import { useDeleteFeedback, useFeedbacks } from '@/hooks/use-feedbacks';
import { useI18n } from '@/hooks/useI18n';
import { getApiErrorMessage } from '@/lib/api-error';
import { FEEDBACK_TYPES, type FeedbackItem } from '@/types';
import { FeedbackDetailDialog } from './feedback-detail-dialog';
import { FeedbackFormDialog } from './feedback-form-dialog';

function typeLabel(type: string) {
  return FEEDBACK_TYPES.find((option) => option.value === type)?.label || type;
}

function FeedbackActions({
  feedback,
  onView,
  onEdit,
  onDelete,
}: {
  feedback: FeedbackItem;
  onView: (feedback: FeedbackItem) => void;
  onEdit: (feedback: FeedbackItem) => void;
  onDelete: (feedback: FeedbackItem) => void;
}) {
  const { t } = useI18n(['feedbacks', 'common']);
  return (
    <AdminRowActions
      triggerLabel={t('rowActionsTrigger', { ns: 'feedbacks', title: feedback.title })}
      viewLabel={t('admin.actions.view', { ns: 'common' })}
      editLabel={t('admin.actions.edit', { ns: 'common' })}
      deleteLabel={t('deleteLabel', { ns: 'feedbacks' })}
      onView={() => onView(feedback)}
      onEdit={() => onEdit(feedback)}
      onDelete={() => onDelete(feedback)}
    />
  );
}

interface FeedbackViewProps {
  items: FeedbackItem[];
  onView: (feedback: FeedbackItem) => void;
  onEdit: (feedback: FeedbackItem) => void;
  onDelete: (feedback: FeedbackItem) => void;
}

function FeedbackTable({ items, onView, onEdit, onDelete }: FeedbackViewProps) {
  const { t } = useI18n('feedbacks');
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.sender')}</TableHead>
          <TableHead>{t('table.type')}</TableHead>
          <TableHead>{t('table.title')}</TableHead>
          <TableHead>{t('table.createdAt')}</TableHead>
          <TableHead className="text-center">{t('table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="min-w-40 font-medium">{item.name}</TableCell>
            <TableCell>
              <Badge variant="secondary">{typeLabel(item.type)}</Badge>
            </TableCell>
            <TableCell className="min-w-64">
              <p className="truncate font-medium">{item.title}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.description}</p>
            </TableCell>
            <TableCell className="min-w-32 text-xs text-muted-foreground">
              {item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : '—'}
            </TableCell>
            <TableCell className="text-center">
              <FeedbackActions
                feedback={item}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function FeedbackMobileCards({ items, onView, onEdit, onDelete }: FeedbackViewProps) {
  const { t } = useI18n('feedbacks');
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border bg-card p-4 shadow-sm transition-all hover:border-yellow-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold">{item.title}</h2>
              <p className="mt-1 truncate text-xs text-muted-foreground">{item.name}</p>
            </div>
            <FeedbackActions feedback={item} onView={onView} onEdit={onEdit} onDelete={onDelete} />
          </div>
          <div className="mt-3">
            <Badge variant="secondary">{typeLabel(item.type)}</Badge>
          </div>
          <dl className="mt-4 grid gap-3 border-t pt-4 text-xs">
            <div>
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

export function FeedbackList() {
  const { t } = useI18n(['feedbacks', 'common']);
  const { success, error } = useNotification();
  const searchRef = React.useRef<HTMLInputElement>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [itemToEdit, setItemToEdit] = React.useState<FeedbackItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [itemToView, setItemToView] = React.useState<FeedbackItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<FeedbackItem | null>(null);

  useAdminSearchRegistration({
    inputRef: searchRef,
    placeholder: t('commandSearchPlaceholder', { ns: 'feedbacks' }),
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
  } = useFeedbacks(queryParams);
  console.log('FeedbackList response:', response); // Debugging line
  const items = response?.items || [];
  console.log('FeedbackList items:', items); // Debugging line
  const totalItem = response?.totalItem ?? 0;
  const totalPage = response?.totalPage ?? 1;

  const deleteMutation = useDeleteFeedback({
    onSuccess: () => {
      success(t('deleteSuccess', { ns: 'feedbacks' }));
      setIsDeleteOpen(false);
      setItemToDelete(null);
    },
    onError: (mutationError) =>
      error(getApiErrorMessage(mutationError, t('deleteError', { ns: 'feedbacks' }))),
  });

  const handleCreate = () => {
    setItemToEdit(null);
    setIsFormOpen(true);
  };
  const handleEdit = (item: FeedbackItem) => {
    setItemToEdit(item);
    setIsFormOpen(true);
  };
  const handleView = (item: FeedbackItem) => {
    setItemToView(item);
    setIsDetailOpen(true);
  };
  const handleDelete = (item: FeedbackItem) => {
    setItemToDelete(item);
    setIsDeleteOpen(true);
  };
  const handleConfirmDelete = () => {
    if (itemToDelete) deleteMutation.mutate(itemToDelete.id);
  };

  const bugCount = items.filter((item) => item.type === 'bug').length;
  const featureRequestCount = items.filter((item) => item.type === 'feature_request').length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        icon={<MessageSquare className="h-5 w-5" aria-hidden="true" />}
        eyebrow={t('pageEyebrow', { ns: 'feedbacks' })}
        title={t('pageTitle', { ns: 'feedbacks' })}
        description={t('pageDescription', { ns: 'feedbacks' })}
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>
              <RefreshCw className={isFetching ? 'animate-spin' : ''} aria-hidden="true" />
              {t('admin.actions.refresh', { ns: 'common' })}
            </Button>
            <Button onClick={handleCreate}>
              <Plus aria-hidden="true" />
              {t('addFeedback', { ns: 'feedbacks' })}
            </Button>
          </div>
        }
      />
      <AdminMetricGrid>
        <AdminMetricCard
          title={t('metrics.total', { ns: 'feedbacks' })}
          value={totalItem}
          icon={MessageSquare}
          trend={t('metrics.totalTrend', { ns: 'feedbacks' })}
        />
        <AdminMetricCard
          title={t('metrics.bugs', { ns: 'feedbacks' })}
          value={bugCount}
          icon={Sparkles}
          trend={t('metrics.pageTrend', { ns: 'feedbacks' })}
        />
        <AdminMetricCard
          title={t('metrics.featureRequests', { ns: 'feedbacks' })}
          value={featureRequestCount}
          icon={Sparkles}
          trend={t('metrics.pageTrend', { ns: 'feedbacks' })}
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
              placeholder={t('toolbarSearchPlaceholder', { ns: 'feedbacks' })}
              aria-label={t('searchAriaLabel', { ns: 'feedbacks' })}
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
        title={t('listTitle', { ns: 'feedbacks' })}
        description={t('listDescription', { ns: 'feedbacks', count: totalItem })}
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
            description={queryError?.message || t('loadError', { ns: 'feedbacks' })}
            onRetry={() => void refetch()}
            retryLabel={t('admin.actions.retry', { ns: 'common' })}
          />
        ) : items.length === 0 ? (
          <AdminEmptyState
            icon={MessageSquare}
            title={
              searchInput
                ? t('emptyFilteredTitle', { ns: 'feedbacks' })
                : t('emptyTitle', { ns: 'feedbacks' })
            }
            description={
              searchInput
                ? t('emptyFilteredDescription', { ns: 'feedbacks' })
                : t('emptyDescription', { ns: 'feedbacks' })
            }
            action={
              <Button onClick={searchInput ? () => setSearchInput('') : handleCreate}>
                {searchInput
                  ? t('admin.actions.clearSearch', { ns: 'common' })
                  : t('addFeedback', { ns: 'feedbacks' })}
              </Button>
            }
          />
        ) : (
          <ResponsiveDataView
            desktop={
              <FeedbackTable
                items={items}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            }
            mobile={
              <FeedbackMobileCards
                items={items}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            }
            mobileClassName="p-4"
          />
        )}
      </AdminContentCard>
      <FeedbackFormDialog
        key={itemToEdit?.id ?? 'create'}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        feedback={itemToEdit}
      />
      <FeedbackDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        feedback={itemToView}
      />
      <ModalDelete
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title={t('deleteConfirmTitle', { ns: 'feedbacks' })}
        description={t('deleteConfirmDescription', {
          ns: 'feedbacks',
          title: itemToDelete?.title || '',
        })}
        cancelText={t('admin.actions.cancel', { ns: 'common' })}
        confirmText={t('deleteConfirmButton', { ns: 'feedbacks' })}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
