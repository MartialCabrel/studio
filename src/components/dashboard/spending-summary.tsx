'use client';

import { useState } from 'react';
import {
  summarizeSpending,
  type SummarizeSpendingOutput,
} from '@/ai/flows/summarize-spending';
import type { Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { useCurrency } from '@/hooks/use-currency';

interface SpendingSummaryProps {
  expenses: Expense[];
}

export function SpendingSummary({ expenses }: SpendingSummaryProps) {
  const [summary, setSummary] = useState<SummarizeSpendingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formatCurrency } = useCurrency();

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await summarizeSpending({ expenses, period: 'monthly' });
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
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
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
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {summary.topCategories.map((cat) => (
                <li key={cat.category}>
                  {cat.category}:{' '}
                  <span className="font-semibold">
                    {formatCurrency(cat.amount)}
                  </span>
                </li>
              ))}
            </ul>
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
