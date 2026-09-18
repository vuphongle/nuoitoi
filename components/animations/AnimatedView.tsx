'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { FADE_UP, STAGGER_CONTAINER, TRANSITION_EASE } from './motion-variants';

interface AnimatedViewProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
}

export function AnimatedView({ children, className, delay = 0, stagger = false }: AnimatedViewProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (stagger) {
    return (
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={FADE_UP}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      transition={{ ...TRANSITION_EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
