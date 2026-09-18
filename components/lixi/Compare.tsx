import { compareBad, compareGood } from './data';

export function Compare() {
  return (
    <section id="compare" className="bg-[#fff7ed] py-20 scroll-mt-27.5">
      <div className="mx-auto w-[min(1180px,94vw)]">
        <div className="mb-8 text-center">
          <h2 className="mb-2.5 text-3xl font-bold sm:text-4xl">So sánh vui</h2>
          <p className="text-[#6a5c55]">Không dìm ai, chỉ show cách chúng tôi minh bạch.</p>
        </div>

        <div className="grid gap-4.5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          <article className="rounded-[18px] border-t-4 border-t-[#b91c1c] border-black/6 bg-white p-5 shadow-[0_24px_60px_rgba(215,38,61,0.12)]">
            <div className="mb-2 font-extrabold">❌ Chỗ khác</div>
            <ul className="m-0 list-disc pl-4.5 text-[#6a5c55]">
              {compareBad.map((line) => (
                <li key={line} className="mb-2">
                  {line}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-[18px] border-t-4 border-t-[#0f766e] border-black/6 bg-white p-5 shadow-[0_24px_60px_rgba(215,38,61,0.12)]">
            <div className="mb-2 font-extrabold">✅ Chúng tôi</div>
            <ul className="m-0 list-disc pl-4.5 text-[#6a5c55]">
              {compareGood.map((line) => (
                <li key={line} className="mb-2">
                  {line}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
