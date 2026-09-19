import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/constants';
import { useAuthStore } from '@/stores/auth.store';
import { createAdminSessionExpiryHandler } from './admin-session';
import { clearAdminQueryState } from './admin-query';
import { handleAdminResponse } from './admin-response-handler';
import { getQueryClient } from './query-client';

export const handleAdminSessionExpiry = createAdminSessionExpiryHandler({
  clearAdminState: () => clearAdminQueryState(getQueryClient()),
  logoutStore: () => useAuthStore.getState().logout(),
  revokeServerSession: async () => {
    if (typeof window === 'undefined') return;
    await fetch('/api/auth/logout', { method: 'POST' });
  },
  getPathname: () => (typeof window === 'undefined' ? '' : window.location.pathname),
  replaceLocation: (path) => {
    if (typeof window !== 'undefined') window.location.replace(path);
  },
});

class AdminApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      // Không set Content-Type mặc định ở đây: axios tự thêm
      // "application/json" cho payload là plain object, nhưng nếu set cứng
      // header này thì khi gửi FormData (upload file), axios sẽ tưởng cần
      // JSON và tự convert FormData -> JSON (làm mất file đính kèm).
    });

    this.instance.interceptors.response.use(
      async (response: AxiosResponse) => {
        await handleAdminResponse({
          httpStatus: response.status,
          payload: response.data,
          cleanup: handleAdminSessionExpiry,
        });
        return response;
      },
      async (error: AxiosError) => {
        await handleAdminResponse({
          httpStatus: error.response?.status,
          payload: error.response?.data,
          cleanup: handleAdminSessionExpiry,
        });
        throw error;
      }
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
    return (await this.instance.get<T>(url, { params, signal })).data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    return (await this.instance.post<T>(url, data)).data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    return (await this.instance.put<T>(url, data)).data;
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    return (await this.instance.patch<T>(url, data)).data;
  }

  async delete<T>(url: string): Promise<T> {
    return (await this.instance.delete<T>(url)).data;
  }
}

export const adminApiClient = new AdminApiClient();
