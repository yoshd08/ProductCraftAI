
'use client';

import type { BrandAnalysisOutput } from '@/ai/flows/analyze-brand';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '../ui/badge';
import { ArrowLeft, Printer, Save, Mail, Brain, Users, Compass, Search, Heart, ThumbsUp, Aperture, BarChart, FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface BrandAnalysisDashboardProps {
    results: BrandAnalysisOutput;
    onReset: () => void;
}

const SectionCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <Card className="break-inside-avoid">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-primary">
                {icon} {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

export default function BrandAnalysisDashboard({ results, onReset }: BrandAnalysisDashboardProps) {
    
    const handleSaveToDevice = () => {
        window.print();
    };

    const handleEmailReport = () => {
        const subject = `Brand Analysis Report for ${results.brandName}`;
        const body = `Here is the brand analysis report for ${results.brandName}.\n\nYou can view the full interactive report here: ${window.location.href}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const ExportButton = () => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline"><Printer className="mr-2" /> Export Report</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleSaveToDevice}>
                        <Save className="mr-2 h-4 w-4" />
                        <span>Save as PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEmailReport}>
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Email Report</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    return (
        <div className="space-y-8 print:space-y-4">
            <div className="flex justify-between items-center print:hidden">
                <Button variant="outline" onClick={onReset}><ArrowLeft className="mr-2" /> New Analysis</Button>
                <h2 className="text-2xl md:text-3xl font-bold text-center text-primary">{results.brandName} - Brand Report</h2>
                <ExportButton />
            </div>
             <div className="hidden print:block text-center mb-8">
                 <h1 className="text-4xl font-bold text-primary">{results.brandName}</h1>
                 <p className="text-lg text-muted-foreground">Brand Analysis Report</p>
             </div>

            <SectionCard title="Executive Summary" icon={<Brain className="h-6 w-6" />}>
                <p className="text-lg text-foreground/90">{results.executiveSummary}</p>
            </SectionCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 @container">
                <SectionCard title="Brand Core & Identity" icon={<Aperture className="h-6 w-6" />}>
                    <Accordion type="multiple" defaultValue={['voiceAndTone', 'visualIdentity']} className="w-full">
                        <AccordionItem value="mission">
                            <AccordionTrigger>Mission, Vision, Values</AccordionTrigger>
                            <AccordionContent>{results.brandCoreIdentity.missionVisionValues}</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="voiceAndTone">
                            <AccordionTrigger>Voice & Tone</AccordionTrigger>
                            <AccordionContent>{results.brandCoreIdentity.voiceAndTone}</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="visualIdentity">
                            <AccordionTrigger>Visual Identity</AccordionTrigger>
                            <AccordionContent>{results.brandCoreIdentity.visualIdentity}</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="consistency">
                            <AccordionTrigger>Consistency</AccordionTrigger>
                            <AccordionContent>{results.brandCoreIdentity.consistency}</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </SectionCard>

                <SectionCard title="Target Audience & Connection" icon={<Users className="h-6 w-6" />}>
                     <Accordion type="multiple" defaultValue={['primaryAudience']} className="w-full">
                        <AccordionItem value="primaryAudience">
                            <AccordionTrigger>Primary Audience</AccordionTrigger>
                            <AccordionContent>{results.targetAudienceConnection.primaryAudience}</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="problemsAndAspirations">
                            <AccordionTrigger>Problems & Aspirations Addressed</AccordionTrigger>
                            <AccordionContent>{results.targetAudienceConnection.problemsAndAspirations}</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="connectionEffectiveness">
                            <AccordionTrigger>Connection Effectiveness</AccordionTrigger>
                            <AccordionContent>{results.targetAudienceConnection.connectionEffectiveness}</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="gapsAndMismatches">
                            <AccordionTrigger>Gaps & Mismatches</AccordionTrigger>
                            <AccordionContent>{results.targetAudienceConnection.gapsAndMismatches}</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </SectionCard>
                 <SectionCard title="Positioning & Competitive Landscape" icon={<Compass className="h-6 w-6" />}>
                     <Accordion type="multiple" defaultValue={['positioningStatement']} className="w-full">
                        <AccordionItem value="positioningStatement">
                            <AccordionTrigger>Positioning Statement</AccordionTrigger>
                            <AccordionContent>{results.positioningAndCompetitiveLandscape.positioningStatement}</AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="valueProposition">
                            <AccordionTrigger>Value Proposition Strength</AccordionTrigger>
                            <AccordionContent>{results.positioningAndCompetitiveLandscape.valuePropositionStrength}</AccordionContent>
                        </AccordionItem>
                        {results.positioningAndCompetitiveLandscape.competitorAnalysis.map(comp => (
                            <AccordionItem value={comp.competitorName} key={comp.competitorName}>
                                <AccordionTrigger>vs. {comp.competitorName}</AccordionTrigger>
                                <AccordionContent>{comp.comparison}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </SectionCard>
                <SectionCard title="Digital & Social Presence" icon={<Search className="h-6 w-6" />}>
                    <Accordion type="multiple" defaultValue={['websiteAnalysis']} className="w-full">
                        <AccordionItem value="websiteAnalysis">
                            <AccordionTrigger>Website Analysis</AccordionTrigger>
                            <AccordionContent>{results.digitalAndSocialPresence.websiteAnalysis}</AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="socialMediaAnalysis">
                            <AccordionTrigger>Social Media Analysis</AccordionTrigger>
                            <AccordionContent>{results.digitalAndSocialPresence.socialMediaAnalysis}</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="bestPerformingContent">
                            <AccordionTrigger>Best Performing Content</AccordionTrigger>
                            <AccordionContent>{results.digitalAndSocialPresence.bestPerformingContent}</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="underutilizedOpportunities">
                            <AccordionTrigger>Underutilized Opportunities</AccordionTrigger>
                            <AccordionContent>{results.digitalAndSocialPresence.underutilizedOpportunities}</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </SectionCard>
            </div>
            
            <SectionCard title="Emotional Resonance & Cultural Impact" icon={<Heart className="h-6 w-6" />}>
                <div className="grid md:grid-cols-2 gap-x-6">
                    <div>
                        <h4 className="font-semibold text-foreground/90">Storytelling & Community</h4>
                        <p className="text-sm mt-1">{results.emotionalResonanceAndCulturalImpact.storytellingAndCommunity}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                         <h4 className="font-semibold text-foreground/90">Authenticity & Relatability</h4>
                        <p className="text-sm mt-1">{results.emotionalResonanceAndCulturalImpact.authenticityAndRelatability}</p>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Strengths, Gaps & Opportunities" icon={<ThumbsUp className="h-6 w-6" />}>
                <Accordion type="multiple" defaultValue={['strengths', 'opportunities']} className="w-full">
                    <AccordionItem value="strengths">
                        <AccordionTrigger>Biggest Strengths</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc pl-5 space-y-1">
                                {results.strengthsGapsAndOpportunities.biggestStrengths.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="gaps">
                        <AccordionTrigger>Identified Gaps</AccordionTrigger>
                        <AccordionContent>
                             <ul className="list-disc pl-5 space-y-1">
                                {results.strengthsGapsAndOpportunities.identifedGaps.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="quickWins">
                        <AccordionTrigger>Quick Wins</AccordionTrigger>
                        <AccordionContent>
                             <ul className="list-disc pl-5 space-y-1">
                                {results.strengthsGapsAndOpportunities.quickWins.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="longTerm">
                        <AccordionTrigger>Long-Term Strategies</AccordionTrigger>
                        <AccordionContent>
                             <ul className="list-disc pl-5 space-y-1">
                                {results.strengthsGapsAndOpportunities.longTermStrategies.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </SectionCard>
            

             <style jsx global>{`
                @media print {
                    body {
                        background-color: white !important;
                        color: black !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .print\:hidden {
                        display: none;
                    }
                    .print\:block {
                        display: block;
                    }
                    .print\:space-y-4 > * + * {
                        margin-top: 1rem;
                    }
                    .break-inside-avoid {
                        break-inside: avoid;
                    }
                    .card {
                        border: 1px solid #e2e8f0 !important;
                        box-shadow: none !important;
                        background-color: white !important;
                        color: black !important;
                    }
                    .card-header, .card-content {
                         color: black !important;
                    }
                    .text-primary {
                        color: #00A3A3 !important; /* Use a specific hex for primary for printing */
                    }
                     .text-foreground, .text-foreground\/90, .text-foreground\/80 {
                        color: black !important;
                    }
                     .text-muted-foreground {
                        color: #555 !important;
                    }
                    .accordion-trigger > svg {
                        display: none; /* Hide chevron on print */
                    }
                    .accordion-content {
                        color: black !important;
                        display: block !important; /* Force content to show */
                    }
                    .accordion-item > div[data-state='closed'] {
                        display: block !important; /* Ensure content area is visible */
                    }
                    .accordion-item > div[data-state='closed'] > div {
                         padding-bottom: 1rem; /* Add padding back */
                    }
                }
            `}</style>
        </div>
    );
}
