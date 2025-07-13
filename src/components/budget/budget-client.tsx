'use client';

import type { Budget, SavingsAccount, Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { SetBudgetDialog } from './set-budget-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useCurrency } from '@/hooks/use-currency';
import { Progress } from '../ui/progress';
import { useMemo } from 'react';
import { add, isWithinInterval, isAfter, subDays } from 'date-fns';

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
  const { formatCurrency } = useCurrency(currency);

  const { spentAmount, budgetProgress, isEditable, periodDisplay } =
    useMemo(() => {
      if (!initialBudget) {
        return {
          spentAmount: 0,
          budgetProgress: 0,
          isEditable: true,
          periodDisplay: 'No budget set',
        };
      }

      const budgetStartDate = new Date(initialBudget.createdAt);
      let intervalEnd: Date;
      let periodDisplay: string;

      switch (initialBudget.period) {
        case 'daily':
          intervalEnd = add(budgetStartDate, { days: 1 });
          periodDisplay = 'Daily';
          break;
        case 'weekly':
          intervalEnd = add(budgetStartDate, { weeks: 1 });
          periodDisplay = 'Weekly';
          break;
        case 'monthly':
        default:
          intervalEnd = add(budgetStartDate, { months: 1 });
          periodDisplay = 'Monthly';
          break;
      }

      const twentyFourHoursAgo = subDays(new Date(), 1);
      const isEditable = isAfter(budgetStartDate, twentyFourHoursAgo);

      const spentAmount = expenses
        .filter((e) =>
          isWithinInterval(new Date(e.date), {
            start: budgetStartDate,
            end: intervalEnd,
          })
        )
        .reduce((sum, e) => sum + e.amount, 0);

      const budgetProgress =
        initialBudget.amount > 0
          ? (spentAmount / initialBudget.amount) * 100
          : 0;

      return { spentAmount, budgetProgress, isEditable, periodDisplay };
    }, [initialBudget, expenses]);

  const remainingBudget = initialBudget
    ? initialBudget.amount - spentAmount
    : 0;

  return (
    <>
      <div className="flex flex-col-reverse items-start gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
          <p className="text-muted-foreground">
            Manage your budget and savings.
          </p>
        </div>
        <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-start">
          <SetBudgetDialog
            initialBudget={initialBudget}
            isEditable={isEditable}
          >
            <Button disabled={!!initialBudget && !isEditable}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {initialBudget ? 'Update Budget' : 'Set Budget'}
            </Button>
          </SetBudgetDialog>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{periodDisplay} Budget</CardTitle>
          </CardHeader>
          <CardContent>
            {initialBudget ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Spent</span>
                    <span>{formatCurrency(spentAmount)}</span>
                  </div>
                  <Progress value={budgetProgress} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Remaining: {formatCurrency(remainingBudget)}</span>
                    <span>Total: {formatCurrency(initialBudget.amount)}</span>
                  </div>
                </div>
                {isEditable && (
                  <p className="text-xs text-muted-foreground">
                    You can edit your budget for the next 24 hours.
                  </p>
                )}
                 {!isEditable && (
                  <p className="text-xs text-muted-foreground">
                    A new budget can be set once the current period ends.
                  </p>
                )}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-muted-foreground">
                  You haven&apos;t set a budget yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Savings Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(initialSavingsAccount?.balance ?? 0)}
            </div>
            <p className="text-sm text-muted-foreground">
              Your accumulated savings.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
