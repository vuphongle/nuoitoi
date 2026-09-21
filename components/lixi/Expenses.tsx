'use client';

import { useState } from 'react';
import { ArrowUpRight, Receipt } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AnimatedView } from '@/components/animations/AnimatedView';
import { useI18n } from '@/hooks/useI18n';
import { expenseData, type LixiExpense } from './data';
import { LixiActionButton, LixiSection, LixiSectionHeading, LixiShell, LixiSurface } from './ui';

export function Expenses() {
  const { t, currentLanguage } = useI18n('lixi');
  const [selected, setSelected] = useState<LixiExpense | null>(null);
  const formatAmount = (amount: number) =>
    `${amount < 0 ? '-' : ''}${new Intl.NumberFormat(
      currentLanguage === 'vi' ? 'vi-VN' : 'en-US'
    ).format(Math.abs(amount))}${t('common.currencySuffix')}`;

  return (
    <LixiSection id="expenses">
      <LixiShell>
        <LixiSectionHeading
          eyebrow="02 / Expenses"
          title={t('expenses.title')}
          description={t('expenses.description')}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {expenseData?.map((expense, index) => (
            <AnimatedView className="w-full" key={expense.id} delay={index * 0.05}>
              <LixiSurface as="article" className="flex h-full min-h-71.75 flex-col p-5">
                <div className="flex items-start gap-[0.8rem]">
                  <span className="lixi-expense-icon" aria-hidden="true">
                    <Receipt size={23} weight="duotone" />
                  </span>
                  <div>
                    <p className="lixi-expense-title">{t(expense.titleKey)}</p>
                    <p className="lixi-expense-date">{t(expense.dateKey)}</p>
                  </div>
                </div>
                <p className="lixi-expense-amount">{formatAmount(expense.amount)}</p>
                <p className="lixi-expense-note">{t(expense.noteKey)}</p>
                <LixiActionButton variant="secondary" onClick={() => setSelected(expense)}>
                  <span>{t('expenses.viewDetails')}</span>
                  <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
                </LixiActionButton>
              </LixiSurface>
            </AnimatedView>
          ))}
        </div>
      </LixiShell>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="lixi-dialog-content max-w-140">
          {selected && (
            <>
              <DialogTitle>{t(selected.titleKey)}</DialogTitle>
              <p className="text-lg font-extrabold text-[#b91c1c]">
                {formatAmount(selected.amount)}
              </p>
              <p className="text-[#6a5c55]">{t(selected.dateKey)}</p>
              <p>{t(selected.descriptionKey)}</p>
              <ul className="mt-1.5 list-disc pl-4.5">
                {selected.lineKeys.map((lineKey) => (
                  <li key={lineKey}>{t(lineKey)}</li>
                ))}
              </ul>
            </>
          )}
        </DialogContent>
      </Dialog>
    </LixiSection>
  );
}
