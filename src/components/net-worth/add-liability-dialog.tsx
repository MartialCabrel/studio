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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { addLiability } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const liabilitySchema = z.object({
  name: z.string().min(1, 'Liability name is required'),
  balance: z.coerce.number().min(0, 'Balance must be positive'),
  type: z.enum(['Loan', 'Mortgage', 'Credit Card', 'Other']),
});

type LiabilityFormValues = z.infer<typeof liabilitySchema>;

interface AddLiabilityDialogProps {
  children: React.ReactNode;
}

export function AddLiabilityDialog({ children }: AddLiabilityDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LiabilityFormValues>({
    resolver: zodResolver(liabilitySchema),
    defaultValues: { type: 'Other' },
  });

  const onSubmit = async (data: LiabilityFormValues) => {
    try {
      await addLiability(data);
      toast({
        title: 'Liability Added',
        description: 'Your liability has been successfully saved.',
      });
      reset();
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add liability. Please try again.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Liability</DialogTitle>
            <DialogDescription>
              Enter the details of your new liability.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="pt-1 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Balance
              </Label>
              <div className="col-span-3">
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  {...register('balance')}
                />
                {errors.balance && (
                  <p className="pt-1 text-xs text-destructive">
                    {errors.balance.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Loan">Loan</SelectItem>
                        <SelectItem value="Mortgage">Mortgage</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="pt-1 text-xs text-destructive">
                    {errors.type.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Liability'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
