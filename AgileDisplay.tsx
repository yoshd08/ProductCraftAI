
'use client';

import type { FrameworkAnalysisItem } from '@/ai/flows/analyze-case-study';
import type { FrameworkMetaData } from '@/lib/frameworks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users, Calendar, ClipboardList, Workflow, TrendingUp, Info, Brain, Target, Lightbulb
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AgileDisplayProps {
  agileData: FrameworkAnalysisItem;
  frameworkMeta: FrameworkMetaData;
}

const aspectIcons: Record<string, React.ReactNode> = {
  "Roles": <Users className="h-6 w-6 text-indigo-500" />,
  "Ceremonies": <Calendar className="h-6 w-6 text-teal-500" />,
  "Artifacts": <ClipboardList className="h-6 w-6 text-blue-500" />,
  "Workflow": <Workflow className="h-6 w-6 text-purple-500" />,
  "Maturity": <TrendingUp className="h-6 w-6 text-green-500" />,
};

export default function AgileDisplay({ agileData, frameworkMeta }: AgileDisplayProps) {
  const {
    keyInsight,
    suggestedStrategy,
    agileMaturityAssessment,
    agileInsights = [],
  } = agileData;

  const hasContent = agileMaturityAssessment || agileInsights.length > 0 || keyInsight || suggestedStrategy;

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-iteration-cw"><path d="M11 20A7 7 0 0 1 4 13H2"/><path d="M4 13A7 7 0 0 1 11 6v2"/><path d="M11 8A3 3 0 0 1 14 5a3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3"/></svg>
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
            <p className="text-sm italic">No detailed Agile analysis data provided by the AI for this case study.</p>
          </div>
        )}
        
        {agileMaturityAssessment && (
           <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-accent">
                <TrendingUp className="h-5 w-5" />
                Agile Maturity Assessment
              </h3>
              <p className="text-sm text-foreground/90 p-3 bg-background/50 rounded-md border-l-4 border-accent">{agileMaturityAssessment}</p>
          </div>
        )}

        {agileInsights.length > 0 && (
          <div>
             <h3 className="text-lg font-semibold mb-4 text-accent">Key Observations</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agileInsights.map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg bg-background/30 shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex-shrink-0">
                            {aspectIcons[insight.aspect] || <Lightbulb className="h-6 w-6 text-gray-500" />}
                        </div>
                        <h4 className="font-semibold text-md text-foreground/90">
                            {insight.aspect}
                        </h4>
                    </div>
                    <p className="text-sm text-foreground/80 flex-grow"><strong className="font-medium text-foreground/90">Observation:</strong> {insight.observation}</p>
                    {insight.suggestion && (
                        <p className="text-sm text-accent/90 mt-2 pt-2 border-t border-border/50"><strong className="font-medium text-accent">Suggestion:</strong> {insight.suggestion}</p>
                    )}
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
