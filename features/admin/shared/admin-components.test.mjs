import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../../../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8');

const componentContracts = {
  'admin-page.tsx': ['AdminPage'],
  'admin-page-header.tsx': ['AdminPageHeader'],
  'admin-metric-card.tsx': ['AdminMetricGrid', 'AdminMetricCard'],
  'admin-content-card.tsx': ['AdminContentCard'],
  'admin-toolbar.tsx': ['AdminToolbar'],
  'admin-status-badge.tsx': ['AdminStatusBadge'],
  'admin-row-actions.tsx': ['AdminRowActions'],
  'admin-pagination.tsx': ['AdminPagination'],
  'admin-states.tsx': ['AdminEmptyState', 'AdminErrorState'],
  'admin-list-skeleton.tsx': ['AdminListSkeleton'],
  'responsive-data-view.tsx': ['ResponsiveDataView'],
};

test('shared admin barrels expose every public composition component', async () => {
  const [componentBarrel, sharedBarrel, ...modules] = await Promise.all([
    source('features/admin/shared/components/index.ts'),
    source('features/admin/shared/index.ts'),
    ...Object.keys(componentContracts).map((file) =>
      source(`features/admin/shared/components/${file}`)
    ),
  ]);

  for (const [index, [file, exports]] of Object.entries(componentContracts).entries()) {
    assert.match(
      componentBarrel,
      new RegExp(`export \\* from ['\"]\\./${file.replace('.tsx', '')}['\"]`),
      `${file} must be re-exported from the component barrel`
    );

    for (const name of exports) {
      assert.match(modules[index], new RegExp(`export (?:function|const) ${name}\\b`));
    }
  }

  assert.match(sharedBarrel, /export \* from ['"]\.\/admin-status['"]/);
  assert.match(sharedBarrel, /export \* from ['"]\.\/components['"]/);
});

test('page composition establishes readable width, rhythm, and responsive header actions', async () => {
  const [page, header, contentCard] = await Promise.all([
    source('features/admin/shared/components/admin-page.tsx'),
    source('features/admin/shared/components/admin-page-header.tsx'),
    source('features/admin/shared/components/admin-content-card.tsx'),
  ]);

  assert.match(page, /className\??:\s*string/);
  assert.match(page, /max-w-/);
  assert.match(page, /space-y-8/);
  assert.match(header, /text-3xl/);
  assert.match(header, /flex-col/);
  assert.match(header, /(?:sm|md):flex-row/);
  assert.match(header, /icon\??:\s*React\.ReactNode/);
  assert.match(header, /eyebrow\??:\s*React\.ReactNode/);
  assert.match(header, /title:\s*string/);
  assert.match(header, /actions\??:\s*React\.ReactNode/);
  assert.match(header, /{eyebrow\s*\?/);
  assert.match(header, /{icon\s*\?/);
  assert.ok(
    header.indexOf('{eyebrow ?') < header.indexOf('<h1'),
    'eyebrow context must precede the page title in the document hierarchy'
  );
  assert.match(header, /<h1[^>]*>{title}<\/h1>/);
  assert.doesNotMatch(header, /<p[^>]*>[\s\S]*?{(?:eyebrow|description)}[\s\S]*?<\/p>/);
  assert.match(contentCard, /CardHeader/);
  assert.match(contentCard, /CardContent/);
  assert.match(contentCard, /title\??:\s*string/);
  assert.match(contentCard, /description\??:\s*string\s*\|\s*number/);
  assert.match(contentCard, /footer\??:\s*React\.ReactNode/);
  assert.match(contentCard, /CardFooter/);
  assert.match(contentCard, /{footer\s*\?/);
  assert.match(contentCard, /border-t/);
});

test('metrics and toolbar expose responsive presentation-only slots and loading shapes', async () => {
  const [metrics, toolbar] = await Promise.all([
    source('features/admin/shared/components/admin-metric-card.tsx'),
    source('features/admin/shared/components/admin-toolbar.tsx'),
  ]);

  for (const prop of [
    'title',
    'value',
    'icon',
    'trend',
    'progress',
    'progressLabel',
    'isLoading',
  ]) {
    assert.match(metrics, new RegExp(`${prop}\\??:`), `metric card must expose ${prop}`);
  }
  assert.match(metrics, /title:\s*string/);
  assert.match(metrics, /grid-cols-2/);
  assert.match(metrics, /(?:lg|xl):grid-cols-4/);
  assert.match(metrics, /Skeleton/);
  assert.match(metrics, /role=['"]progressbar['"]/);
  assert.match(metrics, /aria-label={progressLabel\s*\?\?\s*`\$\{title} progress`}/);
  assert.match(metrics, /<div[^>]*>{value}<\/div>/);
  assert.match(metrics, /<div[^>]*>{trend}<\/div>/);

  assert.match(toolbar, /primary\??:\s*React\.ReactNode/);
  assert.match(toolbar, /secondary\??:\s*React\.ReactNode/);
  assert.match(toolbar, /flex-col/);
  assert.match(toolbar, /(?:sm|md):flex-row/);
  assert.match(toolbar, /flex-wrap/);
});

test('status badges and row actions have semantic styling and accessible callback-only controls', async () => {
  const [badge, actions] = await Promise.all([
    source('features/admin/shared/components/admin-status-badge.tsx'),
    source('features/admin/shared/components/admin-row-actions.tsx'),
  ]);

  assert.match(badge, /getAdminStatusConfig/);
  assert.match(badge, /status:\s*unknown/);
  assert.match(badge, /label\??:\s*React\.ReactNode/);

  assert.match(actions, /^['"]use client['"];?/);
  assert.match(actions, /DropdownMenu/);
  assert.match(actions, /Tooltip/);
  assert.match(actions, /MoreHorizontal/);
  assert.match(actions, /aria-label=/);
  for (const prop of ['onView', 'onEdit', 'onDelete', 'viewLabel', 'editLabel', 'deleteLabel']) {
    assert.match(actions, new RegExp(`${prop}\\??:`), `row actions must expose ${prop}`);
  }
  assert.match(actions, /onSelect=/);
  assert.match(actions, /variant=['"]destructive['"]/);
  assert.match(actions, /cursor-pointer/);
  assert.doesNotMatch(actions, /href=|useRouter|usePathname/);
});

test('pagination provides desktop numbered controls and compact mobile boundary controls', async () => {
  const pagination = await source('features/admin/shared/components/admin-pagination.tsx');

  assert.match(pagination, /^['"]use client['"];?/);
  for (const prop of ['currentPage', 'totalPages', 'onPageChange', 'isLoading']) {
    assert.match(pagination, new RegExp(`${prop}\\??:`), `pagination must expose ${prop}`);
  }
  assert.match(pagination, /hidden md:flex/);
  assert.match(pagination, /md:hidden/);
  assert.match(pagination, /bg-yellow-/);
  assert.match(pagination, /getAdminPaginationModel/);
  assert.match(pagination, /PaginationEllipsis/);
  assert.match(pagination, /model\.currentPage\s*-\s*1/);
  assert.match(pagination, /model\.currentPage\s*\+\s*1/);
  assert.doesNotMatch(pagination, /Array\.from\(\{\s*length:\s*totalPages/);
  assert.doesNotMatch(pagination, /href=/);
});

test('states, skeletons, and responsive data view cover the reusable list states', async () => {
  const [states, skeleton, dataView] = await Promise.all([
    source('features/admin/shared/components/admin-states.tsx'),
    source('features/admin/shared/components/admin-list-skeleton.tsx'),
    source('features/admin/shared/components/responsive-data-view.tsx'),
  ]);

  for (const prop of ['icon', 'title', 'description', 'action']) {
    assert.match(states, new RegExp(`${prop}\\??:`), `empty state must expose ${prop}`);
  }
  assert.match(states, /onRetry\??:/);
  assert.match(states, /Button/);
  assert.match(skeleton, /grid-cols-2/);
  assert.match(skeleton, /Skeleton/);
  const skeletonClasses = new Set(
    [...skeleton.matchAll(/className="([^"]*)"/g)].flatMap((match) => match[1].split(/\s+/))
  );
  assert.ok(skeletonClasses.has('hidden'));
  assert.ok(skeletonClasses.has('md:block'));
  assert.ok(skeletonClasses.has('md:hidden'));

  assert.match(dataView, /desktop:\s*React\.ReactNode/);
  assert.match(dataView, /mobile:\s*React\.ReactNode/);
  assert.match(dataView, /hidden md:block/);
  assert.match(dataView, /md:hidden/);
  assert.match(dataView, /overflow-x-auto/);
});

test('shared components remain presentation-only and feature-agnostic', async () => {
  const sources = await Promise.all(
    Object.keys(componentContracts).map((file) =>
      source(`features/admin/shared/components/${file}`)
    )
  );
  const combined = sources.join('\n');

  assert.doesNotMatch(combined, /from ['"][^'"]*(?:hooks|services|query-client|stores?)[^'"]*['"]/);
  assert.doesNotMatch(combined, /from ['"]@\/features\/admin\/(?!shared)/);
  assert.doesNotMatch(combined, /useQuery|useMutation|createQueryClient|axios/);
});
