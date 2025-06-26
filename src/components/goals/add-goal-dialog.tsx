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
import type { Goal } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  targetAmount: z.coerce.number().min(1, 'Target amount must be greater than 0'),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface AddGoalDialogProps {
  children: React.ReactNode;
  onAddGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
}

export function AddGoalDialog({
  children,
  onAddGoal,
}: AddGoalDialogProps) {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
  });

  const onSubmit = (data: GoalFormValues) => {
    onAddGoal(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>
              Enter the details for your new savings goal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  className="w-full"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="pt-1 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetAmount" className="text-right">
                Target
              </Label>
              <div className="col-span-3">
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  className="w-full"
                  {...register('targetAmount')}
                />
                {errors.targetAmount && (
                  <p className="pt-1 text-xs text-destructive">
                    {errors.targetAmount.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
