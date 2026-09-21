import { useI18n } from '@/hooks/useI18n';
import { LixiSection, LixiShell, LixiSurface } from './ui';

export function Heart() {
  const { t } = useI18n('lixi');

  return (
    <LixiSection id="heart">
      <LixiShell className="lixi-heart-grid">
        <LixiSurface as="article" className="lixi-heart-message">
          <p className="lixi-eyebrow">08 / With heart</p>
          <h2>{t('heart.title')}</h2>
          <p>{t('heart.firstParagraph')}</p>
          <p>{t('heart.secondParagraph')}</p>
        </LixiSurface>
        <LixiSurface as="aside" variant="panel" className="lixi-heart-disclaimer">
          <p className="lixi-eyebrow">{t('heart.disclaimerTitle')}</p>
          <p>{t('heart.disclaimer')}</p>
        </LixiSurface>
      </LixiShell>
    </LixiSection>
  );
}
