
'use server';
/**
 * @fileOverview Recommends product management frameworks based on case study text.
 *
 * - recommendFrameworks - A function that suggests relevant frameworks.
 * - RecommendFrameworksInput - The input type for the recommendFrameworks function.
 * - RecommendedFramework - The structure for a single recommended framework.
 * - RecommendFrameworksOutput - The return type for the recommendFrameworks function (array of RecommendedFramework).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { FrameworkName } from '@/lib/constants';
import { FRAMEWORKS_METADATA } from '@/lib/frameworks'; // To provide context to the AI

// Prepare framework names for the Zod enum dynamically
const frameworkNames = FRAMEWORKS_METADATA.map(f => f.id) as [FrameworkName, ...FrameworkName[]];
const FrameworkNameEnum = z.enum(frameworkNames);


const RecommendFrameworksInputSchema = z.object({
  caseStudyText: z.string().describe('The text content of the case study.'),
});
export type RecommendFrameworksInput = z.infer<typeof RecommendFrameworksInputSchema>;

const RecommendedFrameworkSchema = z.object({
  id: FrameworkNameEnum.describe('The ID/name of the recommended product management framework.'),
  score: z.number().min(0).max(1).describe('A relevance score between 0.0 and 1.0 for the framework.'),
  reason: z.string().describe('A brief justification for why this framework is relevant.'),
});
export type RecommendedFramework = z.infer<typeof RecommendedFrameworkSchema>;

const RecommendFrameworksOutputSchema = z.array(RecommendedFrameworkSchema).length(5).describe('An array of the top 5 recommended frameworks, sorted by relevance.');
export type RecommendFrameworksOutput = z.infer<typeof RecommendFrameworksOutputSchema>;

export async function recommendFrameworks(input: RecommendFrameworksInput): Promise<RecommendFrameworksOutput> {
  const frameworksWithDescriptions = FRAMEWORKS_METADATA.map(f => ({ name: f.id, title: f.title, description: f.description }));

  const recommendFrameworksFlow = ai.defineFlow(
    {
      name: 'recommendFrameworksFlow',
      inputSchema: RecommendFrameworksInputSchema,
      outputSchema: RecommendFrameworksOutputSchema,
    },
    async (input: RecommendFrameworksInput) => {
      const prompt = ai.definePrompt({
        name: 'recommendFrameworksPrompt',
        input: {schema: RecommendFrameworksInputSchema},
        output: {schema: RecommendFrameworksOutputSchema},
        prompt: `You are an expert product management consultant. Your task is to analyze the provided case study text and recommend the 5 most relevant product management frameworks to apply for further analysis.

Consider the core purpose and common use-cases of the following frameworks:
{{#each frameworksWithDescriptions}}
- {{name}} ({{title}}): {{description}}
{{/each}}

Based on the case study text below, identify themes, keywords, or problems mentioned that align with these frameworks.

Case Study Text:
{{{caseStudyText}}}

Return your top 5 recommendations as a JSON array of objects. Each object MUST have:
- "id": The framework name (MUST be one of the exact framework IDs provided above, e.g., "MVP", "RICE").
- "score": A relevance score between 0.0 and 1.0 (e.g., 0.89).
- "reason": A brief justification for why this framework is relevant (e.g., "Mentions prioritization and feature evaluation").

Ensure the "id" precisely matches one of the framework names from the list.
Limit your response to exactly 5 frameworks.
Sort the frameworks by their relevance score in descending order.
Do not include any frameworks not in the provided list.
Provide valid JSON output.
`,
      });
      const {output} = await prompt({ ...input, frameworksWithDescriptions });
      if (!output) {
          throw new Error("AI failed to provide recommendations.");
      }
      // Ensure the output is an array and has 5 items, otherwise provide a default or throw error
      if (!Array.isArray(output) || output.length !== 5) {
          console.warn("AI did not return exactly 5 recommendations, returning empty or handling error.");
          // Fallback or more robust error handling could be implemented here
          // For now, let's attempt to take the first 5 if more, or throw if less/invalid
          if(Array.isArray(output) && output.length > 5) {
            return output.slice(0,5) as RecommendFrameworksOutput;
          }
          if(Array.isArray(output) && output.length > 0 && output.length < 5) {
              // Pad with some defaults if necessary, or handle as an error
              // This case is tricky; for now, we'll rely on the AI to follow instructions.
               throw new Error(`AI returned ${output.length} recommendations, expected 5.`);
          }
          // If it's not an array or empty, and not handled above
          throw new Error("Invalid recommendations format from AI.");
      }
      return output;
    }
  );
  return recommendFrameworksFlow(input);
}
