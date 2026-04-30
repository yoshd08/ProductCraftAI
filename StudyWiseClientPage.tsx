
'use client';

import { useState } from 'react';
import CaseStudyInputForm from './CaseStudyInputForm';
import Dashboard from '@/components/dashboard/Dashboard';
import FrameworkSelectionStep from './FrameworkSelectionStep';
import { analyzeCaseStudy, type AnalyzeCaseStudyInput, type AnalyzeCaseStudyOutput } from '@/ai/flows/analyze-case-study';
import { recommendFrameworks, type RecommendFrameworksInput, type RecommendFrameworksOutput, type RecommendedFramework } from '@/ai/flows/recommend-frameworks';
import type { FrameworkName } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Terminal } from 'lucide-react';

type PageStep = 'input' | 'suggestions' | 'dashboard';

export default function StudyWiseClientPage() {
  const [currentStep, setCurrentStep] = useState<PageStep>('input');
  const [caseStudyText, setCaseStudyText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState<FrameworkName[]>([]);
  const [recommendedFrameworks, setRecommendedFrameworks] = useState<RecommendedFramework[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeCaseStudyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    if (!caseStudyText.trim()) {
      toast({
        title: 'Input Error',
        description: 'Case study text cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendedFrameworks([]);

    const input: RecommendFrameworksInput = { caseStudyText };

    try {
      const recommendations = await recommendFrameworks(input);
      setRecommendedFrameworks(recommendations || []);
      setSelectedFrameworks((recommendations || []).map(rec => rec.id as FrameworkName));
      setCurrentStep('suggestions');
    } catch (e) {
      console.error('Framework recommendation failed:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during recommendation.';
      setError(errorMessage);
      toast({
        title: 'Recommendation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFrameworkSelectionChange = (framework: FrameworkName, isSelected: boolean) => {
    setSelectedFrameworks(prev =>
      isSelected ? [...prev, framework] : prev.filter(f => f !== framework)
    );
  };

  const handleConfirmSelectionAndAnalyze = async () => {
    if (selectedFrameworks.length === 0) {
      toast({
        title: 'Input Error',
        description: 'Please select at least one framework.',
        variant: 'destructive',
      });
      return;
    }
    if (selectedFrameworks.length > 5) {
        toast({
            title: 'Input Error',
            description: `You can select a maximum of 5 frameworks. You have selected ${selectedFrameworks.length}.`,
            variant: 'destructive',
        });
        return;
    }


    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const input: AnalyzeCaseStudyInput = {
      caseStudyText,
      frameworks: selectedFrameworks as AnalyzeCaseStudyInput['frameworks'],
      imageUrl: imageUrl || undefined,
    };

    try {
      const result = await analyzeCaseStudy(input);
      setAnalysisResult(result);
      setCurrentStep('dashboard');
    } catch (e) {
      console.error('Analysis failed:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during analysis.';
      setError(errorMessage);
      toast({
        title: 'Analysis Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageFileChange = (file: File) => {
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
      toast({
        title: "File Too Large",
        description: "Image size should not exceed 4MB.",
        variant: "destructive"
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.onerror = () => {
      toast({
        title: "File Read Error",
        description: "There was an error reading the image file.",
        variant: "destructive"
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleBackToInput = () => {
    setCurrentStep('input');
    setAnalysisResult(null);
    setRecommendedFrameworks([]);
    setError(null);
  };
  
  const handleBackToSuggestions = () => {
    setCurrentStep('suggestions');
    setAnalysisResult(null);
    setError(null);
  }


  return (
    <div className="space-y-10">
       <p className="text-lg text-center text-foreground/80 max-w-2xl mx-auto">
          {currentStep === 'input' && "Paste your case study or upload a file to get started. We'll suggest relevant product management frameworks to analyze it."}
          {currentStep === 'suggestions' && "Review our AI-powered framework suggestions or customize your selection."}
          {currentStep === 'dashboard' && "Explore the detailed, AI-powered analysis of your case study."}
        </p>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentStep === 'input' && (
        <CaseStudyInputForm
          caseStudyText={caseStudyText}
          setCaseStudyText={setCaseStudyText}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          onImageFileChange={handleImageFileChange}
          onSubmit={handleGetSuggestions}
          isLoading={isLoading}
        />
      )}

      {currentStep === 'suggestions' && (
        <>
          <Button variant="outline" onClick={handleBackToInput} className="mb-4">Back to Case Study Input</Button>
          <FrameworkSelectionStep
            recommendedFrameworks={recommendedFrameworks}
            selectedFrameworks={selectedFrameworks}
            onFrameworkSelectionChange={handleFrameworkSelectionChange}
            onConfirmSelection={handleConfirmSelectionAndAnalyze}
            isLoadingConfirmation={isLoading}
            caseStudyTextPresent={!!caseStudyText.trim()}
          />
        </>
      )}

      {currentStep === 'dashboard' && analysisResult && (
         <>
          <Button variant="outline" onClick={handleBackToSuggestions} className="mb-4">Back to Framework Selection</Button>
          <Dashboard analysisResults={analysisResult} />
        </>
      )}
       {currentStep === 'dashboard' && !analysisResult && !isLoading && (
         <Alert variant="default" className="mt-6">
           <AlertTitle>Analysis Incomplete</AlertTitle>
           <AlertDescription>Something went wrong, and the analysis results are not available. Please try again.</AlertDescription>
           <Button variant="link" onClick={handleBackToSuggestions} className="p-0 h-auto mt-2">Go back to framework selection</Button>
         </Alert>
       )}

    </div>
  );
}
