'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AdminHeader } from '@/components/layout/admin-header';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';
import { useProfile } from '@/hooks/use-profile';
import { AdminAuthorizationError, AdminRoleError } from '@/lib/admin-auth-response';
import { handleAdminSessionExpiry } from '@/lib/admin-api-client';
import { AdminSearchProvider, AdminShellSkeleton } from '@/features/admin/shared/components';
import { shouldHoldAdminShell } from './admin-layout-state';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const profileQuery = useProfile({ retry: false, refetchOnMount: 'always' });

  useEffect(() => {
    if (profileQuery.error instanceof AdminRoleError) {
      handleAdminSessionExpiry().catch((error) => {
        console.error('Failed to clean up expired admin session:', error);
      });
    }
  }, [profileQuery.error]);

  if (
    shouldHoldAdminShell({
      isFetchedAfterMount: profileQuery.isFetchedAfterMount,
      isPending: profileQuery.isPending,
    })
  ) {
    return <AdminShellSkeleton label={t('profile.loading')} />;
  }

  const isAuthorizationFailure =
    profileQuery.error instanceof AdminAuthorizationError ||
    profileQuery.error instanceof AdminRoleError;

  if (profileQuery.isError) {
    if (isAuthorizationFailure) return null;

    return (
      <div className="admin-shell flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
        <div className="w-full max-w-md space-y-5 rounded-2xl border bg-card p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" aria-hidden="true" />
          <div className="space-y-2">
            <h1 className="text-xl font-semibold">{t('profile.loadErrorTitle')}</h1>
            <p className="text-sm text-muted-foreground">{t('profile.loadErrorDescription')}</p>
          </div>
          <Button onClick={() => void profileQuery.refetch()} className="min-h-11 gap-2">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {t('profile.retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AdminSearchProvider>
      <SidebarProvider
        defaultOpen={true}
        className="admin-shell min-h-screen bg-background text-foreground"
      >
        <a
          href="#admin-main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground shadow-lg transition-transform focus:translate-y-0"
        >
          {t('admin.skipToContent')}
        </a>
        <AppSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AdminHeader
            showSearch={false}
            showUser={true}
            showLangSwitcher={true}
            showThemeToggle={true}
          />
          <main
            id="admin-main"
            tabIndex={-1}
            className="flex-1 scroll-mt-20 px-4 py-6 sm:px-6 lg:px-8"
          >
            <div className="mx-auto w-full max-w-[1600px] space-y-8">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </AdminSearchProvider>
  );
}
