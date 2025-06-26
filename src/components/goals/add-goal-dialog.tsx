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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addGoal } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  targetAmount: z.coerce
    .number()
    .min(1, 'Target amount must be greater than 0'),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface AddGoalDialogProps {
  children: React.ReactNode;
}

export function AddGoalDialog({ children }: AddGoalDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
  });

  const onSubmit = async (data: GoalFormValues) => {
    try {
      await addGoal(data);
      toast({
        title: 'Goal Added',
        description: 'Your new goal has been saved.',
      });
      reset();
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save goal. Please try again.',
      });
    }
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
                <Input id="name" className="w-full" {...register('name')} />
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
