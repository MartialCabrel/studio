'use client';

import type { Category, Expense } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Icon } from '../icon';
import { useCurrency } from '@/hooks/use-currency';

interface ExpenseTableProps {
  expenses: Expense[];
  categories: Category[];
}

export function ExpenseTable({ expenses, categories }: ExpenseTableProps) {
  const categoryMap = new Map(categories.map((cat) => [cat.name, cat]));
  const { formatCurrency } = useCurrency();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[100px] text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length > 0 ? (
                expenses.map((expense) => {
                  const category = categoryMap.get(expense.category);
                  return (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {category && (
                            <Icon
                              name={category.icon}
                              className="h-4 w-4 text-muted-foreground"
                            />
                          )}
                          <span>{expense.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(expense.date)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No expenses to display.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
