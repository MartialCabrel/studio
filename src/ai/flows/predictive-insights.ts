'use server';

/**
 * @fileOverview This file implements the predictive insights flow.
 *
 * The flow analyzes past spending habits to offer predictions on future expenses,
 * helping users anticipate upcoming financial needs.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveInsightsInputSchema = z.object({
  expenses: z.array(
    z.object({
      amount: z.number().describe('The amount of the expense.'),
      category: z.string().describe('The category of the expense.'),
      date: z.string().describe('The date of the expense (ISO format).'),
      description: z.string().describe('A brief description of the expense.'),
    })
  ).describe('An array of historical expense objects.'),
   budget: z.object({
    amount: z.number().describe('The total budget amount.'),
    period: z.enum(['daily', 'weekly', 'monthly']).describe('The budget period.'),
  }).optional().describe('The user\'s current budget, if set.'),
  currency: z.string().describe('The currency of the expenses, e.g., USD, EUR.'),
});

export type PredictiveInsightsInput = z.infer<typeof PredictiveInsightsInputSchema>;

const PredictiveInsightsOutputSchema = z.object({
  predictions: z.array(
    z.object({
      category: z.string().describe('The category of the predicted expense.'),
      predictedAmount: z.number().describe('The predicted amount for this category in the next period.'),
      reasoning: z.string().describe('The reasoning behind the prediction, based on past spending.'),
    })
  ).describe('An array of expense predictions for the upcoming period.'),
  summary: z.string().describe('A brief summary of the predictive insights.'),
});

export type PredictiveInsightsOutput = z.infer<typeof PredictiveInsightsOutputSchema>;

export async function predictiveInsights(input: PredictiveInsightsInput): Promise<PredictiveInsightsOutput> {
  return predictiveInsightsFlow(input);
}

const predictiveInsightsPrompt = ai.definePrompt({
  name: 'predictiveInsightsPrompt',
  input: {schema: PredictiveInsightsInputSchema},
  output: {schema: PredictiveInsightsOutputSchema},
  prompt: `You are a financial analyst AI. Based on the user's past spending habits, predict their expenses for the next month. The currency for all amounts is {{{currency}}}. Mention the currency in your predictions and summary.

{{#if budget}}
User's Current Budget for context:
- Amount: {{{budget.amount}}} {{{currency}}}
- Period: {{{budget.period}}}
This budget may or may not align with historical spending. Use it as context for your summary.
{{/if}}

Historical Expenses:
{{#each expenses}}
- Amount: {{amount}}, Category: {{category}}, Date: {{date}}, Description: {{description}}
{{/each}}

Provide predictions for categories with recurring or significant spending. For each prediction, give a predicted amount and a brief reasoning. Also provide an overall summary of what the user can expect, and mention if their predicted spending is in line with their current budget.`,
});

const predictiveInsightsFlow = ai.defineFlow(
  {
    name: 'predictiveInsightsFlow',
    inputSchema: PredictiveInsightsInputSchema,
    outputSchema: PredictiveInsightsOutputSchema,
  },
  async input => {
    const {output} = await predictiveInsightsPrompt(input);
    return output!;
  }
);
