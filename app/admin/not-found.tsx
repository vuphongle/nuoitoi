'use client';

import Link from 'next/link';
import { ArrowLeft, LayoutDashboard, MapPinOff, Settings } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/utils';

export default function AdminNotFound() {
  const { t } = useI18n();

  return (
    <section className="relative isolate flex min-h-[calc(100vh-7rem)] items-center justify-center overflow-hidden py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.10),transparent_28%),radial-gradient(circle_at_80%_70%,hsl(var(--sidebar-active)/0.12),transparent_30%)]" />
      <Card className="w-full max-w-2xl overflow-hidden border-border/70 bg-card/90 shadow-xl backdrop-blur">
        <CardContent className="grid gap-8 p-6 sm:p-10 md:grid-cols-[auto_1fr] md:items-center">
          <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-[2rem] border bg-muted/60 md:mx-0">
            <MapPinOff className="h-14 w-14 text-primary" aria-hidden="true" />
          </div>

          <div className="space-y-5 text-center md:text-left">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                {t('adminNotFound.eyebrow')}
              </p>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {t('adminNotFound.title')}
              </h1>
              <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                {t('adminNotFound.description')}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:justify-start">
              <Link href="/admin/users" className={cn(buttonVariants(), 'min-h-11 gap-2')}>
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                {t('adminNotFound.dashboard')}
              </Link>
              <Link
                href="/admin/settings"
                className={cn(buttonVariants({ variant: 'outline' }), 'min-h-11 gap-2')}
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                {t('adminNotFound.settings')}
              </Link>
            </div>

            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t('adminNotFound.back')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
