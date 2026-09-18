'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Check, ChevronRight, LogOut, Moon, Search, Sun, X } from 'lucide-react';

import { ThemeToggle } from '@/components/site/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/constants';
import { useAdminSearch } from '@/features/admin/shared/components';
import { useI18n } from '@/hooks/useI18n';
import { clearAdminQueryState } from '@/lib/admin-query';
import { icons, LANGUAGES } from '@/shared/assets';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';

interface AdminHeaderProps {
  title?: string;
  showSearch?: boolean;
  showUser?: boolean;
  showLangSwitcher?: boolean;
  showThemeToggle?: boolean;
}

const routeLabelKeys: Record<string, string> = {
  users: 'users',
  settings: 'settings',
};

function readableSegment(segment: string) {
  return decodeURIComponent(segment)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function AdminBreadcrumbs({ fallbackTitle }: { fallbackTitle: string }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const segments = pathname.split('/').filter(Boolean).slice(1);
  const breadcrumbs = segments.map((segment, index) => {
    const labelKey = routeLabelKeys[segment];
    const label = labelKey ? t(`sidebar.${labelKey}`) : readableSegment(segment);

    return { label, href: `/admin/${segments.slice(0, index + 1).join('/')}` };
  });
  const currentTitle = breadcrumbs.at(-1)?.label ?? fallbackTitle;

  return (
    <>
      <span className="truncate text-sm font-semibold md:hidden">{currentTitle}</span>
      <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1 text-sm md:flex">
        <Link href="/admin/users" className="text-muted-foreground hover:text-foreground">
          {t('admin.header.breadcrumbRoot')}
        </Link>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            {index === breadcrumbs.length - 1 ? (
              <span className="truncate font-medium">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="truncate text-muted-foreground hover:text-foreground"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
}

interface MobilePreferencesProps {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
  showLangSwitcher: boolean;
  showThemeToggle: boolean;
  t: (key: string) => string;
}

function MobilePreferences({
  currentLanguage,
  changeLanguage,
  showLangSwitcher,
  showThemeToggle,
  t,
}: MobilePreferencesProps) {
  const { resolvedTheme, toggleTheme } = useThemeStore();

  if (!showLangSwitcher && !showThemeToggle) return null;

  return (
    <>
      <DropdownMenuSeparator className="sm:hidden" />
      {showLangSwitcher ? (
        <>
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground sm:hidden">
            {t('admin.header.languageMobile')}
          </div>
          {LANGUAGES.map((language) => (
            <DropdownMenuItem
              key={language.code}
              className="sm:hidden"
              onClick={() => changeLanguage(language.code)}
            >
              <Image src={language.icon} alt="" width={16} height={16} />
              <span>{t(language.label)}</span>
              {currentLanguage === language.code ? (
                <Check className="ml-auto h-4 w-4" aria-hidden="true" />
              ) : null}
            </DropdownMenuItem>
          ))}
        </>
      ) : null}
      {showThemeToggle ? (
        <DropdownMenuItem className="sm:hidden" onSelect={toggleTheme}>
          {resolvedTheme === 'dark' ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
          <span>{t('admin.header.toggleTheme')}</span>
        </DropdownMenuItem>
      ) : null}
    </>
  );
}

export function AdminHeader({
  title,
  showSearch = false,
  showUser = false,
  showLangSwitcher = false,
  showThemeToggle = true,
}: AdminHeaderProps) {
  const { currentLanguage, changeLanguage, isHydrated, t } = useI18n();
  const resolvedTitle = title ?? t('admin.header.defaultTitle');
  const { registration, activate } = useAdminSearch();
  const [mobileSearchRegistration, setMobileSearchRegistration] =
    React.useState<typeof registration>(null);
  const mobileSearchOpen = Boolean(registration && mobileSearchRegistration === registration);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const currentLang = LANGUAGES.find((language) => language.code === currentLanguage);
  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || 'A';
  const adminFallbackName = t('admin.header.adminFallbackName');

  const handleLogout = async () => {
    await clearAdminQueryState(queryClient);
    logout();
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.replace(ROUTES.LOGIN);
    }
  };

  const searchControl =
    showSearch && registration ? (
      <button
        type="button"
        onClick={() => void activate()}
        className="flex h-10 w-full items-center gap-2 rounded-xl border bg-muted/40 px-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="truncate">
          {registration.placeholder ?? t('admin.header.searchPlaceholder')}
        </span>
        <kbd className="ml-auto hidden rounded border bg-background px-1.5 py-0.5 text-[10px] lg:inline">
          /
        </kbd>
      </button>
    ) : null;

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center gap-2 px-4 sm:px-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger
              aria-label={t('admin.header.toggleNavigation')}
              className="-ml-2 shrink-0"
            />
          </TooltipTrigger>
          <TooltipContent>{t('admin.header.toggleNavigation')}</TooltipContent>
        </Tooltip>

        <div className="min-w-0 flex-1">
          <React.Suspense
            fallback={<span className="text-sm font-semibold">{resolvedTitle}</span>}
          >
            <AdminBreadcrumbs fallbackTitle={resolvedTitle} />
          </React.Suspense>
        </div>

        {registration ? (
          <div className="hidden w-full max-w-sm md:block">{searchControl}</div>
        ) : null}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {showSearch && registration ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={
                    mobileSearchOpen
                      ? t('admin.header.closeSearch')
                      : t('admin.header.openSearch')
                  }
                  aria-expanded={mobileSearchOpen}
                  onClick={() =>
                    setMobileSearchRegistration((current) =>
                      current === registration ? null : registration
                    )
                  }
                >
                  {mobileSearchOpen ? <X aria-hidden="true" /> : <Search aria-hidden="true" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {mobileSearchOpen ? t('admin.header.closeSearch') : t('admin.header.openSearch')}
              </TooltipContent>
            </Tooltip>
          ) : null}

          <Separator orientation="vertical" className="hidden h-5 sm:block" />

          {showLangSwitcher ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={t('admin.header.changeLanguage')}
                  className="hidden gap-1.5 px-2 sm:flex"
                >
                  {isHydrated ? (
                    <Image src={currentLang?.icon ?? icons.iconUS} alt="" width={16} height={16} />
                  ) : (
                    <span className="h-4 w-4" />
                  )}
                  <span className="hidden lg:inline">
                    {isHydrated ? (currentLang ? t(currentLang.label) : '...') : '...'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LANGUAGES.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => changeLanguage(language.code)}
                    className="flex items-center gap-2"
                  >
                    <Image src={language.icon} alt="" width={16} height={16} />
                    <span>{t(language.label)}</span>
                    {currentLanguage === language.code ? (
                      <Check className="ml-auto h-4 w-4" />
                    ) : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {showThemeToggle ? (
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          ) : null}

          {showUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={user?.name || t('admin.header.adminAccount')}
                >
                  <Avatar className="h-10 w-10">
                    {user?.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar className="h-9 w-9">
                    {user?.avatar ? <AvatarImage src={user.avatar} alt="" /> : null}
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {user?.name || adminFallbackName}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {user?.email || ''}
                    </div>
                  </div>
                </div>
                <MobilePreferences
                  currentLanguage={currentLanguage}
                  changeLanguage={changeLanguage}
                  showLangSwitcher={showLangSwitcher}
                  showThemeToggle={showThemeToggle}
                  t={t}
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => void handleLogout()}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  {t('admin.header.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      {mobileSearchOpen && registration ? (
        <div className="border-t px-4 py-3 md:hidden">{searchControl}</div>
      ) : null}
    </header>
  );
}
