import { queryOptions } from '@tanstack/react-query';
import { PROFILE_QUERY_KEY } from '@/lib/query-client';
import { profileService } from '@/services/profile.service';
import { extractAdminProfile } from './profile-refresh';

async function loadAdminProfile(signal?: AbortSignal) {
  return extractAdminProfile(await profileService.getProfile(signal));
}

export function profileQueryOptions() {
  return queryOptions({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: ({ signal }) => loadAdminProfile(signal),
    retry: false,
    staleTime: 0,
  });
}

export function profileRefreshQueryOptions(sequence: number) {
  return queryOptions({
    queryKey: [...PROFILE_QUERY_KEY, 'post-update', sequence] as const,
    queryFn: ({ signal }) => loadAdminProfile(signal),
    retry: false,
    staleTime: 0,
  });
}
