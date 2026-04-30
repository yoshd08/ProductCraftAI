
'use client';

import type { FrameworkAnalysisItem } from '@/ai/flows/analyze-case-study';
import type { FrameworkMetaData } from '@/lib/frameworks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Lightbulb, Info, Target, Calculator, ChevronsUp, ChevronsDown } from 'lucide-react';

interface RiceScoreDisplayProps {
  riceData: FrameworkAnalysisItem;
  frameworkMeta: FrameworkMetaData;
}

export default function RiceScoreDisplay({ riceData, frameworkMeta }: RiceScoreDisplayProps) {
  const {
    initiatives = [],
    topItemsAnalysis,
    bottomItemsAnalysis,
    estimationImprovementSuggestions,
  } = riceData;

  const hasContent = initiatives.length > 0;

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-xl flex items-center gap-2 text-primary">
          <Calculator className="h-6 w-6" />
          {frameworkMeta.title} Analysis
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-3">
          {frameworkMeta.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {!hasContent ? (
          <div className="flex items-center gap-2 text-muted-foreground p-4 border rounded-md">
            <Info className="h-5 w-5" />
            <p className="text-sm italic">No RICE initiatives could be identified from the case study text.</p>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-accent">Prioritized Initiatives</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">Rank</TableHead>
                      <TableHead>Initiative</TableHead>
                      <TableHead className="text-right">Reach</TableHead>
                      <TableHead className="text-right">Impact</TableHead>
                      <TableHead className="text-right">Confidence</TableHead>
                      <TableHead className="text-right">Effort</TableHead>
                      <TableHead className="text-right font-bold text-primary">RICE Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initiatives.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell className="font-medium text-center">{item.ranking}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.reach.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.impact}</TableCell>
                        <TableCell className="text-right">{item.confidence}%</TableCell>
                        <TableCell className="text-right">{item.effort}</TableCell>
                        <TableCell className="text-right font-bold text-lg text-primary">
                          {item.score.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topItemsAnalysis && (
                 <div className="p-4 border rounded-lg bg-background/40 shadow-sm">
                    <h4 className="text-md font-semibold flex items-center gap-2 mb-2 text-green-400">
                        <ChevronsUp className="h-5 w-5" />
                        Top Priorities Analysis
                    </h4>
                    <p className="text-sm text-foreground/90">{topItemsAnalysis}</p>
                </div>
              )}
              {bottomItemsAnalysis && (
                <div className="p-4 border rounded-lg bg-background/40 shadow-sm">
                    <h4 className="text-md font-semibold flex items-center gap-2 mb-2 text-red-400">
                        <ChevronsDown className="h-5 w-5" />
                        Lower Priorities Analysis
                    </h4>
                    <p className="text-sm text-foreground/90">{bottomItemsAnalysis}</p>
                </div>
              )}
            </div>
            
            {estimationImprovementSuggestions && (
                <div className="p-4 border rounded-lg bg-accent/10 shadow-sm">
                    <h4 className="text-md font-semibold flex items-center gap-2 mb-2 text-accent">
                        <Lightbulb className="h-5 w-5" />
                        How to Improve Estimates
                    </h4>
                    <p className="text-sm text-foreground/90 whitespace-pre-line">{estimationImprovementSuggestions}</p>
                </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
