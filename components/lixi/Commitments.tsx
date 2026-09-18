import { useI18n } from '@/hooks/useI18n';
import { commitData } from './data';

export function Commitments() {
  const { t } = useI18n('lixi');

  return (
    <section id="commit" className="bg-[#fff7ed] py-20 scroll-mt-27.5">
      <div className="mx-auto w-[min(1180px,94vw)]">
        <div
          className="rounded-[22px] border border-black/6 p-6.5 shadow-[0_24px_60px_rgba(215,38,61,0.12)]"
          style={{ background: 'linear-gradient(135deg, #fff5e5, #ffe7f0)' }}
        >
          <h2 className="mb-2.5">{t('commitments.title')}</h2>
          <p className="mb-3 text-[#6a5c55]">{t('commitments.description')}</p>
          <ul className="grid list-none gap-2.5 p-0 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {commitData.map((item) => (
              <li
                key={item}
                className="rounded-[14px] border border-dashed border-black/7 bg-white/90 p-3"
              >
                <strong>{t(`commitments.items.${item}.title`)}</strong>{' '}
                {t(`commitments.items.${item}.text`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
