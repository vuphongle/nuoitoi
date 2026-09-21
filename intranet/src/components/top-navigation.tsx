'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar } from '@/components/avatar';
import type { Employee } from '@/lib/types';

const navItems = [
  { href: '/', label: 'Trang chủ', icon: '⌂' },
  { href: '/employees', label: 'Đồng nghiệp', icon: '◎' },
  { href: '/profile/edit', label: 'Hồ sơ', icon: '✎' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function TopNavigation({ viewer, demoMode }: { viewer: Employee; demoMode: boolean }) {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-[rgba(255,250,246,0.88)] backdrop-blur-xl">
        <div className="app-container flex h-16 items-center justify-between gap-4">
          <Link className="flex items-center gap-3" href="/" aria-label="Nhà Mình - Trang chủ">
            <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white shadow-sm">
              NM
            </span>
            <span>
              <strong className="block text-sm font-black tracking-[-0.02em] text-slate-950">
                NHÀ MÌNH
              </strong>
              <span className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:block">
                Không gian nội bộ
              </span>
            </span>
          </Link>

          <nav
            aria-label="Điều hướng chính"
            className="hidden items-center gap-1 rounded-2xl border border-slate-200/70 bg-white/70 p-1 sm:flex"
          >
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition ${active ? 'bg-slate-950 text-white' : 'text-slate-500 hover:bg-coral-50 hover:text-coral-700'}`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {demoMode && (
              <span className="hidden rounded-full bg-amber-100 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-amber-800 lg:inline">
                Demo
              </span>
            )}
            <Link
              className="flex items-center gap-2 rounded-full p-1 transition hover:bg-white"
              href="/profile/edit"
              aria-label={`Mở hồ sơ của ${viewer.fullName}`}
            >
              <span className="hidden text-right lg:block">
                <strong className="block max-w-36 truncate text-xs text-slate-900">
                  {viewer.fullName}
                </strong>
                <span className="block text-[0.68rem] text-slate-500">{viewer.department}</span>
              </span>
              <Avatar employee={viewer} size="md" />
            </Link>
          </div>
        </div>
      </header>

      <nav
        aria-label="Điều hướng trên điện thoại"
        className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-3 rounded-2xl border border-white/80 bg-slate-950/95 p-1.5 shadow-2xl backdrop-blur sm:hidden"
      >
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[0.68rem] font-bold transition ${active ? 'bg-white text-slate-950' : 'text-slate-400'}`}
              href={item.href}
            >
              <span className="text-base" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
