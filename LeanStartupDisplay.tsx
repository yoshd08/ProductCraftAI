
'use client';

import type { FrameworkAnalysisItem } from '@/ai/flows/analyze-case-study';
import type { FrameworkMetaData } from '@/lib/frameworks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wrench, Gauge, Lightbulb, GitFork, CheckCircle, Info, Beaker, Repeat, Target
} from 'lucide-react';

interface LeanStartupDisplayProps {
  leanData: FrameworkAnalysisItem;
  frameworkMeta: FrameworkMetaData;
}

const decisionIcons: Record<string, React.ReactNode> = {
  "Pivot": <GitFork className="h-5 w-5 text-orange-500" />,
  "Persevere": <CheckCircle className="h-5 w-5 text-green-500" />,
};

const stepIcons = {
  "Build": <Wrench className="h-6 w-6 text-blue-500" />,
  "Measure": <Gauge className="h-6 w-6 text-purple-500" />,
  "Learn": <Lightbulb className="h-6 w-6 text-yellow-500" />,
};

export default function LeanStartupDisplay({ leanData, frameworkMeta }: LeanStartupDisplayProps) {
  const {
    keyInsight,
    suggestedStrategy,
    keyAssumptions = [],
    leanStartupCycles = [],
  } = leanData;

  const hasContent = keyAssumptions.length > 0 || leanStartupCycles.length > 0 || keyInsight || suggestedStrategy;

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <Repeat className="h-6 w-6" />
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
            <p className="text-sm italic">No detailed Lean Startup analysis data provided by the AI for this case study.</p>
          </div>
        )}
        
        {keyAssumptions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-accent">
              <Beaker className="h-5 w-5" />
              Key Assumptions
            </h3>
            <div className="flex flex-wrap gap-2">
              {keyAssumptions.map((assumption, index) => (
                <Badge key={index} variant="secondary" className="text-sm font-normal text-wrap p-2">
                  {assumption}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {leanStartupCycles.length > 0 && (
          <div className="space-y-6">
            {leanStartupCycles.map((cycle, index) => (
              <div key={index} className="p-4 border rounded-lg bg-background/40 shadow-inner">
                <h3 className="text-lg font-semibold mb-2 text-accent">
                  Cycle {index + 1}: Testing the Hypothesis
                </h3>
                <p className="italic text-foreground/90 p-3 bg-background/50 rounded-md border-l-4 border-accent mb-4">{cycle.hypothesis}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold flex items-center gap-2">{stepIcons.Build} Build</h4>
                    <p className="text-sm text-foreground/80 pl-8">{cycle.build}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold flex items-center gap-2">{stepIcons.Measure} Measure</h4>
                    <p className="text-sm text-foreground/80 pl-8">{cycle.measure}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold flex items-center gap-2">{stepIcons.Learn} Learn</h4>
                    <p className="text-sm text-foreground/80 pl-8">{cycle.learn}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <div className="flex items-center gap-2 p-2 rounded-md bg-background/80">
                      <span className="text-md font-semibold">Decision:</span>
                      <Badge variant={cycle.decision === 'Pivot' ? 'destructive' : 'default'} className="text-md">
                        <div className="flex items-center gap-1">
                          {decisionIcons[cycle.decision]}
                          {cycle.decision}
                        </div>
                      </Badge>
                    </div>
                </div>
              </div>
            ))}
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
