'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { lixiSessionService, publicLixiSessionService } from '@/services';
import type {
  AdminLixiSessionListResponse,
  AdminLixiSessionDetailResponse,
  AdminLixiSessionQueryParams,
  LixiSessionItem,
} from '@/types';

export const LIXI_SESSION_QUERY_KEYS = {
  all: ['admin-lixi-sessions'] as const,
  lists: () => [...LIXI_SESSION_QUERY_KEYS.all, 'list'] as const,
  list: (params?: AdminLixiSessionQueryParams) =>
    [...LIXI_SESSION_QUERY_KEYS.lists(), params] as const,
  details: () => [...LIXI_SESSION_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number | string) => [...LIXI_SESSION_QUERY_KEYS.details(), String(id)] as const,
};

export function useLixiSessions(
  params?: AdminLixiSessionQueryParams,
  options?: Omit<UseQueryOptions<AdminLixiSessionListResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: LIXI_SESSION_QUERY_KEYS.list(params),
    queryFn: () => lixiSessionService.getLixiSessions(params),
    ...options,
  });
}

export function useLixiSession(
  id: number | string,
  options?: Omit<UseQueryOptions<AdminLixiSessionDetailResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: LIXI_SESSION_QUERY_KEYS.detail(id),
    queryFn: () => lixiSessionService.getLixiSessionById(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useCreateLixiSession(
  options?: Omit<UseMutationOptions<AdminLixiSessionDetailResponse, Error, FormData>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => lixiSessionService.createLixiSession(formData),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: LIXI_SESSION_QUERY_KEYS.lists() });
      // @ts-expect-error tanstack query v5 callback
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useUpdateLixiSession(
  options?: Omit<
    UseMutationOptions<
      AdminLixiSessionDetailResponse,
      Error,
      { id: number | string; formData: FormData }
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => lixiSessionService.updateLixiSession(id, formData),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: LIXI_SESSION_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: LIXI_SESSION_QUERY_KEYS.detail(variables.id) });
      // @ts-expect-error tanstack query v5 callback
      options?.onSuccess?.(data, variables, context);
    },
  });
}

// Dùng ở trang client công khai (không cần đăng nhập) - danh sách hiển thị trên trang chủ.
export function usePublicLixiSessions(
  options?: Omit<UseQueryOptions<LixiSessionItem[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['public-lixi-sessions'] as const,
    queryFn: () => publicLixiSessionService.getLixiSessions(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useDeleteLixiSession(
  options?: Omit<
    UseMutationOptions<{ success: boolean; message?: string }, Error, number | string>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => lixiSessionService.deleteLixiSession(id),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: LIXI_SESSION_QUERY_KEYS.lists() });
      // @ts-expect-error tanstack query v5 callback
      options?.onSuccess?.(data, variables, context);
    },
  });
}
