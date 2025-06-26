'use client';

import type { Goal } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCurrency } from '@/hooks/use-currency';

interface GoalCardProps {
  goal: Goal;
  currency: string;
}

export function GoalCard({ goal, currency }: GoalCardProps) {
  const { formatCurrency } = useCurrency(currency);
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={progress} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(goal.currentAmount)}</span>
            <span>{formatCurrency(goal.targetAmount)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm font-medium">{Math.round(progress)}% complete</p>
      </CardFooter>
    </Card>
  );
}
