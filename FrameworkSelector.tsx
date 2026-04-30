'use client';

import type { FrameworkName } from '@/lib/constants';
import { ALL_FRAMEWORKS, MAX_FRAMEWORKS_SELECTABLE } from '@/lib/constants';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FrameworkSelectorProps {
  selectedFrameworks: FrameworkName[];
  onChange: (framework: FrameworkName) => void;
}

export default function FrameworkSelector({ selectedFrameworks, onChange }: FrameworkSelectorProps) {
  const handleCheckedChange = (framework: FrameworkName) => {
    onChange(framework);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Select Frameworks</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose up to {MAX_FRAMEWORKS_SELECTABLE} frameworks for analysis.
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full rounded-md border p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ALL_FRAMEWORKS.map((framework) => {
              const isChecked = selectedFrameworks.includes(framework);
              const isDisabled = !isChecked && selectedFrameworks.length >= MAX_FRAMEWORKS_SELECTABLE;
              return (
                <div key={framework} className="flex items-center space-x-2">
                  <Checkbox
                    id={framework}
                    checked={isChecked}
                    onCheckedChange={() => handleCheckedChange(framework)}
                    disabled={isDisabled}
                    aria-label={`Select framework ${framework}`}
                  />
                  <Label
                    htmlFor={framework}
                    className={`text-sm ${isDisabled ? 'text-muted-foreground cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {framework}
                  </Label>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
