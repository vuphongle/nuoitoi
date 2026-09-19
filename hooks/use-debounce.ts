'use client';

import * as React from 'react';
import { flushSync } from 'react-dom';

interface UseDebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

export function useDebounce<T>(value: T, delay: number, options: UseDebounceOptions = {}): T {
  const { leading = false, trailing = true } = options;
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    if (leading && !trailing) {
      flushSync(() => setDebouncedValue(value));
      return;
    }

    const timer = setTimeout(() => {
      if (trailing) {
        setDebouncedValue(value);
      }
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, leading, trailing]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return React.useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
