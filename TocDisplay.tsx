
'use client';

import type { FrameworkAnalysisItem } from '@/ai/flows/analyze-case-study';
import type { FrameworkMetaData } from '@/lib/frameworks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle, Target, Puzzle, Filter, ChevronRight, Zap, ArrowDownUp, Rocket, Repeat, Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TocDisplayProps {
  tocData: FrameworkAnalysisItem;
  frameworkMeta: FrameworkMetaData;
}

const stepIcons: Record<string, React.ReactNode> = {
  "Identify": <Filter className="h-5 w-5 text-red-500" />,
  "Exploit": <Zap className="h-5 w-5 text-orange-500" />,
  "Subordinate": <ArrowDownUp className="h-5 w-5 text-blue-500" />,
  "Elevate": <Rocket className="h-5 w-5 text-purple-500" />,
  "Repeat": <Repeat className="h-5 w-5 text-green-500" />,
};

export default function TocDisplay({ tocData, frameworkMeta }: TocDisplayProps) {
  const {
    keyInsight,
    suggestedStrategy,
    identifiedConstraint,
    processFlow = [],
    fiveFocusingSteps = [],
  } = tocData;

  const hasContent = identifiedConstraint || processFlow.length > 0 || fiveFocusingSteps.length > 0;

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <Puzzle className="h-6 w-6" />
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
            <p className="text-sm italic">No detailed Theory of Constraints analysis data provided by the AI for this case study.</p>
          </div>
        )}

        {processFlow.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-accent">Process Flow</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-4">
              {processFlow.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`p-3 border rounded-lg shadow-sm whitespace-nowrap ${step.isConstraint ? 'border-destructive ring-2 ring-destructive/50 bg-destructive/10' : 'bg-background/30'}`}>
                    <p className="font-medium text-sm flex items-center gap-2">
                      {step.isConstraint && <Filter className="h-4 w-4 text-destructive" />}
                      {step.name}
                    </p>
                    {step.isConstraint && <Badge variant="destructive" className="mt-1">Bottleneck</Badge>}
                  </div>
                  {index < processFlow.length - 1 && <ChevronRight className="h-6 w-6 text-muted-foreground shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {identifiedConstraint && (
           <div>
              <h4 className="text-md font-semibold flex items-center gap-2 mb-1 text-accent">
                <AlertCircle className="h-5 w-5" />
                Primary Constraint Identified
              </h4>
              <p className="text-sm text-foreground/90 p-3 bg-background/50 rounded-md border-l-4 border-accent">{identifiedConstraint}</p>
          </div>
        )}

        {fiveFocusingSteps.length > 0 && (
          <div>
             <h3 className="text-lg font-semibold mb-3 text-accent">The Five Focusing Steps</h3>
             <div className="space-y-3">
              {fiveFocusingSteps.map(s => (
                <div key={s.step} className={`p-3 border-l-4 rounded-r-md bg-background/30 ${s.step === 'Identify' ? 'border-destructive' : 'border-accent'}`}>
                  <h4 className="font-semibold text-md flex items-center gap-2 mb-1 text-foreground/90">
                    {stepIcons[s.step]}
                    {s.step}
                  </h4>
                  <p className="text-sm text-foreground/80">{s.action}</p>
                </div>
              ))}
             </div>
          </div>
        )}
        
        {(keyInsight || suggestedStrategy) && (
            <div className="mt-4 space-y-3 pt-3 border-t border-border">
                 {keyInsight && (
                    <div>
                        <h4 className="text-md font-semibold flex items-center gap-2 mb-1 text-accent">
                            Overall Key Insight
                        </h4>
                        <p className="text-sm text-foreground/90">{keyInsight}</p>
                    </div>
                )}
                {suggestedStrategy && (
                    <div>
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
