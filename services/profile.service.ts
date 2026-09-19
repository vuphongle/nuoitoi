import { adminApiClient } from '@/lib/admin-api-client';
import type { ProfileResponse, UpdatePasswordPayload, UpdateProfilePayload } from '@/types';

export const profileService = {
  getProfile(signal?: AbortSignal): Promise<ProfileResponse> {
    return adminApiClient.get<ProfileResponse>('/users/profile', undefined, signal);
  },

  updateProfile(payload: UpdateProfilePayload | UpdatePasswordPayload): Promise<ProfileResponse> {
    return adminApiClient.patch<ProfileResponse>('/users/profile', payload);
  },
};
