import type { Query, QueryClient } from '@tanstack/react-query';

type AdminQueryClient = Pick<QueryClient, 'cancelQueries' | 'removeQueries' | 'getMutationCache'>;

export function isAdminQueryKey(queryKey: readonly unknown[]): boolean {
  return typeof queryKey[0] === 'string' && queryKey[0].startsWith('admin-');
}

export function clearAdminQueryState(queryClient: AdminQueryClient): void {
  const predicate = (query: Query) => isAdminQueryKey(query.queryKey);
  void queryClient.cancelQueries({ predicate }).catch(() => undefined);
  queryClient.removeQueries({ predicate });
  queryClient.getMutationCache().clear();
}
