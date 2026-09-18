'use client';

import { cn } from '@/lib/utils';
import { Header } from './Header';
import { Hero } from './Hero';
import { Dashboard } from './Dashboard';
import { Expenses } from './Expenses';
import { WhyUs } from './WhyUs';
import { Commitments } from './Commitments';
import { Compare } from './Compare';
import { DonateCarousel } from './DonateCarousel';
import { Allocation } from './Allocation';
import { Heart } from './Heart';
import { DisclaimerBar, Footer } from './Footer';
import { PetalFireworks } from './PetalFireworks';

interface LixiPageProps {
  className?: string;
  style?: React.CSSProperties;
}

export function LixiPage({ className, style }: LixiPageProps) {
  return (
    <div className={cn('relative bg-[#fff7ed] text-[#1f1a17]', className)} style={style}>
      <Header />
      <PetalFireworks />
      <main>
        <Hero />
        <Dashboard />
        <Expenses />
        <WhyUs />
        <Commitments />
        <Compare />
        <DonateCarousel />
        <Allocation />
        <Heart />
      </main>
      <DisclaimerBar />
      <Footer />
    </div>
  );
}
