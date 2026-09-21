import { AnimatedView } from '@/components/animations/AnimatedView';
import { ChartLineUp, Eye, HandCoins, ShieldCheck, type Icon } from '@phosphor-icons/react';
import { useI18n } from '@/hooks/useI18n';
import { featureData } from './data';

const featureIcons = {
  statement: ChartLineUp,
  transparency: ShieldCheck,
  spending: HandCoins,
  tracking: Eye,
} satisfies Record<(typeof featureData)[number]['icon'], Icon>;

export function WhyUs() {
  const { t } = useI18n('lixi');

  return (
    <section id="why" className="lixi-section lixi-section-soft">
      <div className="lixi-shell">
        <div className="lixi-section-heading">
          <p className="lixi-eyebrow">03 / Why this works</p>
          <h2>{t('whyUs.title')}</h2>
          <p className="lixi-section-description">{t('whyUs.description')}</p>
        </div>

        <div className="lixi-feature-grid">
          {featureData.map((feature, index) => {
            const Icon = featureIcons[feature.icon];

            return (
              <AnimatedView key={feature.id} delay={index * 0.06}>
                <article className="lixi-feature-card lixi-surface lixi-surface-card">
                  <div className="lixi-feature-icon">
                    <Icon aria-hidden="true" size={26} weight="duotone" />
                  </div>
                  <h3>{t(`whyUs.features.${feature.id}.title`)}</h3>
                  <p>{t(`whyUs.features.${feature.id}.text`)}</p>
                </article>
              </AnimatedView>
            );
          })}
        </div>
      </div>
    </section>
  );
}
