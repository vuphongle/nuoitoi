import { apiClient } from '@/lib/api-client';
import type { AdminFeedbackDetailResponse, CreateFeedbackPayload } from '@/types';

const ENDPOINTS = {
  CREATE: '/feedbacks',
} as const;

// Dùng ở trang client công khai - không cần đăng nhập, không đính kèm cookie admin.
export const publicFeedbackService = {
  async submitFeedback(payload: CreateFeedbackPayload): Promise<AdminFeedbackDetailResponse> {
    return apiClient.post<AdminFeedbackDetailResponse>(ENDPOINTS.CREATE, payload);
  },
};
