
'use client';

import type { FrameworkAnalysisItem } from '@/ai/flows/analyze-case-study';
import type { FrameworkMetaData } from '@/lib/frameworks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, HelpCircle, DollarSign, XCircle, Brain, Target, Info, LineChart } from 'lucide-react';

interface BcgMatrixDisplayProps {
  bcgData: FrameworkAnalysisItem;
  frameworkMeta: FrameworkMetaData;
}

type BcgQuadrantKey = "Stars" | "Question Marks" | "Cash Cows" | "Dogs";

interface QuadrantConfig {
  title: BcgQuadrantKey;
  icon: React.ReactNode;
  description: string;
  bgColor: string;
}

const quadrantConfigs: QuadrantConfig[] = [
  { title: 'Stars', icon: <Star className="h-5 w-5 text-yellow-400" />, description: 'High Growth, High Share', bgColor: 'bg-green-500/10' },
  { title: 'Question Marks', icon: <HelpCircle className="h-5 w-5 text-blue-400" />, description: 'High Growth, Low Share', bgColor: 'bg-blue-500/10' },
  { title: 'Cash Cows', icon: <DollarSign className="h-5 w-5 text-green-400" />, description: 'Low Growth, High Share', bgColor: 'bg-yellow-500/10' },
  { title: 'Dogs', icon: <XCircle className="h-5 w-5 text-red-400" />, description: 'Low Growth, Low Share', bgColor: 'bg-red-500/10' },
];

export default function BcgMatrixDisplay({ bcgData, frameworkMeta }: BcgMatrixDisplayProps) {
  const {
    keyInsight,
    suggestedStrategy,
    bcgMatrixItems = [],
  } = bcgData;

  const hasContent = bcgMatrixItems.length > 0 || keyInsight || suggestedStrategy;

  const getQuadrantItems = (quadrant: BcgQuadrantKey) => {
    return bcgMatrixItems.filter(item => item.quadrant === quadrant);
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <LineChart className="h-6 w-6" />
          {frameworkMeta.title} Analysis
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-3">
          {frameworkMeta.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        {!hasContent && (
            <div className="flex items-center gap-2 text-muted-foreground p-4 border rounded-md">
                <Info className="h-5 w-5" />
                <p className="text-sm italic">No detailed BCG Matrix analysis data provided by the AI for this case study.</p>
            </div>
        )}
        
        {bcgMatrixItems.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quadrantConfigs.map((quadrant) => {
                const items = getQuadrantItems(quadrant.title);
                return (
                    <div key={quadrant.title} className={`p-4 border rounded-lg ${quadrant.bgColor} shadow-inner`}>
                    <h4 className="text-lg font-bold flex items-center gap-2 mb-2 text-foreground">
                        {quadrant.icon}
                        {quadrant.title}
                    </h4>
                     <p className="text-xs text-muted-foreground mb-3">{quadrant.description}</p>
                    {items.length > 0 ? (
                        <ul className="space-y-3 text-sm">
                        {items.map((item, index) => (
                            <li key={index} className="p-2 border-l-2 border-primary/60 bg-background/50 rounded-r-md">
                            <strong className="font-semibold text-primary/90">{item.unitName}</strong>
                             <div className="text-xs text-muted-foreground flex gap-4 mt-1">
                                <span>Share: <Badge variant="secondary">{item.marketShare}%</Badge></span>
                                <span>Growth: <Badge variant="secondary">{item.marketGrowth}%</Badge></span>
                            </div>
                            <p className="text-xs text-foreground/80 mt-2">{item.recommendation}</p>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">No units identified for this quadrant.</p>
                    )}
                    </div>
                );
                })}
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
