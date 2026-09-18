'use client';

import CountUp from 'react-countup';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/hooks/useI18n';

interface CounterProps {
  target: number;
  format?: 'currency';
  suffix?: string;
  className?: string;
}

export function Counter({ target, format, suffix = '', className }: CounterProps) {
  const { t, currentLanguage } = useI18n('lixi');
  const shouldReduceMotion = useReducedMotion();

  return (
    <CountUp
      end={target}
      duration={shouldReduceMotion ? 0 : 1.6}
      separator={currentLanguage === 'vi' ? '.' : ','}
      suffix={format === 'currency' ? t('common.currencySuffix') : suffix}
      className={cn(className)}
    />
  );
}
