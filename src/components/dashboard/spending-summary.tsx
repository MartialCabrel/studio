'use client';

import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
import {
  summarizeSpending,
  type SummarizeSpendingOutput,
} from '@/ai/flows/summarize-spending';
import type { Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useCurrency } from '@/hooks/use-currency';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface SpendingSummaryProps {
  expenses: Expense[];
  currency: string;
}

const chartConfig = {
  amount: {
    label: 'Amount',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function SpendingSummary({ expenses, currency }: SpendingSummaryProps) {
  const [summary, setSummary] = useState<SummarizeSpendingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formatCurrency } = useCurrency(currency);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await summarizeSpending({
        expenses,
        period: 'monthly',
        currency,
      });
      setSummary(result);
    } catch (e) {
      setError('Failed to generate summary. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <h3 className="font-semibold">Spending Summary</h3>
        <p className="text-sm text-muted-foreground">
          Get an AI-generated summary of your spending.
        </p>
      </div>

      {!summary && (
        <Button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Summary
        </Button>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {summary && (
        <div className="space-y-2">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>AI Summary</AlertTitle>
            <AlertDescription>{summary.summary}</AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="font-medium">
              Total Expenditure:{' '}
              <span className="font-bold text-primary">
                {formatCurrency(summary.totalExpenditure)}
              </span>
            </h4>
            <h4 className="font-medium">Top Categories:</h4>
            {summary.topCategories.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart
                  accessibilityLayer
                  data={summary.topCategories}
                  layout="vertical"
                  margin={{ left: 0, right: 50 }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="category"
                    type="category"
                    tickLine={false}
                    tickMargin={5}
                    axisLine={false}
                    tickFormatter={(value) =>
                      value.length > 12 ? `${value.substring(0, 12)}...` : value
                    }
                    className="text-xs"
                    width={80}
                  />
                  <XAxis type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatCurrency(value as number)}
                        indicator="dot"
                      />
                    }
                  />
                  <Bar
                    dataKey="amount"
                    layout="vertical"
                    fill="var(--color-amount)"
                    radius={4}
                  >
                    <LabelList
                      dataKey="amount"
                      position="right"
                      offset={8}
                      className="fill-foreground text-xs"
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground">
                No category data to display.
              </p>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleGenerateSummary}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Regenerate
          </Button>
        </div>
      )}
    </div>
  );
}
