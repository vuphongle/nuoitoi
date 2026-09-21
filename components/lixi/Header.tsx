'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Gift, List } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { FeedbackDialog } from '@/features/feedback';
import { useI18n } from '@/hooks/useI18n';
import { SUPPORTED_LANGUAGES } from '@/constants/lang';
import { navLinks } from './data';
import { MobileMenu } from './MobileMenu';
import { LixiActionLink, LixiShell } from './ui';

export function Header() {
  const { t, currentLanguage, switchLanguage } = useI18n('lixi');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <header className="lixi-site-header" aria-label={t('header.mainAria')}>
      <LixiShell className="lixi-site-header-inner">
        <a className="lixi-brand-lockup" href="#hero" aria-label={t('common.brandName')}>
          <span className="lixi-brand-mark" aria-hidden="true">
            <Gift size={26} weight="duotone" />
          </span>
          <span className="lixi-brand-copy">
            <strong>{t('common.brandName')}</strong>
            <small>{t('header.subtitle')}</small>
          </span>
        </a>

        <nav className="lixi-desktop-nav" aria-label={t('header.internalLinksAria')}>
          {navLinks.map((link) =>
            link.action === 'feedback' ? (
              <button key={link.href} type="button" onClick={() => setIsFeedbackOpen(true)}>
                {t(link.labelKey)}
              </button>
            ) : (
              <a key={link.href} href={link.href}>
                {t(link.labelKey)}
              </a>
            )
          )}
        </nav>

        <div className="lixi-header-actions">
          <div
            className="lixi-language-switcher"
            role="group"
            aria-label={t('header.languageSelectorAria')}
          >
            {SUPPORTED_LANGUAGES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => switchLanguage(code)}
                className={cn(currentLanguage === code && 'is-active')}
                aria-pressed={currentLanguage === code}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <LixiActionLink className="lixi-header-cta" href="#donate">
            {t('common.donateNow')}
          </LixiActionLink>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="lixi-mobile-menu-trigger"
          aria-label={t('header.openMenuAria')}
          aria-expanded={isMobileOpen}
        >
          <List size={24} weight="bold" aria-hidden="true" />
        </button>
      </LixiShell>

      <AnimatePresence>
        {isMobileOpen ? (
          <MobileMenu
            isOpen={isMobileOpen}
            onClose={() => setIsMobileOpen(false)}
            currentLanguage={currentLanguage}
            onChangeLanguage={switchLanguage}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
            translate={t}
          />
        ) : null}
      </AnimatePresence>

      <FeedbackDialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen} />
    </header>
  );
}
