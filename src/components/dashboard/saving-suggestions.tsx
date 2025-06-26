'use client';

import { useState, useEffect } from 'react';
import {
  costSavingSuggestions,
  type CostSavingSuggestionsOutput,
  type CostSavingSuggestionsInput,
} from '@/ai/flows/cost-saving-suggestions';
import type { Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useCurrency } from '@/hooks/use-currency';

interface SavingSuggestionsProps {
  expenses: Expense[];
}

export function SavingSuggestions({ expenses }: SavingSuggestionsProps) {
  const [suggestions, setSuggestions] =
    useState<CostSavingSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<CostSavingSuggestionsInput['userPreferences'] | undefined>(undefined);
  const { currency } = useCurrency();
    
  useEffect(() => {
    const savedPrefs = localStorage.getItem('aiPreferences');
    if (savedPrefs) {
        try {
            setPreferences(JSON.parse(savedPrefs));
        } catch (e) {
            console.error("Failed to parse AI preferences from localStorage", e);
        }
    }
  }, []);

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await costSavingSuggestions({ expenses, userPreferences: preferences, currency });
      setSuggestions(result);
    } catch (e) {
      setError('Failed to generate suggestions. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Saving Suggestions</h3>
        <p className="text-sm text-muted-foreground">
          Let AI find potential ways for you to save money.
        </p>
      </div>

      {!suggestions && (
        <Button
          onClick={handleGenerateSuggestions}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Get Suggestions
        </Button>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestions && (
        <div className="space-y-4">
          {suggestions.suggestions.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {suggestions.suggestions.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2 text-left">
                      <Lightbulb className="h-4 w-4 shrink-0 text-primary" />
                      <span className="font-medium">
                        {item.expenseDescription}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2 text-sm text-muted-foreground">
                      <strong>Reason:</strong> {item.reason}
                    </p>
                    <p className="text-sm">
                      <strong>Suggestion:</strong> {item.suggestion}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Alert>
              <AlertTitle>All Clear!</AlertTitle>
              <AlertDescription>
                AI couldn&apos;t find any specific saving suggestions right now.
                Keep up the good work!
              </AlertDescription>
            </Alert>
          )}

          <Button
            variant="outline"
            onClick={handleGenerateSuggestions}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Regenerate
          </Button>
        </div>
      )}
    </div>
  );
}
