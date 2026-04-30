
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StudyWiseClientPage from '@/components/studywise/StudyWiseClientPage';
import BrandAnalysisClientPage from '@/components/brand-analysis/BrandAnalysisClientPage';
import AppLayout from "@/components/layout/AppLayout";

export default function DashboardPage() {

  return (
    <AppLayout>
      <div className="space-y-10">
        <section className="text-center pt-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary font-headline">
                Unlock Business Insights with AI
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
                Analyze case studies, get answers from online articles, or perform a deep-dive brand analysis.
            </p>
        </section>
        
        <Tabs defaultValue="analyze" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
                <TabsTrigger value="analyze">Analyze Case Study</TabsTrigger>
                <TabsTrigger value="brand">Brand Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="analyze" className="mt-6">
                <StudyWiseClientPage />
            </TabsContent>
            <TabsContent value="brand" className="mt-6">
                <BrandAnalysisClientPage />
            </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
