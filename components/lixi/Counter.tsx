'use client';

import CountUp from 'react-countup';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CounterProps {
  target: number;
  format?: 'currency';
  suffix?: string;
  className?: string;
}

export function Counter({ target, format, suffix = '', className }: CounterProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <CountUp
      end={target}
      duration={shouldReduceMotion ? 0 : 1.6}
      separator="."
      suffix={format === 'currency' ? ' đ' : suffix}
      className={cn(className)}
    />
  );
}
