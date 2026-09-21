'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ArrowDown, Gift, X } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { SUPPORTED_LANGUAGES, type AppLanguage } from '@/constants/lang';
import { navLinks } from './data';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: AppLanguage;
  onChangeLanguage: (language: AppLanguage) => void;
  onOpenFeedback: () => void;
  translate: (key: string) => string;
}

export function MobileMenu({
  isOpen,
  onClose,
  currentLanguage,
  onChangeLanguage,
  onOpenFeedback,
  translate,
}: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Portal target (document.body) only exists client-side.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="lixi-mobile-drawer"
    >
      <div className="lixi-mobile-drawer-topline">
        <div className="lixi-brand-lockup">
          <span className="lixi-brand-mark" aria-hidden="true">
            <Gift size={26} weight="duotone" />
          </span>
          <span className="lixi-brand-copy">
            <strong>{translate('common.brandName')}</strong>
            <small>{translate('header.subtitle')}</small>
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="lixi-mobile-menu-trigger"
          aria-label={translate('mobileMenu.closeMenuAria')}
        >
          <X size={22} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <motion.nav
        className="lixi-mobile-nav"
        aria-label={translate('header.internalLinksAria')}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.035, delayChildren: 0.04 } },
        }}
      >
        {navLinks.map((link, index) => (
          <motion.div
            key={link.href}
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.18 }}
          >
            {link.action === 'feedback' ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFeedback();
                }}
              >
                <span aria-hidden="true">0{index + 1}</span>
                {translate(link.labelKey)}
              </button>
            ) : (
              <a href={link.href} onClick={onClose}>
                <span aria-hidden="true">0{index + 1}</span>
                {translate(link.labelKey)}
              </a>
            )}
          </motion.div>
        ))}
      </motion.nav>

      <div className="lixi-mobile-drawer-footer">
        <div
          className="lixi-language-switcher"
          role="group"
          aria-label={translate('header.languageSelectorAria')}
        >
          {SUPPORTED_LANGUAGES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onChangeLanguage(code)}
              className={cn(currentLanguage === code && 'is-active')}
              aria-pressed={currentLanguage === code}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        <a className="lixi-action lixi-action-primary" href="#donate" onClick={onClose}>
          {translate('common.donateNow')}
          <ArrowDown size={18} weight="bold" aria-hidden="true" />
        </a>
      </div>
    </motion.div>,
    document.body
  );
}
