import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';

const root = new URL('../../../', import.meta.url);
const source = (path) => readFile(new URL(path, root), 'utf8');
const execFileAsync = promisify(execFile);

const primitiveExports = {
  avatar: ['Avatar', 'AvatarImage', 'AvatarFallback'],
  checkbox: ['Checkbox'],
  'scroll-area': ['ScrollArea', 'ScrollBar'],
  'alert-dialog': [
    'AlertDialog',
    'AlertDialogAction',
    'AlertDialogCancel',
    'AlertDialogContent',
    'AlertDialogDescription',
    'AlertDialogFooter',
    'AlertDialogHeader',
    'AlertDialogOverlay',
    'AlertDialogPortal',
    'AlertDialogTitle',
    'AlertDialogTrigger',
  ],
  pagination: [
    'Pagination',
    'PaginationContent',
    'PaginationEllipsis',
    'PaginationItem',
    'PaginationLink',
    'PaginationNext',
    'PaginationPrevious',
  ],
  sonner: ['Toaster'],
};

function namedExports(contents) {
  return new Set(
    [...contents.matchAll(/export\s*{([\s\S]*?)}/g)].flatMap((match) =>
      match[1]
        .split(',')
        .map((name) =>
          name
            .trim()
            .split(/\s+as\s+/)
            .at(-1)
        )
        .filter(Boolean)
    )
  );
}

function classTokens(contents) {
  return new Set(
    [...contents.matchAll(/'([^'\n]*)'|"([^"\n]*)"/g)].flatMap((match) =>
      (match[1] ?? match[2]).split(/\s+/).filter(Boolean)
    )
  );
}

function cssBlock(contents, selector) {
  const start = contents.indexOf(selector);
  assert.notEqual(start, -1, `${selector} must exist`);
  const openingBrace = contents.indexOf('{', start);
  assert.notEqual(openingBrace, -1, `${selector} must have an opening brace`);
  const end = contents.indexOf('}', openingBrace);
  assert.notEqual(end, -1, `${selector} must have a closing brace`);
  return contents.slice(start, end + 1);
}

test('admin UI primitives expose their shadcn APIs and are exported from the UI barrel', async () => {
  const barrel = await source('components/ui/index.ts');

  for (const [primitive, requiredExports] of Object.entries(primitiveExports)) {
    await assert.doesNotReject(
      access(new URL(`components/ui/${primitive}.tsx`, root)),
      `${primitive}.tsx must exist`
    );
    const moduleSource = await source(`components/ui/${primitive}.tsx`);
    const exports = namedExports(moduleSource);

    for (const name of requiredExports) {
      assert.ok(exports.has(name), `${primitive}.tsx must export ${name}`);
    }

    assert.match(
      barrel,
      new RegExp(`export \\* from ['\"]\\./${primitive}['\"]`),
      `${primitive} must be exported from components/ui/index.ts`
    );
  }
});

test('application providers mount the themed Sonner toaster', async () => {
  const [providers, sonner] = await Promise.all([
    source('app/providers.tsx'),
    source('components/ui/sonner.tsx'),
  ]);

  assert.match(providers, /import\s*{\s*Toaster\s*}\s*from\s*['\"]@\/components\/ui\/sonner['\"]/);
  assert.match(providers, /<Toaster\s*\/?\s*>/);
  assert.match(sonner, /useThemeStore/);
  assert.match(sonner, /from ['\"]sonner['\"]/);
});

test('admin portal roots opt into shell tokens without restyling public portals', async () => {
  const [globals, alertDialog, sonner] = await Promise.all([
    source('app/globals.css'),
    source('components/ui/alert-dialog.tsx'),
    source('components/ui/sonner.tsx'),
  ]);

  assert.match(alertDialog, /data-admin-portal/);
  assert.match(sonner, /data-admin-portal/);
  assert.match(globals, /body:has\(\.admin-shell\)\s+\[data-admin-portal\]/);
  assert.match(globals, /\.dark\s+body:has\(\.admin-shell\)\s+\[data-admin-portal\]/);
  assert.match(
    globals,
    /body:has\(\.admin-shell\)\s+\[data-admin-portal\][\s\S]*--primary:\s*48 96% 53%/
  );
  assert.match(
    globals,
    /body:has\(\.admin-shell\)\s+\[data-admin-portal\][\s\S]*:focus-visible[\s\S]*outline-offset:\s*2px/
  );
  assert.doesNotMatch(globals, /^\s*\[data-admin-portal\]\s*{/m);
});

test('admin shell owns neutral zinc tokens without changing the public root scope', async () => {
  const globals = await source('app/globals.css');
  const rootStart = globals.indexOf(':root {');
  const adminSelector = '\n.admin-shell,\nbody:has(.admin-shell) [data-admin-portal]';
  const adminStart = globals.indexOf(adminSelector, rootStart);

  assert.notEqual(rootStart, -1, 'public root tokens must remain defined');
  assert.notEqual(adminStart, -1, '.admin-shell light tokens must exist');

  const lightTokens = cssBlock(globals, adminSelector);
  assert.match(lightTokens, /--background:\s*0 0% 100%/);
  assert.match(lightTokens, /--foreground:\s*240 10% 4%/);
  assert.match(lightTokens, /--card:\s*0 0% 100%/);
  assert.match(lightTokens, /--muted:\s*240 5% 96%/);
  assert.match(lightTokens, /--primary:\s*48 96% 53%/);
  assert.match(lightTokens, /#FACC14/i);
  assert.match(lightTokens, /--border:\s*240 6% 90%/);

  const darkTokens = cssBlock(globals, '.dark .admin-shell,');
  assert.match(darkTokens, /--background:\s*240 10% 4%/);
  assert.match(darkTokens, /--foreground:\s*0 0% 98%/);
  assert.match(darkTokens, /--card:\s*240 6% 10%/);
  assert.match(darkTokens, /--muted:\s*240 4% 16%/);
  assert.match(darkTokens, /--primary:\s*48 96% 53%/);
  assert.match(darkTokens, /#FACC14/i);
  assert.match(darkTokens, /--border:\s*240 4% 20%/);

  const publicTokens = globals.slice(rootStart, adminStart);
  assert.match(publicTokens, /--background:\s*44 73% 96%/);
});

test('admin shell uses visible focus offsets, thin scrollbars, and reduced motion', async () => {
  const globals = await source('app/globals.css');
  const focusStyles = cssBlock(globals, '.admin-shell :focus-visible');

  assert.match(focusStyles, /outline-color:\s*hsl\(var\(--ring\)\)/);
  assert.match(focusStyles, /outline-offset:\s*2px/);
  assert.match(globals, /\.admin-shell,[\s\S]*scrollbar-width:\s*thin/);
  assert.match(globals, /\.admin-shell\s+::?-webkit-scrollbar\s*{[\s\S]*width:\s*6px/);
  assert.match(globals, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(globals, /animation-duration:\s*0\.01ms\s*!important/);
  assert.match(globals, /transition-duration:\s*0\.01ms\s*!important/);
});

test('notification hook keeps its consumer API while delegating delivery to Sonner', async () => {
  const notification = await source('components/ui/notification.tsx');

  const signatures = [
    /showNotification:\s*\(options:\s*ShowNotificationOptions\)\s*=>\s*string/,
    /closeNotification:\s*\(id:\s*string\)\s*=>\s*void/,
    /success:\s*\(message:\s*string,\s*title\?:\s*string\)\s*=>\s*string/,
    /error:\s*\(message:\s*string,\s*title\?:\s*string\)\s*=>\s*string/,
    /warning:\s*\(message:\s*string,\s*title\?:\s*string\)\s*=>\s*string/,
    /info:\s*\(message:\s*string,\s*title\?:\s*string\)\s*=>\s*string/,
  ];
  for (const signature of signatures) {
    assert.match(notification, signature);
  }

  assert.match(notification, /import\s*{\s*toast\s*}\s*from\s*['\"]sonner['\"]/);
  assert.match(notification, /const\s+id\s*=\s*Math\.random\(\)\.toString\(36\)\.slice\(2,\s*9\)/);
  assert.match(notification, /toast\[type\]\([\s\S]*?{[\s\S]*?\bid,/);
  assert.match(notification, /return\s+id/);
  assert.match(
    notification,
    /closeNotification\s*=\s*\(id:\s*string\)\s*=>\s*{[\s\S]*toast\.dismiss\(id\)/
  );

  for (const type of ['success', 'error', 'warning', 'info']) {
    assert.match(
      notification,
      new RegExp(
        `${type}:\\s*\\(message,\\s*title\\)\\s*=>\\s*showNotification\\(\\{\\s*type:\\s*'${type}',\\s*message,\\s*title\\s*\\}\\)`
      )
    );
  }

  assert.doesNotMatch(notification, /AnimatePresence|motion\.div|useState<NotificationItem/);
});

test('pagination links use semantic controls and expose ellipsis text to assistive technology', async () => {
  const pagination = await source('components/ui/pagination.tsx');
  const ellipsisStart = pagination.indexOf('function PaginationEllipsis');
  const ellipsisEnd = pagination.indexOf('\nexport {', ellipsisStart);
  const ellipsis = pagination.slice(ellipsisStart, ellipsisEnd);

  assert.match(pagination, /href\s*!==\s*undefined\s*\?\s*\(/);
  assert.match(pagination, /<a[\s\S]*href={href}/);
  assert.match(pagination, /<button[\s\S]*type={[\s\S]*\?\?\s*['\"]button['\"]}/);
  assert.match(pagination, /PaginationButtonProps[\s\S]*disabled/);
  assert.match(pagination, /aria-current={isActive\s*\?\s*['\"]page['\"]\s*:\s*undefined}/);
  assert.match(pagination, /disabled:cursor-not-allowed/);

  assert.notEqual(ellipsisStart, -1, 'PaginationEllipsis must exist');
  assert.match(ellipsis, /<MoreHorizontal[^>]*aria-hidden/);
  assert.match(ellipsis, /<span className=['\"]sr-only['\"]>More pages<\/span>/);
  assert.doesNotMatch(ellipsis, /<span\s+aria-hidden/);
});

test('Sonner is the only newly introduced package dependency', async () => {
  const [packageSource, lockfile, { stdout: baselineSource }] = await Promise.all([
    source('package.json'),
    source('pnpm-lock.yaml'),
    execFileAsync('git', ['show', 'HEAD:package.json'], { cwd: fileURLToPath(root) }),
  ]);
  const currentPackage = JSON.parse(packageSource);
  const baselinePackage = JSON.parse(baselineSource);

  const addedDependencies = Object.keys(currentPackage.dependencies ?? {}).filter(
    (name) => !(name in (baselinePackage.dependencies ?? {}))
  );
  const addedDevDependencies = Object.keys(currentPackage.devDependencies ?? {}).filter(
    (name) => !(name in (baselinePackage.devDependencies ?? {}))
  );

  if (addedDependencies.length > 0 || addedDevDependencies.length > 0) {
    assert.deepEqual(addedDependencies, ['sonner']);
    assert.deepEqual(addedDevDependencies, []);
  }
  assert.match(currentPackage.dependencies.sonner, /^\^2\./);
  for (const unnecessaryRadixPackage of [
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-avatar',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-scroll-area',
  ]) {
    assert.equal(currentPackage.dependencies[unnecessaryRadixPackage], undefined);
  }
  assert.match(lockfile, /^\s{6}sonner:\n\s{8}specifier:\s*\^2\./m);
  assert.match(lockfile, /^\s{2}sonner@2\./m);
});

test('shared buttons and compact controls expose visible interaction states and safe targets', async () => {
  const [button, switchSource, tabs] = await Promise.all([
    source('components/ui/button.tsx'),
    source('components/ui/switch.tsx'),
    source('components/ui/tabs.tsx'),
  ]);
  const buttonTokens = classTokens(button);
  const switchTokens = classTokens(switchSource);

  for (const token of [
    'admin:rounded-xl',
    'admin:cursor-pointer',
    'admin:disabled:cursor-not-allowed',
    'focus-visible:ring-2',
    'duration-200',
    'admin:not-disabled:hover:brightness-95',
    'admin:not-disabled:active:scale-[0.98]',
    'admin:h-11',
    'admin:md:h-10',
  ]) {
    assert.ok(buttonTokens.has(token), `button must include exact class token ${token}`);
  }
  assert.match(button, /disabled:pointer-events-none/);
  assert.match(button, /admin:disabled:pointer-events-auto/);
  assert.deepEqual(
    [...buttonTokens].filter((token) => token.startsWith('enabled:')),
    [],
    'button variants must retain interaction styles when composed onto anchors'
  );
  assert.deepEqual(
    [...buttonTokens].filter((token) => token.startsWith('admin:enabled:')),
    [],
    'admin interactions must remain compatible with links'
  );
  assert.doesNotMatch(button, /const buttonVariants = cva\(\s*['"][^'"]*\bshadow-sm\b/);
  assert.match(button, /default:\s*['"][^'"]*\bshadow-sm\b/);
  assert.match(button, /destructive:\s*['"][^'"]*\bshadow-sm\b/);
  assert.match(button, /ghost:\s*['"][^'"]*\bshadow-none\b/);
  assert.match(button, /link:\s*['"][^'"]*\bshadow-none\b/);
  assert.match(button, /icon:\s*['"][^'"]*admin:h-11[^'"]*admin:w-11[^'"]*admin:md:/);

  for (const [name, contents] of [
    ['switch', switchSource],
    ['tabs', tabs],
  ]) {
    assert.match(contents, /cursor-pointer/, `${name} must use a pointer cursor`);
    assert.match(contents, /disabled:cursor-not-allowed/, `${name} must expose disabled cursor`);
    assert.match(contents, /focus-visible:ring-2/, `${name} must retain a visible focus ring`);
    assert.doesNotMatch(contents, /disabled:pointer-events-none/);
  }

  assert.ok(switchTokens.has('after:-inset-y-3'));
  assert.ok(switchTokens.has('md:after:-inset-y-2.5'));
  assert.equal(switchTokens.has('after:-inset-y-2.5'), false);
  assert.equal(switchTokens.has('md:after:-inset-y-2'), false);
  assert.match(tabs, /min-h-11/);
  assert.match(tabs, /md:min-h-10/);
});

test('form primitives use semantic theme tokens, rounded fields, focus rings, and touch sizing', async () => {
  const [input, textarea, select] = await Promise.all([
    source('components/ui/input.tsx'),
    source('components/ui/textarea.tsx'),
    source('components/ui/select.tsx'),
  ]);

  for (const [name, contents] of [
    ['input', input],
    ['textarea', textarea],
    ['select', select],
  ]) {
    assert.match(contents, /rounded-xl/, `${name} must use the requested field radius`);
    assert.match(contents, /bg-background/, `${name} must use semantic surface tokens`);
    assert.match(contents, /focus-visible:ring-2/, `${name} must expose a visible focus ring`);
    assert.match(contents, /disabled:cursor-not-allowed/, `${name} must expose disabled cursor`);
    assert.match(contents, /duration-200/, `${name} must use a short transition`);
    assert.doesNotMatch(contents, /border-slate-|bg-white|ring-offset-white/);
  }

  assert.match(input, /h-11/);
  assert.match(input, /md:h-10/);
  assert.match(select, /data-admin-portal/);
  assert.match(select, /data-\[disabled\]:cursor-not-allowed/);
});

test('overlay primitives inherit admin tokens and dialogs adapt safely across viewport sizes', async () => {
  const [dialog, sheet, dropdown, tooltip] = await Promise.all([
    source('components/ui/dialog.tsx'),
    source('components/ui/sheet.tsx'),
    source('components/ui/dropdown-menu.tsx'),
    source('components/ui/tooltip.tsx'),
  ]);

  for (const [name, contents] of [
    ['dialog', dialog],
    ['sheet', sheet],
    ['dropdown', dropdown],
    ['tooltip', tooltip],
  ]) {
    assert.match(contents, /data-admin-portal/, `${name} portal content must inherit admin tokens`);
  }

  for (const token of [
    'bottom-0',
    'rounded-t-3xl',
    'sm:top-1/2',
    'sm:rounded-3xl',
    'max-h-[calc(100dvh-',
    'overflow-y-auto',
    'shadow-xl',
  ]) {
    assert.ok(dialog.includes(token), `dialog must include ${token}`);
  }
  assert.match(dialog, /admin:overflow-y-auto/);
  assert.match(dialog, /fixed left-\[50%\] top-\[50%\]/);

  assert.match(dropdown, /rounded-xl/);
  assert.match(dropdown, /cursor-pointer/);
  assert.match(dropdown, /data-disabled:cursor-not-allowed/);
  assert.match(tooltip, /TooltipPrimitive\.Portal/);
});

test('cards, tables, and passive feedback primitives keep semantic, opt-in presentation contracts', async () => {
  const [card, table, badge, skeleton, separator] = await Promise.all([
    source('components/ui/card.tsx'),
    source('components/ui/table.tsx'),
    source('components/ui/badge.tsx'),
    source('components/ui/skeleton.tsx'),
    source('components/ui/separator.tsx'),
  ]);

  assert.match(card, /rounded-2xl/);
  assert.match(card, /shadow-sm/);
  assert.match(card, /data-\[interactive=true\]:hover:shadow-md/);
  assert.doesNotMatch(card, /\s+hover:shadow-md/);

  assert.match(table, /overflow-auto/);
  assert.match(table, /sticky top-0 z-10 bg-background/);
  assert.match(table, /hover:bg-primary\/10/);
  assert.match(table, /transition-colors/);

  assert.match(badge, /bg-primary/);
  assert.doesNotMatch(badge, /#[\da-f]{3,8}/i);
  assert.match(skeleton, /bg-muted/);
  assert.match(separator, /bg-border/);
});
