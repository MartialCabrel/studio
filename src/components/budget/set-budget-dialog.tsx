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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { setBudget } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { Budget } from '@/lib/types';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { SubmitButton } from '../submit-button';

const budgetSchema = z.object({
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  period: z.enum(['daily', 'weekly', 'monthly'], {
    required_error: 'You need to select a budget period.',
  }),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface SetBudgetDialogProps {
  children: React.ReactNode;
  initialBudget: Budget | null;
  isEditable: boolean;
}

export function SetBudgetDialog({
  children,
  initialBudget,
  isEditable,
}: SetBudgetDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      amount: initialBudget?.amount || undefined,
      period: initialBudget?.period || 'weekly',
    },
  });

  const onSubmit = async (data: BudgetFormValues) => {
    try {
      const result = await setBudget(data);
       if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        reset(data); // keep form values
        setOpen(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to set budget. Please try again.',
      });
    }
  };

  const dialogDisabled = !isEditable && !!initialBudget;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={dialogDisabled}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Set Your Budget</DialogTitle>
            <DialogDescription>
              Define your spending limit for the period. You can only change
              this within 24 hours of setting it.
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
              <Label className="text-right">Period</Label>
              <div className="col-span-3">
                <Controller
                  name="period"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily">Daily</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly">Weekly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.period && (
                  <p className="pt-1 text-xs text-destructive">
                    {errors.period.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <SubmitButton disabled={isSubmitting} loadingText="Saving...">
              Save Budget
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
