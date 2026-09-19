'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface Petal {
  id: number;
  left: number;
  duration: number;
  size: number;
}

interface Spark {
  id: number;
  dx: number;
  dy: number;
  tone: 'default' | 'gold' | 'red';
}

interface Burst {
  id: number;
  left: number;
  top: number;
  sparks: Spark[];
}

const PETAL_COUNT = 26;
const SPARK_COUNT = 10;
const SPARK_TONES: Spark['tone'][] = ['default', 'gold', 'red'];

const sparkColor: Record<Spark['tone'], string> = {
  default: 'radial-gradient(circle, #fff, #ffd166 55%, transparent 70%)',
  gold: 'radial-gradient(circle, #fff, #f28c28 55%, transparent 70%)',
  red: 'radial-gradient(circle, #fff, #d7263d 55%, transparent 70%)',
};

export function PetalFireworks() {
  const shouldReduceMotion = useReducedMotion();
  const [petals, setPetals] = useState<Petal[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstIdRef = useRef(0);

  useEffect(() => {
    if (shouldReduceMotion) return;

    // Randomized decoration must be generated client-side only to avoid SSR/hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPetals(
      Array.from({ length: PETAL_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 10 + Math.random() * 8,
        size: 12 + Math.random() * 10,
      }))
    );

    const spawnFirework = () => {
      const id = burstIdRef.current++;
      const sparks: Spark[] = Array.from({ length: SPARK_COUNT }, (_, i) => {
        const angle = (Math.PI * 2 * i) / SPARK_COUNT + Math.random() * 0.4;
        const distance = 40 + Math.random() * 60;
        return {
          id: i,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          tone: SPARK_TONES[Math.floor(Math.random() * SPARK_TONES.length)],
        };
      });

      setBursts((prev) => [
        ...prev,
        { id, left: 10 + Math.random() * 80, top: 12 + Math.random() * 40, sparks },
      ]);

      setTimeout(() => {
        setBursts((prev) => prev.filter((burst) => burst.id !== id));
      }, 950);
    };

    const interval = setInterval(
      spawnFirework,
      1400 + Math.random() * 900
    );

    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-3 overflow-hidden" aria-hidden="true">
        {petals.map((petal) => (
          <motion.span
            key={petal.id}
            className="absolute rounded-[60%_40%_60%_40%] opacity-90 filter-[drop-shadow(0_4px_6px_rgba(0,0,0,0.08))]"
            style={{
              left: `${petal.left}vw`,
              width: petal.size,
              height: petal.size * 0.65,
              background: 'radial-gradient(circle at 30% 30%, #ffd7e4, #f28c28 60%)',
              top: '-12vh',
            }}
            animate={{
              y: ['0vh', '72vh', '122vh'],
              x: [0, 20, 40],
              rotate: [0, 180, 340],
              opacity: [0.9, 0.9, 0],
            }}
            transition={{
              duration: petal.duration,
              repeat: Infinity,
              ease: 'linear',
              times: [0, 0.7, 1],
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none fixed inset-0 z-4 overflow-hidden" aria-hidden="true">
        <AnimatePresence>
          {bursts.map((burst) => (
            <div
              key={burst.id}
              className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${burst.left}%`, top: `${burst.top}vh` }}
            >
              {burst.sparks.map((spark) => (
                <motion.span
                  key={spark.id}
                  className="absolute h-2 w-2 rounded-full"
                  style={{ background: sparkColor[spark.tone] }}
                  initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 1 }}
                  animate={{
                    x: `calc(-50% + ${spark.dx}px)`,
                    y: `calc(-50% + ${spark.dy}px)`,
                    scale: [0, 1, 1.1],
                    opacity: [1, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              ))}
            </div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
