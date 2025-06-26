'use client';

import type { Goal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { GoalCard } from './goal-card';
import { AddGoalDialog } from './add-goal-dialog';

interface GoalsClientProps {
  initialGoals: Goal[];
  currency: string;
}

export function GoalsClient({ initialGoals, currency }: GoalsClientProps) {
  return (
    <>
      <div className="flex flex-col-reverse items-start gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Financial Goals
          </h1>
          <p className="text-muted-foreground">
            Set and track your savings goals.
          </p>
        </div>
        <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-start">
          <AddGoalDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </AddGoalDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initialGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} currency={currency} />
        ))}
        {initialGoals.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            You haven&apos;t set any goals yet. Click &quot;Add Goal&quot; to
            start.
          </div>
        )}
      </div>
    </>
  );
}
