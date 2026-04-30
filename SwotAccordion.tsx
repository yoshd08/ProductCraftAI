
'use client';

import type { FrameworkAnalysisItem } from '@/ai/flows/analyze-case-study';
import type { FrameworkMetaData } from '@/lib/frameworks';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Lightbulb, ShieldAlert, Target, ThumbsDown, ThumbsUp, Zap } from 'lucide-react';

interface SwotAccordionProps {
  swotData: FrameworkAnalysisItem; // This will contain strengths, weaknesses, etc.
  frameworkMeta: FrameworkMetaData; // For title, description
}

export default function SwotAccordion({ swotData, frameworkMeta }: SwotAccordionProps) {
  const {
    keyInsight,
    suggestedStrategy,
    strengths = [],
    weaknesses = [],
    opportunities = [],
    threats = [],
  } = swotData;

  const swotSections = [
    { title: 'Strengths', items: strengths, icon: <ThumbsUp className="h-5 w-5 text-green-500" />, value: 'strengths', type: 'list' },
    { title: 'Weaknesses', items: weaknesses, icon: <ThumbsDown className="h-5 w-5 text-red-500" />, value: 'weaknesses', type: 'list' },
    { title: 'Opportunities', items: opportunities, icon: <Lightbulb className="h-5 w-5 text-yellow-500" />, value: 'opportunities', type: 'list' },
    { title: 'Threats', items: threats, icon: <ShieldAlert className="h-5 w-5 text-orange-500" />, value: 'threats', type: 'list' },
  ];

  if (keyInsight) {
    swotSections.push({ title: 'Overall Key Insight', items: [keyInsight], icon: <Brain className="h-5 w-5 text-accent" />, value: 'overallInsight', type: 'text' });
  }
  if (suggestedStrategy) {
    swotSections.push({ title: 'Overall Suggested Strategy', items: [suggestedStrategy], icon: <Target className="h-5 w-5 text-accent" />, value: 'overallStrategy', type: 'text' });
  }

  const defaultOpenValues = swotSections.map(section => section.value);
  const hasContent = strengths.length > 0 || weaknesses.length > 0 || opportunities.length > 0 || threats.length > 0 || keyInsight || suggestedStrategy;


  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <Zap className="h-6 w-6" />
          {frameworkMeta.title}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-3">
          {frameworkMeta.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {hasContent ? (
            <Accordion type="multiple" defaultValue={defaultOpenValues} className="w-full">
            {swotSections.map((section) => (
                <AccordionItem value={section.value} key={section.value}>
                <AccordionTrigger className="text-md font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                    {section.icon}
                    {section.title}
                    {section.type === 'list' && <span className="text-xs text-muted-foreground">({section.items?.length || 0})</span>}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pl-2 pr-2 pt-2 text-sm">
                    {section.type === 'list' ? (
                    section.items && section.items.length > 0 ? (
                        <ul className="space-y-1 list-disc list-inside ml-4">
                        {section.items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground italic">No {section.title.toLowerCase()} identified by AI.</p>
                    )
                    ) : ( // type === 'text'
                    <p className="text-foreground/90">{section.items[0]}</p>
                    )}
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        ) : (
            <p className="mt-4 text-sm text-muted-foreground italic">No detailed SWOT analysis data provided by the AI for this case study.</p>
        )}
      </CardContent>
    </Card>
  );
}
