import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { isSupportedLanguage } from '@/constants/lang';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isSupportedLanguage(locale)) {
    notFound();
  }

  return children;
}
