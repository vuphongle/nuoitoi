import { AdminAuthorizationError, AdminRoleError } from '../lib/admin-auth-response.ts';
import type { ProfileResponse, UserProfile } from '../types/user.ts';

type ProfileEnvelope = Pick<ProfileResponse, 'data'> | null | undefined;
export type ProfileRefreshWarning = { updated: true; refreshError: unknown };

export class ProfileRefreshAfterUpdateError extends Error {
  readonly cause: unknown;

  constructor(cause: unknown) {
    super('Profile update succeeded, but the refreshed profile could not be loaded');
    this.name = 'ProfileRefreshAfterUpdateError';
    this.cause = cause;
  }
}

export function extractAdminProfile(response: ProfileEnvelope): UserProfile {
  const profile = response?.data;
  if (!profile) throw new Error('Admin profile response is missing profile data');
  if (profile.role !== 'admin') throw new AdminRoleError();
  return profile;
}

export async function refreshProfileAfterPatch(
  refresh: () => Promise<UserProfile>,
  cleanupRoleFailure: () => void | Promise<void>
): Promise<UserProfile | ProfileRefreshWarning> {
  try {
    return await refresh();
  } catch (error) {
    if (error instanceof AdminAuthorizationError) {
      throw new ProfileRefreshAfterUpdateError(error);
    }
    if (error instanceof AdminRoleError) {
      await cleanupRoleFailure();
      throw new ProfileRefreshAfterUpdateError(error);
    }
    return { updated: true, refreshError: error };
  }
}
