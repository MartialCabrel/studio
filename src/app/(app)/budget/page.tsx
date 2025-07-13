import { BudgetClient } from '@/components/budget/budget-client';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function getData(userId: string) {
  const budget = await prisma.budget.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  const savingsAccount = await prisma.savingsAccount.findUnique({
    where: { userId },
  });
  
  const expenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  return { budget, savingsAccount, expenses };
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
