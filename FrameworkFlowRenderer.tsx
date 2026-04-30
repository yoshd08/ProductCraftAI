
import * as React from "react";
import type { FrameworkMetaData } from '@/lib/frameworks';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronRight, Info } from 'lucide-react';

interface FrameworkFlowRendererProps {
  framework: FrameworkMetaData;
  data: any; // Expects e.g. { phases: Array<{ name: string, details: string[] }> }
}

export default function FrameworkFlowRenderer({ framework, data }: FrameworkFlowRendererProps) {
  if (!data || !data.phases || !Array.isArray(data.phases) || data.phases.length === 0) {
     return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Flow Data Missing</AlertTitle>
        <AlertDescription>
          The AI did not provide structured data for the flow diagram of {framework.title}.
        </AlertDescription>
      </Alert>
    );
  }
  
  const { keyInsight, suggestedStrategy } = data;


  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        {data.phases.map((phase: { name: string, details?: string[] }, index: number) => (
          <React.Fragment key={phase.name}>
            <div className="flex-shrink-0 p-3 border rounded-lg bg-primary/10 text-primary min-w-[100px] text-center">
              <h5 className="font-semibold">{phase.name}</h5>
              {phase.details && phase.details.length > 0 && (
                <ul className="text-xs mt-1 list-disc list-inside text-primary/80">
                  {phase.details.map((detail, i) => <li key={i}>{detail}</li>)}
                </ul>
              )}
            </div>
            {index < data.phases.length - 1 && (
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            )}
          </React.Fragment>
        ))}
      </div>
       {keyInsight && (
        <div className="mt-4 pt-2 border-t">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-1 text-foreground/80">
             Key Insight from AI
          </h4>
          <p className="text-xs text-foreground/90">{keyInsight}</p>
        </div>
      )}
      {suggestedStrategy && (
        <div className="mt-2">
          <h4 className="text-sm font-semibold flex items-center gap-2 mb-1 text-foreground/80">
             Suggested Strategy from AI
          </h4>
          <p className="text-xs text-foreground/90">{suggestedStrategy}</p>
        </div>
      )}
    </div>
  );
}
