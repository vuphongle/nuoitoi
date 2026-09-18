import { QueryClient } from '@tanstack/react-query';
import { AdminAuthorizationError } from './admin-auth-response';

export const PROFILE_QUERY_KEY = ['admin-profile'] as const;

function shouldRetry(failureCount: number, error: unknown): boolean {
  return !(error instanceof AdminAuthorizationError) && failureCount < 1;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: shouldRetry,
      },
      mutations: {
        retry: shouldRetry,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') return makeQueryClient();

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
