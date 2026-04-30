
'use client';

import type { FrameworkAnalysisItem } from '@/ai/flows/analyze-case-study';
import type { FrameworkMetaData } from '@/lib/frameworks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Globe, Network, PackagePlus, Target, Users, Briefcase } from 'lucide-react';

interface AnsoffMatrixDisplayProps {
  ansoffData: FrameworkAnalysisItem;
  frameworkMeta: FrameworkMetaData;
}

type AnsoffQuadrantKey = 'marketPenetration' | 'productDevelopment' | 'marketDevelopment' | 'diversification';

interface QuadrantConfig {
  title: string;
  icon: React.ReactNode;
  key: AnsoffQuadrantKey;
  description: string;
}

const quadrantConfigs: QuadrantConfig[] = [
  { title: 'Market Penetration', icon: <Users className="h-5 w-5 text-blue-500" />, key: 'marketPenetration', description: 'Existing Products, Existing Markets' },
  { title: 'Product Development', icon: <PackagePlus className="h-5 w-5 text-green-500" />, key: 'productDevelopment', description: 'New Products, Existing Markets' },
  { title: 'Market Development', icon: <Globe className="h-5 w-5 text-purple-500" />, key: 'marketDevelopment', description: 'Existing Products, New Markets' },
  { title: 'Diversification', icon: <Network className="h-5 w-5 text-orange-500" />, key: 'diversification', description: 'New Products, New Markets' },
];

export default function AnsoffMatrixDisplay({ ansoffData, frameworkMeta }: AnsoffMatrixDisplayProps) {
  const {
    keyInsight,
    suggestedStrategy,
    marketPenetration = [],
    productDevelopment = [],
    marketDevelopment = [],
    diversification = [],
    quadrantRecommendations = [],
  } = ansoffData;

  const ansoffQuadrantsData = {
    marketPenetration,
    productDevelopment,
    marketDevelopment,
    diversification,
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <Briefcase className="h-6 w-6" />
          {frameworkMeta.title} Analysis
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-3">
          {frameworkMeta.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quadrantConfigs.map((quadrant) => {
            const items = ansoffQuadrantsData[quadrant.key];
            return (
              <div key={quadrant.key} className="p-3 border rounded-lg bg-background/30 shadow">
                <h4 className="text-md font-semibold flex items-center gap-2 mb-1 text-foreground/90">
                  {quadrant.icon}
                  {quadrant.title}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">{quadrant.description}</p>
                {items && items.length > 0 ? (
                  <ul className="space-y-1.5 text-xs">
                    {items.map((item, index) => (
                      <li key={index} className="p-1.5 border-l-2 border-primary/50 bg-background/50 rounded-r-sm">
                        <strong className="font-medium text-primary/90">{item.initiative}:</strong>
                        <span className="ml-1 text-foreground/80">{item.rationale}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No specific initiatives identified by AI.</p>
                )}
              </div>
            );
          })}
        </div>

        {quadrantRecommendations && quadrantRecommendations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <h4 className="text-md font-semibold text-accent mb-1">Strategic Recommendations</h4>
            <ul className="space-y-1 text-sm list-disc list-inside ml-1">
              {quadrantRecommendations.map((rec, index) => (
                <li key={index} className="text-foreground/90">
                  <strong className="text-accent/90">{rec.quadrant}:</strong> {rec.recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(keyInsight || suggestedStrategy) && (
            <div className="mt-4 space-y-3 pt-3 border-t border-border">
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
        {!keyInsight && !suggestedStrategy && marketPenetration.length === 0 && productDevelopment.length === 0 && marketDevelopment.length === 0 && diversification.length === 0 && quadrantRecommendations.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground italic">No detailed Ansoff Matrix analysis data provided by the AI for this case study.</p>
        )}
      </CardContent>
    </Card>
  );
}

