import { cn } from '@/lib/utils';
import { AnimatedView } from '@/components/animations/AnimatedView';
import { useI18n } from '@/hooks/useI18n';
import { Counter } from './Counter';
import { kpiData } from './data';

const toneClass = {
  positive: 'text-[#047857]',
  negative: 'text-[#b91c1c]',
};

export function Dashboard() {
  const { t } = useI18n('lixi');

  return (
    <section id="dashboard" className="bg-[#fff7ed] py-20 scroll-mt-27.5">
      <div className="mx-auto w-[min(1180px,94vw)]">
        <div className="mb-8 text-center">
          <h2 className="mb-2.5 text-3xl font-bold sm:text-4xl">{t('dashboard.title')}</h2>
          <p className="text-[#6a5c55]">{t('dashboard.description')}</p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi, index) => (
            <AnimatedView key={kpi.id} delay={index * 0.06}>
              <article className="min-h-40.5 relative overflow-hidden rounded-[18px] border border-black/6 bg-white/86 p-4.5 shadow-[0_24px_60px_rgba(215,38,61,0.12)] backdrop-blur-md">
                <div
                  className="pointer-events-none absolute -top-12.5 -right-10 h-30 w-30 rotate-12"
                  style={{
                    background: 'radial-gradient(circle, rgba(215,38,61,0.08), transparent 70%)',
                  }}
                  aria-hidden="true"
                />
                <p className="m-0 font-bold text-[#6a5c55]">
                  {t(`dashboard.kpis.${kpi.id}.label`)}
                </p>
                <p
                  className={cn(
                    'my-1.5 mb-2.5 text-3xl font-extrabold',
                    'tone' in kpi && toneClass[kpi.tone]
                  )}
                >
                  <Counter
                    target={kpi.target}
                    format={'format' in kpi ? kpi.format : undefined}
                    suffix={'suffixKey' in kpi ? t(kpi.suffixKey) : undefined}
                  />
                </p>
                <p className="m-0 text-[#6a5c55]">{t(`dashboard.kpis.${kpi.id}.note`)}</p>
              </article>
            </AnimatedView>
          ))}

          <AnimatedView delay={kpiData.length * 0.06}>
            <article className="relative overflow-hidden rounded-[18px] border-t-4 border-t-[#d7263d] border-black/6 bg-white/86 p-4.5 shadow-[0_24px_60px_rgba(215,38,61,0.12)] backdrop-blur-md">
              <p className="m-0 font-bold text-[#6a5c55]">{t('dashboard.monthlyGoal')}</p>
              <p className="my-1.5 mb-2.5 text-3xl font-extrabold">
                <Counter target={10000000} format="currency" />
              </p>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-black/5"
                aria-label={t('dashboard.goalProgressAria', { percent: 35 })}
              >
                <span
                  className="block h-full rounded-full"
                  style={{ width: '35%', background: 'linear-gradient(90deg, #d7263d, #f28c28)' }}
                />
              </div>
              <p className="m-0 mt-2.5 text-[#6a5c55]">
                {t('dashboard.goalReached', { percent: 35 })}
              </p>
            </article>
          </AnimatedView>
        </div>
      </div>
    </section>
  );
}
