import { ChartLineUp, EnvelopeOpen, HandCoins, Receipt, Wallet } from '@phosphor-icons/react';
import { AnimatedView } from '@/components/animations/AnimatedView';
import { useI18n } from '@/hooks/useI18n';
import { Counter } from './Counter';
import { kpiData } from './data';
import { LixiIconTile, LixiSection, LixiSectionHeading, LixiShell, LixiSurface } from './ui';

const kpiIcons = [Wallet, EnvelopeOpen, HandCoins, Receipt, ChartLineUp] as const;

export function Dashboard() {
  const { t } = useI18n('lixi');

  return (
    <LixiSection id="dashboard" tone="soft">
      <LixiShell>
        <LixiSectionHeading
          eyebrow="01 / Dashboard"
          title={t('dashboard.title')}
          description={t('dashboard.description')}
        />

        <div className="lixi-dashboard-grid">
          {kpiData.map((kpi, index) => (
            <AnimatedView key={kpi.id} delay={index * 0.06}>
              <LixiSurface as="article" className="lixi-kpi-card">
                <LixiIconTile tone={index === 2 ? 'green' : index === 3 ? 'coral' : 'blue'}>
                  {(() => {
                    const Icon = kpiIcons[index];
                    return <Icon size={24} weight="duotone" aria-hidden="true" />;
                  })()}
                </LixiIconTile>
                <p className="lixi-kpi-label">{t(`dashboard.kpis.${kpi.id}.label`)}</p>
                <p className="lixi-kpi-value">
                  <Counter
                    target={kpi.target}
                    format={'format' in kpi ? kpi.format : undefined}
                    suffix={'suffixKey' in kpi ? t(kpi.suffixKey) : undefined}
                  />
                </p>
                <p className="lixi-kpi-note">{t(`dashboard.kpis.${kpi.id}.note`)}</p>
              </LixiSurface>
            </AnimatedView>
          ))}

          <AnimatedView delay={kpiData.length * 0.06}>
            <LixiSurface as="article" variant="panel" className="lixi-kpi-card lixi-goal-card">
              <div className="lixi-goal-card-heading">
                <div>
                  <p className="lixi-kpi-label">{t('dashboard.monthlyGoal')}</p>
                  <p className="lixi-kpi-value">
                    <Counter target={10000000} format="currency" />
                  </p>
                </div>
                <ChartLineUp size={32} weight="duotone" aria-hidden="true" />
              </div>
              <div
                className="lixi-goal-progress"
                role="progressbar"
                aria-label={t('dashboard.goalProgressAria', { percent: 35 })}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={35}
              >
                <span style={{ width: '35%' }} />
              </div>
              <p className="lixi-kpi-note">{t('dashboard.goalReached', { percent: 35 })}</p>
            </LixiSurface>
          </AnimatedView>
        </div>
      </LixiShell>
    </LixiSection>
  );
}
