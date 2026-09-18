'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useThemeStore } from '@/stores/theme.store';

function Toaster(props: ToasterProps) {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  return (
    <div data-admin-portal="">
      <Sonner
        theme={resolvedTheme}
        position="top-right"
        closeButton
        richColors
        toastOptions={{
          classNames: {
            toast: 'group toast border-border bg-background text-foreground shadow-lg',
            description: 'text-muted-foreground',
            actionButton: 'bg-primary text-primary-foreground',
            cancelButton: 'bg-muted text-muted-foreground',
          },
        }}
        {...props}
      />
    </div>
  );
}

export { Toaster };
