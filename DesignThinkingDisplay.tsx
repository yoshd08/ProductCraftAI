
'use client';

import type { FrameworkAnalysisItem } from '@/ai/flows/analyze-case-study';
import type { FrameworkMetaData } from '@/lib/frameworks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  HeartHandshake, TargetIcon, Lightbulb, Component, FlaskConical, Info, Brain, Target
} from 'lucide-react';

interface DesignThinkingDisplayProps {
  designThinkingData: FrameworkAnalysisItem;
  frameworkMeta: FrameworkMetaData;
}

const phaseIcons: Record<string, React.ReactNode> = {
  "Empathize": <HeartHandshake className="h-6 w-6 text-pink-500" />,
  "Define": <TargetIcon className="h-6 w-6 text-blue-500" />,
  "Ideate": <Lightbulb className="h-6 w-6 text-yellow-500" />,
  "Prototype": <Component className="h-6 w-6 text-green-500" />,
  "Test": <FlaskConical className="h-6 w-6 text-purple-500" />,
};

export default function DesignThinkingDisplay({ designThinkingData, frameworkMeta }: DesignThinkingDisplayProps) {
  const {
    keyInsight,
    suggestedStrategy,
    designThinkingPhases = [],
  } = designThinkingData;

  const hasContent = designThinkingPhases.length > 0 || keyInsight || suggestedStrategy;

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-drafting-compass"><circle cx="12" cy="12" r="3"/><path d="m12 19 5-10"/><path d="m12 19-5-10"/><path d="M19 12h-2"/><path d="M5 12H3"/><path d="m7 7-1.5-1.5"/><path d="m17 7 1.5-1.5"/></svg>
          {frameworkMeta.title} Process
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-3">
          {frameworkMeta.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {!hasContent && (
          <div className="flex items-center gap-2 text-muted-foreground p-4 border rounded-md">
            <Info className="h-5 w-5" />
            <p className="text-sm italic">No detailed Design Thinking analysis data provided by the AI for this case study.</p>
          </div>
        )}
        
        {designThinkingPhases.length > 0 && (
          <div>
             <h3 className="text-lg font-semibold mb-4 text-accent">The 5 Phases</h3>
             <div className="space-y-4">
              {designThinkingPhases.map((p, index) => (
                <div key={index} className="p-4 border rounded-lg bg-background/30 shadow-sm flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {phaseIcons[p.phase]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-md text-foreground/90">
                      {p.phase}
                    </h4>
                    <p className="text-sm text-foreground/80 mt-1">{p.details}</p>
                  </div>
                </div>
              ))}
             </div>
          </div>
        )}
        
        {(keyInsight || suggestedStrategy) && (
            <div className="mt-4 space-y-3 pt-4 border-t border-border">
                 {keyInsight && (
                    <div>
                        <h4 className="text-md font-semibold flex items-center gap-2 mb-1 text-accent">
                            <Brain className="h-5 w-5" />
                            Overall Key Insight
                        </h4>
                        <p className="text-sm text-foreground/90">{keyInsight}</p>
                    </div>
                )}
                {suggestedStrategy && (
                    <div className="mt-2">
                        <h4 className="text-md font-semibold flex items-center gap-2 mb-1 text-accent">
                            <Target className="h-5 w-5" />
                            Overall Suggested Strategy
                        </h4>
                        <p className="text-sm text-foreground/90">{suggestedStrategy}</p>
                    </div>
                )}
            </div>
        )}

      </CardContent>
    </Card>
  );
}
