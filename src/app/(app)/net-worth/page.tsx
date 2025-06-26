import { assets, liabilities } from '@/lib/data';
import { NetWorthClient } from '@/components/net-worth/net-worth-client';
import { Separator } from '@/components/ui/separator';
import { NetWorthChart } from '@/components/net-worth/net-worth-chart';

export default function NetWorthPage() {
  // In a real application, you would fetch this data from your database.
  const fetchedAssets = assets;
  const fetchedLiabilities = liabilities;

  return (
    <div className="space-y-4">
       <div className="flex flex-col-reverse items-start gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Net Worth
          </h1>
          <p className="text-muted-foreground">
            Track your assets and liabilities to see your financial health.
          </p>
        </div>
      </div>
      
      <NetWorthClient 
        initialAssets={fetchedAssets} 
        initialLiabilities={fetchedLiabilities} 
      />

      <Separator />

      <NetWorthChart 
        assets={fetchedAssets} 
        liabilities={fetchedLiabilities}
      />

    </div>
  );
}
