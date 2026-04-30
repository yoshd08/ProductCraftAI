
'use server';

/**
 * @fileOverview Suggests strategies or improvements based on the case study analysis for each selected product management framework.
 *
 * - suggestImprovements - A function that suggests improvements based on case study analysis.
 * - SuggestImprovementsInput - The input type for the suggestImprovements function.
 * - SuggestImprovementsOutput - The return type for the suggestImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestImprovementsInputSchema = z.object({
  caseStudyText: z.string().describe('The text of the case study to analyze.'),
  frameworks: z
    .array(z.string())
    .describe('The product management frameworks to use for analysis.'),
});
export type SuggestImprovementsInput = z.infer<typeof SuggestImprovementsInputSchema>;

const SuggestImprovementsOutputSchema = z.object({
  suggestions: z.record(z.string(), z.string()).describe(
    'A map of framework names to suggested strategies or improvements based on the case study analysis.'
  ),
});
export type SuggestImprovementsOutput = z.infer<typeof SuggestImprovementsOutputSchema>;

export async function suggestImprovements(
  input: SuggestImprovementsInput
): Promise<SuggestImprovementsOutput> {
  const suggestImprovementsFlow = ai.defineFlow(
    {
      name: 'suggestImprovementsFlow',
      inputSchema: SuggestImprovementsInputSchema,
      outputSchema: SuggestImprovementsOutputSchema,
    },
    async input => {
      const prompt = ai.definePrompt({
        name: 'suggestImprovementsPrompt',
        input: {schema: SuggestImprovementsInputSchema},
        output: {schema: SuggestImprovementsOutputSchema},
        prompt: `You are an expert product management consultant. Given the following case study text and a list of product management frameworks, analyze the case study and suggest specific strategies or improvements for each framework.

Case Study Text:
{{caseStudyText}}

Frameworks:
{{#each frameworks}}- {{this}}\n{{/each}}

For each framework, provide a key insight extracted from the case study and a suggested strategy or improvement.

Output the suggestions as a JSON object where the keys are the framework names and the values are the suggested strategies or improvements for each framework.

Format:
{
  "framework1": "suggestion1",
  "framework2": "suggestion2",
  ...
}`,
      });

      const {output} = await prompt(input);
      return output!;
    }
  );
  return suggestImprovementsFlow(input);
}
