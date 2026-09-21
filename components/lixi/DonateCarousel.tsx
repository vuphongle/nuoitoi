'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  MagnifyingGlass,
  Pause,
  Play,
  QrCode,
} from '@phosphor-icons/react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { usePublicLixiSessions } from '@/hooks/use-lixi-sessions';
import { useI18n } from '@/hooks/useI18n';
import type { LixiSessionItem } from '@/types';
import { LixiActionButton, LixiSection, LixiSectionHeading, LixiShell, LixiSurface } from './ui';

export function DonateCarousel() {
  const { t } = useI18n('lixi');
  const shouldReduceMotion = useReducedMotion();
  const [autoplay] = useState(() => Autoplay({ delay: 6200, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeImage, setActiveImage] = useState<LixiSessionItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const { data: response, isLoading, isError } = usePublicLixiSessions();
  const sessions = response ?? [];
  const current = sessions[selectedIndex] ?? sessions[0];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Embla exposes the initial snap only after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (shouldReduceMotion) {
      autoplay.stop();
    }
  }, [shouldReduceMotion, autoplay]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, sessions.length]);

  const setAutoplayPaused = (paused: boolean) => {
    setIsPaused(paused);
    if (paused) autoplay.stop();
    else autoplay.play();
  };

  const handleCopy = async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <LixiSection id="donate" tone="accent" className="lixi-donate-section">
      <LixiShell>
        <LixiSectionHeading
          eyebrow={t('donateCarousel.eyebrow')}
          title={t('donateCarousel.title')}
          description={t('donateCarousel.description')}
        />

        <LixiSurface variant="panel" className="lixi-donate-panel">
          <div className="lixi-donate-panel-heading">
            <div>
              <p className="lixi-eyebrow">{t('donateCarousel.recipientListTitle')}</p>
              <h3>
                {sessions.length > 0
                  ? t('donateCarousel.sessionsTitle', { count: sessions.length })
                  : t('donateCarousel.recipientListTitle')}
              </h3>
              <p>{t('donateCarousel.sessionHint')}</p>
            </div>
            <LixiActionButton
              variant="secondary"
              className="lixi-carousel-toggle"
              onClick={() => setAutoplayPaused(!isPaused)}
              aria-pressed={isPaused}
            >
              {isPaused ? (
                <Play size={18} weight="bold" aria-hidden="true" />
              ) : (
                <Pause size={18} weight="bold" aria-hidden="true" />
              )}
              <span>
                {isPaused || shouldReduceMotion
                  ? t('donateCarousel.resume')
                  : t('donateCarousel.pause')}
              </span>
            </LixiActionButton>
          </div>

          <div
            className="lixi-donate-carousel"
            ref={emblaRef}
            onMouseEnter={() => autoplay.stop()}
            onMouseLeave={() => !isPaused && autoplay.play()}
            onFocus={() => autoplay.stop()}
            onBlur={() => !isPaused && autoplay.play()}
          >
            <div className="lixi-donate-slides">
              {isLoading || sessions.length === 0 ? (
                <div className="lixi-donate-slide" role="listitem">
                  <div className="lixi-donate-state">
                    <QrCode size={40} weight="duotone" aria-hidden="true" />
                    <p>
                      {isLoading
                        ? t('donateCarousel.loading')
                        : isError
                          ? t('donateCarousel.loadError')
                          : t('donateCarousel.empty')}
                    </p>
                  </div>
                </div>
              ) : (
                sessions.map((session, index) => (
                  <div key={session.id} className="lixi-donate-slide" role="listitem">
                    <div className="lixi-donate-session">
                      <div className="lixi-donate-session-copy">
                        <div className="lixi-donate-recipient">
                          <button
                            type="button"
                            className="lixi-donate-avatar"
                            onClick={() => setActiveImage(session)}
                            aria-label={t('donateCarousel.viewImageAria', { name: session.name })}
                          >
                            <Image
                              src={session.avatar}
                              alt={t('donateCarousel.imageAlt', { name: session.name })}
                              width={112}
                              height={112}
                              className="h-full w-full object-cover"
                              preload={index === 0}
                            />
                            <span aria-hidden="true">
                              <MagnifyingGlass size={18} weight="bold" />
                            </span>
                          </button>
                          <div>
                            <h4>@{session.name}</h4>
                            <p>{session.tagline}</p>
                          </div>
                        </div>

                        <dl className="lixi-donate-details">
                          <div>
                            <dt>{t('donateCarousel.bank')}</dt>
                            <dd>{session.bank}</dd>
                          </div>
                          <div>
                            <dt>{t('donateCarousel.accountNumber')}</dt>
                            <dd>{session.account}</dd>
                          </div>
                          <div>
                            <dt>{t('donateCarousel.accountOwner')}</dt>
                            <dd>{session.owner}</dd>
                          </div>
                          <div>
                            <dt>{t('donateCarousel.transferContent')}</dt>
                            <dd>{session.content}</dd>
                          </div>
                        </dl>
                      </div>

                      <div className="lixi-donate-qr-card">
                        <p>{t('donateCarousel.sessionQr')}</p>
                        <div className="lixi-donate-qr">
                          <Image
                            src={session.qr}
                            alt={t('donateCarousel.qrAlt', { name: session.name })}
                            width={240}
                            height={240}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <span>{t('donateCarousel.scanHint')}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {sessions.length > 0 ? (
            <>
              <div className="lixi-donate-controls">
                <LixiActionButton
                  variant="secondary"
                  onClick={() => emblaApi?.scrollPrev()}
                  aria-label={t('donateCarousel.previousSessionAria')}
                >
                  <ArrowLeft size={18} weight="bold" aria-hidden="true" />
                  <span>{t('donateCarousel.previous')}</span>
                </LixiActionButton>
                <div
                  className="lixi-donate-dots"
                  aria-label={t('donateCarousel.sessionSelectorAria')}
                >
                  {sessions.map((session, index) => (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => emblaApi?.scrollTo(index)}
                      aria-label={t('donateCarousel.chooseSessionAria', { number: index + 1 })}
                      aria-current={index === selectedIndex}
                      className={cn(index === selectedIndex && 'is-active')}
                    />
                  ))}
                </div>
                <LixiActionButton
                  variant="secondary"
                  onClick={() => emblaApi?.scrollNext()}
                  aria-label={t('donateCarousel.nextSessionAria')}
                >
                  <span>{t('donateCarousel.next')}</span>
                  <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </LixiActionButton>
              </div>

              <div className="lixi-donate-copy-box">
                <label htmlFor="transfer-content">{t('donateCarousel.suggestedContent')}</label>
                <div>
                  <input
                    id="transfer-content"
                    type="text"
                    readOnly
                    value={current?.content ?? ''}
                    aria-live="polite"
                  />
                  <LixiActionButton variant="secondary" onClick={handleCopy}>
                    <Copy size={18} weight="bold" aria-hidden="true" />
                    <span>{copied ? t('donateCarousel.copied') : t('donateCarousel.copy')}</span>
                  </LixiActionButton>
                </div>
                <p>{t('donateCarousel.thankYouHint')}</p>
              </div>
            </>
          ) : null}
        </LixiSurface>
      </LixiShell>

      <Dialog open={!!activeImage} onOpenChange={(open) => !open && setActiveImage(null)}>
        <DialogContent className="lixi-dialog-content lixi-image-dialog max-w-160">
          {activeImage ? (
            <>
              <DialogTitle>{t('donateCarousel.imageDialogTitle')}</DialogTitle>
              <div className="lixi-image-dialog-frame">
                <Image
                  src={activeImage.avatar}
                  alt={t('donateCarousel.imageAlt', { name: activeImage.name })}
                  width={640}
                  height={640}
                  className="h-full w-full object-contain"
                />
              </div>
              <p>
                @{activeImage.name} - {activeImage.tagline}
              </p>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </LixiSection>
  );
}
