import { categories, expenses } from '@/lib/data';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default function DashboardPage() {
  // In a real application, you would fetch this data from your database.
  const fetchedExpenses = expenses;
  const fetchedCategories = categories;

  return (
    <div className="space-y-4">
      <DashboardClient
        expenses={fetchedExpenses}
        categories={fetchedCategories}
      />
    </div>
  );
}
