import { useI18n } from '@/hooks/useI18n';

export function DisclaimerBar() {
  const { t } = useI18n('lixi');

  return (
    <div className="bg-[#1f1a17] px-2.5 py-3 text-center font-bold text-white">
      {t('footer.disclaimer')}
    </div>
  );
}

export function Footer() {
  const { t } = useI18n('lixi');

  return (
    <footer className="bg-[#fff7ed] py-7 pb-10 text-center text-[#6a5c55]">
      <div className="mx-auto w-[min(1180px,94vw)]">
        <div className="mb-2.5 flex flex-wrap justify-center gap-3">
          <a href="#dashboard" className="font-extrabold text-[#1f1a17]">
            {t('footer.statementLink')}
          </a>
          <a href="#heart" className="font-extrabold text-[#1f1a17]">
            {t('footer.contactLink')}
          </a>
          <a href="#donate" className="font-extrabold text-[#1f1a17]">
            {t('common.donateNow')}
          </a>
        </div>
        <p className="my-1">{t('footer.description')}</p>
        <p className="my-1">{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}
