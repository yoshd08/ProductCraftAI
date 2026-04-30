
'use client';

import type { AnalyzeCaseStudyOutput } from '@/ai/flows/analyze-case-study';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, Target, Zap } from 'lucide-react';

interface AnalysisResultsDisplayProps {
  results: AnalyzeCaseStudyOutput;
}

/**
 * @deprecated This component is being replaced by the more sophisticated Dashboard component.
 * It can be removed or kept for reference.
 */
export default function AnalysisResultsDisplay({ results }: AnalysisResultsDisplayProps) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold mb-8 text-center font-headline text-primary">
        Legacy Analysis Results (Summary)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item, index) => (
          <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-xl flex items-center gap-2 text-primary">
                <Zap className="h-6 w-6" />
                {item.framework}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-grow flex flex-col">
              <div className="mb-4">
                <h3 className="text-md font-semibold flex items-center gap-2 mb-1 text-foreground/80">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  Key Insight
                </h3>
                <p className="text-sm text-foreground/90">{item.keyInsight}</p>
              </div>
              <Separator className="my-3" />
              <div>
                <h3 className="text-md font-semibold flex items-center gap-2 mb-1 text-foreground/80">
                  <Target className="h-5 w-5 text-accent" />
                  Suggested Strategy
                </h3>
                <p className="text-sm text-foreground/90">{item.suggestedStrategy}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
