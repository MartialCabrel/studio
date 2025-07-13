'use client';

import type { Budget, SavingsAccount, Expense } from '@/lib/types';

interface BudgetClientProps {
  initialBudget: Budget | null;
  initialSavingsAccount: SavingsAccount | null;
  expenses: Expense[];
  currency: string;
}

export function BudgetClient({
  initialBudget,
  initialSavingsAccount,
  expenses,
  currency,
}: BudgetClientProps) {
  return (
    <>
      <div className="flex flex-col-reverse items-start gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
          <p className="text-muted-foreground">
            Manage your budget and savings.
          </p>
        </div>
      </div>
      <div>
        <p>Budgeting features will be implemented here.</p>
      </div>
    </>
  );
}
