import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarCheck,
  Gift,
  MoonStars,
  Receipt,
  SealCheck,
  Smiley,
} from '@phosphor-icons/react';
import { useI18n } from '@/hooks/useI18n';
import { Counter } from './Counter';
import { LixiActionLink, LixiIconTile, LixiShell, LixiSurface } from './ui';

export function Hero() {
  const { t } = useI18n('lixi');
  const highlights = [
    { key: 'dailyStatement', Icon: CalendarCheck },
    { key: 'clearReceipts', Icon: Receipt },
    { key: 'funTransparency', Icon: Smiley },
  ] as const;

  return (
    <section id="hero" className="lixi-hero" aria-labelledby="lixi-hero-title">
      <div className="lixi-hero-orbit lixi-hero-orbit-one" aria-hidden="true" />
      <div className="lixi-hero-orbit lixi-hero-orbit-two" aria-hidden="true" />

      <LixiShell className="lixi-hero-grid">
        <div className="lixi-hero-copy">
          <p className="lixi-hero-kicker">
            <span aria-hidden="true" />
            {t('hero.eyebrow')}
          </p>
          <h1 id="lixi-hero-title">{t('hero.title')}</h1>
          <p className="lixi-hero-description">{t('hero.description')}</p>

          <div className="lixi-hero-actions">
            <LixiActionLink href="#donate">{t('common.donateNow')}</LixiActionLink>
            <LixiActionLink href="#commit" variant="secondary">
              {t('hero.viewCommitments')}
            </LixiActionLink>
          </div>

          <ul className="lixi-hero-highlights" aria-label={t('hero.highlightsAria')}>
            {highlights?.map(({ key, Icon }) => (
              <li key={key} className="w-56.25">
                <Icon size={20} weight="bold" aria-hidden="true" />
                <span>{t(`hero.highlights.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lixi-hero-visual">
          <span className="lixi-hero-spark lixi-hero-spark-one" aria-hidden="true">
            +
          </span>
          <span className="lixi-hero-spark lixi-hero-spark-two" aria-hidden="true">
            +
          </span>

          <LixiSurface variant="panel" className="lixi-hero-window">
            <div className="lixi-hero-window-bar">
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <div className="lixi-hero-window-labels">
                <strong>{t('hero.realtimeBoard')}</strong>
                <span>{t('hero.funMode')}</span>
              </div>
            </div>

            <div className="lixi-hero-window-content">
              <div className="lixi-hero-status-card">
                <LixiIconTile tone="amber" aria-hidden="true">
                  <Gift size={28} weight="duotone" />
                </LixiIconTile>
                <div>
                  <p>{t('hero.todayStatus')}</p>
                  <strong>{t('hero.priority')}</strong>
                </div>
              </div>

              <div className="lixi-hero-stat-grid">
                <article className="lixi-hero-stat lixi-hero-stat-income">
                  <span className="lixi-hero-stat-icon" aria-hidden="true">
                    <ArrowDownLeft size={20} weight="bold" />
                  </span>
                  <p>{t('hero.incomeToday')}</p>
                  <strong>
                    <Counter target={720000} format="currency" />
                  </strong>
                </article>

                <article className="lixi-hero-stat lixi-hero-stat-expense">
                  <span className="lixi-hero-stat-icon" aria-hidden="true">
                    <ArrowUpRight size={20} weight="bold" />
                  </span>
                  <p>{t('hero.expenseToday')}</p>
                  <strong>
                    <Counter target={410000} format="currency" />
                  </strong>
                </article>

                <article className="lixi-hero-stat">
                  <span className="lixi-hero-stat-icon" aria-hidden="true">
                    <SealCheck size={20} weight="bold" />
                  </span>
                  <p>{t('hero.openedEnvelopes')}</p>
                  <strong>
                    <Counter target={38} suffix={t('hero.envelopeSuffix')} />
                  </strong>
                </article>

                <article className="lixi-hero-stat">
                  <span className="lixi-hero-stat-icon" aria-hidden="true">
                    <MoonStars size={20} weight="bold" />
                  </span>
                  <p>{t('hero.statementFrequency')}</p>
                  <strong>{t('hero.statementFrequencyValue')}</strong>
                </article>
              </div>

              <div className="lixi-hero-goal">
                <div className="lixi-hero-goal-copy">
                  <span>{t('hero.monthlyGoal')}</span>
                  <strong>
                    <Counter target={3500000} format="currency" /> /{' '}
                    <Counter target={10000000} format="currency" />
                  </strong>
                </div>
                <div
                  className="lixi-hero-progress"
                  role="progressbar"
                  aria-label={t('hero.goalProgressAria', { percent: 35 })}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={35}
                >
                  <span style={{ width: '35%' }} />
                </div>
                <p>{t('hero.sleeplessMode')}</p>
              </div>
            </div>
          </LixiSurface>
        </div>
      </LixiShell>
    </section>
  );
}
