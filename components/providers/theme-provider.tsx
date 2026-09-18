'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme.store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { setTheme, theme } = useThemeStore();

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    setTheme(savedTheme || 'system');
  }, [setTheme]);

  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystemTheme = () => setTheme('system');

    mediaQuery.addEventListener('change', syncSystemTheme);
    return () => mediaQuery.removeEventListener('change', syncSystemTheme);
  }, [setTheme, theme]);

  return children;
}
