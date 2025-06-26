'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { SpendingSummary } from './spending-summary';
import { SavingSuggestions } from './saving-suggestions';
import { PredictiveInsights } from './predictive-insights';
import type { Expense } from '@/lib/types';
import { Card } from '../ui/card';

interface AIInsightsProps {
  expenses: Expense[];
  currency: string;
}

export function AIInsights({ expenses, currency }: AIInsightsProps) {
  return (
    <Card>
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-b-none rounded-t-lg">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="p-2">
          <SpendingSummary expenses={expenses} currency={currency} />
        </TabsContent>
        <TabsContent value="suggestions" className="p-2">
          <SavingSuggestions expenses={expenses} currency={currency} />
        </TabsContent>
        <TabsContent value="predictions" className="p-2">
          <PredictiveInsights expenses={expenses} currency={currency} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
