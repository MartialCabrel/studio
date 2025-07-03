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
  prompt: `You are an AI assistant for "Insightful Expenses". Your task is to generate a personalized financial advice email.

**User's Name:**
{{{userName}}}

**Financial Suggestions:**
{{#if (gt suggestions.suggestions.length 0)}}
<p>Here are your personalized financial insights:</p>
<ul>
{{#each suggestions.suggestions}}
<li><strong>{{this.expenseDescription}}</strong>: {{this.suggestion}} (Reason: {{this.reason}})</li>
{{/each}}
</ul>
{{else}}
<p>You're doing great! We didn't find any specific saving opportunities this time. Keep up the great work with your budgeting.</p>
{{/if}}

**Instructions:**
1.  Generate a friendly and positive subject line for the email.
2.  Generate the full HTML body for the email by populating the template below.
    - Replace the placeholder comment with the user's name and the financial suggestions provided above.

**Email HTML Template:**
<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px">
  <a style="text-decoration: none; outline: none; color: #468989; font-weight: bold;" href="/" target="_blank">
    Insightful Expenses
  </a>
  <p style="padding-top: 16px; border-top: 1px solid #eaeaea">Hi {{{userName}}},</p>
  
  {{! This is where the AI should insert the "Financial Suggestions" content. }}

  <p style="padding-top: 16px; border-top: 1px solid #eaeaea">
    Best regards,<br />The Insightful Expenses Team
  </p>
</div>
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
