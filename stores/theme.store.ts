import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';

  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getInitialTheme = (): { theme: Theme; resolvedTheme: 'light' | 'dark' } => {
  if (typeof window === 'undefined') {
    return { theme: 'system', resolvedTheme: 'dark' };
  }

  try {
    const saved = localStorage.getItem('theme') as Theme | null;
    const theme = saved || 'system';
    const root = document.documentElement;
    const isDark =
      root.classList.contains('dark') ||
      theme === 'dark' ||
      ((!saved || theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return {
      theme,
      resolvedTheme: isDark ? 'dark' : 'light',
    };
  } catch {
    return { theme: 'system', resolvedTheme: 'dark' };
  }
};

const initial = getInitialTheme();

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initial.theme,
  resolvedTheme: initial.resolvedTheme,

  setTheme: (theme) => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
      set({ theme, resolvedTheme: systemTheme });
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      set({ theme, resolvedTheme: theme });
    }

    try {
      localStorage.setItem('theme', theme);
    } catch {}
  },

  toggleTheme: () => {
    const { resolvedTheme } = get();
    get().setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  },
}));
