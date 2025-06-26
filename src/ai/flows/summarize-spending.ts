// Summarize spending patterns and provide a concise summary.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSpendingInputSchema = z.object({
  expenses: z.array(
    z.object({
      amount: z.number().describe('The amount of the expense.'),
      category: z.string().describe('The category of the expense.'),
      date: z.string().describe('The date of the expense.'),
      description: z.string().describe('A description of the expense.'),
    })
  ).describe('A list of expenses to summarize.'),
  period: z.string().describe('The period for which to summarize spending, e.g., daily, weekly, or monthly.'),
  currency: z.string().describe('The currency of the expenses, e.g., USD, EUR.'),
});
export type SummarizeSpendingInput = z.infer<typeof SummarizeSpendingInputSchema>;

const SummarizeSpendingOutputSchema = z.object({
  totalExpenditure: z.number().describe('The total expenditure for the selected period.'),
  topCategories: z.array(
    z.object({
      category: z.string().describe('The category of the expense.'),
      amount: z.number().describe('The total amount spent in this category.'),
    })
  ).describe('The top categories by expenditure for the selected period.'),
  summary: z.string().describe('A concise summary of the spending patterns.'),
});
export type SummarizeSpendingOutput = z.infer<typeof SummarizeSpendingOutputSchema>;

export async function summarizeSpending(input: SummarizeSpendingInput): Promise<SummarizeSpendingOutput> {
  return summarizeSpendingFlow(input);
}

const summarizeSpendingPrompt = ai.definePrompt({
  name: 'summarizeSpendingPrompt',
  input: {schema: SummarizeSpendingInputSchema},
  output: {schema: SummarizeSpendingOutputSchema},
  prompt: `Analyze the following expenses for the selected period and provide a concise summary of the total expenditure, top categories, and overall spending patterns. The amounts are in {{{currency}}}. Make sure to mention the currency in your summary.

Period: {{{period}}}

Expenses:
{{#each expenses}}
- Amount: {{{amount}}}, Category: {{{category}}}, Date: {{{date}}}, Description: {{{description}}}
{{/each}}

Summary:`,
});

const summarizeSpendingFlow = ai.defineFlow(
  {
    name: 'summarizeSpendingFlow',
    inputSchema: SummarizeSpendingInputSchema,
    outputSchema: SummarizeSpendingOutputSchema,
  },
  async input => {
    // Calculate total expenditure
    const totalExpenditure = input.expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate top categories
    const categoryTotals: {[category: string]: number} = {};
    input.expenses.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    const topCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5) // Get top 5 categories for the chart
      .map(([category, amount]) => ({category, amount}));

    const {output} = await summarizeSpendingPrompt({
      ...input,
    });

    return {
      totalExpenditure,
      topCategories,
      summary: output!.summary,
    };
  }
);
