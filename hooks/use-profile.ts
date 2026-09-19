'use client';

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { handleAdminSessionExpiry } from '@/lib/admin-api-client';
import { PROFILE_QUERY_KEY } from '@/lib/query-client';
import { profileService } from '@/services/profile.service';
import { useAuthStore } from '@/stores/auth.store';
import type { UpdatePasswordPayload, UpdateProfilePayload, UserProfile } from '@/types';
import { profileQueryOptions, profileRefreshQueryOptions } from './profile-query';
import { refreshProfileAfterPatch, type ProfileRefreshWarning } from './profile-refresh';

type ProfileQueryOverrides = Omit<
  UseQueryOptions<UserProfile, Error, UserProfile, typeof PROFILE_QUERY_KEY>,
  'queryKey' | 'queryFn'
>;

export function useProfile(options?: ProfileQueryOverrides) {
  const setUser = useAuthStore((state) => state.setUser);
  const query = useQuery({ ...profileQueryOptions(), ...options });

  useEffect(() => {
    const profile = query.data;
    if (profile) setUser(profile);
  }, [query.data, setUser]);

  return query;
}

export type UpdateProfileResult = UserProfile | ProfileRefreshWarning;

let profileRefreshSequence = 0;

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<UpdateProfileResult, Error, UpdateProfilePayload | UpdatePasswordPayload>({
    mutationFn: async (payload) => {
      await queryClient.cancelQueries({ queryKey: PROFILE_QUERY_KEY });
      await profileService.updateProfile(payload);
      await queryClient.cancelQueries({ queryKey: PROFILE_QUERY_KEY });
      const refreshOptions = profileRefreshQueryOptions(++profileRefreshSequence);

      const result = await refreshProfileAfterPatch(async () => {
        try {
          return await queryClient.fetchQuery(refreshOptions);
        } finally {
          queryClient.removeQueries({ queryKey: refreshOptions.queryKey });
        }
      }, handleAdminSessionExpiry);

      if (!('updated' in result)) {
        const profile = result;
        queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
        setUser(profile);
      }

      return result;
    },
    retry: false,
  });
}
