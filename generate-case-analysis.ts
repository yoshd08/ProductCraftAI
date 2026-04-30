'use server';
/**
 * @fileOverview Generates a synthetic case study analysis from a short prompt.
 * @deprecated This flow is no longer used by the UI and is superseded by diagnose-error.
 *
 * - generateCaseAnalysis - A function that takes a prompt and industry to create a case.
 * - GenerateCaseAnalysisInput - The input type for the function.
 * - GenerateCaseAnalysisOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IndustryEnumSchema = z.enum(['FMCG', 'Tech', 'Healthcare', 'Retail']);

const GenerateCaseAnalysisInputSchema = z.object({
  prompt: z.string().describe('A short prompt describing a business problem. e.g., "A beverage company is facing declining sales."'),
  industry: IndustryEnumSchema.describe('The industry of the company in the prompt.'),
});
export type GenerateCaseAnalysisInput = z.infer<typeof GenerateCaseAnalysisInputSchema>;

const DataPointSchema = z.object({
  name: z.string().describe("The name of the data point, e.g., a quarter ('Q1 2023'), a product category, or a region."),
  value: z.number().describe("The numeric value for this data point."),
  // Optional secondary value for comparison, e.g., previous year's value
  value2: z.number().optional().describe("An optional second numeric value for comparison, e.g., cost or a secondary metric."),
});

const GenerateCaseAnalysisOutputSchema = z.object({
  executiveSummary: z.string().describe("A 2-3 sentence executive summary of the analysis, including the key data-driven insight."),
  problemAreas: z.array(z.string()).describe("A list of 2-4 key business problem areas identified from the prompt (e.g., 'Market Saturation', 'Operational Inefficiency')."),
  analysisDetails: z.string().describe("A paragraph detailing the analysis performed on the generated data."),
  generatedData: z.array(DataPointSchema).describe("An array of 4-6 synthetic data points relevant to the prompt, suitable for charting."),
  chartTitle: z.string().describe("A descriptive title for the chart that will visualize the generated data."),
  valueUnit: z.string().describe("The unit for the primary value axis of the chart (e.g., 'Million USD', '%', 'Units Sold')."),
  value2Unit: z.string().optional().describe("The unit for the optional secondary value axis of the chart."),
});
export type GenerateCaseAnalysisOutput = z.infer<typeof GenerateCaseAnalysisOutputSchema>;

export async function generateCaseAnalysis(input: GenerateCaseAnalysisInput): Promise<GenerateCaseAnalysisOutput> {
  const generateCaseAnalysisFlow = ai.defineFlow(
    {
      name: 'generateCaseAnalysisFlow',
      inputSchema: GenerateCaseAnalysisInputSchema,
      outputSchema: GenerateCaseAnalysisOutputSchema,
    },
    async (input) => {
      const promptTemplate = ai.definePrompt({
        name: 'generateCaseAnalysisPrompt',
        input: {schema: GenerateCaseAnalysisInputSchema},
        output: {schema: GenerateCaseAnalysisOutputSchema},
        prompt: `You are a world-class business strategy consultant. A client has given you a short prompt about a business problem.
Your task is to:
1.  Identify the core problem areas.
2.  Generate a small, realistic, and relevant dataset that illustrates the problem.
3.  Analyze the data you generated.
4.  Provide a concise executive summary with a key data-driven insight.

Client Prompt: "{{prompt}}"
Industry: {{industry}}

INSTRUCTIONS:
- **Problem Areas**: Identify 2-4 high-level problem areas from the prompt.
- **Generated Data**: Create a synthetic dataset of 4-6 data points. The data should be simple enough to be displayed on a bar chart. The 'name' can be time-based (like quarters), categorical (like products), or regional. 'value' is the primary metric. You can optionally include a 'value2' for comparison (e.g., Sales vs. Costs).
- **Chart Title**: Create a clear and descriptive title for a chart that would display your generated data.
- **Units**: Specify the units for the chart values (e.g., "Sales (in Millions)", "Margin %").
- **Analysis Details**: Briefly explain what the data shows.
- **Executive Summary**: Write a powerful 2-3 sentence summary that synthesizes the analysis into a key takeaway, as you would for a C-level executive. It must be data-driven.

Example for prompt "A retail chain is experiencing margin pressure." in "Retail":
- executiveSummary: "Gross margin has declined from 42% to 36% over the last 3 quarters, largely due to rising supply costs and stagnant pricing. The Home Goods category is the biggest contributor, accounting for 60% of the decline."
- problemAreas: ["Declining Profitability", "Supply Chain Costs", "Pricing Strategy"]
- analysisDetails: "The generated data shows a consistent decline in gross margin from 42% in Q1 to 36% in Q3. This trend indicates that cost of goods sold is rising faster than revenue, putting significant pressure on profitability."
- generatedData: [{"name": "Q1", "value": 42}, {"name": "Q2", "value": 39}, {"name": "Q3", "value": 36}]
- chartTitle: "Quarterly Gross Margin Decline"
- valueUnit: "Gross Margin (%)"

Now, generate a new analysis for the provided client prompt and industry.
`,
      });
      
      const {output} = await promptTemplate(input);
      if (!output) {
        throw new Error('AI did not return a case analysis.');
      }
      return output;
    }
  );
  return generateCaseAnalysisFlow(input);
}