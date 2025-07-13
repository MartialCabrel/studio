import { BudgetClient } from '@/components/budget/budget-client';
import { archiveAndSaveRemainingBudget } from '@/lib/actions';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { add, isBefore } from 'date-fns';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

async function getData(userId: string) {
  noStore(); // Ensure data is fetched fresh on every request

  const activeBudget = await prisma.budget.findFirst({
    where: { userId, archived: false },
    orderBy: { createdAt: 'desc' },
  });

  if (activeBudget) {
    const now = new Date();
    const budgetStartDate = new Date(activeBudget.createdAt);
    let budgetEndDate: Date;
    switch (activeBudget.period) {
      case 'daily':
        budgetEndDate = add(budgetStartDate, { days: 1 });
        break;
      case 'weekly':
        budgetEndDate = add(budgetStartDate, { weeks: 1 });
        break;
      case 'monthly':
      default:
        budgetEndDate = add(budgetStartDate, { months: 1 });
        break;
    }

    if (isBefore(now, budgetEndDate)) {
      // Budget is still active, do nothing
    } else {
      // Budget period has ended. Archive it and save remaining amount.
      const expensesInPeriod = await prisma.expense.findMany({
        where: {
          userId,
          date: {
            gte: budgetStartDate,
            lt: budgetEndDate,
          },
        },
      });
      const spentAmount = expensesInPeriod.reduce((sum, e) => sum + e.amount, 0);
      await archiveAndSaveRemainingBudget(activeBudget, spentAmount);
      
      // After archiving, we need to refetch data, so we redirect to the same page
      // to trigger a new render cycle with fresh data.
      redirect('/budget');
    }
  }

  const budget = await prisma.budget.findFirst({
    where: { userId, archived: false },
    orderBy: { createdAt: 'desc' },
  });

  const savingsAccount = await prisma.savingsAccount.findUnique({
    where: { userId },
  });

  const expenses = await prisma.expense.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'desc' },
  });

  return {
    budget,
    savingsAccount,
    expenses: expenses.map((e) => ({ ...e, category: e.category.name })),
  };
}

export default async function BudgetPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { budget, savingsAccount, expenses } = await getData(user.id);
  const currency = user.user_metadata.currency || 'USD';

  return (
    <div className="space-y-2">
      <BudgetClient
        initialBudget={budget}
        initialSavingsAccount={savingsAccount}
        expenses={expenses}
        currency={currency}
      />
    </div>
  );
}
