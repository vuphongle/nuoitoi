'use client';

import * as React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = React.useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const newSearch = params.toString();
      router.push(`${pathname}${newSearch ? `?${newSearch}` : ''}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const getParam = React.useCallback(
    <T extends string | number = string>(key: string): T | undefined => {
      const value = searchParams.get(key);
      return value ? (value as T) : undefined;
    },
    [searchParams]
  );

  const clearParams = React.useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    params: searchParams,
    updateParams,
    getParam,
    clearParams,
  };
}
