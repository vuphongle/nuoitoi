import { useI18n } from '@/hooks/useI18n';
import { compareBad, compareGood } from './data';
import { LixiSection, LixiSectionHeading, LixiShell, LixiSurface } from './ui';

export function Compare() {
  const { t } = useI18n('lixi');

  return (
    <LixiSection id="compare">
      <LixiShell>
        <LixiSectionHeading
          eyebrow="05 / A playful comparison"
          title={t('compare.title')}
          description={t('compare.description')}
        />

        <div className="lixi-compare-grid">
          <LixiSurface as="article" className="lixi-compare-card lixi-compare-card-muted">
            <div className="lixi-compare-title">{t('compare.others')}</div>
            <ul>
              {compareBad.map((key) => (
                <li key={key}>{t(`compare.bad.${key}`)}</li>
              ))}
            </ul>
          </LixiSurface>
          <LixiSurface as="article" className="lixi-compare-card lixi-compare-card-good">
            <div className="lixi-compare-title">{t('compare.us')}</div>
            <ul>
              {compareGood.map((key) => (
                <li key={key}>{t(`compare.good.${key}`)}</li>
              ))}
            </ul>
          </LixiSurface>
        </div>
      </LixiShell>
    </LixiSection>
  );
}
