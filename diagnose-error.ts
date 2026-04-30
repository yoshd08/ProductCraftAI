
'use server';
/**
 * @fileOverview Diagnoses an application error based on provided context.
 * @deprecated This flow is no longer used and has been replaced by case-analysis.ts.
 *
 * - diagnoseError - A function that takes error details and returns a diagnosis.
 * - DiagnoseErrorInput - The input type for the function.
 * - DiagnoseErrorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { scrapeWebPage } from '../tools/webScraper';

const DiagnoseErrorInputSchema = z.object({
  errorLog: z.string().describe('The full text-based stack trace or error log.'),
  screenshotUrl: z.string().url().optional().describe('An optional URL to a screenshot of the error message or UI.'),
  appUrl: z.string().url().optional().describe('An optional URL to the public web link or hosted environment where the error occurs.'),
});
export type DiagnoseErrorInput = z.infer<typeof DiagnoseErrorInputSchema>;

const DiagnosisSchema = z.object({
    isFrontend: z.boolean().describe("True if the issue is likely frontend (Next.js, React, browser), false if backend (API, Firebase, server)."),
    probableCauses: z.array(z.string()).describe("A list of the most probable causes for the error (e.g., 'Missing server response', 'Improper route handling')."),
    suggestedFixes: z.array(z.object({
        step: z.number().int(),
        description: z.string().describe("A step-by-step guide to debug or fix the issue."),
        codeSnippet: z.string().optional().describe("An optional code snippet to illustrate the fix.")
    })).describe("A step-by-step debugging or fixing plan."),
    recommendedTools: z.array(z.string()).describe("A list of relevant Firebase tools, browser dev tools, or other utilities to trace the issue."),
});

const DiagnoseErrorOutputSchema = z.object({
  diagnosisReport: DiagnosisSchema,
  actionPlan: z.string().describe("A concise, summary action plan in markdown format for the user to follow."),
});
export type DiagnoseErrorOutput = z.infer<typeof DiagnoseErrorOutputSchema>;


export async function diagnoseError(input: DiagnoseErrorInput): Promise<DiagnoseErrorOutput> {
  const diagnoseErrorFlow = ai.defineFlow(
    {
      name: 'diagnoseErrorFlow',
      inputSchema: DiagnoseErrorInputSchema,
      outputSchema: DiagnoseErrorOutputSchema,
    },
    async (input) => {
      
      const prompt = ai.definePrompt({
        name: 'diagnoseErrorPrompt',
        input: { schema: z.object({
            errorLog: z.string(),
            appContext: z.string().optional(),
            screenshotUrl: z.string().url().optional(),
        })},
        output: { schema: DiagnoseErrorOutputSchema },
        tools: [scrapeWebPage],
        prompt: `You are an expert software engineer specializing in Next.js and Firebase applications.
Your task is to analyze the provided error information and generate a concise case report and action plan.

Error Log:
{{{errorLog}}}

{{#if appContext}}
Application Context from URL:
{{{appContext}}}
{{/if}}

{{#if screenshotUrl}}
Screenshot of the Error:
{{media url=screenshotUrl}}
{{/if}}

INSTRUCTIONS:
1.  **Analyze the Inputs**: Review the error log, optional screenshot, and application context.
2.  **Identify Root Cause**: Determine if the issue is primarily frontend (Next.js, React) or backend (API, server-side logic, Firebase).
3.  **Generate Diagnosis Report (JSON)**:
    -   'isFrontend': Set to true or false.
    -   'probableCauses': List 2-3 likely causes.
    -   'suggestedFixes': Create a clear, step-by-step plan.
    -   'recommendedTools': Suggest specific tools for debugging.
4.  **Generate Action Plan (Markdown)**:
    -   Summarize the diagnosis in a clear, easy-to-read markdown format. Start with the most likely cause and provide the most critical action to take first.

Ensure the final output is a valid JSON object containing both the structured report and the markdown summary.
`,
      });

      let appContext: string | undefined;
      if (input.appUrl) {
        try {
          appContext = await scrapeWebPage({url: input.appUrl});
        } catch (error) {
          // If scraping fails, just proceed without the context. Don't block the diagnosis.
          console.warn(`Could not scrape app URL: ${error}`);
        }
      }

      const { output } = await prompt({
        errorLog: input.errorLog,
        appContext: appContext,
        screenshotUrl: input.screenshotUrl,
      });

      if (!output) {
        throw new Error('AI did not return a diagnosis.');
      }
      
      return output;
    }
  );
  return diagnoseErrorFlow(input);
}
