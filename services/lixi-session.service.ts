import { adminApiClient } from '@/lib/admin-api-client';
import type {
  AdminLixiSessionListResponse,
  AdminLixiSessionDetailResponse,
  AdminLixiSessionQueryParams,
  LixiSessionListEnvelope,
} from '@/types';

const ENDPOINTS = {
  LIST: '/lixi-sessions',
  DETAIL: (id: number | string) => `/lixi-sessions/${id}`,
  CREATE: '/lixi-sessions',
  UPDATE: (id: number | string) => `/lixi-sessions/${id}`,
  DELETE: (id: number | string) => `/lixi-sessions/${id}`,
} as const;

export const lixiSessionService = {
  async getLixiSessions(
    params?: AdminLixiSessionQueryParams
  ): Promise<AdminLixiSessionListResponse> {
    const response = await adminApiClient.get<LixiSessionListEnvelope>(
      ENDPOINTS.LIST,
      params as Record<string, unknown>
    );
    return response.data;
  },

  async getLixiSessionById(id: number | string): Promise<AdminLixiSessionDetailResponse> {
    return adminApiClient.get<AdminLixiSessionDetailResponse>(ENDPOINTS.DETAIL(id));
  },

  // formData phải chứa các field text (code, name, tagline, bank, account, owner, content,
  // sort_order) cùng 2 file qr, avatar - backend nhận multipart/form-data.
  async createLixiSession(formData: FormData): Promise<AdminLixiSessionDetailResponse> {
    return adminApiClient.post<AdminLixiSessionDetailResponse>(ENDPOINTS.CREATE, formData);
  },

  async updateLixiSession(
    id: number | string,
    formData: FormData
  ): Promise<AdminLixiSessionDetailResponse> {
    return adminApiClient.patch<AdminLixiSessionDetailResponse>(ENDPOINTS.UPDATE(id), formData);
  },

  async deleteLixiSession(id: number | string): Promise<{ success: boolean; message?: string }> {
    return adminApiClient.delete<{ success: boolean; message?: string }>(ENDPOINTS.DELETE(id));
  },
};
