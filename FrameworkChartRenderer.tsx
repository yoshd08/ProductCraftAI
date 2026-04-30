
'use client';

import type { FrameworkMetaData } from '@/lib/frameworks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useTheme } from 'next-themes'; // If you install next-themes for dynamic HSL values
import { useEffect, useState } from 'react';

interface FrameworkChartRendererProps {
  framework: FrameworkMetaData;
  data: any; // Expects { metrics: Array<{name: string, value: number}>, score?: number }
}

// Helper to get CSS variable value
const getCssVariableValue = (variableName: string) => {
  if (typeof window === 'undefined') return '#8884d8'; // Default for SSR
  return getComputedStyle(document.documentElement).getPropertyValue(variableName.startsWith('--') ? variableName : `--${variableName}`).trim();
};


export default function FrameworkChartRenderer({ framework, data }: FrameworkChartRendererProps) {
  const [chartColors, setChartColors] = useState<string[]>([]);

  useEffect(() => {
    // Ensure this runs client-side
    setChartColors([
      getCssVariableValue('--chart-1'),
      getCssVariableValue('--chart-2'),
      getCssVariableValue('--chart-3'),
      getCssVariableValue('--chart-4'),
      getCssVariableValue('--chart-5'),
    ]);
  }, []);


  if (!data || !data.metrics || !Array.isArray(data.metrics) || data.metrics.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Chart Data Missing</AlertTitle>
        <AlertDescription>
          The AI did not provide the necessary structured data (e.g., specific metric values) to render a chart for {framework.title}. 
          The AI prompt might need adjustment.
        </AlertDescription>
      </Alert>
    );
  }

  const chartData = data.metrics.map((metric: {name: string, value: number}) => ({
    name: metric.name,
    value: metric.value,
  }));

  if (chartColors.length === 0) {
    return <div>Loading chart styles...</div>; // Or a skeleton loader
  }

  return (
    <div className="w-full h-[250px] text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--popover-foreground))',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '10px' }} />
          <Bar dataKey="value" name={framework.title} >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {data.score && (
        <p className="text-center text-sm font-semibold mt-2 text-primary">
          Overall Score: {data.score}
        </p>
      )}
    </div>
  );
}
