
'use client';

import type { FrameworkName } from '@/lib/constants';
import type { RecommendedFramework } from '@/ai/flows/recommend-frameworks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import FrameworkSelector from './FrameworkSelector';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Loader2, Percent, Info } from 'lucide-react';

interface FrameworkSelectionStepProps {
  recommendedFrameworks: RecommendedFramework[];
  selectedFrameworks: FrameworkName[];
  onFrameworkSelectionChange: (framework: FrameworkName, isSelected: boolean) => void;
  onConfirmSelection: () => Promise<void>;
  isLoadingConfirmation: boolean;
  caseStudyTextPresent: boolean; // To enable/disable confirm button
}

export default function FrameworkSelectionStep({
  recommendedFrameworks,
  selectedFrameworks,
  onFrameworkSelectionChange,
  onConfirmSelection,
  isLoadingConfirmation,
  caseStudyTextPresent,
}: FrameworkSelectionStepProps) {

  const handleCheckboxChange = (frameworkId: FrameworkName, checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      onFrameworkSelectionChange(frameworkId, checked);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-primary font-headline">
          Suggested Frameworks
        </h2>
        <p className="text-muted-foreground mb-6">
          Based on your case study, we suggest these frameworks. You can adjust the selection below.
        </p>
        {recommendedFrameworks.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Info className="h-5 w-5" />
                <p>No specific recommendations could be generated. Please select frameworks manually below.</p>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {recommendedFrameworks.map((rec) => (
            <Card key={rec.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                   <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    {rec.id}
                   </CardTitle>
                   <Badge variant="secondary" className="flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    {(rec.score * 100).toFixed(0)}% Match
                  </Badge>
                </div>
                <CardDescription className="text-xs flex items-start gap-1 pt-1">
                  <Lightbulb className="h-3 w-3 mt-0.5 shrink-0 text-accent" />
                  <span>{rec.reason}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <Checkbox
                    id={`suggested-${rec.id}`}
                    checked={selectedFrameworks.includes(rec.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(rec.id, checked)}
                  />
                  <Label htmlFor={`suggested-${rec.id}`} className="text-sm font-medium leading-none cursor-pointer">
                    Select this framework
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <FrameworkSelector
        selectedFrameworks={selectedFrameworks}
        onChange={(frameworkName) => {
            // This toggle logic is now centralized
            const isCurrentlySelected = selectedFrameworks.includes(frameworkName);
            onFrameworkSelectionChange(frameworkName, !isCurrentlySelected);
        }}
      />

      <Button
        onClick={onConfirmSelection}
        className="w-full sm:w-auto"
        disabled={isLoadingConfirmation || !caseStudyTextPresent || selectedFrameworks.length === 0}
      >
        {isLoadingConfirmation ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing with Selected Frameworks...
          </>
        ) : (
          'Analyze with Selected Frameworks'
        )}
      </Button>
    </div>
  );
}
