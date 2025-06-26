'use client';

import type { Goal } from '@/lib/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { GoalCard } from './goal-card';
import { AddGoalDialog } from './add-goal-dialog';

interface GoalsClientProps {
  initialGoals: Goal[];
}

export function GoalsClient({ initialGoals }: GoalsClientProps) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const handleAddGoal = (newGoal: Omit<Goal, 'id' | 'currentAmount'>) => {
    setGoals((prev) => [
      { ...newGoal, id: `goal-${Date.now()}`, currentAmount: 0 },
      ...prev,
    ]);
  };

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
            <AddGoalDialog onAddGoal={handleAddGoal}>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Goal
                </Button>
            </AddGoalDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
        ))}
        {goals.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
                You haven't set any goals yet.
            </div>
        )}
      </div>
    </>
  );
}
