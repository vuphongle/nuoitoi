'use client';
import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';

export default function NotFound() {
  const { t } = useI18n();
  const currentLocale = useCurrentLocale();
  return (
    <section className="flex min-h-screen items-center justify-center bg-[#fff7ed] px-4 py-20 text-[#1f1a17]">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-3 text-3xl font-bold">{t('notFound.title')}</h1>
        <p className="mb-8 text-[#6a5c55]">{t('notFound.description')}</p>
        <Link
          href={'/' + currentLocale}
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-4.5 py-3 font-extrabold text-white shadow-[0_16px_34px_rgba(215,38,61,0.25)] transition hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(120deg, #d7263d, #f28c28)' }}
        >
          {t('notFound.backToHome')}
        </Link>
      </div>
    </section>
  );
}
