
'use client';

import type { FrameworkAnalysisItem } from '@/ai/flows/analyze-case-study';
import type { FrameworkMetaData } from '@/lib/frameworks';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Brain, BriefcaseBusiness, DoorOpen, Handshake, Replace, ShieldAlert, ShieldCheck, ShoppingCart, Swords, Target, Users } from 'lucide-react';

interface PorterFiveForcesDisplayProps {
  porterData: FrameworkAnalysisItem;
  frameworkMeta: FrameworkMetaData;
}

const forceIcons: Record<string, React.ReactNode> = {
  "Competitive Rivalry": <Swords className="h-5 w-5 text-red-500" />,
  "Supplier Power": <Handshake className="h-5 w-5 text-orange-500" />, // Changed from Truck for better abstraction
  "Buyer Power": <ShoppingCart className="h-5 w-5 text-blue-500" />,
  "Threat of Substitution": <Replace className="h-5 w-5 text-purple-500" />,
  "Threat of New Entry": <DoorOpen className="h-5 w-5 text-green-500" />,
};

const impactLevelVariant = (level: "Low" | "Moderate" | "High" | undefined): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
        case "Low": return "default"; // Consider a less prominent variant if 'default' is primary
        case "Moderate": return "secondary";
        case "High": return "destructive";
        default: return "outline";
    }
};

const impactLevelIcon = (level: "Low" | "Moderate" | "High" | undefined): React.ReactNode => {
    switch (level) {
        case "Low": return <ShieldCheck className="h-4 w-4 text-green-500" />;
        case "Moderate": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        case "High": return <ShieldAlert className="h-4 w-4 text-red-500" />;
        default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
}

export default function PorterFiveForcesDisplay({ porterData, frameworkMeta }: PorterFiveForcesDisplayProps) {
  const {
    keyInsight,
    suggestedStrategy,
    porterForcesDetails = [],
  } = porterData;

  const defaultOpenValues = porterForcesDetails.map(force => force.forceName);

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <BriefcaseBusiness className="h-6 w-6" /> 
          {frameworkMeta.title} Analysis
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-3">
          {frameworkMeta.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {porterForcesDetails.length > 0 ? (
            <Accordion type="multiple" defaultValue={defaultOpenValues} className="w-full">
            {porterForcesDetails.map((force) => (
                <AccordionItem value={force.forceName} key={force.forceName}>
                <AccordionTrigger className="text-md font-semibold hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-2">
                            {forceIcons[force.forceName] || <Users className="h-5 w-5 text-gray-500" />}
                            {force.forceName}
                        </span>
                        <Badge variant={impactLevelVariant(force.impactLevel)} className="flex items-center gap-1 text-xs">
                           {impactLevelIcon(force.impactLevel)} {force.impactLevel || "N/A"}
                        </Badge>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pl-2 pr-2 pt-2 text-sm space-y-2">
                    <p><strong className="text-foreground/80">Analysis:</strong> {force.analysis}</p>
                    {force.specificSuggestion && (
                    <p><strong className="text-accent/90">Suggestion:</strong> {force.specificSuggestion}</p>
                    )}
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        ) : (
            <p className="text-muted-foreground italic">No detailed Porter's Five Forces analysis provided by AI.</p>
        )}

        {(keyInsight || suggestedStrategy) && (
            <div className="mt-6 space-y-4 pt-4 border-t border-border">
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
         {!keyInsight && !suggestedStrategy && porterForcesDetails.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground italic">No Porter's Five Forces data provided by the AI for this case study.</p>
        )}
      </CardContent>
    </Card>
  );
}
