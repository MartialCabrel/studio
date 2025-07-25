'use client';

import { useState } from 'react';
import {
  predictiveInsights,
  type PredictiveInsightsOutput,
} from '@/ai/flows/predictive-insights';
import type { Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useCurrency } from '@/hooks/use-currency';

interface PredictiveInsightsProps {
  expenses: Expense[];
  currency: string;
}

export function PredictiveInsights({
  expenses,
  currency,
}: PredictiveInsightsProps) {
  const [prediction, setPrediction] =
    useState<PredictiveInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { formatCurrency } = useCurrency(currency);

  const handleGeneratePrediction = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const preparedExpenses = expenses.map((e) => ({
        amount: e.amount,
        category: e.category,
        date: new Date(e.date).toISOString(),
        description: e.description,
      }));
      const result = await predictiveInsights({
        expenses: preparedExpenses,
        currency,
      });
      setPrediction(result);
    } catch (e) {
      setError('Failed to generate predictions. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <h3 className="font-semibold">Predictive Insights</h3>
        <p className="text-sm text-muted-foreground">
          See what your spending might look like next month.
        </p>
      </div>

      {!prediction && (
        <Button
          onClick={handleGeneratePrediction}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Predictions
        </Button>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {prediction && (
        <div className="space-y-2">
          <Alert>
            <AlertTitle>Prediction Summary</AlertTitle>
            <AlertDescription>{prediction.summary}</AlertDescription>
          </Alert>
          {prediction.predictions.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {prediction.predictions.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2 text-left">
                      <TrendingUp className="h-4 w-4 shrink-0 text-primary" />
                      <span className="font-medium">
                        {item.category}: ~{formatCurrency(item.predictedAmount)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      {item.reasoning}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Alert>
              <AlertTitle>Not Enough Data</AlertTitle>
              <AlertDescription>
                AI couldn&apos;t generate predictions due to insufficient
                spending history.
              </AlertDescription>
            </Alert>
          )}

          <Button
            variant="outline"
            onClick={handleGeneratePrediction}
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
