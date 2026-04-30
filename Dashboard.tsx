
'use client';

import type { AnalyzeCaseStudyOutput, FrameworkAnalysisItem } from '@/ai/flows/analyze-case-study';
import type { FrameworkMetaData } from '@/lib/frameworks';
import { getFrameworkMetaData } from '@/lib/frameworks';
import FrameworkDisplayWrapper from './FrameworkDisplayWrapper';
import FrameworkCardRenderer from './renderers/FrameworkCardRenderer';
import FrameworkChartRenderer from './renderers/FrameworkChartRenderer';
import FrameworkFlowRenderer from './renderers/FrameworkFlowRenderer';
import FrameworkMatrixRenderer from './renderers/FrameworkMatrixRenderer';
import SwotAccordion from './renderers/SwotAccordion';
import AnsoffMatrixDisplay from './renderers/AnsoffMatrixDisplay';
import PorterFiveForcesDisplay from './renderers/PorterFiveForcesDisplay';
import BlueOceanDisplay from './renderers/BlueOceanDisplay';
import ValueChainDisplay from './renderers/ValueChainDisplay';
import BcgMatrixDisplay from './renderers/BcgMatrixDisplay';
import TocDisplay from './renderers/TocDisplay';
import SixSigmaDisplay from './renderers/SixSigmaDisplay';
import DesignThinkingDisplay from './renderers/DesignThinkingDisplay';
import LeanStartupDisplay from './renderers/LeanStartupDisplay';
import AgileDisplay from './renderers/AgileDisplay';
import RiceScoreDisplay from './renderers/RiceScoreDisplay';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface DashboardProps {
  analysisResults: AnalyzeCaseStudyOutput | null;
}

export default function Dashboard({ analysisResults }: DashboardProps) {
  if (!analysisResults || analysisResults.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 space-y-8">
      <h2 className="text-3xl font-bold mb-8 text-center font-headline text-primary">
        Detailed Framework Analysis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {analysisResults.map((resultItem, index) => {
          const frameworkMeta = getFrameworkMetaData(resultItem.framework as any);

          if (!frameworkMeta) {
            return (
              <Alert variant="destructive" key={`unknown-${index}`} className="md:col-span-2 xl:col-span-3">
                <AlertTitle>Unknown Framework</AlertTitle>
                <AlertDescription>
                  Metadata not found for framework: {resultItem.framework}
                </AlertDescription>
              </Alert>
            );
          }

          if (resultItem.framework === 'SWOT') {
            return (
                <div key={`swot-container-${index}`} className="md:col-span-1 xl:col-span-1 w-full">
                    <SwotAccordion
                        swotData={resultItem}
                        frameworkMeta={frameworkMeta}
                    />
                </div>
            );
          } else if (resultItem.framework === 'RICE') {
            return (
              <div key={`rice-container-${index}`} className="md:col-span-full w-full">
                <RiceScoreDisplay
                  riceData={resultItem}
                  frameworkMeta={frameworkMeta}
                />
              </div>
            );
          } else if (resultItem.framework === 'Ansoff Matrix') {
            return (
              <div key={`ansoff-container-${index}`} className="md:col-span-1 xl:col-span-1 w-full">
                <AnsoffMatrixDisplay
                  ansoffData={resultItem}
                  frameworkMeta={frameworkMeta}
                />
              </div>
            );
          } else if (resultItem.framework === 'Five Forces') {
            return (
              <div key={`porter-container-${index}`} className="md:col-span-1 xl:col-span-1 w-full">
                <PorterFiveForcesDisplay
                  porterData={resultItem}
                  frameworkMeta={frameworkMeta}
                />
              </div>
            );
          } else if (resultItem.framework === 'Blue Ocean Strategy') {
            return (
              <div key={`blueocean-container-${index}`} className="md:col-span-1 xl:col-span-1 w-full">
                <BlueOceanDisplay
                  blueOceanData={resultItem}
                  frameworkMeta={frameworkMeta}
                />
              </div>
            );
          } else if (resultItem.framework === 'Value Chain') {
            return (
              <div key={`valuechain-container-${index}`} className="md:col-span-full w-full"> {/* Value chain can take full width */}
                <ValueChainDisplay
                  valueChainData={resultItem}
                  frameworkMeta={frameworkMeta}
                />
              </div>
            );
          } else if (resultItem.framework === 'BCG Matrix') {
            return (
              <div key={`bcg-container-${index}`} className="md:col-span-full w-full"> {/* BCG can take full width */}
                <BcgMatrixDisplay
                  bcgData={resultItem}
                  frameworkMeta={frameworkMeta}
                />
              </div>
            );
          } else if (resultItem.framework === 'Theory of Constraints') {
            return (
              <div key={`toc-container-${index}`} className="md:col-span-full w-full">
                <TocDisplay
                  tocData={resultItem}
                  frameworkMeta={frameworkMeta}
                />
              </div>
            );
          } else if (resultItem.framework === 'Six Sigma') {
            return (
              <div key={`sixsigma-container-${index}`} className="md:col-span-full w-full">
                <SixSigmaDisplay
                  sixSigmaData={resultItem}
                  frameworkMeta={frameworkMeta}
                />
              </div>
            );
          } else if (resultItem.framework === 'Design Thinking') {
            return (
              <div key={`designthinking-container-${index}`} className="md:col-span-full w-full">
                <DesignThinkingDisplay
                  designThinkingData={resultItem}
                  frameworkMeta={frameworkMeta}
                />
              </div>
            );
          } else if (resultItem.framework === 'Lean Startup') {
            return (
              <div key={`leanstartup-container-${index}`} className="md:col-span-full w-full">
                <LeanStartupDisplay
                  leanData={resultItem}
                  frameworkMeta={frameworkMeta}
                />
              </div>
            );
          } else if (resultItem.framework === 'Agile') {
            return (
              <div key={`agile-container-${index}`} className="md:col-span-full w-full">
                <AgileDisplay
                  agileData={resultItem}
                  frameworkMeta={frameworkMeta}
                />
              </div>
            );
          } else {
            const displayData = {
              keyInsight: resultItem.keyInsight,
              suggestedStrategy: resultItem.suggestedStrategy,
              ...(frameworkMeta.id === 'RICE' && {
                metrics: [
                  { name: 'Reach', value: Math.floor(Math.random() * 100) + 50 },
                  { name: 'Impact', value: Math.floor(Math.random() * 3) + 1 },
                  { name: 'Confidence', value: Math.floor(Math.random() * 100)},
                  { name: 'Effort', value: Math.floor(Math.random() * 5) + 1 },
                ],
                score: Math.floor(Math.random() * 300) + 50,
              }),
              ...(frameworkMeta.id === 'JTBD' && {
                items: [
                  { job: 'Organize my project tasks', context: 'When planning a new feature', outcome: 'Clearly see priorities and deadlines' },
                  { job: 'Understand user pain points', context: 'Before designing a solution', outcome: 'Build a more relevant product' },
                ]
              }),
            };

            return (
              <FrameworkDisplayWrapper
                key={frameworkMeta.id + index}
                title={frameworkMeta.title}
                description={frameworkMeta.description}
              >
                {frameworkMeta.visualType === 'card' && (
                  <FrameworkCardRenderer framework={frameworkMeta} data={displayData} />
                )}
                {frameworkMeta.visualType === 'list' && (
                   <FrameworkCardRenderer framework={frameworkMeta} data={displayData} />
                )}
                {frameworkMeta.visualType === 'chart' && (
                  <FrameworkChartRenderer framework={frameworkMeta} data={displayData} />
                )}
                {frameworkMeta.visualType === 'flow' && (
                  <FrameworkFlowRenderer framework={frameworkMeta} data={displayData} />
                )}
                {frameworkMeta.visualType === 'matrix' && (
                  <FrameworkMatrixRenderer framework={frameworkMeta} data={displayData} />
                )}
                {(frameworkMeta.visualType === 'text' || !['card', 'list', 'chart', 'flow', 'matrix'].includes(frameworkMeta.visualType)) && (
                   <FrameworkCardRenderer framework={frameworkMeta} data={displayData} />
                )}
              </FrameworkDisplayWrapper>
            );
          }
        })}
      </div>
    </section>
  );
}
