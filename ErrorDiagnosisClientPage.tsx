'use client';

import { useState } from "react";
import ErrorDiagnosisForm from "./ErrorDiagnosisForm";
import DiagnosisDisplay from "./DiagnosisDisplay";
import { diagnoseError, type DiagnoseErrorInput, type DiagnoseErrorOutput } from "@/ai/flows/diagnose-error";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ErrorDiagnosisClientPage() {
    const [errorLog, setErrorLog] = useState('');
    const [screenshotUrl, setScreenshotUrl] = useState('');
    const [appUrl, setAppUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<DiagnoseErrorOutput | null>(null);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!errorLog) {
            toast({
                title: 'Input Missing',
                description: 'Please provide an error log or stack trace.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults(null);

        const input: DiagnoseErrorInput = {
            errorLog,
            screenshotUrl: screenshotUrl || undefined,
            appUrl: appUrl || undefined,
        };

        try {
            const diagnosisResults = await diagnoseError(input);
            setResults(diagnosisResults);
        } catch (e) {
            console.error("Error diagnosis failed:", e);
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during analysis.";
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

    return (
        <div className="space-y-6">
            <p className="text-lg text-foreground/80 text-center max-w-2xl mx-auto">
                Paste an error log or stack trace. You can also provide a screenshot or a link to the app for more context.
            </p>
            <Card>
                <CardContent className="pt-6">
                    <ErrorDiagnosisForm
                        errorLog={errorLog}
                        setErrorLog={setErrorLog}
                        screenshotUrl={screenshotUrl}
                        setScreenshotUrl={setScreenshotUrl}
                        appUrl={appUrl}
                        setAppUrl={setAppUrl}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>
            {isLoading && (
                 <div className="flex items-center justify-center p-8">
                    <Terminal className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-4 text-lg">Diagnosing error...</p>
                </div>
            )}
            {error && (
                <Alert variant="destructive" className="mt-6">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {results && <DiagnosisDisplay results={results} />}
        </div>
    );
}
