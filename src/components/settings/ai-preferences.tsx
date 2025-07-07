'use client';

import * as React from 'react';
import emailjs from '@emailjs/browser';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/card';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { Loader2, Mail } from 'lucide-react';
import type { Expense } from '@/lib/types';
import type { User } from '@supabase/supabase-js';
import { costSavingSuggestions } from '@/ai/flows/cost-saving-suggestions';
import { generateAdviceEmail } from '@/ai/flows/generate-advice-email';

const aiPreferencesSchema = z.object({
  reportFrequency: z.enum(['daily', 'weekly', 'monthly']),
  adviceType: z.string().min(1, 'Please select an advice type.'),
});

type AIPreferencesFormValues = z.infer<typeof aiPreferencesSchema>;

interface AIPreferencesProps {
  user: User;
  expenses: Expense[];
  currency: string;
}

export function AIPreferences({ user, expenses, currency }: AIPreferencesProps) {
  const { toast } = useToast();
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AIPreferencesFormValues>({
    resolver: zodResolver(aiPreferencesSchema),
    defaultValues: {
      reportFrequency: 'weekly',
      adviceType: 'general',
    },
  });

  React.useEffect(() => {
    const savedPrefs = localStorage.getItem('aiPreferences');
    if (savedPrefs) {
      try {
        reset(JSON.parse(savedPrefs));
      } catch (e) {
        console.error('Failed to parse AI preferences from localStorage', e);
      }
    }
  }, [reset]);

  const onSubmit = (data: AIPreferencesFormValues) => {
    localStorage.setItem('aiPreferences', JSON.stringify(data));
    toast({
      title: 'Preferences Saved',
      description: 'Your AI preferences have been updated.',
    });
  };

  const handleSendAdviceEmail = async () => {
    if (!user.email) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User email not found.',
      });
      return;
    }

    if (
      !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ) {
      toast({
        variant: 'destructive',
        title: 'Email Service Not Configured',
        description:
          'Please ask the administrator to configure the email service.',
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      const savedPrefs = localStorage.getItem('aiPreferences');
      const preferences = savedPrefs ? JSON.parse(savedPrefs) : undefined;
      const preparedExpenses = expenses.map((e) => ({
        amount: e.amount,
        category: e.category,
        date: new Date(e.date).toISOString(),
        description: e.description,
      }));

      const suggestions = await costSavingSuggestions({
        expenses: preparedExpenses,
        userPreferences: preferences,
        currency,
      });
      const emailContent = await generateAdviceEmail({
        userName: user.user_metadata.name || 'User',
        suggestions,
      });

      const templateParams = {
        to_name: user.user_metadata.name || 'User',
        to_email: user.email,
        from_name: 'Insightful Expenses',
        subject: emailContent.subject,
        html_body: emailContent.htmlBody,
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      toast({
        title: 'Email Sent!',
        description: 'Your AI financial advice is on its way.',
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send advice email. Please try again.',
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Insights</CardTitle>
        <CardDescription>
          Customize your personalized expense reports and financial advice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Report Frequency</Label>
            <Controller
              name="reportFrequency"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.reportFrequency && (
              <p className="pt-1 text-xs text-destructive">
                {errors.reportFrequency.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Advice Type</Label>
            <Controller
              name="adviceType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select advice type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Savings</SelectItem>
                    <SelectItem value="aggressive">
                      Aggressive Savings
                    </SelectItem>
                    <SelectItem value="investment">
                      Investment Focused
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.adviceType && (
              <p className="pt-1 text-xs text-destructive">
                {errors.adviceType.message}
              </p>
            )}
          </div>
          <Button type="submit">Save Preferences</Button>
        </form>

        <Separator className="my-6" />

        <div className="space-y-2">
          <h3 className="font-semibold">Email Reports</h3>
          <p className="text-sm text-muted-foreground">
            Get your AI-generated financial advice sent directly to your inbox.
          </p>
          <Button onClick={handleSendAdviceEmail} disabled={isSendingEmail}>
            {isSendingEmail ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Email Me My Advice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
