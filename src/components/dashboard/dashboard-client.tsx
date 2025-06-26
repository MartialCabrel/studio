'use client';

import type { Category, Expense } from '@/lib/types';
import { useState, useMemo } from 'react';
import { AddExpenseDialog } from './add-expense-dialog';
import { ExpenseTable } from './expense-table';
import { AIInsights } from './ai-insights';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DashboardClientProps {
  expenses: Expense[];
  categories: Category[];
}

export function DashboardClient({
  expenses: initialExpenses,
  categories,
}: DashboardClientProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    setExpenses((prev) => [
      { ...newExpense, id: `exp-${Date.now()}` },
      ...prev,
    ]);
  };

  const filteredExpenses = useMemo(() => {
    if (categoryFilter === 'all') {
      return expenses;
    }
    return expenses.filter((expense) => expense.category === categoryFilter);
  }, [expenses, categoryFilter]);

  return (
    <>
      <div className="flex flex-col-reverse items-start gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your recent expenses.
          </p>
        </div>
        <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-start">
          <AddExpenseDialog categories={categories} onAddExpense={handleAddExpense}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </AddExpenseDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Your Expenses</h2>
            <Select onValueChange={setCategoryFilter} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ExpenseTable expenses={filteredExpenses} categories={categories} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">AI Insights</h2>
          <AIInsights expenses={expenses} />
        </div>
      </div>
    </>
  );
}
