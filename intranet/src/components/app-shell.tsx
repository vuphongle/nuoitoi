import type { ReactNode } from 'react';

import { TopNavigation } from '@/components/top-navigation';
import { hasSupabaseEnv } from '@/lib/supabase/server';
import type { Employee } from '@/lib/types';

export function AppShell({ children, viewer }: { children: ReactNode; viewer: Employee }) {
  return (
    <div className="min-h-screen pb-24 sm:pb-10">
      <TopNavigation demoMode={!hasSupabaseEnv()} viewer={viewer} />
      <main className="app-container py-5 sm:py-8">{children}</main>
      <footer className="app-container mt-10 hidden border-t border-slate-200/70 py-7 text-center text-xs text-slate-500 sm:block">
        Nhà Mình · Một góc nhỏ để đồng nghiệp gần nhau hơn.
      </footer>
    </div>
  );
}
