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
import { BackToTop } from './BackToTop';
import { SkipLink } from './SkipLink';

interface LixiPageProps {
  className?: string;
}

export function LixiPage({ className }: LixiPageProps) {
  return (
    <div className={cn('lixi-app lixi-hub relative', className)}>
      <SkipLink />
      <Header />
      <PetalFireworks />
      <main id="lixi-main">
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
      <BackToTop />
    </div>
  );
}
