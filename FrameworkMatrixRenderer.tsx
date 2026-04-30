
import type { FrameworkMetaData } from '@/lib/frameworks';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppWindow, Info } from 'lucide-react';

interface FrameworkMatrixRendererProps {
  framework: FrameworkMetaData;
  data: any; // Expects { keyInsight?: string, suggestedStrategy?: string, specific matrix data... }
}

export default function FrameworkMatrixRenderer({ framework, data }: FrameworkMatrixRendererProps) {
  const { keyInsight, suggestedStrategy } = data;

  // Attempt to get specific matrix cell data based on metricLabels
  const labels = framework.metricLabels || [];
  if (labels.length > 0) {
     const cellData = labels.map(label => {
        // Try to find data using various casings/spacings for the label
        // e.g., "Market Penetration", "marketPenetration", "marketpenetration"
        const Lkey = label.toLowerCase().replace(/\s+/g, '');
        const camelCaseKey = label.charAt(0).toLowerCase() + label.slice(1).replace(/\s+/g, '');
        // Check if data exists for any of these keys
        return data[Lkey as keyof typeof data] || data[camelCaseKey as keyof typeof data] || data[label as keyof typeof data] || [`${label} points... (AI data for this specific quadrant might be missing)`]
     }
     );

    return (
      <div className="space-y-3 text-sm">
        <div className={`grid grid-cols-1 ${labels.length === 4 ? 'md:grid-cols-2' : labels.length === 2 || labels.length === 3 ? 'md:grid-cols-' + labels.length : ''} gap-2`}>
          {labels.map((label, index) => (
            <div key={label} className="p-3 border rounded-lg bg-background/50">
              <h5 className="font-semibold text-primary mb-1">{label}</h5>
              {/* Check if cellData[index] is an array of strings */}
              {Array.isArray(cellData[index]) ? (
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  {(cellData[index] as string[]).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              ) : (
                // If not an array, treat as a single string or show placeholder
                <p className="text-xs">{String(cellData[index])}</p>
              )}
            </div>
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

  // Fallback if no metricLabels are defined for the matrix framework or if specific data is missing
  return (
    <Alert>
      <AppWindow className="h-4 w-4" />
      <AlertTitle>Matrix Display Information</AlertTitle>
      <AlertDescription>
        Displaying general information for {framework.title}. 
        {(keyInsight || suggestedStrategy) ? "See general insights below." : "The AI needs to provide structured data specific to this framework for a detailed matrix view."}
        {keyInsight && <><br /><br /><strong className="text-foreground/90">Key Insight:</strong> {keyInsight}</>}
        {suggestedStrategy && <><br /><strong className="text-foreground/90">Suggested Strategy:</strong> {suggestedStrategy}</>}
      </AlertDescription>
    </Alert>
  );
}
