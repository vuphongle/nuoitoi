'use client';

import * as React from 'react';
import { Mail, Phone, Plus, RefreshCw, Search, Shield, UserRound, Users, X } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  AdminStatusBadge,
  AdminToolbar,
  ResponsiveDataView,
  useAdminSearchRegistration,
} from '@/features/admin/shared';
import { useDeleteUser, useUsers } from '@/hooks/use-users';
import { useI18n } from '@/hooks/useI18n';
import { getApiErrorMessage } from '@/lib/api-error';
import { useAuthStore } from '@/stores/auth.store';
import type { UserItem, UserProfile } from '@/types';
import { UserDetailDialog } from './user-detail-dialog';
import { UserFormDialog } from './user-form-dialog';

type CurrentUser = Partial<UserProfile> | null;

function getUserRowPermissions(user: UserItem, currentUser: CurrentUser) {
  const isSelf = currentUser?.id !== undefined && String(currentUser.id) === String(user.id);
  const isSameRole =
    Boolean(currentUser?.role) && user.role?.toLowerCase() === currentUser?.role?.toLowerCase();

  return {
    isSelf,
    isSameRole,
    disableEdit: isSameRole,
    disableDelete: isSameRole || isSelf,
  };
}

function initials(name: string, email: string) {
  const value = name.trim() || email;
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function UserAvatar({ user }: { user: UserItem }) {
  return (
    <Avatar className="h-10 w-10 border">
      <AvatarImage src={user.avatar} alt="" />
      <AvatarFallback>{initials(user.name, user.email)}</AvatarFallback>
    </Avatar>
  );
}

function UserActions({
  user,
  currentUser,
  onView,
  onEdit,
  onDelete,
}: {
  user: UserItem;
  currentUser: CurrentUser;
  onView: (user: UserItem) => void;
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
}) {
  const { t } = useI18n(['users', 'common']);
  const { isSelf, isSameRole, disableEdit, disableDelete } = getUserRowPermissions(
    user,
    currentUser
  );

  const deleteDisabledReason = isSelf
    ? t('cannotDeleteSelf', { ns: 'users' })
    : isSameRole
      ? t('cannotDeleteSameRole', { ns: 'users' })
      : undefined;

  return (
    <AdminRowActions
      triggerLabel={t('rowActionsTrigger', { ns: 'users', name: user.name || user.email })}
      viewLabel={t('admin.actions.view', { ns: 'common' })}
      editLabel={t('admin.actions.edit', { ns: 'common' })}
      deleteLabel={t('deleteLabel', { ns: 'users' })}
      onView={() => onView(user)}
      onEdit={() => onEdit(user)}
      onDelete={() => onDelete(user)}
      editDisabled={disableEdit}
      editDisabledReason={isSameRole ? t('cannotEditSameRole', { ns: 'users' }) : undefined}
      deleteDisabled={disableDelete}
      deleteDisabledReason={deleteDisabledReason}
    />
  );
}

interface UserViewProps {
  users: UserItem[];
  currentUser: CurrentUser;
  onView: (user: UserItem) => void;
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
}

function UserTable({ users, currentUser, onView, onEdit, onDelete }: UserViewProps) {
  const { t } = useI18n('users');
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.user')}</TableHead>
          <TableHead>{t('table.phone')}</TableHead>
          <TableHead>{t('table.role')}</TableHead>
          <TableHead>{t('table.gender')}</TableHead>
          <TableHead>{t('table.birthDay')}</TableHead>
          <TableHead>{t('table.createdAt')}</TableHead>
          <TableHead className="text-center">
            <span className="block">{t('table.actions')}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="min-w-64">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{user.name || t('unnamed')}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="min-w-36 text-sm text-muted-foreground">
              {user.phone || '—'}
            </TableCell>
            <TableCell>
              <AdminStatusBadge
                status={user.role}
                label={
                  user.role === 'admin'
                    ? t('roles.admin')
                    : user.role === 'editor'
                      ? t('roles.editor')
                      : t('roles.user')
                }
              />
            </TableCell>
            <TableCell className="text-sm">
              {user.gender?.toLowerCase() === 'male'
                ? t('genders.male')
                : user.gender?.toLowerCase() === 'female'
                  ? t('genders.female')
                  : user.gender
                    ? t('genders.other')
                    : '—'}
            </TableCell>
            <TableCell className="min-w-28 text-xs text-muted-foreground">
              {user.birth_day || '—'}
            </TableCell>
            <TableCell className="min-w-32 text-xs text-muted-foreground">
              {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : '—'}
            </TableCell>
            <TableCell className="text-center">
              <UserActions
                user={user}
                currentUser={currentUser}
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

function UserMobileCards({ users, currentUser, onView, onEdit, onDelete }: UserViewProps) {
  const { t } = useI18n('users');
  return (
    <div className="space-y-3">
      {users.map((user) => (
        <article
          key={user.id}
          className="rounded-2xl border bg-card p-4 shadow-sm transition-all hover:border-yellow-300 hover:shadow-md"
        >
          <div className="flex items-start gap-3">
            <UserAvatar user={user} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold">{user.name || t('unnamed')}</h2>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
                <UserActions
                  user={user}
                  currentUser={currentUser}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
              <div className="mt-3">
                <AdminStatusBadge
                  status={user.role}
                  label={
                    user.role === 'admin'
                      ? t('roles.admin')
                      : user.role === 'editor'
                        ? t('roles.editor')
                        : t('roles.user')
                  }
                />
              </div>
            </div>
          </div>
          <dl className="mt-4 grid gap-3 border-t pt-4 text-xs sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">{t('table.phone')}</dt>
              <dd className="mt-1 font-medium">{user.phone || '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t('table.gender')}</dt>
              <dd className="mt-1 font-medium">
                {user.gender?.toLowerCase() === 'male'
                  ? t('genders.male')
                  : user.gender?.toLowerCase() === 'female'
                    ? t('genders.female')
                    : user.gender
                      ? t('genders.other')
                      : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t('table.birthDay')}</dt>
              <dd className="mt-1 font-medium">{user.birth_day || '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t('table.createdAt')}</dt>
              <dd className="mt-1 font-medium">
                {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : '—'}
              </dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

export function UserList() {
  const { t } = useI18n(['users', 'common']);
  const { success, error } = useNotification();
  const currentUser = useAuthStore((state) => state.user);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [userToEdit, setUserToEdit] = React.useState<UserItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [userToView, setUserToView] = React.useState<UserItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<UserItem | null>(null);
  useAdminSearchRegistration({
    inputRef: searchRef,
    placeholder: t('commandSearchPlaceholder', { ns: 'users' }),
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
  } = useUsers(queryParams);
  const users = response?.items || [];
  const totalItem = response?.totalItem ?? 0;
  const totalPage = response?.totalPage ?? 1;
  const deleteMutation = useDeleteUser({
    onSuccess: () => {
      success(t('deleteSuccess', { ns: 'users' }));
      setIsDeleteOpen(false);
      setUserToDelete(null);
    },
    onError: (mutationError) =>
      error(getApiErrorMessage(mutationError, t('deleteError', { ns: 'users' }))),
  });
  const handleCreate = () => {
    setUserToEdit(null);
    setIsFormOpen(true);
  };
  const handleEdit = (user: UserItem) => {
    setUserToEdit(user);
    setIsFormOpen(true);
  };
  const handleView = (user: UserItem) => {
    setUserToView(user);
    setIsDetailOpen(true);
  };
  const handleDelete = (user: UserItem) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };
  const handleConfirmDelete = () => {
    if (userToDelete) deleteMutation.mutate(userToDelete.id);
  };
  const admins = users.filter((user) => user.role === 'admin').length;
  const editors = users.filter((user) => user.role === 'editor').length;
  const withPhone = users.filter((user) => Boolean(user.phone)).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        icon={<Users className="h-5 w-5" aria-hidden="true" />}
        eyebrow={t('pageEyebrow', { ns: 'users' })}
        title={t('pageTitle', { ns: 'users' })}
        description={t('pageDescription', { ns: 'users' })}
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>
              <RefreshCw className={isFetching ? 'animate-spin' : ''} aria-hidden="true" />
              {t('admin.actions.refresh', { ns: 'common' })}
            </Button>
            <Button onClick={handleCreate}>
              <Plus aria-hidden="true" />
              {t('addUser', { ns: 'users' })}
            </Button>
          </div>
        }
      />
      <AdminMetricGrid>
        <AdminMetricCard
          title={t('metrics.total', { ns: 'users' })}
          value={totalItem}
          icon={Users}
          trend={t('metrics.totalTrend', { ns: 'users' })}
        />
        <AdminMetricCard
          title={t('metrics.admins', { ns: 'users' })}
          value={admins}
          icon={Shield}
          trend={t('metrics.pageTrend', { ns: 'users' })}
        />
        <AdminMetricCard
          title={t('metrics.editors', { ns: 'users' })}
          value={editors}
          icon={UserRound}
          trend={t('metrics.pageTrend', { ns: 'users' })}
        />
        <AdminMetricCard
          title={t('metrics.withPhone', { ns: 'users' })}
          value={withPhone}
          icon={Phone}
          trend={t('metrics.pageTrend', { ns: 'users' })}
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
              placeholder={t('toolbarSearchPlaceholder', { ns: 'users' })}
              aria-label={t('searchAriaLabel', { ns: 'users' })}
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
        title={t('listTitle', { ns: 'users' })}
        description={t('listDescription', { ns: 'users', count: totalItem })}
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
            description={queryError?.message || t('loadError', { ns: 'users' })}
            onRetry={() => void refetch()}
            retryLabel={t('admin.actions.retry', { ns: 'common' })}
          />
        ) : users.length === 0 ? (
          <AdminEmptyState
            icon={Mail}
            title={
              searchInput
                ? t('emptyFilteredTitle', { ns: 'users' })
                : t('emptyTitle', { ns: 'users' })
            }
            description={
              searchInput
                ? t('emptyFilteredDescription', { ns: 'users' })
                : t('emptyDescription', { ns: 'users' })
            }
            action={
              <Button onClick={searchInput ? () => setSearchInput('') : handleCreate}>
                {searchInput
                  ? t('admin.actions.clearSearch', { ns: 'common' })
                  : t('addUser', { ns: 'users' })}
              </Button>
            }
          />
        ) : (
          <ResponsiveDataView
            desktop={
              <UserTable
                users={users}
                currentUser={currentUser}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            }
            mobile={
              <UserMobileCards
                users={users}
                currentUser={currentUser}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            }
            mobileClassName="p-4"
          />
        )}
      </AdminContentCard>
      <UserFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} user={userToEdit} />
      <UserDetailDialog open={isDetailOpen} onOpenChange={setIsDetailOpen} user={userToView} />
      <ModalDelete
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title={t('deleteConfirmTitle', { ns: 'users' })}
        description={t('deleteConfirmDescription', {
          ns: 'users',
          name: userToDelete?.name || userToDelete?.email || '',
        })}
        cancelText={t('admin.actions.cancel', { ns: 'common' })}
        confirmText={t('deleteConfirmButton', { ns: 'users' })}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
