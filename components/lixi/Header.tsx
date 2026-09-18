'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navLinks } from './data';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const [lang, setLang] = useState<'VI' | 'EN'>('VI');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-[1000] border-b border-[#d7263d]/12 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md"
      aria-label="Thanh điều hướng chính"
    >
      <div className="mx-auto flex w-[min(1180px,94vw)] items-center gap-4.5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl shadow-[0_24px_60px_rgba(215,38,61,0.12)]"
            style={{ background: 'radial-gradient(circle at 30% 30%, #fff1e6, #ffd2c2 60%, #ffb9a5)' }}
            aria-hidden="true"
          >
            🧧
          </div>
          <div>
            <div className="font-extrabold tracking-wide">LÌ XÌ THẬT THÀ</div>
            <div className="text-sm text-[#6a5c55]">Dashboard Tết vui vẻ</div>
          </div>
        </div>

        <nav
          className="hidden flex-1 flex-wrap items-center justify-center gap-2.5 min-[901px]:flex"
          aria-label="Liên kết nội trang"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 font-bold text-[#6a5c55] transition hover:-translate-y-px hover:bg-[#d7263d]/8 hover:text-[#1f1a17]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2.5 min-[901px]:flex">
          <div className="inline-flex rounded-full border border-black/6 bg-black/4 p-1" role="group" aria-label="Chọn ngôn ngữ">
            {(['VI', 'EN'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={cn(
                  'rounded-full px-3 py-1.5 font-bold text-[#6a5c55]',
                  lang === code && 'bg-white text-[#1f1a17] shadow-[0_8px_16px_rgba(0,0,0,0.06)]'
                )}
              >
                {code}
              </button>
            ))}
          </div>
          <a
            href="#donate"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent px-3.5 py-2.5 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(215,38,61,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(215,38,61,0.32)]"
            style={{ background: 'linear-gradient(120deg, #d7263d, #f28c28)' }}
          >
            Lì xì ngay
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-black/4 text-[#1f1a17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7263d] min-[901px]:hidden"
          aria-label="Mở menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <MobileMenu
            isOpen={isMobileOpen}
            onClose={() => setIsMobileOpen(false)}
            lang={lang}
            onChangeLang={setLang}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
