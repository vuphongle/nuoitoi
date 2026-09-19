import { adminApiClient } from '@/lib/admin-api-client';
import type {
  AdminUserListResponse,
  AdminUserDetailResponse,
  AdminUserQueryParams,
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
} from '@/types';

const ENDPOINTS = {
  LIST: '/users',
  DETAIL: (id: number | string) => `/users/${id}`,
  CREATE: '/users',
  UPDATE: (id: number | string) => `/users/${id}`,
  DELETE: (id: number | string) => `/users/${id}`,
} as const;

export const userService = {
  async getUsers(params?: AdminUserQueryParams): Promise<AdminUserListResponse> {
    return adminApiClient.get<AdminUserListResponse>(
      ENDPOINTS.LIST,
      params as Record<string, unknown>
    );
  },

  async getUserById(id: number | string): Promise<AdminUserDetailResponse> {
    return adminApiClient.get<AdminUserDetailResponse>(ENDPOINTS.DETAIL(id));
  },

  async createUser(payload: CreateAdminUserPayload): Promise<AdminUserDetailResponse> {
    return adminApiClient.post<AdminUserDetailResponse>(ENDPOINTS.CREATE, payload);
  },

  async updateUser(
    id: number | string,
    payload: UpdateAdminUserPayload
  ): Promise<AdminUserDetailResponse> {
    return adminApiClient.patch<AdminUserDetailResponse>(ENDPOINTS.UPDATE(id), payload);
  },

  async deleteUser(id: number | string): Promise<{ success: boolean; message?: string }> {
    return adminApiClient.delete<{ success: boolean; message?: string }>(ENDPOINTS.DELETE(id));
  },
};
