import { NetWorthClient } from '@/components/net-worth/net-worth-client';
import { Separator } from '@/components/ui/separator';
import { NetWorthChart } from '@/components/net-worth/net-worth-chart';
import { HistoricalNetWorthChart } from '@/components/net-worth/historical-net-worth-chart';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function getData(userId: string) {
  const assets = await prisma.asset.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  const liabilities = await prisma.liability.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  const netWorthHistory = await prisma.netWorthHistory.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  });

  return { assets, liabilities, netWorthHistory };
}

export default async function NetWorthPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { assets, liabilities, netWorthHistory } = await getData(user.id);
  const currency = user.user_metadata.currency || 'USD';

  return (
    <div className="space-y-2">
      <div className="flex flex-col-reverse items-start gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Net Worth</h1>
          <p className="text-muted-foreground">
            Track your assets and liabilities to see your financial health.
          </p>
        </div>
      </div>

      <NetWorthClient
        initialAssets={assets}
        initialLiabilities={liabilities}
        currency={currency}
      />

      <Separator />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NetWorthChart
          assets={assets}
          liabilities={liabilities}
          currency={currency}
        />
        <HistoricalNetWorthChart
          history={netWorthHistory}
          currency={currency}
        />
      </div>
    </div>
  );
}
