
'use client';

import type { FrameworkAnalysisItem } from '@/ai/flows/analyze-case-study';
import type { FrameworkMetaData } from '@/lib/frameworks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Truck, Settings, PackageOpen, Megaphone, SmilePlus,
  Building2, Users2, Cpu, ShoppingCart, Route,
  Lightbulb, AlertCircle, Target, DollarSign, Star, Workflow, Info
} from 'lucide-react';

interface ValueChainDisplayProps {
  valueChainData: FrameworkAnalysisItem;
  frameworkMeta: FrameworkMetaData;
}

const primaryActivityIcons: Record<string, React.ReactNode> = {
  "Inbound Logistics": <Truck className="h-5 w-5 text-blue-500" />,
  "Operations": <Settings className="h-5 w-5 text-green-500" />,
  "Outbound Logistics": <PackageOpen className="h-5 w-5 text-purple-500" />,
  "Marketing & Sales": <Megaphone className="h-5 w-5 text-orange-500" />,
  "Services": <SmilePlus className="h-5 w-5 text-teal-500" />,
};

const supportActivityIcons: Record<string, React.ReactNode> = {
  "Firm Infrastructure": <Building2 className="h-5 w-5 text-gray-500" />,
  "Human Resource Management": <Users2 className="h-5 w-5 text-indigo-500" />,
  "Technology Development": <Cpu className="h-5 w-5 text-pink-500" />,
  "Procurement": <ShoppingCart className="h-5 w-5 text-lime-500" />,
};

const OptimizationIcon = ({ opportunity }: { opportunity?: string }) => {
  if (!opportunity) return null;
  if (opportunity.toLowerCase().includes('cost')) return <DollarSign className="h-4 w-4 text-red-500" />;
  if (opportunity.toLowerCase().includes('differentiation') || opportunity.toLowerCase().includes('value')) return <Star className="h-4 w-4 text-yellow-500" />;
  return <Lightbulb className="h-4 w-4 text-blue-500" />;
};


export default function ValueChainDisplay({ valueChainData, frameworkMeta }: ValueChainDisplayProps) {
  const {
    keyInsight,
    suggestedStrategy,
    primaryActivities = [],
    supportActivities = [],
    valueChainRecommendations = [],
  } = valueChainData;

  const hasContent = primaryActivities.length > 0 || supportActivities.length > 0 || valueChainRecommendations.length > 0 || keyInsight || suggestedStrategy;

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <Workflow className="h-6 w-6" />
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
            <p className="text-sm italic">No detailed Value Chain analysis data provided by the AI for this case study.</p>
          </div>
        )}

        {primaryActivities.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-accent flex items-center gap-2">
              <Route className="h-5 w-5" /> Primary Activities
            </h3>
            <div className="flex flex-col md:flex-row md:flex-wrap gap-3 items-stretch">
              {primaryActivities.map((activity, index) => (
                <div key={activity.name + index} className="flex-1 min-w-[180px] p-3 border rounded-lg bg-background/30 shadow-sm">
                  <h4 className="text-md font-semibold flex items-center gap-2 mb-1 text-foreground/90">
                    {primaryActivityIcons[activity.name] || <Settings className="h-5 w-5" />}
                    {activity.name}
                  </h4>
                  <p className="text-xs text-foreground/80 mb-1">{activity.insight}</p>
                  {activity.optimizationOpportunity && (
                    <p className="text-xs text-accent/80 flex items-center gap-1">
                      <OptimizationIcon opportunity={activity.optimizationOpportunity} />
                      <span className="font-medium">Opportunity:</span> {activity.optimizationOpportunity}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {supportActivities.length > 0 && (
          <div>
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-3 text-accent flex items-center gap-2">
              <Settings className="h-5 w-5" /> Support Activities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {supportActivities.map((activity, index) => (
                <div key={activity.name + index} className="p-3 border rounded-lg bg-background/30 shadow-sm">
                  <h4 className="text-md font-semibold flex items-center gap-2 mb-1 text-foreground/90">
                    {supportActivityIcons[activity.name] || <Cpu className="h-5 w-5" />}
                    {activity.name}
                  </h4>
                  <p className="text-xs text-foreground/80 mb-1">{activity.insight}</p>
                  {activity.optimizationOpportunity && (
                     <p className="text-xs text-accent/80 flex items-center gap-1">
                      <OptimizationIcon opportunity={activity.optimizationOpportunity} />
                      <span className="font-medium">Opportunity:</span> {activity.optimizationOpportunity}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {valueChainRecommendations.length > 0 && (
          <div>
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-2 text-accent flex items-center gap-2">
              <Lightbulb className="h-5 w-5" /> Actionable Recommendations
            </h3>
            <ul className="space-y-1 text-sm list-disc list-inside ml-1">
              {valueChainRecommendations.map((rec, index) => (
                <li key={index} className="text-foreground/90">{rec}</li>
              ))}
            </ul>
          </div>
        )}
        
        {(keyInsight || suggestedStrategy) && (
            <div className="mt-4 space-y-3 pt-3 border-t border-border">
                 {keyInsight && (
                    <div>
                        <h4 className="text-md font-semibold flex items-center gap-2 mb-1 text-accent">
                            <AlertCircle className="h-5 w-5" />
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

