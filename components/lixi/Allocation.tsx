import { allocationData } from './data';

const toneGradient: Record<(typeof allocationData)[number]['tone'], string> = {
  primary: 'linear-gradient(90deg, #d7263d, #f28c28)',
  accent: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
  soft: 'linear-gradient(90deg, #8b5cf6, #c084fc)',
  gold: 'linear-gradient(90deg, #f6c344, #f28c28)',
  danger: 'linear-gradient(90deg, #f87171, #ef4444)',
  muted: 'linear-gradient(90deg, #94a3b8, #64748b)',
};

export function Allocation() {
  return (
    <section id="allocation" className="bg-[#fff7ed] py-20 scroll-mt-27.5">
      <div className="mx-auto w-[min(1180px,94vw)]">
        <div className="mb-8 text-center">
          <h2 className="mb-2.5 text-3xl font-bold sm:text-4xl">Tôi sẽ dùng tiền vào đâu?</h2>
          <p className="text-[#6a5c55]">Biểu đồ minh họa, cập nhật mỗi tuần lễ Tết.</p>
        </div>

        <div className="grid items-start gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          <div className="grid gap-3">
            {allocationData.map((item) => (
              <div
                key={item.label}
                className="rounded-[18px] border border-black/6 bg-white px-3.5 py-3 shadow-[0_24px_60px_rgba(215,38,61,0.12)]"
              >
                <div className="flex justify-between font-extrabold">
                  <span>{item.label}</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-black/5">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${item.percent}%`, background: toneGradient[item.tone] }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-[18px] border border-black/6 bg-white/86 p-4.5 shadow-[0_24px_60px_rgba(215,38,61,0.12)] backdrop-blur-md">
            <p className="mb-2 text-lg font-bold">
              &ldquo;Ưu tiên năng lượng tích cực: đủ ăn, đủ mặc, đủ meme để trả lời inbox.&rdquo;
            </p>
            <p className="m-0 text-[#6a5c55]">Nếu bạn muốn chỉnh tỷ lệ, hãy nhắn — bảng sẽ cập nhật.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
