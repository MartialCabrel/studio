'use server';

/**
 * @fileOverview Formats AI-generated financial advice into a friendly email.
 *
 * - generateAdviceEmail - A function that creates an email subject and body from financial advice.
 * - GenerateAdviceEmailInput - The input type for the function.
 * - GenerateAdviceEmailOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { CostSavingSuggestionsOutput } from './cost-saving-suggestions';

const GenerateAdviceEmailInputSchema = z.object({
  userName: z.string().describe("The user's name."),
  suggestions: z.custom<CostSavingSuggestionsOutput>().describe('The financial suggestions to include in the email.'),
});
export type GenerateAdviceEmailInput = z.infer<
  typeof GenerateAdviceEmailInputSchema
>;

const GenerateAdviceEmailOutputSchema = z.object({
  subject: z.string().describe('The subject line for the email.'),
  htmlBody: z.string().describe('The HTML body of the email.'),
});
export type GenerateAdviceEmailOutput = z.infer<
  typeof GenerateAdviceEmailOutputSchema
>;

export async function generateAdviceEmail(
  input: GenerateAdviceEmailInput
): Promise<GenerateAdviceEmailOutput> {
  return generateAdviceEmailFlow(input);
}

const generateAdviceEmailPrompt = ai.definePrompt({
  name: 'generateAdviceEmailPrompt',
  input: {schema: GenerateAdviceEmailInputSchema},
  output: {schema: GenerateAdviceEmailOutputSchema},
  prompt: `You are a friendly and encouraging financial assistant for an app called "Insightful Expenses".

Your task is to write a personalized email to a user with some financial advice you have generated.

The user's name is {{{userName}}}.

Here are the suggestions:
{{#each suggestions.suggestions}}
- **{{this.expenseDescription}}**: {{this.suggestion}} (Reason: {{this.reason}})
{{/each}}
{{#if (eq suggestions.suggestions.length 0)}}
You're doing great! We didn't find any specific saving opportunities this time. Keep up the great work with your budgeting.
{{/if}}

Please write a concise, friendly, and encouraging email. The subject line should be catchy and positive. The body should be in HTML format. Start by greeting the user by name. Present the suggestions in a clear, easy-to-read format (like a list). End with a positive and motivating closing.
`,
});

const generateAdviceEmailFlow = ai.defineFlow(
  {
    name: 'generateAdviceEmailFlow',
    inputSchema: GenerateAdviceEmailInputSchema,
    outputSchema: GenerateAdviceEmailOutputSchema,
  },
  async (input) => {
    const {output} = await generateAdviceEmailPrompt(input);
    return output!;
  }
);
