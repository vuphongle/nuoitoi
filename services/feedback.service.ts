import { adminApiClient } from '@/lib/admin-api-client';
import type {
  AdminFeedbackListResponse,
  AdminFeedbackDetailResponse,
  AdminFeedbackQueryParams,
  CreateFeedbackPayload,
  UpdateFeedbackPayload,
  FeedbackListEnvelope,
} from '@/types';

const ENDPOINTS = {
  LIST: '/feedbacks',
  DETAIL: (id: number | string) => `/feedbacks/${id}`,
  CREATE: '/feedbacks',
  UPDATE: (id: number | string) => `/feedbacks/${id}`,
  DELETE: (id: number | string) => `/feedbacks/${id}`,
} as const;

export const feedbackService = {
  async getFeedbacks(params?: AdminFeedbackQueryParams): Promise<AdminFeedbackListResponse> {
    const response = await adminApiClient.get<FeedbackListEnvelope>(
      ENDPOINTS.LIST,
      params as Record<string, unknown>
    );
    return response.data;
  },

  async getFeedbackById(id: number | string): Promise<AdminFeedbackDetailResponse> {
    return adminApiClient.get<AdminFeedbackDetailResponse>(ENDPOINTS.DETAIL(id));
  },

  async createFeedback(payload: CreateFeedbackPayload): Promise<AdminFeedbackDetailResponse> {
    return adminApiClient.post<AdminFeedbackDetailResponse>(ENDPOINTS.CREATE, payload);
  },

  async updateFeedback(
    id: number | string,
    payload: UpdateFeedbackPayload
  ): Promise<AdminFeedbackDetailResponse> {
    return adminApiClient.patch<AdminFeedbackDetailResponse>(ENDPOINTS.UPDATE(id), payload);
  },

  async deleteFeedback(id: number | string): Promise<{ success: boolean; message?: string }> {
    return adminApiClient.delete<{ success: boolean; message?: string }>(ENDPOINTS.DELETE(id));
  },
};
