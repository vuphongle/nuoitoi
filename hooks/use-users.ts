'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { userService } from '@/services';
import type {
  AdminUserListResponse,
  AdminUserDetailResponse,
  AdminUserQueryParams,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from '@/types';

export const USER_QUERY_KEYS = {
  all: ['admin-users'] as const,
  lists: () => [...USER_QUERY_KEYS.all, 'list'] as const,
  list: (params?: AdminUserQueryParams) =>
    [...USER_QUERY_KEYS.lists(), params] as const,
  details: () => [...USER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number | string) =>
    [...USER_QUERY_KEYS.details(), String(id)] as const,
};

export function useUsers(
  params?: AdminUserQueryParams,
  options?: Omit<
    UseQueryOptions<AdminUserListResponse, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(params),
    queryFn: () => userService.getUsers(params),
    ...options,
  });
}

export function useUser(
  id: number | string,
  options?: Omit<
    UseQueryOptions<AdminUserDetailResponse, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useCreateUser(
  options?: Omit<
    UseMutationOptions<
      AdminUserDetailResponse,
      Error,
      CreateAdminUserPayload
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => userService.createUser(payload),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      // @ts-expect-error tanstack query v5 callback
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useUpdateUser(
  options?: Omit<
    UseMutationOptions<
      AdminUserDetailResponse,
      Error,
      { id: number | string; payload: UpdateAdminUserPayload }
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => userService.updateUser(id, payload),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.detail(variables.id),
      });
      // @ts-expect-error tanstack query v5 callback
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useDeleteUser(
  options?: Omit<
    UseMutationOptions<
      { success: boolean; message?: string },
      Error,
      number | string
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userService.deleteUser(id),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      // @ts-expect-error tanstack query v5 callback
      options?.onSuccess?.(data, variables, context);
    },
  });
}
