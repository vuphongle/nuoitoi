import { apiClient } from '@/lib/api-client';
import type { LixiSessionItem, PublicLixiSessionListResponse } from '@/types';

const ENDPOINTS = {
  LIST: '/public/lixi-sessions',
} as const;

export const publicLixiSessionService = {
  async getLixiSessions(): Promise<LixiSessionItem[]> {
    const response = await apiClient.get<PublicLixiSessionListResponse>(ENDPOINTS.LIST);
    return response.data;
  },
};
