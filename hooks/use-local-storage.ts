'use client';

import * as React from 'react';

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const { serializer = JSON.stringify, deserializer = JSON.parse } = options;

  const readValue = React.useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, deserializer]);

  const setValue = React.useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const newValue = value instanceof Function ? value(readValue()) : value;
        window.localStorage.setItem(key, serializer(newValue));
        window.dispatchEvent(
          new StorageEvent('storage', { key, newValue: serializer(newValue) as string | null })
        );
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, readValue, serializer]
  );

  const removeValue = React.useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new StorageEvent('storage', { key }));
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  React.useEffect(() => {
    setValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [readValue(), setValue, removeValue];
}
