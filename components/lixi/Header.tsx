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
      className="lixi-header sticky top-0 z-[1000] border-b bg-white/90 shadow-[0_8px_30px_rgba(16,25,54,0.06)] backdrop-blur-md"
      aria-label={t('header.mainAria')}
    >
      <div className="lixi-header-inner mx-auto flex w-[min(1180px,94vw)] items-center gap-4.5 py-3.5">
        <div className="lixi-brand flex items-center gap-3">
          <Image
            src={icons.iconLogoHQ}
            alt={t('common.brandName')}
            width={44}
            height={44}
            className="h-11 w-11 rounded-2xl"
          />
          <div>
            <div className="lixi-brand-name font-extrabold tracking-wide truncate max-w-36">
              {t('common.brandName')}
            </div>
            <div className="lixi-brand-subtitle text-sm truncate max-w-36">
              {t('header.subtitle')}
            </div>
          </div>
        </div>

        <nav
          className="lixi-nav hidden flex-1 flex-wrap items-center justify-center gap-2.5 min-[901px]:flex"
          aria-label={t('header.internalLinksAria')}
        >
          {navLinks?.map((link) =>
            link.action === 'feedback' ? (
              <button
                key={link.href}
                type="button"
                onClick={() => setIsFeedbackOpen(true)}
                className="lixi-nav-link cursor-pointer rounded-xl px-3 py-2 font-bold transition hover:-translate-y-px"
              >
                {t(link.labelKey)}
              </button>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="lixi-nav-link rounded-xl px-3 py-2 font-bold transition hover:-translate-y-px"
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
            className="lixi-button lixi-button-primary inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent px-3.5 py-2.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5"
          >
            {t('common.donateNow')}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="lixi-menu-button ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border focus-visible:outline-none min-[901px]:hidden"
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
