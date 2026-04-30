
'use server';

/**
 * @fileOverview Analyzes a case study using AI to extract key insights relevant to selected product management frameworks.
 *
 * - analyzeCaseStudy - A function that handles the case study analysis process.
 * - AnalyzeCaseStudyInput - The input type for the analyzeCaseStudy function.
 * - AnalyzeCaseStudyOutput - The return type for the analyzeCaseStudy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ALL_FRAMEWORKS, type FrameworkName } from '@/lib/constants';

const FrameworkIdEnumSchema = z.enum(ALL_FRAMEWORKS as [FrameworkName, ...FrameworkName[]]);

const RiceInitiativeSchema = z.object({
  name: z.string().describe("The name of the feature or initiative."),
  reach: z.number().describe("Estimated number of people this initiative will reach in a given timeframe."),
  impact: z.number().min(0.25).max(3).describe("How much this initiative will impact individual users (0.25=minimal, 1=low, 2=medium, 3=high)."),
  confidence: z.number().min(0).max(100).describe("Confidence level in the estimations, as a percentage (e.g., 80 for 80%)."),
  effort: z.number().min(0.0001).describe("Estimated total effort required from the team (e.g., in person-months). Must be greater than 0."),
  score: z.number().describe("The calculated RICE score ((Reach * Impact * Confidence) / Effort)."),
  ranking: z.number().int().min(1).describe("The rank of this initiative, with 1 being the highest priority.")
});

const PorterForceDetailSchema = z.object({
  forceName: z.string().describe('The name of the Porter\'s force (e.g., "Competitive Rivalry", "Supplier Power", "Buyer Power", "Threat of Substitution", "Threat of New Entry"). This MUST be one of the five standard forces.'),
  impactLevel: z.enum(["Low", "Moderate", "High"]).describe('The assessed impact level of this force on the subject of the case study.'),
  analysis: z.string().describe('A brief analysis or summary of this specific force based on the case study text.'),
  specificSuggestion: z.string().optional().describe('A tactical suggestion related to this specific force, if applicable.'),
});

const PrimaryActivityItemSchema = z.object({
  name: z.enum(["Inbound Logistics", "Operations", "Outbound Logistics", "Marketing & Sales", "Services"])
    .describe('The name of the primary activity. MUST be one of the five standard primary activities.'),
  insight: z.string().describe('A brief insight or analysis related to this primary activity based on the case study.'),
  optimizationOpportunity: z.string().optional().describe('A specific opportunity for optimization (e.g., cost reduction, differentiation) related to this activity, if identifiable.'),
});

const SupportActivityItemSchema = z.object({
  name: z.enum(["Firm Infrastructure", "Human Resource Management", "Technology Development", "Procurement"])
    .describe('The name of the support activity. MUST be one of the four standard support activities.'),
  insight: z.string().describe('A brief insight or analysis related to this support activity based on the case study.'),
  optimizationOpportunity: z.string().optional().describe('A specific opportunity for optimization related to this activity, if identifiable.'),
});

const BcgMatrixItemSchema = z.object({
  unitName: z.string().describe('The name of the business unit or product.'),
  marketShare: z.number().describe('The relative market share percentage (e.g., 15 for 15%).'),
  marketGrowth: z.number().describe('The market growth rate percentage (e.g., 20 for 20%).'),
  quadrant: z.enum(["Stars", "Question Marks", "Cash Cows", "Dogs"]).describe('The quadrant classification for this unit.'),
  recommendation: z.string().describe('A brief strategic recommendation for this specific unit (e.g., "Invest to maintain growth" or "Divest").'),
});

const TocStepSchema = z.object({
  step: z.enum(["Identify", "Exploit", "Subordinate", "Elevate", "Repeat"]).describe("The name of the TOC focusing step."),
  action: z.string().describe("The specific action or insight related to this step for the given case study.")
});

const ProcessStepSchema = z.object({
  name: z.string().describe("The name of the process step."),
  isConstraint: z.boolean().describe("Whether this step is identified as the primary constraint.")
});

const DmaicStepSchema = z.object({
  step: z.enum(["Define", "Measure", "Analyze", "Improve", "Control"]).describe("The name of the DMAIC step."),
  details: z.string().describe("The specific insight, action, or data point related to this step for the given case study.")
});

const DesignThinkingPhaseSchema = z.object({
  phase: z.enum(["Empathize", "Define", "Ideate", "Prototype", "Test"]).describe("The name of the Design Thinking phase."),
  details: z.string().describe("The specific insight, action, or data point related to this phase for the given case study.")
});

const LeanStartupCycleSchema = z.object({
  hypothesis: z.string().describe("The core hypothesis that was tested in this cycle."),
  build: z.string().describe("A description of the Minimum Viable Product (MVP) or feature that was built to test the hypothesis."),
  measure: z.string().describe("The key metrics or methods used to measure the outcome of the MVP test."),
  learn: z.string().describe("The key learning or insight gained from the measurements."),
  decision: z.enum(["Pivot", "Persevere"]).describe("The strategic decision made based on the learning: either 'Pivot' (change strategy) or 'Persevere' (continue on the current path).")
});

const AgileInsightSchema = z.object({
  aspect: z.enum(["Roles", "Ceremonies", "Artifacts", "Workflow", "Maturity"]).describe("The aspect of Agile being analyzed (e.g., Roles, Ceremonies, Workflow, Maturity)."),
  observation: z.string().describe("The specific observation or insight related to this aspect from the case study."),
  suggestion: z.string().optional().describe("A specific suggestion for improvement related to this observation."),
});


const AnalyzeCaseStudyInputSchema = z.object({
  caseStudyText: z.string().describe('The text content of the case study.'),
  imageUrl: z.string().optional().describe("A URL or data URI of an image for additional context. Format: 'data:<mimetype>;base64,<encoded_data>' or 'http(s)://...'. The AI should analyze this image in conjunction with the text."),
  frameworks: z
    .array(FrameworkIdEnumSchema)
    .describe('An array of product management framework IDs (e.g., "MVP", "RICE") to analyze the case study against.'),
});

export type AnalyzeCaseStudyInput = z.infer<typeof AnalyzeCaseStudyInputSchema>;

const FrameworkAnalysisItemSchema = z.object({
  framework: FrameworkIdEnumSchema.describe('The ID of the product management framework. This MUST exactly match one of the input framework IDs provided to the prompt.'),
  keyInsight: z.string().describe('A key insight extracted from the case study relevant to this framework. For SWOT, Ansoff Matrix, Five Forces, Value Chain, BCG Matrix, Theory of Constraints, Six Sigma, Design Thinking, Lean Startup, Agile this should be an OVERALL insight covering the entire analysis if more specific summary fields are not populated. For Blue Ocean Strategy, this field should contain the concise summary of the potential Blue Ocean opportunity.'),
  suggestedStrategy: z.string().describe('A suggested strategy or improvement based on the insight and the principles of this framework. For SWOT, Ansoff Matrix, Five Forces, Value Chain, BCG Matrix, Theory of Constraints, Six Sigma, Design Thinking, Lean Startup, Agile this should be an OVERALL strategy based on the entire analysis if more specific action fields are not populated. For Blue Ocean Strategy, this field should contain the suggested strategic action or prompt to pursue the Blue Ocean.'),
  
  // SWOT specific fields - only populate if framework is 'SWOT'
  strengths: z.array(z.string()).optional().describe('List of identified strengths (strings). Only populate if the framework is SWOT. If none, return empty array.'),
  weaknesses: z.array(z.string()).optional().describe('List of identified weaknesses (strings). Only populate if the framework is SWOT. If none, return empty array.'),
  opportunities: z.array(z.string()).optional().describe('List of identified opportunities (strings). Only populate if the framework is SWOT. If none, return empty array.'),
  threats: z.array(z.string()).optional().describe('List of identified threats (strings). Only populate if the framework is SWOT. If none, return empty array.'),
  
  // Ansoff Matrix specific fields - only populate if framework is 'Ansoff Matrix'
  marketPenetration: z.array(z.object({ initiative: z.string(), rationale: z.string() })).optional().describe('Initiatives and rationales for Market Penetration (existing product, existing market). Only populate if framework is Ansoff Matrix. If none, return empty array.'),
  productDevelopment: z.array(z.object({ initiative: z.string(), rationale: z.string() })).optional().describe('Initiatives and rationales for Product Development (new product, existing market). Only populate if framework is Ansoff Matrix. If none, return empty array.'),
  marketDevelopment: z.array(z.object({ initiative: z.string(), rationale: z.string() })).optional().describe('Initiatives and rationales for Market Development (existing product, new market). Only populate if framework is Ansoff Matrix. If none, return empty array.'),
  diversification: z.array(z.object({ initiative: z.string(), rationale: z.string() })).optional().describe('Initiatives and rationales for Diversification (new product, new market). Only populate if framework is Ansoff Matrix. If none, return empty array.'),
  quadrantRecommendations: z.array(z.object({ quadrant: z.string().describe("The Ansoff quadrant name, e.g., 'Market Penetration'"), recommendation: z.string() })).optional().describe('Strategic recommendations for each populated Ansoff quadrant. Only populate if framework is Ansoff Matrix. If none, return empty array.'),

  // RICE specific fields - only populate if framework is 'RICE'
  initiatives: z.array(RiceInitiativeSchema).optional().describe("A list of initiatives scored with the RICE model. Only populate if the framework is RICE."),
  topItemsAnalysis: z.string().optional().describe("A short narrative for the top 3 scoring RICE items, explaining why they scored high and what to do next. Only populate for RICE framework."),
  bottomItemsAnalysis: z.string().optional().describe("A short narrative for the bottom 3 scoring RICE items, explaining why they scored low and what to do next. Only populate for RICE framework."),
  estimationImprovementSuggestions: z.string().optional().describe("Suggestions on how to improve the precision of RICE estimates (e.g., what kind of data to gather). Only populate for RICE framework."),

  // Porter's Five Forces specific fields - only populate if framework is 'Five Forces'
  porterForcesDetails: z.array(PorterForceDetailSchema).optional().describe("Detailed analysis for each of Porter's Five Forces. Only populate if the framework is 'Five Forces'. Provide exactly five entries, one for each force. If no specific details for a force, provide minimal analysis. Return empty array if not applicable for other frameworks."),

  // Blue Ocean Strategy specific fields - only populate if framework is 'Blue Ocean Strategy'
  eliminateItems: z.array(z.string()).optional().describe("List of factors the industry competes on that should be ELIMINATED. Only populate if framework is 'Blue Ocean Strategy'. If none, return empty array."),
  reduceItems: z.array(z.string()).optional().describe("List of factors that should be REDUCED well below the industry's standard. Only populate if framework is 'Blue Ocean Strategy'. If none, return empty array."),
  raiseItems: z.array(z.string()).optional().describe("List of factors that should be RAISED well above the industry's standard. Only populate if framework is 'Blue Ocean Strategy'. If none, return empty array."),
  createItems: z.array(z.string()).optional().describe("List of new factors or sources of value the industry has never offered that should be CREATED. Only populate if framework is 'Blue Ocean Strategy'. If none, return empty array."),

  // Value Chain specific fields - only populate if framework is 'Value Chain'
  primaryActivities: z.array(PrimaryActivityItemSchema).optional().describe("Detailed analysis for each of Porter's Primary Value Chain Activities. Only populate if framework is 'Value Chain'. Provide an entry for each primary activity that has relevant information. If none, return empty array."),
  supportActivities: z.array(SupportActivityItemSchema).optional().describe("Detailed analysis for each of Porter's Support Value Chain Activities. Only populate if framework is 'Value Chain'. Provide an entry for each support activity that has relevant information. If none, return empty array."),
  valueChainRecommendations: z.array(z.string()).optional().describe("Actionable recommendations based on the overall Value Chain analysis. Only populate if framework is 'Value Chain'. If none, return empty array."),

  // BCG Matrix specific fields - only populate if framework is 'BCG Matrix'
  bcgMatrixItems: z.array(BcgMatrixItemSchema).optional().describe("Detailed analysis for each identified business unit in the BCG Matrix. Only populate if framework is 'BCG Matrix'. If none, return empty array."),

  // Theory of Constraints specific fields - only populate if framework is 'Theory of Constraints'
  identifiedConstraint: z.string().optional().describe("A concise description of the primary constraint/bottleneck. Only populate if framework is 'Theory of Constraints'."),
  fiveFocusingSteps: z.array(TocStepSchema).optional().describe("The five focusing steps of TOC with actions. Only populate if framework is 'Theory of Constraints'."),
  processFlow: z.array(ProcessStepSchema).optional().describe("The sequence of process steps, with one marked as the constraint. Only populate if framework is 'Theory of Constraints'."),
  
  // Six Sigma specific fields - only populate if framework is 'Six Sigma'
  identifiedProblem: z.string().optional().describe("A concise statement of the primary problem or defect being addressed. Only populate if framework is 'Six Sigma'."),
  dmaicSteps: z.array(DmaicStepSchema).optional().describe("The five steps of DMAIC with insights. Only populate if framework is 'Six Sigma'."),

  // Design Thinking specific fields - only populate if framework is 'Design Thinking'
  designThinkingPhases: z.array(DesignThinkingPhaseSchema).optional().describe("The five phases of Design Thinking with insights. Only populate if framework is 'Design Thinking'."),

  // Lean Startup specific fields - only populate if framework is 'Lean Startup'
  keyAssumptions: z.array(z.string()).optional().describe("List of key assumptions identified from the case study. Only populate if framework is 'Lean Startup'."),
  leanStartupCycles: z.array(LeanStartupCycleSchema).optional().describe("An array representing one or more Build-Measure-Learn cycles. Only populate if framework is 'Lean Startup'."),
  
  // Agile specific fields - only populate if framework is 'Agile'
  agileMaturityAssessment: z.string().optional().describe("A concise (1-2 sentence) assessment of the team's agile maturity (e.g., 'Evolving', 'Advanced'). Only populate if framework is 'Agile'."),
  agileInsights: z.array(AgileInsightSchema).optional().describe("A list of specific insights into the team's agile practices, categorized by aspect. Only populate if framework is 'Agile'."),
});


export type FrameworkAnalysisItem = z.infer<typeof FrameworkAnalysisItemSchema>;
const AnalyzeCaseStudyOutputSchema = z.array(FrameworkAnalysisItemSchema);
export type AnalyzeCaseStudyOutput = z.infer<typeof AnalyzeCaseStudyOutputSchema>;


export async function analyzeCaseStudy(input: AnalyzeCaseStudyInput): Promise<AnalyzeCaseStudyOutput> {
  const analyzeCaseStudyFlow = ai.defineFlow(
    {
      name: 'analyzeCaseStudyFlow',
      inputSchema: AnalyzeCaseStudyInputSchema,
      outputSchema: AnalyzeCaseStudyOutputSchema,
    },
    async (input) => {
      const prompt = ai.definePrompt({
        name: 'analyzeCaseStudyPrompt',
        input: {schema: AnalyzeCaseStudyInputSchema},
        output: {schema: AnalyzeCaseStudyOutputSchema},
        prompt: `You are an expert product management consultant. Given the following case study text, an optional image, and a list of product management framework IDs, analyze the provided content.

Case Study Text:
{{{caseStudyText}}}

{{#if imageUrl}}
Case Study Image:
{{media url=imageUrl}}
{{/if}}

Framework IDs:
{{#each frameworks}}
- {{this}}
{{/each}}

For EACH of the framework IDs listed above, provide:
1. "framework": The value MUST be the exact framework ID from the input list (e.g., if "SWOT" was an input ID, use "SWOT").
2. "keyInsight": A concise key insight extracted from the case study that is relevant to THIS specific framework. For SWOT, Ansoff Matrix, RICE, Five Forces, Value Chain, BCG Matrix, Theory of Constraints, Six Sigma, Design Thinking, Lean Startup, or Agile, this should be an OVERALL summary insight. For Blue Ocean Strategy, this field should be populated with a concise summary (2-3 sentences) explaining the potential Blue Ocean opportunity and how it differentiates from competition.
3. "suggestedStrategy": A brief, actionable strategy or improvement related to THIS framework, based on the case study. For SWOT, Ansoff Matrix, RICE, Five Forces, Value Chain, BCG Matrix, Theory of Constraints, Six Sigma, Design Thinking, Lean Startup, or Agile, this should be an OVERALL summary strategy. For Blue Ocean Strategy, this field should be populated with a suggested strategic action or prompt to pursue the Blue Ocean (e.g., "Consider eliminating X and focusing on Y to create a new market space.").

SPECIFIC INSTRUCTIONS FOR SWOT FRAMEWORK:
If one of the framework IDs is "SWOT", then in addition to the overall "keyInsight" and "suggestedStrategy" for SWOT, you MUST ALSO populate the following fields with arrays of strings:
- "strengths": ["Identified strength 1", "Identified strength 2", ...]
- "weaknesses": ["Identified weakness 1", "Identified weakness 2", ...]
- "opportunities": ["Identified opportunity 1", "Identified opportunity 2", ...]
- "threats": ["Identified threat 1", "Identified threat 2", ...]
If no items are found for a specific quadrant (e.g., no strengths), return an empty array for that field (e.g., "strengths": []).
Do NOT populate these strengths, weaknesses, opportunities, or threats fields for any other framework ID.

SPECIFIC INSTRUCTIONS FOR ANSOFF MATRIX FRAMEWORK:
If one of the framework IDs is "Ansoff Matrix", then in addition to the overall "keyInsight" and "suggestedStrategy", you MUST ALSO populate the following fields. Each quadrant field should be an array of objects, where each object has "initiative" (string) and "rationale" (string).
- "marketPenetration": [{ "initiative": "Example Initiative for MP", "rationale": "Rationale for this MP initiative" }, ...] (for existing product, existing market)
- "productDevelopment": [{ "initiative": "Example Initiative for PD", "rationale": "Rationale for this PD initiative" }, ...] (for new product, existing market)
- "marketDevelopment": [{ "initiative": "Example Initiative for MD", "rationale": "Rationale for this MD initiative" }, ...] (for existing product, new market)
- "diversification": [{ "initiative": "Example Initiative for Div", "rationale": "Rationale for this Div initiative" }, ...] (for new product, new market)
- "quadrantRecommendations": [{ "quadrant": "Market Penetration", "recommendation": "Strategic recommendation for Market Penetration initiatives" }, ...] (provide a recommendation for each Ansoff quadrant that has identified initiatives)
If no initiatives are found for a specific quadrant (e.g., no Market Penetration initiatives), return an empty array for that field (e.g., "marketPenetration": []).
If no recommendations can be made for a quadrant, omit it from "quadrantRecommendations" or provide an empty array for "quadrantRecommendations".
Do NOT populate these Ansoff Matrix specific fields for any other framework ID.

SPECIFIC INSTRUCTIONS FOR RICE FRAMEWORK:
If one of the framework IDs is "RICE", then in addition to the overall "keyInsight" and "suggestedStrategy", you MUST ALSO populate the following fields:
- "initiatives": An array of objects. Each object should represent a feature/initiative found in the case study. For each, you must estimate the RICE values based on the text. Each object must include "name", "reach", "impact" (0.25-3), "confidence" (0-100), "effort" (in person-months), a calculated "score", and a "ranking".
- "topItemsAnalysis": A short narrative for the top 3 scoring items, explaining why they scored high and what to do next.
- "bottomItemsAnalysis": A short narrative for the bottom 3 scoring items, explaining why they scored low and what to do next.
- "estimationImprovementSuggestions": A few bullet points on how to improve the precision of these RICE estimates (e.g., what data to gather, who to talk to).
If no initiatives are identifiable in the text, return an empty array for "initiatives" and empty strings for the analysis fields.
Do NOT populate these RICE-specific fields for any other framework ID.

SPECIFIC INSTRUCTIONS FOR PORTER'S FIVE FORCES FRAMEWORK:
If one of the framework IDs is "Five Forces", then in addition to the overall "keyInsight" and "suggestedStrategy" for Five Forces, you MUST ALSO populate the "porterForcesDetails" field.
This field should be an array of exactly FIVE objects, one for each of Porter's Five Forces. Each object MUST include:
- "forceName": The standard name of the force (e.g., "Competitive Rivalry", "Supplier Power", "Buyer Power", "Threat of Substitution", "Threat of New Entry").
- "impactLevel": Assessed as "Low", "Moderate", or "High" based on the case study.
- "analysis": A brief analysis of this force from the case study.
- "specificSuggestion": (Optional) A tactical suggestion for this force.
If no specific details are apparent for a force from the text, provide a minimal analysis (e.g., "Not explicitly detailed in the case study.") and an appropriate impact level. Ensure all five forces are covered.
Do NOT populate the "porterForcesDetails" field for any other framework ID.

SPECIFIC INSTRUCTIONS FOR BLUE OCEAN STRATEGY FRAMEWORK:
If one of the framework IDs is "Blue Ocean Strategy", in addition to populating the "keyInsight" field with the Blue Ocean opportunity summary and the "suggestedStrategy" field with the action prompt as described above, you MUST ALSO populate the following fields:
- "eliminateItems": An array of strings identifying factors the industry currently competes on that could be eliminated. (e.g., ["Complex feature X", "High-cost material Y"])
- "reduceItems": An array of strings identifying factors that should be reduced well below the industry standard. (e.g., ["Service level Z", "Marketing spend on channel A"])
- "raiseItems": An array of strings identifying factors that should be raised well above the industry standard. (e.g., ["Customer support quality", "Product durability"])
- "createItems": An array of strings identifying new factors or sources of value the industry has never offered. (e.g., ["Unique partnership with service B", "Novel user experience C"])
If no items are identified for a specific ERRC category, return an empty array for that field (e.g., "eliminateItems": []).
Do NOT populate these Blue Ocean Strategy ERRC fields for any other framework ID.

SPECIFIC INSTRUCTIONS FOR VALUE CHAIN ANALYSIS FRAMEWORK:
If one of the framework IDs is "Value Chain", then in addition to the overall "keyInsight" and "suggestedStrategy", you MUST ALSO populate the following fields:
- "primaryActivities": An array of objects. Each object MUST include:
  - "name": The name of the primary activity (MUST be one of: "Inbound Logistics", "Operations", "Outbound Logistics", "Marketing & Sales", "Services").
  - "insight": A brief insight or analysis related to this primary activity from the case study.
  - "optimizationOpportunity": (Optional) A specific opportunity for optimization (e.g., cost reduction, differentiation).
  Provide an entry for each of the five primary activities if relevant information exists. If information for a specific primary activity is not present, you MAY omit it or provide a minimal insight like "Not detailed in case study."
- "supportActivities": An array of objects. Each object MUST include:
  - "name": The name of the support activity (MUST be one of: "Firm Infrastructure", "Human Resource Management", "Technology Development", "Procurement").
  - "insight": A brief insight or analysis related to this support activity from the case study.
  - "optimizationOpportunity": (Optional) A specific opportunity for optimization.
  Provide an entry for each of the four support activities if relevant information exists. If information for a specific support activity is not present, you MAY omit it or provide a minimal insight.
- "valueChainRecommendations": An array of strings, where each string is an actionable recommendation based on the overall Value Chain analysis. (e.g., "Streamline outbound logistics by partnering with local distributors.")
If no specific data can be extracted for primary/support activities or recommendations, return empty arrays for those fields.
Do NOT populate these Value Chain specific fields for any other framework ID.

SPECIFIC INSTRUCTIONS FOR BCG MATRIX FRAMEWORK:
If one of the framework IDs is "BCG Matrix", then in addition to the overall "keyInsight" and "suggestedStrategy", you MUST ALSO populate the "bcgMatrixItems" field.
This field should be an array of objects, where each object represents a distinct business unit or product identified in the case study. Each object MUST include:
- "unitName": The name of the business unit or product.
- "marketShare": An estimated relative market share percentage (e.g., 15 for 15%).
- "marketGrowth": An estimated market growth rate percentage (e.g., 20 for 20%).
- "quadrant": The correct classification ("Stars", "Question Marks", "Cash Cows", or "Dogs") based on the share and growth.
- "recommendation": A brief strategic recommendation for this specific unit.
If no specific units can be identified from the text, return an empty array for "bcgMatrixItems".
Do NOT populate the "bcgMatrixItems" field for any other framework ID.

SPECIFIC INSTRUCTIONS FOR THEORY OF CONSTRAINTS (TOC) FRAMEWORK:
If one of the framework IDs is "Theory of Constraints", then in addition to the overall "keyInsight" and "suggestedStrategy", you MUST ALSO populate the following fields:
- "identifiedConstraint": A string that clearly and concisely describes the primary bottleneck identified in the process described in the case study.
- "processFlow": An array of objects representing the sequential steps in the process. Each object should have a "name" (string) and "isConstraint" (boolean). Exactly ONE step in the array should have "isConstraint" set to true. (e.g., [{"name": "Step A", "isConstraint": false}, {"name": "Step B (Bottleneck)", "isConstraint": true}, ...])
- "fiveFocusingSteps": An array of exactly FIVE objects, one for each of the Five Focusing Steps. Each object MUST include:
  - "step": The name of the step ("Identify", "Exploit", "Subordinate", "Elevate", "Repeat").
  - "action": A brief, actionable insight for applying this step to the case study's context.
If no clear process or constraint can be identified, you may return empty arrays for these fields.
Do NOT populate these TOC-specific fields for any other framework ID.

SPECIFIC INSTRUCTIONS FOR SIX SIGMA FRAMEWORK:
If one of the framework IDs is "Six Sigma", then in addition to the overall "keyInsight" and "suggestedStrategy", you MUST ALSO populate the following fields:
- "identifiedProblem": A string that clearly and concisely describes the primary problem or defect identified from the case study.
- "dmaicSteps": An array of exactly FIVE objects, one for each of the DMAIC steps. Each object MUST include:
  - "step": The name of the step ("Define", "Measure", "Analyze", "Improve", "Control").
  - "details": A brief, actionable insight for applying this step to the case study's context. For "Define", this should reiterate or expand on the problem. For others, it should suggest what to measure, analyze, improve, or control.
If no clear process for Six Sigma can be identified, you may return empty arrays for these fields.
Do NOT populate these Six Sigma-specific fields for any other framework ID.

SPECIFIC INSTRUCTIONS FOR DESIGN THINKING FRAMEWORK:
If one of the framework IDs is "Design Thinking", then in addition to the overall "keyInsight" and "suggestedStrategy", you MUST ALSO populate the "designThinkingPhases" field.
This field should be an array of exactly FIVE objects, one for each of the Design Thinking phases. Each object MUST include:
  - "phase": The name of the phase ("Empathize", "Define", "Ideate", "Prototype", "Test").
  - "details": A brief, actionable insight for applying this step to the case study's context. For "Empathize", describe user needs. For "Define", state the core problem. For "Ideate", list potential solutions. For "Prototype", suggest what to build. For "Test", describe how to validate.
If no clear process for Design Thinking can be identified, you may return an empty array for this field.
Do NOT populate the "designThinkingPhases" field for any other framework ID.

SPECIFIC INSTRUCTIONS FOR LEAN STARTUP FRAMEWORK:
If one of the framework IDs is "Lean Startup", then in addition to the overall "keyInsight" and "suggestedStrategy", you MUST ALSO populate the following fields:
- "keyAssumptions": An array of strings, where each string is a core assumption identified from the case study. (e.g., "Users are willing to pay for feature X.")
- "leanStartupCycles": An array of objects, where each object represents a full Build-Measure-Learn cycle. Each object MUST include:
  - "hypothesis": A string describing the core hypothesis tested.
  - "build": A string describing the MVP or feature built to test it.
  - "measure": A string describing what was measured and how.
  - "learn": A string summarizing the key learning from the cycle.
  - "decision": A string that is either "Pivot" or "Persevere" based on the learning.
If the case study describes multiple cycles, add multiple objects to the array. If no cycles are identifiable, return an empty array.
Do NOT populate these Lean Startup-specific fields for any other framework ID.

SPECIFIC INSTRUCTIONS FOR AGILE FRAMEWORK:
If one of the framework IDs is "Agile", then in addition to the overall "keyInsight" and "suggestedStrategy", you MUST ALSO populate the following fields:
- "agileMaturityAssessment": A concise (1-2 sentence) assessment of the team's agile maturity level (e.g., Foundational, Evolving, Advanced) based on the case study.
- "agileInsights": An array of objects, where each object provides a specific insight into the team's agile practices. Each object must include:
  - "aspect": The aspect of Agile being analyzed (one of "Roles", "Ceremonies", "Artifacts", "Workflow", "Maturity").
  - "observation": A brief observation about this aspect from the case study (e.g., "The team appears to be missing a dedicated Product Owner role.").
  - "suggestion": (Optional) A specific, actionable suggestion for improvement related to the observation.
If no specific insights can be drawn, return an empty array for "agileInsights".
Do NOT populate these Agile-specific fields for any other framework ID.

Return your response as a JSON array of objects, where each object corresponds to one of the input framework IDs.
Ensure your response strictly adheres to the JSON structure and the specific instructions for all complex frameworks if they are requested.
Example for a single framework (non-complex):
{
  "framework": "MVP",
  "keyInsight": "The case study mentions launching a basic version to test the market.",
  "suggestedStrategy": "Focus on core features for the initial MVP and gather user feedback quickly."
}
`,
      });
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI did not return analysis results.');
      }
      // Basic validation to ensure the output is an array
      if (!Array.isArray(output)) {
        console.error("AI output was not an array:", output);
        throw new Error("AI returned invalid analysis results format.");
      }
      return output;
    }
  );
  return analyzeCaseStudyFlow(input);
}
