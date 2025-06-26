'use server';

/**
 * @fileOverview This file implements the cost saving suggestions flow.
 *
 * The flow analyzes user expenses and suggests potential cost-saving opportunities by highlighting unusual or high expenses.
 * It takes expense data as input and returns a list of cost-saving suggestions.
 *
 * @interface CostSavingSuggestionsInput - The input type for the costSavingSuggestions function.
 * @interface CostSavingSuggestionsOutput - The output type for the costSavingSuggestions function.
 * @function costSavingSuggestions - A function that calls the cost saving suggestions flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CostSavingSuggestionsInputSchema = z.object({
  expenses: z.array(
    z.object({
      amount: z.number().describe('The amount of the expense.'),
      category: z.string().describe('The category of the expense.'),
      date: z.string().describe('The date of the expense (ISO format).'),
      description: z.string().describe('A brief description of the expense.'),
    })
  ).describe('An array of expense objects.'),
  userPreferences: z.object({
    reportFrequency: z.enum(['daily', 'weekly', 'monthly']).optional().describe('The user-selected report frequency.'),
    adviceType: z.string().optional().describe('The type of cost saving advice the user wants to receive.'),
  }).optional().describe('User preferences for cost saving suggestions.'),
});

export type CostSavingSuggestionsInput = z.infer<typeof CostSavingSuggestionsInputSchema>;

const CostSavingSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      expenseDescription: z.string().describe('Description of the expense for which the suggestion is made.'),
      reason: z.string().describe('The reason why this expense is flagged as a potential cost saving opportunity.'),
      suggestion: z.string().describe('A suggestion on how to reduce costs related to this expense.'),
    })
  ).describe('An array of cost saving suggestions.'),
});

export type CostSavingSuggestionsOutput = z.infer<typeof CostSavingSuggestionsOutputSchema>;

export async function costSavingSuggestions(input: CostSavingSuggestionsInput): Promise<CostSavingSuggestionsOutput> {
  return costSavingSuggestionsFlow(input);
}

const costSavingSuggestionsPrompt = ai.definePrompt({
  name: 'costSavingSuggestionsPrompt',
  input: {schema: CostSavingSuggestionsInputSchema},
  output: {schema: CostSavingSuggestionsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's expenses and identify potential cost-saving opportunities.

Expenses:
{{#each expenses}}
- Amount: {{amount}}, Category: {{category}}, Date: {{date}}, Description: {{description}}
{{/each}}

User Preferences:
{{#if userPreferences}}
  Report Frequency: {{userPreferences.reportFrequency}}
  Advice Type: {{userPreferences.adviceType}}
{{/if}}

Based on the expenses and user preferences, provide a list of cost-saving suggestions. Highlight any unusual or high expenses and suggest ways to reduce spending in those areas.

Format your suggestions as an array of JSON objects, with each object containing the following keys:
- expenseDescription: Description of the expense for which the suggestion is made.
- reason: The reason why this expense is flagged as a potential cost saving opportunity.
- suggestion: A suggestion on how to reduce costs related to this expense.`,
});

const costSavingSuggestionsFlow = ai.defineFlow(
  {
    name: 'costSavingSuggestionsFlow',
    inputSchema: CostSavingSuggestionsInputSchema,
    outputSchema: CostSavingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await costSavingSuggestionsPrompt(input);
    return output!;
  }
);
