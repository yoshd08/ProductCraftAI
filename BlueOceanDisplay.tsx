
'use client';

import type { FrameworkAnalysisItem } from '@/ai/flows/analyze-case-study';
import type { FrameworkMetaData } from '@/lib/frameworks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, Target, Waves, Trash2, TrendingDown, TrendingUp, Sparkles, Info } from 'lucide-react';

interface BlueOceanDisplayProps {
  blueOceanData: FrameworkAnalysisItem;
  frameworkMeta: FrameworkMetaData;
}

interface ErrcSectionProps {
  title: string;
  items: string[] | undefined;
  icon: React.ReactNode;
  colorClass: string;
}

const ErrcSection: React.FC<ErrcSectionProps> = ({ title, items, icon, colorClass }) => {
  return (
    <div className="p-3 border rounded-lg bg-background/30 shadow">
      <h4 className={`text-md font-semibold flex items-center gap-2 mb-1 ${colorClass}`}>
        {icon}
        {title}
      </h4>
      {items && items.length > 0 ? (
        <ul className="space-y-1 text-xs list-disc list-inside pl-2">
          {items.map((item, index) => (
            <li key={index} className="text-foreground/80">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground italic">No specific items identified by AI for {title.toLowerCase()}.</p>
      )}
    </div>
  );
};

export default function BlueOceanDisplay({ blueOceanData, frameworkMeta }: BlueOceanDisplayProps) {
  const {
    keyInsight, // This will now serve as the Blue Ocean Opportunity Summary
    suggestedStrategy, // This will now serve as the Suggested Strategic Action
    eliminateItems = [],
    reduceItems = [],
    raiseItems = [],
    createItems = [],
  } = blueOceanData;

  const hasErrcContent = eliminateItems.length > 0 || reduceItems.length > 0 || raiseItems.length > 0 || createItems.length > 0;
  const hasInsights = keyInsight || suggestedStrategy;

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <Waves className="h-6 w-6" />
          {frameworkMeta.title} Insights
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-3">
          {frameworkMeta.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-accent">ERRC Grid (Eliminate-Reduce-Raise-Create)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ErrcSection title="Eliminate" items={eliminateItems} icon={<Trash2 className="h-5 w-5" />} colorClass="text-red-500" />
            <ErrcSection title="Reduce" items={reduceItems} icon={<TrendingDown className="h-5 w-5" />} colorClass="text-orange-500" />
            <ErrcSection title="Raise" items={raiseItems} icon={<TrendingUp className="h-5 w-5" />} colorClass="text-blue-500" />
            <ErrcSection title="Create" items={createItems} icon={<Sparkles className="h-5 w-5" />} colorClass="text-green-500" />
          </div>
        </div>

        {(keyInsight || suggestedStrategy) && (
          <div className="space-y-4">
            <Separator />
            {keyInsight && (
              <div>
                <h4 className="text-md font-semibold flex items-center gap-2 mb-1 text-accent">
                  <Lightbulb className="h-5 w-5" />
                  Blue Ocean Opportunity Summary
                </h4>
                <p className="text-sm text-foreground/90">{keyInsight}</p>
              </div>
            )}
            {suggestedStrategy && (
              <div className={keyInsight ? "mt-3" : ""}>
                <h4 className="text-md font-semibold flex items-center gap-2 mb-1 text-accent">
                  <Target className="h-5 w-5" />
                  Suggested Strategic Action
                </h4>
                <p className="text-sm text-foreground/90">{suggestedStrategy}</p>
              </div>
            )}
          </div>
        )}
        
        {!hasErrcContent && !hasInsights && (
             <div className="flex items-center gap-2 text-muted-foreground p-4 border rounded-md">
                <Info className="h-5 w-5" />
                <p className="text-sm italic">No detailed Blue Ocean Strategy analysis data provided by the AI for this case study.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

