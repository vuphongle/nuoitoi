import { Gift } from '@phosphor-icons/react';
import { useI18n } from '@/hooks/useI18n';
import { LixiShell } from './ui';

export function DisclaimerBar() {
  const { t } = useI18n('lixi');

  return <div className="lixi-disclaimer">{t('footer.disclaimer')}</div>;
}

export function Footer() {
  const { t } = useI18n('lixi');

  return (
    <footer className="lixi-site-footer">
      <LixiShell className="lixi-site-footer-grid">
        <div className="lixi-footer-brand">
          <span className="lixi-brand-mark" aria-hidden="true">
            <Gift size={26} weight="duotone" />
          </span>
          <div>
            <strong>{t('common.brandName')}</strong>
            <p>{t('footer.description')}</p>
          </div>
        </div>

        <nav className="lixi-footer-nav" aria-label={t('header.internalLinksAria')}>
          <a href="#dashboard">{t('footer.statementLink')}</a>
          <a href="#heart">{t('footer.contactLink')}</a>
          <a href="#donate">{t('common.donateNow')}</a>
        </nav>

        <p className="lixi-footer-copyright">{t('footer.copyright')}</p>
      </LixiShell>
    </footer>
  );
}
