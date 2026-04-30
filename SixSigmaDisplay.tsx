
'use client';

import type { FrameworkAnalysisItem } from '@/ai/flows/analyze-case-study';
import type { FrameworkMetaData } from '@/lib/frameworks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ClipboardList, Ruler, BrainCircuit, Lightbulb, CheckCircle, Info, Target, AlertCircle
} from 'lucide-react';

interface SixSigmaDisplayProps {
  sixSigmaData: FrameworkAnalysisItem;
  frameworkMeta: FrameworkMetaData;
}

const stepIcons: Record<string, React.ReactNode> = {
  "Define": <ClipboardList className="h-6 w-6 text-blue-500" />,
  "Measure": <Ruler className="h-6 w-6 text-purple-500" />,
  "Analyze": <BrainCircuit className="h-6 w-6 text-orange-500" />,
  "Improve": <Lightbulb className="h-6 w-6 text-green-500" />,
  "Control": <CheckCircle className="h-6 w-6 text-teal-500" />,
};

export default function SixSigmaDisplay({ sixSigmaData, frameworkMeta }: SixSigmaDisplayProps) {
  const {
    keyInsight,
    suggestedStrategy,
    identifiedProblem,
    dmaicSteps = [],
  } = sixSigmaData;

  const hasContent = identifiedProblem || dmaicSteps.length > 0 || keyInsight || suggestedStrategy;

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sigma"><path d="M18 7V4H6v3"/><path d="M12 4v16"/><path d="M6 20v-3h12v3"/></svg>
          {frameworkMeta.title} Analysis
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-3">
          {frameworkMeta.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {!hasContent && (
          <div className="flex items-center gap-2 text-muted-foreground p-4 border rounded-md">
            <Info className="h-5 w-5" />
            <p className="text-sm italic">No detailed Six Sigma analysis data provided by the AI for this case study.</p>
          </div>
        )}
        
        {identifiedProblem && (
           <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-accent">
                <AlertCircle className="h-5 w-5" />
                Problem Statement
              </h3>
              <p className="text-sm text-foreground/90 p-3 bg-background/50 rounded-md border-l-4 border-accent">{identifiedProblem}</p>
          </div>
        )}

        {dmaicSteps.length > 0 && (
          <div>
             <h3 className="text-lg font-semibold mb-4 text-accent">DMAIC Process</h3>
             <div className="space-y-4">
              {dmaicSteps.map((s, index) => (
                <div key={index} className="p-4 border rounded-lg bg-background/30 shadow-sm flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {stepIcons[s.step]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-md text-foreground/90">
                      {s.step}
                    </h4>
                    <p className="text-sm text-foreground/80 mt-1">{s.details}</p>
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
