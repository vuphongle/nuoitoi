import { useI18n } from '@/hooks/useI18n';
import { compareBad, compareGood } from './data';

export function Compare() {
  const { t } = useI18n('lixi');

  return (
    <section id="compare" className="bg-[#fff7ed] py-20 scroll-mt-27.5">
      <div className="mx-auto w-[min(1180px,94vw)]">
        <div className="mb-8 text-center">
          <h2 className="mb-2.5 text-3xl font-bold sm:text-4xl">{t('compare.title')}</h2>
          <p className="text-[#6a5c55]">{t('compare.description')}</p>
        </div>

        <div className="grid gap-4.5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          <article className="rounded-[18px] border-t-4 border-t-[#b91c1c] border-black/6 bg-white p-5 shadow-[0_24px_60px_rgba(215,38,61,0.12)]">
            <div className="mb-2 font-extrabold">{t('compare.others')}</div>
            <ul className="m-0 list-disc pl-4.5 text-[#6a5c55]">
              {compareBad.map((key) => (
                <li key={key} className="mb-2">
                  {t(`compare.bad.${key}`)}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-[18px] border-t-4 border-t-[#0f766e] border-black/6 bg-white p-5 shadow-[0_24px_60px_rgba(215,38,61,0.12)]">
            <div className="mb-2 font-extrabold">{t('compare.us')}</div>
            <ul className="m-0 list-disc pl-4.5 text-[#6a5c55]">
              {compareGood.map((key) => (
                <li key={key} className="mb-2">
                  {t(`compare.good.${key}`)}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
