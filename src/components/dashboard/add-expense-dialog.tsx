'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category, Expense } from '@/lib/types';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { categorizeExpense } from '@/ai/flows/categorize-expense';
import { addExpense } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const expenseSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  date: z.date({ required_error: 'Date is required' }),
  description: z.string().min(1, 'Description is required'),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface AddExpenseDialogProps {
  children: React.ReactNode;
  categories: Category[];
}

export function AddExpenseDialog({
  children,
  categories,
}: AddExpenseDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isCategorizing, setIsCategorizing] = React.useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
  });

  const descriptionValue = useWatch({
    control,
    name: 'description',
    defaultValue: '',
  });

  React.useEffect(() => {
    if (!descriptionValue || descriptionValue.trim().length < 4) {
      return;
    }

    const handler = setTimeout(() => {
      const suggestCategory = async () => {
        setIsCategorizing(true);
        try {
          const categoryNames = categories.map((c) => c.name);
          const result = await categorizeExpense({
            description: descriptionValue,
            categories: categoryNames,
          });
          if (
            result &&
            result.category &&
            categoryNames.includes(result.category)
          ) {
            setValue('category', result.category, { shouldValidate: true });
          }
        } catch (e) {
          console.error('Failed to get AI category suggestion.', e);
        } finally {
          setIsCategorizing(false);
        }
      };
      suggestCategory();
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [descriptionValue, categories, setValue]);

  const onSubmit = async (data: ExpenseFormValues) => {
    try {
      await addExpense(data);
      toast({
        title: 'Expense Added',
        description: 'Your expense has been successfully saved.',
      });
      reset();
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add expense. Please try again.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the details of your expense below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  className="w-full"
                  {...register('amount')}
                />
                {errors.amount && (
                  <p className="pt-1 text-xs text-destructive">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="description"
                  className="w-full pr-8"
                  {...register('description')}
                  autoComplete="off"
                />
                {isCategorizing && (
                  <Sparkles className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-pulse text-primary" />
                )}
                {errors.description && (
                  <p className="pt-1 text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="pt-1 text-xs text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.date && (
                  <p className="pt-1 text-xs text-destructive">
                    {errors.date.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
