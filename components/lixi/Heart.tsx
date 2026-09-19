import { useI18n } from '@/hooks/useI18n';

export function Heart() {
  const { t } = useI18n('lixi');

  return (
    <section id="heart" className="bg-[#fff7ed] py-20 scroll-mt-27.5">
      <div className="mx-auto grid w-[min(1180px,94vw)] gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <div className="rounded-[18px] border border-black/6 bg-white p-4.5 shadow-[0_24px_60px_rgba(215,38,61,0.12)]">
          <h2 className="mb-2.5">{t('heart.title')}</h2>
          <p className="my-2.5">{t('heart.firstParagraph')}</p>
          <p className="my-2.5">{t('heart.secondParagraph')}</p>
        </div>
        <div className="rounded-[18px] border border-[#f6c344]/40 bg-[#fff7e1] p-4.5 shadow-[0_24px_60px_rgba(215,38,61,0.12)]">
          <h3 className="mb-2.5">{t('heart.disclaimerTitle')}</h3>
          <p className="my-2.5">{t('heart.disclaimer')}</p>
        </div>
      </div>
    </section>
  );
}
