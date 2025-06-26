import { DashboardClient } from '@/components/dashboard/dashboard-client';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function getData(userId: string) {
  const expenses = await prisma.expense.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'desc' },
  });

  const categories = await prisma.category.findMany({
    where: { userId },
  });

  return {
    expenses: expenses.map((e) => ({ ...e, category: e.category.name })),
    categories,
  };
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { expenses, categories } = await getData(user.id);
  const currency = user.user_metadata.currency || 'USD';

  return (
    <div className="space-y-2">
      <DashboardClient
        expenses={expenses}
        categories={categories}
        currency={currency}
      />
    </div>
  );
}
