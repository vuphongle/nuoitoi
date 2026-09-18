'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/theme.store';

export function ThemeToggle() {
  const { toggleTheme } = useThemeStore();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/40 text-foreground backdrop-blur-xl transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Toggle color theme"
    >
      <Sun className="h-4 w-4 hidden dark:block" aria-hidden="true" />
      <Moon className="h-4 w-4 block dark:hidden" aria-hidden="true" />
    </button>
  );
}
