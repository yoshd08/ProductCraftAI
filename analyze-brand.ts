
'use server';
/**
 * @fileOverview Performs a comprehensive brand analysis using AI.
 *
 * - analyzeBrand - A function that handles the brand analysis process.
 * - BrandAnalysisInput - The input type for the analyzeBrand function.
 * - BrandAnalysisOutput - The return type for the analyzeBrand function.
 */

import { ai } from '@/ai/genkit';
import { scrapeWebPage } from '@/ai/tools/webScraper';
import { z } from 'genkit';

// Input Schema
const BrandAnalysisInputSchema = z.object({
    brandName: z.string().describe("The name of the brand to analyze."),
    url: z.string().url().optional().describe('The primary website or social media link for the brand.'),
    additionalData: z.string().optional().describe('Pasted text, user observations, strategic goals, or other contextual data.'),
});
export type BrandAnalysisInput = z.infer<typeof BrandAnalysisInputSchema>;


// Output Schema
const BrandCoreIdentitySchema = z.object({
    missionVisionValues: z.string().describe("Analysis of the brand’s mission, vision, and values (explicit or implied)."),
    voiceAndTone: z.string().describe("Analysis of the brand voice and tone (e.g., friendly, authoritative, quirky)."),
    visualIdentity: z.string().describe("Evaluation of the visual identity (logo, color palette, typography)."),
    consistency: z.string().describe("Assessment of brand coherence and consistency across platforms.")
});

const TargetAudienceConnectionSchema = z.object({
    primaryAudience: z.string().describe("Definition of the brand’s primary target audience (age, demographics, psychographics)."),
    problemsAndAspirations: z.string().describe("What problems, aspirations, or emotions the brand addresses for its audience."),
    connectionEffectiveness: z.string().describe("How effectively the brand connects with its audience on emotional, cultural, and practical levels."),
    gapsAndMismatches: z.string().describe("Identified gaps or mismatches between the brand message and audience expectations.")
});

const PositioningCompetitiveLandscapeSchema = z.object({
    positioningStatement: z.string().describe("The brand’s core positioning statement or promise."),
    competitorAnalysis: z.array(z.object({
        competitorName: z.string(),
        comparison: z.string().describe("Direct comparison of where the brand stands out or falls short against this competitor.")
    })).describe("Comparison to 2-3 key competitors."),
    valuePropositionStrength: z.string().describe("Analysis of the brand’s value proposition strength relative to competitors."),
});

const DigitalSocialPresenceSchema = z.object({
    websiteAnalysis: z.string().describe("Analysis of the brand’s website UX/UI, tone, content structure, and SEO friendliness."),
    socialMediaAnalysis: z.string().describe("Holistic review of social media channels (themes, frequency, engagement, sentiment)."),
    bestPerformingContent: z.string().describe("Identification of best-performing content types or themes."),
    underutilizedOpportunities: z.string().describe("Suggestions for underutilized opportunities on digital platforms.")
});

const EmotionalResonanceCulturalImpactSchema = z.object({
    storytellingAndCommunity: z.string().describe("Analysis of brand stories that build community, inspire, or shift culture."),
    authenticityAndRelatability: z.string().describe("Evaluation of the brand’s authenticity, relatability, and emotional recall."),
});

const StrengthsGapsOpportunitiesSchema = z.object({
    biggestStrengths: z.array(z.string()).describe("List of the brand’s biggest strengths and most unique assets."),
    identifedGaps: z.array(z.string()).describe("List of identified gaps in tone, design, communication, or experience."),
    quickWins: z.array(z.string()).describe("List of quick win strategies to improve brand equity or awareness."),
    longTermStrategies: z.array(z.string()).describe("List of long-term strategies to improve brand equity or awareness.")
});


const BrandAnalysisOutputSchema = z.object({
    brandName: z.string().describe("The name of the brand analyzed."),
    executiveSummary: z.string().describe("A concise, high-level summary of the entire brand analysis, including the most critical insight and recommendation."),
    brandCoreIdentity: BrandCoreIdentitySchema,
    targetAudienceConnection: TargetAudienceConnectionSchema,
    positioningAndCompetitiveLandscape: PositioningCompetitiveLandscapeSchema,
    digitalAndSocialPresence: DigitalSocialPresenceSchema,
    emotionalResonanceAndCulturalImpact: EmotionalResonanceCulturalImpactSchema,
    strengthsGapsAndOpportunities: StrengthsGapsOpportunitiesSchema,
});
export type BrandAnalysisOutput = z.infer<typeof BrandAnalysisOutputSchema>;


export async function analyzeBrand(input: BrandAnalysisInput): Promise<BrandAnalysisOutput> {
  const analyzeBrandFlow = ai.defineFlow(
    {
      name: 'analyzeBrandFlow',
      inputSchema: BrandAnalysisInputSchema,
      outputSchema: BrandAnalysisOutputSchema,
    },
    async (input) => {
      const prompt = ai.definePrompt({
        name: 'brandAnalysisPrompt',
        input: { schema: BrandAnalysisInputSchema },
        output: { schema: BrandAnalysisOutputSchema },
        tools: [scrapeWebPage],
        prompt: `You are a world-class brand strategist and digital analyst. A user has provided a brand name and optional URL/text for an in-depth brand analysis.

        **Brand to Analyze:** {{brandName}}
        
        {{#if url}}
        **Primary URL (scrape this first):** {{url}}
        If a URL is provided, you MUST use the 'scrapeWebPage' tool to get the text content from that URL as the primary source of information.
        {{/if}}

        {{#if additionalData}}
        **Additional Context & Strategic Goals from User:**
        {{{additionalData}}}
        If the user has provided strategic goals, tailor your analysis and recommendations to help them achieve these goals.
        {{/if}}

        **Your Task:**
        Conduct a comprehensive brand analysis based on the provided information. If a URL is given, scrape it for content. Combine that with any additional text provided. Structure your entire response into the required JSON format. For each section, provide both qualitative insights and strategic recommendations.

        **JSON Sections to Populate:**

        1.  **executiveSummary**: Write a 2-3 sentence summary of the most critical findings and your top recommendation.
        2.  **brandCoreIdentity**:
            -   **missionVisionValues**: What are the brand’s mission, vision, and values (explicit or implied)?
            -   **voiceAndTone**: Analyze the brand voice and tone (e.g., friendly, authoritative, quirky).
            -   **visualIdentity**: Evaluate the visual identity (logo, color palette, typography).
            -   **consistency**: Is the brand identity coherent and consistent across platforms?
        3.  **targetAudienceConnection**:
            -   **primaryAudience**: Define the primary target audience (age, demographics, psychographics).
            -   **problemsAndAspirations**: What problems, aspirations, or emotions does the brand address?
            -   **connectionEffectiveness**: How effectively does the brand connect with its audience (emotional, cultural, practical)?
            -   **gapsAndMismatches**: Are there any gaps between the brand message and audience expectations?
        4.  **positioningAndCompetitiveLandscape**:
            -   **positioningStatement**: What is the brand’s core positioning statement or promise?
            -   **competitorAnalysis**: Identify 2-3 key competitors and write a direct comparison of where the brand stands out or falls short against each.
            -   **valuePropositionStrength**: How strong is the brand’s value proposition relative to these competitors?
        5.  **digitalAndSocialPresence**:
            -   **websiteAnalysis**: Analyze the brand’s website UX/UI, tone, content, and SEO-friendliness.
            -   **socialMediaAnalysis**: Review social media channels for themes, frequency, engagement, and sentiment.
            -   **bestPerformingContent**: What content types or themes perform best?
            -   **underutilizedOpportunities**: What are some underutilized digital opportunities?
        6.  **emotionalResonanceAndCulturalImpact**:
            -   **storytellingAndCommunity**: Does the brand tell stories that build community or shift culture?
            -   **authenticityAndRelatability**: Evaluate its authenticity, relatability, and emotional recall.
        7.  **strengthsGapsAndOpportunities**:
            -   **biggestStrengths**: List the brand’s biggest strengths and unique assets.
            -   **identifedGaps**: List key gaps in tone, design, communication, or experience.
            -   **quickWins**: Suggest actionable quick wins.
            -   **longTermStrategies**: Suggest actionable long-term strategies for growth.

        Ensure your entire output is a single, valid JSON object that strictly adheres to the output schema.
        `,
      });
      const { output } = await prompt(input);
      if (!output) {
        throw new Error('AI did not return brand analysis results.');
      }
      return output;
    }
  );
  return analyzeBrandFlow(input);
}
