import type { Transition, Variants } from 'framer-motion';

export const FADE_UP: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const FADE_IN: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const STAGGER_CONTAINER: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const SLIDE_IN_LEFT: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export const SLIDE_IN_RIGHT: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

export const SCALE_HOVER: Variants = {
  hover: {
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
  tap: {
    scale: 0.98,
  },
};

export const TRANSITION_SPRING: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
};

export const TRANSITION_EASE: Transition = {
  type: 'tween',
  ease: [0.22, 1, 0.36, 1],
  duration: 0.6,
};
