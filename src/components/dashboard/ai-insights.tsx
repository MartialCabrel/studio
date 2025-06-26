'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { SpendingSummary } from './spending-summary';
import { SavingSuggestions } from './saving-suggestions';
import type { Expense } from '@/lib/types';
import { Card } from '../ui/card';

interface AIInsightsProps {
  expenses: Expense[];
}

export function AIInsights({ expenses }: AIInsightsProps) {
  return (
    <Card>
      <Tabs defaultValue="summary">
        <TabsList className="grid w-full grid-cols-2 rounded-b-none rounded-t-lg">
          <TabsTrigger value="summary">Spending Summary</TabsTrigger>
          <TabsTrigger value="suggestions">Saving Suggestions</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="p-4">
          <SpendingSummary expenses={expenses} />
        </TabsContent>
        <TabsContent value="suggestions" className="p-4">
          <SavingSuggestions expenses={expenses} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
