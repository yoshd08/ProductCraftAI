
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import type { BrandAnalysisInput, BrandAnalysisOutput } from '@/ai/flows/analyze-brand';
import { analyzeBrand } from '@/ai/flows/analyze-brand';
import BrandAnalysisForm from './BrandAnalysisForm';
import BrandAnalysisDashboard from './BrandAnalysisDashboard';
import GoalSelectionModal from './GoalSelectionModal';

export default function BrandAnalysisClientPage() {
    const [brandName, setBrandName] = useState('');
    const [url, setUrl] = useState('');
    const [additionalData, setAdditionalData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<BrandAnalysisOutput | null>(null);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

    const { toast } = useToast();

    const handleFormSubmit = () => {
        if (!brandName.trim() || !url.trim()) {
            toast({
                title: 'Input Missing',
                description: 'Please provide a brand name and a URL for analysis.',
                variant: 'destructive',
            });
            return;
        }
        setIsGoalModalOpen(true);
    };

    const handleConfirmGoals = async (goals: string[]) => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        setIsGoalModalOpen(false);

        // Join goals into the additionalData field for the AI to consider
        const goalsText = `\n\nStrategic Goals for this Analysis:\n- ${goals.join('\n- ')}`;
        const combinedAdditionalData = additionalData.trim() ? `${additionalData}\n${goalsText}` : goalsText;

        const input: BrandAnalysisInput = { 
            brandName, 
            url, 
            additionalData: combinedAdditionalData,
        };

        try {
            const analysisResults = await analyzeBrand(input);
            setResults(analysisResults);
        } catch (e) {
            console.error("Brand analysis failed:", e);
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
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


    const handleReset = () => {
        setBrandName('');
        setUrl('');
        setAdditionalData('');
        setResults(null);
        setError(null);
    };

    return (
        <div className="space-y-6">
            <p className="text-lg text-foreground/80 text-center max-w-2xl mx-auto">
                Enter a brand name and its primary URL (website, social media) to perform a comprehensive analysis of its identity, audience, positioning, and digital presence.
            </p>

            {!results ? (
                <>
                    <BrandAnalysisForm
                        brandName={brandName}
                        setBrandName={setBrandName}
                        url={url}
                        setUrl={setUrl}
                        additionalData={additionalData}
                        setAdditionalData={setAdditionalData}
                        onSubmit={handleFormSubmit}
                        isLoading={isLoading}
                    />
                    <GoalSelectionModal
                        isOpen={isGoalModalOpen}
                        onClose={() => setIsGoalModalOpen(false)}
                        onConfirm={handleConfirmGoals}
                        isLoading={isLoading}
                    />
                </>
            ) : (
                <BrandAnalysisDashboard results={results} onReset={handleReset} />
            )}

            {error && (
                <Alert variant="destructive" className="mt-6">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
