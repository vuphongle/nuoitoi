'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { feedbackService, publicFeedbackService } from '@/services';
import type {
  AdminFeedbackListResponse,
  AdminFeedbackDetailResponse,
  AdminFeedbackQueryParams,
  CreateFeedbackPayload,
  UpdateFeedbackPayload,
} from '@/types';

export const FEEDBACK_QUERY_KEYS = {
  all: ['admin-feedbacks'] as const,
  lists: () => [...FEEDBACK_QUERY_KEYS.all, 'list'] as const,
  list: (params?: AdminFeedbackQueryParams) => [...FEEDBACK_QUERY_KEYS.lists(), params] as const,
  details: () => [...FEEDBACK_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number | string) => [...FEEDBACK_QUERY_KEYS.details(), String(id)] as const,
};

export function useFeedbacks(
  params?: AdminFeedbackQueryParams,
  options?: Omit<UseQueryOptions<AdminFeedbackListResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: FEEDBACK_QUERY_KEYS.list(params),
    queryFn: () => feedbackService.getFeedbacks(params),
    ...options,
  });
}

export function useFeedback(
  id: number | string,
  options?: Omit<UseQueryOptions<AdminFeedbackDetailResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: FEEDBACK_QUERY_KEYS.detail(id),
    queryFn: () => feedbackService.getFeedbackById(id),
    enabled: Boolean(id),
    ...options,
  });
}

export function useCreateFeedback(
  options?: Omit<
    UseMutationOptions<AdminFeedbackDetailResponse, Error, CreateFeedbackPayload>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => feedbackService.createFeedback(payload),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.lists() });
      // @ts-expect-error tanstack query v5 callback
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useUpdateFeedback(
  options?: Omit<
    UseMutationOptions<
      AdminFeedbackDetailResponse,
      Error,
      { id: number | string; payload: UpdateFeedbackPayload }
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => feedbackService.updateFeedback(id, payload),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.detail(variables.id) });
      // @ts-expect-error tanstack query v5 callback
      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useDeleteFeedback(
  options?: Omit<
    UseMutationOptions<{ success: boolean; message?: string }, Error, number | string>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => feedbackService.deleteFeedback(id),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: FEEDBACK_QUERY_KEYS.lists() });
      // @ts-expect-error tanstack query v5 callback
      options?.onSuccess?.(data, variables, context);
    },
  });
}

// Dùng ở trang client công khai (không cần đăng nhập).
export function useSubmitFeedback(
  options?: Omit<
    UseMutationOptions<AdminFeedbackDetailResponse, Error, CreateFeedbackPayload>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: (payload) => publicFeedbackService.submitFeedback(payload),
    ...options,
  });
}
