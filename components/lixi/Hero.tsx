import { useI18n } from '@/hooks/useI18n';
import { Counter } from './Counter';

export function Hero() {
  const { t } = useI18n('lixi');
  const highlightKeys = ['dailyStatement', 'clearReceipts', 'funTransparency'] as const;

  return (
    <section id="hero" className="lixi-hero relative overflow-hidden pb-20 pt-27.5">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(50px 50px at 25% 70%, rgba(215,38,61,0.14), transparent 60%), radial-gradient(70px 70px at 80% 65%, rgba(242,140,40,0.12), transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="lixi-hero-grid relative z-[1] mx-auto grid w-[min(1180px,94vw)] items-center gap-6.5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        <div className="lixi-hero-copy">
          <p className="lixi-eyebrow text-sm font-extrabold uppercase tracking-wide">
            {t('hero.eyebrow')}
          </p>
          <h1 className="my-2 text-4xl leading-tight font-bold sm:text-5xl">{t('hero.title')}</h1>
          <p className="mb-4.5 max-w-160 text-[#6a5c55]">{t('hero.description')}</p>
          <div className="mb-3.5 flex w-full flex-wrap gap-3">
            <a
              href="#donate"
              className="lixi-button lixi-button-primary inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4.5 py-3 font-extrabold text-white transition hover:-translate-y-0.5 min-[480px]:flex-none"
            >
              {t('common.donateNow')}
            </a>
            <a
              href="#commit"
              className="lixi-button lixi-button-secondary inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4.5 py-3 font-extrabold transition hover:-translate-y-px min-[480px]:flex-none"
            >
              {t('hero.viewCommitments')}
            </a>
          </div>
          <div className="flex flex-wrap gap-2.5" aria-label={t('hero.highlightsAria')}>
            {highlightKeys.map((key) => (
              <span
                key={key}
                className="lixi-highlight rounded-2xl border border-dashed px-3 py-2 font-bold"
              >
                {t(`hero.highlights.${key}`)}
              </span>
            ))}
          </div>
          <p className="mt-3 mb-2 font-semibold">{t('hero.todayStatus')}</p>
          <div className="lixi-status inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-extrabold">
            {t('hero.priority')}
          </div>
        </div>

        <div className="lixi-hero-board lixi-card relative overflow-hidden rounded-[22px] p-5.5 backdrop-blur-md">
          <div className="mb-3 flex gap-2">
            <span className="inline-flex items-center justify-center rounded-full border border-[#d7263d]/16 bg-[#d7263d]/12 px-3 py-1.75 text-sm font-extrabold text-[#d7263d]">
              {t('hero.realtimeBoard')}
            </span>
            <span className="inline-flex items-center justify-center rounded-full border border-black/6 bg-black/5 px-3 py-1.75 text-sm font-extrabold text-[#6a5c55]">
              {t('hero.funMode')}
            </span>
          </div>
          <div className="rounded-2xl border border-dashed border-black/6 bg-white/82 px-3.5 py-3">
            <div className="flex items-center justify-between gap-2.5 border-b border-dashed border-black/7 py-2.5 font-bold">
              <span className="text-[#6a5c55]">{t('hero.incomeToday')}</span>
              <strong>
                <Counter target={720000} format="currency" />
              </strong>
            </div>
            <div className="flex items-center justify-between gap-2.5 border-b border-dashed border-black/7 py-2.5 font-bold">
              <span className="text-[#6a5c55]">{t('hero.expenseToday')}</span>
              <strong>
                <Counter target={410000} format="currency" />
              </strong>
            </div>
            <div className="flex items-center justify-between gap-2.5 border-b border-dashed border-black/7 py-2.5 font-bold">
              <span className="text-[#6a5c55]">{t('hero.openedEnvelopes')}</span>
              <strong>
                <Counter target={38} suffix={t('hero.envelopeSuffix')} />
              </strong>
            </div>
            <div className="flex items-center justify-between gap-2.5 py-2.5 font-bold">
              <span className="text-[#6a5c55]">{t('hero.statementFrequency')}</span>
              <strong>{t('hero.statementFrequencyValue')}</strong>
            </div>
          </div>
          <div className="mt-4.5">
            <div className="mb-1.5 flex items-center justify-between text-sm text-[#6a5c55]">
              <span>{t('hero.monthlyGoal')}</span>
              <span>
                <Counter target={3500000} format="currency" /> /{' '}
                <Counter target={10000000} format="currency" />
              </span>
            </div>
            <div
              className="h-3 overflow-hidden rounded-full bg-black/6"
              aria-label={t('hero.goalProgressAria', { percent: 35 })}
            >
              <span
                className="block h-full rounded-full shadow-[0_12px_24px_rgba(215,38,61,0.25)]"
                style={{ width: '35%', background: 'linear-gradient(90deg, #d7263d, #f28c28)' }}
              />
            </div>
            <p className="mt-2 font-semibold text-[#6a5c55]">{t('hero.sleeplessMode')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
