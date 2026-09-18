import { AdminAuthorizationError, AdminRoleError } from '../../../lib/admin-auth-response.ts';

export type LoginProfileAction = 'redirect' | 'stay' | 'cleanup-role' | 'show-error';

interface LoginProfileState {
  isFetchedAfterMount: boolean;
  isSuccess: boolean;
  profile?: { role?: string };
  error: unknown;
}

export function getLoginProfileAction({
  isFetchedAfterMount,
  isSuccess,
  profile,
  error,
}: LoginProfileState): LoginProfileAction {
  if (!isFetchedAfterMount) return 'stay';
  if (isSuccess) return profile?.role === 'admin' ? 'redirect' : 'cleanup-role';
  if (error instanceof AdminRoleError) return 'cleanup-role';
  if (error instanceof AdminAuthorizationError) return 'stay';
  if (error) return 'show-error';
  return 'stay';
}
