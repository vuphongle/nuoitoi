'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/hooks/useI18n';
import { SUPPORTED_LANGUAGES, type AppLanguage } from '@/constants/lang';
import { navLinks } from './data';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: AppLanguage;
  onChangeLanguage: (language: AppLanguage) => void;
  onOpenFeedback: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  currentLanguage,
  onChangeLanguage,
  onOpenFeedback,
}: MobileMenuProps) {
  const { t } = useI18n('lixi');
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
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="lixi-mobile-menu fixed inset-0 z-1100 h-dvh w-screen overflow-y-auto p-5 min-[901px]:hidden"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="grid h-11 w-11 place-items-center rounded-2xl shadow-[0_24px_60px_rgba(215,38,61,0.12)]"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #fff1e6, #ffd2c2 60%, #ffb9a5)',
            }}
            aria-hidden="true"
          >
            🧧
          </div>
          <div className="font-extrabold tracking-wide">{t('common.brandName')}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="lixi-menu-button inline-flex h-11 w-11 items-center justify-center rounded-full border focus-visible:outline-none"
          aria-label={t('mobileMenu.closeMenuAria')}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <motion.nav
        className="mt-10"
        aria-label={t('header.internalLinksAria')}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
        }}
      >
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <motion.li
              key={link.href}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.25 }}
            >
              {link.action === 'feedback' ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFeedback();
                  }}
                  className="lixi-mobile-link block w-full border-b py-4 text-left text-2xl font-extrabold transition-colors"
                >
                  {t(link.labelKey)}
                </button>
              ) : (
                <a
                  href={link.href}
                  onClick={onClose}
                  className="lixi-mobile-link block border-b py-4 text-2xl font-extrabold transition-colors"
                >
                  {t(link.labelKey)}
                </a>
              )}
            </motion.li>
          ))}
        </ul>
      </motion.nav>

      <div className="mt-8 flex items-center gap-3">
        <div
          className="inline-flex rounded-full border border-black/6 bg-black/4 p-1"
          role="group"
          aria-label={t('header.languageSelectorAria')}
        >
          {SUPPORTED_LANGUAGES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onChangeLanguage(code)}
              className={cn(
                'rounded-full px-3 py-1.5 font-bold text-[#6a5c55]',
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
          onClick={onClose}
          className="lixi-button lixi-button-primary flex-1 rounded-2xl px-4 py-3 text-center font-extrabold text-white"
        >
          {t('common.donateNow')}
        </a>
      </div>
    </motion.div>,
    document.body
  );
}
