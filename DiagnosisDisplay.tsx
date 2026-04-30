'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DiagnoseErrorOutput } from "@/ai/flows/diagnose-error";
import { Bug, AlertTriangle, Wrench, Terminal, CheckCircle } from 'lucide-react';
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

interface DiagnosisDisplayProps {
    results: DiagnoseErrorOutput;
}

export default function DiagnosisDisplay({ results }: DiagnosisDisplayProps) {
    const { diagnosisReport, actionPlan } = results;

    // A simple markdown-to-HTML converter for the action plan
    const renderMarkdown = (text: string) => {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-muted/80 text-foreground/80 font-mono text-sm p-1 rounded-sm">$1</code>')
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted/80 p-3 rounded-md overflow-x-auto"><code class="font-mono text-sm">$1</code></pre>')
            .replace(/\n/g, '<br />');
    };

    return (
        <div className="space-y-8 mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Bug />
                        AI-Powered Error Diagnosis
                    </CardTitle>
                    <CardDescription>
                        An analysis of the provided error log and context.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                           <AlertTriangle className="text-destructive"/>
                           Diagnosis Report
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-md">
                                <h4 className="font-medium mb-1">Issue Location</h4>
                                <Badge variant={diagnosisReport.isFrontend ? "default" : "secondary"}>
                                    {diagnosisReport.isFrontend ? "Frontend" : "Backend"}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {diagnosisReport.isFrontend 
                                        ? "The issue seems to be related to client-side code (Next.js/React)."
                                        : "The issue seems to be related to server-side logic or an API."}
                                </p>
                            </div>
                             <div className="p-4 bg-muted/50 rounded-md">
                                <h4 className="font-medium mb-2">Probable Causes</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-foreground/90">
                                   {diagnosisReport.probableCauses.map((cause, i) => <li key={i}>{cause}</li>)}
                                </ul>
                            </div>
                             <div className="p-4 bg-muted/50 rounded-md">
                                <h4 className="font-medium mb-2">Recommended Tools</h4>
                                <div className="flex flex-wrap gap-2">
                                    {diagnosisReport.recommendedTools.map((tool, i) => <Badge variant="outline" key={i}>{tool}</Badge>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />
                    
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                            <Wrench className="text-accent" />
                           Suggested Fixes
                        </h3>
                         <div className="space-y-3">
                            {diagnosisReport.suggestedFixes.map(fix => (
                                <div key={fix.step} className="p-3 border-l-4 border-accent rounded-r-md bg-muted/50">
                                    <h4 className="font-semibold flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Step {fix.step}</h4>
                                    <p className="text-sm my-1">{fix.description}</p>
                                    {fix.codeSnippet && (
                                        <pre className="bg-background mt-2 p-2 rounded-md overflow-x-auto">
                                            <code className="font-mono text-xs">{fix.codeSnippet}</code>
                                        </pre>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                            <Terminal className="text-primary"/>
                           Action Plan Summary
                        </h3>
                        <div 
                            className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 space-y-4"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(actionPlan) }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
