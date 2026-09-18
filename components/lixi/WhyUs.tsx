import { AnimatedView } from '@/components/animations/AnimatedView';
import { ChartNoAxesCombined, Eye, HandCoins, ShieldCheck, type LucideIcon } from 'lucide-react';
import { featureData } from './data';

const featureIcons = {
  statement: ChartNoAxesCombined,
  transparency: ShieldCheck,
  spending: HandCoins,
  tracking: Eye,
} satisfies Record<(typeof featureData)[number]['icon'], LucideIcon>;

export function WhyUs() {
  return (
    <section id="why" className="bg-[#fff7ed] py-20 scroll-mt-27.5">
      <div className="mx-auto w-[min(1180px,94vw)]">
        <div className="mb-8 text-center">
          <h2 className="mb-2.5 text-3xl font-bold sm:text-4xl">
            Tại sao nên lì xì cho chúng tôi?
          </h2>
          <p className="text-[#6a5c55]">Vì vui, vì minh bạch, và vì bảng số nhìn xịn.</p>
        </div>

        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {featureData.map((feature, index) => {
            const Icon = featureIcons[feature.icon];

            return (
              <AnimatedView key={feature.title} delay={index * 0.06}>
                <article className="rounded-[18px] border border-black/6 bg-white/86 p-4.5 shadow-[0_24px_60px_rgba(215,38,61,0.12)] backdrop-blur-md transition hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(215,38,61,0.2)]">
                  <div className="mb-2 grid h-12 w-12 place-items-center rounded-2xl bg-[#d7263d]/8 text-[#d7263d]">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1.5">{feature.title}</h3>
                  <p className="m-0 text-[#6a5c55]">{feature.text}</p>
                </article>
              </AnimatedView>
            );
          })}
        </div>
      </div>
    </section>
  );
}
