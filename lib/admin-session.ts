export interface AdminSessionExpiryDependencies {
  clearAdminState: () => void | Promise<void>;
  logoutStore: () => void;
  revokeServerSession: () => void | Promise<void>;
  getPathname: () => string;
  replaceLocation: (path: string) => void;
}

export function createAdminSessionExpiryHandler(dependencies: AdminSessionExpiryDependencies) {
  let inFlight: Promise<void> | null = null;
  // Cleanup removes the still-mounted profile query from the cache, which makes
  // React Query immediately refetch it. That refetch fails the same way and would
  // call this handler again, looping until the redirect below actually navigates
  // away. Running the destructive cleanup only once per page load breaks that loop.
  let hasExpired = false;

  return function handleAdminSessionExpiry(): Promise<void> {
    if (hasExpired) return Promise.resolve();
    if (inFlight) return inFlight;

    inFlight = (async () => {
      hasExpired = true;
      await dependencies.clearAdminState();
      dependencies.logoutStore();

      try {
        await dependencies.revokeServerSession();
      } catch {
        // Local cleanup and navigation must still complete if the server is unavailable.
      } finally {
        if (!dependencies.getPathname().startsWith('/auth/login')) {
          dependencies.replaceLocation('/auth/login');
        }
      }
    })().finally(() => {
      inFlight = null;
    });

    return inFlight;
  };
}
