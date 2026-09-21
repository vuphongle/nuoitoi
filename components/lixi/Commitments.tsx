import { useI18n } from '@/hooks/useI18n';
import { commitData } from './data';
import { LixiSection, LixiSectionHeading, LixiShell } from './ui';

export function Commitments() {
  const { t } = useI18n('lixi');

  return (
    <LixiSection id="commit" tone="soft">
      <LixiShell>
        <div className="lixi-commitment-panel">
          <LixiSectionHeading
            eyebrow="04 / Commitments"
            title={t('commitments.title')}
            description={t('commitments.description')}
          />
          <ul className="lixi-commitment-grid">
            {commitData.map((item) => (
              <li key={item}>
                <strong>{t(`commitments.items.${item}.title`)}</strong>{' '}
                {t(`commitments.items.${item}.text`)}
              </li>
            ))}
          </ul>
        </div>
      </LixiShell>
    </LixiSection>
  );
}
