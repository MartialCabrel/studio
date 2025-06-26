import { goals } from '@/lib/data';
import { GoalsClient } from '@/components/goals/goals-client';

export default function GoalsPage() {
  // In a real application, you would fetch this data from your database.
  const fetchedGoals = goals;

  return (
    <div className="space-y-4">
      <GoalsClient initialGoals={fetchedGoals} />
    </div>
  );
}
