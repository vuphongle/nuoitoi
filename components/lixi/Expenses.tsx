'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AnimatedView } from '@/components/animations/AnimatedView';
import { expenseData, type LixiExpense } from './data';

export function Expenses() {
  const [selected, setSelected] = useState<LixiExpense | null>(null);

  return (
    <section id="expenses" className="bg-[#fff7ed] py-20 scroll-mt-27.5">
      <div className="mx-auto w-[min(1180px,94vw)]">
        <div className="mb-8 text-center">
          <h2 className="mb-2.5 text-3xl font-bold sm:text-4xl">Chi tiêu (có sao kê đàng hoàng)</h2>
          <p className="text-[#6a5c55]">
            Chọn mục bất kỳ để xem chi tiết. Không có khoản nào biến mất sau giao thừa.
          </p>
        </div>

        <div className="grid gap-4.5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {expenseData.map((expense, index) => (
            <AnimatedView key={expense.title} delay={index * 0.05}>
              <article className="flex flex-col justify-between min-h-58 relative rounded-[18px] border border-black/6 bg-white p-4.5 shadow-[0_24px_60px_rgba(215,38,61,0.12)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="m-0 font-extrabold truncate max-w-34">{expense.title}</p>
                    <p className="mt-1 mb-0 font-semibold text-[#6a5c55]">{expense.date}</p>
                  </div>
                  <span className="font-extrabold text-[#b91c1c]">{expense.amount}</span>
                </div>
                <p className="my-2.5 mb-3.5 line-clamp-2">{expense.note}</p>
                <button
                  type="button"
                  onClick={() => setSelected(expense)}
                  className="rounded-[14px] border border-black/6 bg-black/4 px-3.5 py-2.5 font-extrabold text-[#1f1a17]"
                >
                  Xem chi tiết
                </button>
              </article>
            </AnimatedView>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-140 rounded-[20px]">
          {selected && (
            <>
              <DialogTitle>{selected.title}</DialogTitle>
              <p className="text-lg font-extrabold text-[#b91c1c]">{selected.amount}</p>
              <p className="text-[#6a5c55]">{selected.date}</p>
              <p>{selected.description}</p>
              <ul className="mt-1.5 list-disc pl-4.5">
                {selected.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
