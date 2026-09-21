import { useI18n } from '@/hooks/useI18n';
import { allocationData } from './data';
import { LixiSection, LixiSectionHeading, LixiShell, LixiSurface } from './ui';

const toneGradient: Record<(typeof allocationData)[number]['tone'], string> = {
  primary: 'linear-gradient(90deg, #d7263d, #f28c28)',
  accent: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
  soft: 'linear-gradient(90deg, #8b5cf6, #c084fc)',
  gold: 'linear-gradient(90deg, #f6c344, #f28c28)',
  danger: 'linear-gradient(90deg, #f87171, #ef4444)',
  muted: 'linear-gradient(90deg, #94a3b8, #64748b)',
};

export function Allocation() {
  const { t } = useI18n('lixi');

  return (
    <LixiSection id="allocation" tone="soft">
      <LixiShell>
        <LixiSectionHeading
          eyebrow="07 / Allocation"
          title={t('allocation.title')}
          description={t('allocation.description')}
        />

        <div className="lixi-allocation-grid">
          <div className="lixi-allocation-list">
            {allocationData.map((item) => (
              <LixiSurface as="article" key={item.id} className="lixi-allocation-item">
                <div className="lixi-allocation-item-heading">
                  <span>{t(`allocation.labels.${item.id}`)}</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="lixi-allocation-bar">
                  <span
                    style={{ width: `${item.percent}%`, background: toneGradient[item.tone] }}
                  />
                </div>
              </LixiSurface>
            ))}
          </div>
          <LixiSurface variant="panel" className="lixi-allocation-note">
            <p>{t('allocation.quote')}</p>
            <p>{t('allocation.note')}</p>
          </LixiSurface>
        </div>
      </LixiShell>
    </LixiSection>
  );
}
