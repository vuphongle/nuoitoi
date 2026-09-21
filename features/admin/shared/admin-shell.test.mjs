import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../../../', import.meta.url);

async function source(path) {
  try {
    return await readFile(new URL(path, root), 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') return '';
    throw error;
  }
}

test('layout mounts the responsive admin shell and preserves authorization behavior', async () => {
  const layout = await source('app/admin/layout.tsx');

  assert.match(layout, /admin-shell/);
  assert.match(layout, /min-h-screen/);
  assert.match(layout, /bg-background/);
  assert.match(layout, /text-foreground/);
  assert.match(layout, /SidebarProvider/);
  assert.match(layout, /AdminSearchProvider/);
  assert.match(layout, /AdminShellSkeleton/);
  assert.match(layout, /href=['"]#admin-main['"]/);
  assert.match(layout, /id=['"]admin-main['"]/);
  assert.match(layout, /tabIndex=\{-1\}/);
  assert.match(layout, /max-w-/);
  assert.match(layout, /space-y-8/);
  assert.match(layout, /px-4/);
  assert.match(layout, /shouldHoldAdminShell/);
  assert.match(layout, /useProfile\(\{ retry: false, refetchOnMount: ['"]always['"] \}\)/);
  assert.match(layout, /handleAdminSessionExpiry/);
  assert.match(layout, /AdminAuthorizationError/);
  assert.match(layout, /AdminRoleError/);
  assert.match(layout, /profileQuery\.refetch/);
});

test('shell skeleton resembles navigation, header, metrics, and content', async () => {
  const skeleton = await source('features/admin/shared/components/admin-shell-skeleton.tsx');

  assert.match(skeleton, /export function AdminShellSkeleton/);
  assert.match(skeleton, /aria-label=/);
  assert.match(skeleton, /md:block/);
  assert.match(skeleton, /h-16/);
  assert.match(skeleton, /grid-cols-2/);
  assert.match(skeleton, /(?:lg|xl):grid-cols-4/);
  assert.match(skeleton, /Skeleton/);
});

test('search registration exposes ref, focus, reveal, and placeholder without query state', async () => {
  const search = await source('features/admin/shared/components/admin-search-context.tsx');
  const barrel = await source('features/admin/shared/components/index.ts');

  assert.match(search, /export function AdminSearchProvider/);
  assert.match(search, /export function useAdminSearch/);
  assert.match(search, /export function useAdminSearchRegistration/);
  assert.match(search, /export function AdminSearchRegistration/);
  assert.match(search, /inputRef:/);
  assert.match(search, /focus\??:/);
  assert.match(search, /reveal\??:/);
  assert.match(search, /placeholder\??:/);
  assert.match(search, /usePathname/);
  assert.match(search, /Suspense/);
  assert.match(search, /return \(\) =>/);
  assert.doesNotMatch(search, /query\s*:/i);
  assert.match(barrel, /export \* from ['"]\.\/admin-search-context['"]/);
  assert.match(barrel, /export \* from ['"]\.\/admin-shell-skeleton['"]/);
});

test('sticky header provides breadcrumbs, contextual search, notifications, and avatar menu', async () => {
  const header = await source('components/layout/admin-header.tsx');

  assert.match(header, /sticky/);
  assert.match(header, /top-0/);
  assert.match(header, /usePathname/);
  assert.match(header, /Suspense/);
  for (const route of [
    'dashboard',
    'products',
    'product-categories',
    'blogs',
    'blog-categories',
    'brands',
    'campaigns',
    'users',
    'settings',
    'notifications',
  ]) {
    assert.match(header, new RegExp(route));
  }
  assert.match(header, /Campaign detail/);
  assert.match(header, /useAdminSearch/);
  assert.match(header, /registration\s*\?/);
  assert.match(header, /md:hidden/);
  const breadcrumbClass = header.match(/<nav aria-label="Breadcrumb" className="([^"]+)"/)?.[1];
  assert.ok(breadcrumbClass, 'desktop breadcrumb must have a className');
  const breadcrumbTokens = new Set(breadcrumbClass.split(/\s+/));
  assert.ok(breadcrumbTokens.has('hidden'));
  assert.ok(breadcrumbTokens.has('md:flex'));
  assert.match(header, /href=['"]\/admin\/notifications['"]/);
  assert.match(header, /aria-label=['"]Notifications['"]/);
  assert.match(header, /Tooltip/);
  assert.match(header, /Avatar/);
  assert.match(header, /clearAdminQueryState\(queryClient\)/);
  assert.match(header, /fetch\(['"]\/api\/auth\/logout['"], \{ method: ['"]POST['"] \}\)/);
  assert.match(header, /router\.replace\(ROUTES\.LOGIN\)/);
  assert.match(header, /ThemeToggle/);
  assert.match(header, /LANGUAGES/);
});

test('sidebar keeps its route config while supporting active paths and mobile close', async () => {
  const [appSidebar, sidebar] = await Promise.all([
    source('components/app-sidebar.tsx'),
    source('components/ui/sidebar.tsx'),
  ]);

  assert.doesNotMatch(appSidebar, /href:\s*['"]\/admin\/(?:brands|campaigns)['"]/);
  assert.match(appSidebar, /collapsible=['"]icon['"]/);
  assert.match(appSidebar, /SidebarRail/);
  assert.match(appSidebar, /<Link href=['"]\/['"]/);
  assert.match(appSidebar, /aria-label=/);
  assert.match(sidebar, /usePathname/);
  assert.match(sidebar, /pathname\.startsWith/);
  assert.match(sidebar, /bg-sidebar-active\/10/);
  assert.match(sidebar, /absolute left-0/);
  assert.match(sidebar, /setOpenMobile\(false\)/);
  assert.match(sidebar, /onClick=/);
  assert.match(sidebar, /Suspense/);
  assert.match(sidebar, /w-\[70px\]/);
  assert.match(sidebar, /className=\{cn\([\s\S]*group-sidebar[\s\S]*className/);
  assert.match(
    sidebar,
    /import\s*{[\s\S]*Sheet[\s\S]*SheetContent[\s\S]*SheetHeader[\s\S]*SheetTitle[\s\S]*}\s*from\s*['"]@\/components\/ui\/sheet['"]/
  );
  assert.match(sidebar, /<Sheet\s+open={openMobile}\s+onOpenChange={setOpenMobile}>/);
  assert.match(sidebar, /<SheetContent[\s\S]*side={side}/);
  assert.match(sidebar, /<SheetTitle>Navigation<\/SheetTitle>/);
  assert.match(sidebar, /w-\[18rem\]/);
  assert.match(sidebar, /max-w-\[calc\(100vw-2rem\)\]/);
  assert.doesNotMatch(sidebar, /fixed inset-0 z-40 bg-black\/50/);
  assert.match(sidebar, /const isCollapsed = !isMobile && state === ['"]collapsed['"]/);
  assert.match(appSidebar, /const isCollapsed = !isMobile && state === ['"]collapsed['"]/);
  assert.match(sidebar, /aria-current=\{isActive \? ['"]page['"] : undefined\}/);
});

test('mobile account menu retains language and theme actions', async () => {
  const header = await source('components/layout/admin-header.tsx');

  assert.match(header, /function MobilePreferences/);
  assert.match(header, /sm:hidden/);
  assert.match(header, /LANGUAGES\.map/);
  assert.match(header, /changeLanguage/);
  assert.match(header, /useThemeStore/);
  assert.match(header, /<DropdownMenuItem className="sm:hidden" onSelect=\{toggleTheme\}>/);
  assert.match(header, /Toggle color theme/);
  assert.match(header, /<MobilePreferences/);
  assert.match(header, /mobileSearchRegistration === registration/);
  assert.match(header, /current === registration \? null : registration/);
});
