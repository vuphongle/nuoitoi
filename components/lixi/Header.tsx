'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FeedbackDialog } from '@/features/feedback';
import { useI18n } from '@/hooks/useI18n';
import { SUPPORTED_LANGUAGES } from '@/constants/lang';
import { navLinks } from './data';
import { MobileMenu } from './MobileMenu';
import Image from 'next/image';
import { icons } from '@/shared/assets/index';

export function Header() {
  const { t, currentLanguage, switchLanguage } = useI18n('lixi');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-[1000] border-b border-[#d7263d]/12 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md"
      aria-label={t('header.mainAria')}
    >
      <div className="mx-auto flex w-[min(1180px,94vw)] items-center gap-4.5 py-3.5">
        <div className="flex items-center gap-3">
          <Image
            src={icons.iconLogoHQ}
            alt={t('common.brandName')}
            width={44}
            height={44}
            className="h-11 w-11 rounded-2xl"
          />
          <div>
            <div className="font-extrabold tracking-wide truncate max-w-36">
              {t('common.brandName')}
            </div>
            <div className="text-sm text-[#6a5c55] truncate max-w-36">{t('header.subtitle')}</div>
          </div>
        </div>

        <nav
          className="hidden flex-1 flex-wrap items-center justify-center gap-2.5 min-[901px]:flex"
          aria-label={t('header.internalLinksAria')}
        >
          {navLinks?.map((link) =>
            link.action === 'feedback' ? (
              <button
                key={link.href}
                type="button"
                onClick={() => setIsFeedbackOpen(true)}
                className="cursor-pointer rounded-xl px-3 py-2 font-bold text-[#6a5c55] transition hover:-translate-y-px hover:bg-[#d7263d]/8 hover:text-[#1f1a17]"
              >
                {t(link.labelKey)}
              </button>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 font-bold text-[#6a5c55] transition hover:-translate-y-px hover:bg-[#d7263d]/8 hover:text-[#1f1a17]"
              >
                {t(link.labelKey)}
              </a>
            )
          )}
        </nav>

        <div className="ml-auto hidden items-center gap-2.5 min-[901px]:flex">
          <div
            className="inline-flex rounded-full border border-black/6 bg-black/4 p-1"
            role="group"
            aria-label={t('header.languageSelectorAria')}
          >
            {SUPPORTED_LANGUAGES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => switchLanguage(code)}
                className={cn(
                  'rounded-full px-3 py-1.5 font-bold text-[#6a5c55] cursor-pointer',
                  currentLanguage === code &&
                    'bg-white text-[#1f1a17] shadow-[0_8px_16px_rgba(0,0,0,0.06)]'
                )}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href="#donate"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent px-3.5 py-2.5 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(215,38,61,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(215,38,61,0.32)]"
            style={{ background: 'linear-gradient(120deg, #d7263d, #f28c28)' }}
          >
            {t('common.donateNow')}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/6 bg-black/4 text-[#1f1a17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7263d] min-[901px]:hidden"
          aria-label={t('header.openMenuAria')}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <MobileMenu
            isOpen={isMobileOpen}
            onClose={() => setIsMobileOpen(false)}
            currentLanguage={currentLanguage}
            onChangeLanguage={switchLanguage}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
          />
        )}
      </AnimatePresence>

      <FeedbackDialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen} />
    </header>
  );
}
