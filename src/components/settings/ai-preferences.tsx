'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
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

const aiPreferencesSchema = z.object({
    reportFrequency: z.enum(['daily', 'weekly', 'monthly']),
    adviceType: z.string().min(1, 'Please select an advice type.'),
});

type AIPreferencesFormValues = z.infer<typeof aiPreferencesSchema>;

export function AIPreferences() {
    const { toast } = useToast();
    const { control, handleSubmit, formState: { errors }, reset } = useForm<AIPreferencesFormValues>({
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
            } catch(e) {
                console.error("Failed to parse AI preferences from localStorage", e);
            }
        }
    }, [reset]);

    const onSubmit = (data: AIPreferencesFormValues) => {
        localStorage.setItem('aiPreferences', JSON.stringify(data));
        toast({
            title: "Preferences Saved",
            description: "Your AI preferences have been updated.",
        });
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
                                    <SelectItem value="aggressive">Aggressive Savings</SelectItem>
                                    <SelectItem value="investment">Investment Focused</SelectItem>
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
            </CardContent>
        </Card>
    );
}
