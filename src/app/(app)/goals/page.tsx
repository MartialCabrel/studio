import { GoalsClient } from '@/components/goals/goals-client';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function getGoals(userId: string) {
  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return goals;
}

export default async function GoalsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const goals = await getGoals(user.id);
  const currency = user.user_metadata.currency || 'USD';

  return (
    <div className="space-y-2">
      <GoalsClient initialGoals={goals} currency={currency} />
    </div>
  );
}
