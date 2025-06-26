'use server';

/**
 * @fileOverview An AI flow to automatically categorize expenses.
 *
 * - categorizeExpense - A function that suggests a category for an expense based on its description.
 * - CategorizeExpenseInput - The input type for the categorizeExpense function.
 * - CategorizeExpenseOutput - The return type for the categorizeExpense function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeExpenseInputSchema = z.object({
  description: z.string().describe('The description of the expense.'),
  categories: z
    .array(z.string())
    .describe('The list of available categories to choose from.'),
});
export type CategorizeExpenseInput = z.infer<
  typeof CategorizeExpenseInputSchema
>;

const CategorizeExpenseOutputSchema = z.object({
  category: z.string().describe('The suggested category for the expense.'),
});
export type CategorizeExpenseOutput = z.infer<
  typeof CategorizeExpenseOutputSchema
>;

export async function categorizeExpense(
  input: CategorizeExpenseInput
): Promise<CategorizeExpenseOutput> {
  return categorizeExpenseFlow(input);
}

const categorizeExpensePrompt = ai.definePrompt({
  name: 'categorizeExpensePrompt',
  input: {schema: CategorizeExpenseInputSchema},
  output: {schema: CategorizeExpenseOutputSchema},
  prompt: `You are an expert at categorizing personal expenses. Based on the expense description, choose the most appropriate category from the provided list.

Available Categories:
{{#each categories}}
- {{{this}}}
{{/each}}

Expense Description:
"{{{description}}}"

Analyze the description and select one category from the list that best fits.`,
});

const categorizeExpenseFlow = ai.defineFlow(
  {
    name: 'categorizeExpenseFlow',
    inputSchema: CategorizeExpenseInputSchema,
    outputSchema: CategorizeExpenseOutputSchema,
  },
  async (input) => {
    const {output} = await categorizeExpensePrompt(input);
    return output!;
  }
);
