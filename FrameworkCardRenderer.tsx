
import type { FrameworkMetaData } from '@/lib/frameworks';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Target, ListChecks, Info } from 'lucide-react';

interface FrameworkCardRendererProps {
  framework: FrameworkMetaData;
  data: any; // Expects { keyInsight?: string, suggestedStrategy?: string, items?: any[] ... }
}

export default function FrameworkCardRenderer({ framework, data }: FrameworkCardRendererProps) {
  const { keyInsight, suggestedStrategy, items } = data;

  if (framework.visualType === 'list' && items && Array.isArray(items)) {
    return (
      <div className="space-y-3 text-sm">
        {items.length === 0 && <p className="text-muted-foreground">No list items provided for {framework.title}.</p>}
        {items.map((item, index) => (
          <div key={index} className="p-2 border rounded-md bg-background/50">
            {Object.entries(item).map(([key, value]) => (
              <p key={key}>
                <strong className="capitalize text-primary/80">{key.replace(/([A-Z])/g, ' $1')}:</strong> {String(value)}
              </p>
            ))}
          </div>
        ))}
         {keyInsight && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-1 text-foreground/80">
              <Lightbulb className="h-4 w-4 text-accent" />
              Key Insight from AI
            </h4>
            <p className="text-xs text-foreground/90">{keyInsight}</p>
          </div>
        )}
        {suggestedStrategy && (
          <div className="mt-2">
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-1 text-foreground/80">
              <Target className="h-4 w-4 text-accent" />
              Suggested Strategy from AI
            </h4>
            <p className="text-xs text-foreground/90">{suggestedStrategy}</p>
          </div>
        )}
      </div>
    );
  }


  if (!keyInsight && !suggestedStrategy) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Data Note</AlertTitle>
        <AlertDescription>
          No specific insights or strategies provided by the AI for {framework.title}.
          The AI output may need to be adjusted to provide structured data for this framework.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      {keyInsight && (
        <div>
          <h4 className="text-md font-semibold flex items-center gap-2 mb-1 text-foreground/80">
            <Lightbulb className="h-5 w-5 text-accent" />
            Key Insight
          </h4>
          <p className="text-sm text-foreground/90">{keyInsight}</p>
        </div>
      )}
      {suggestedStrategy && (
        <div>
          <h4 className="text-md font-semibold flex items-center gap-2 mb-1 text-foreground/80">
            <Target className="h-5 w-5 text-accent" />
            Suggested Strategy
          </h4>
          <p className="text-sm text-foreground/90">{suggestedStrategy}</p>
        </div>
      )}
    </div>
  );
}
