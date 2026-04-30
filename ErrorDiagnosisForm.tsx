'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Separator } from "../ui/separator";

interface ErrorDiagnosisFormProps {
    errorLog: string;
    setErrorLog: (text: string) => void;
    screenshotUrl: string;
    setScreenshotUrl: (url: string) => void;
    appUrl: string;
    setAppUrl: (url: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

export default function ErrorDiagnosisForm({
    errorLog,
    setErrorLog,
    screenshotUrl,
    setScreenshotUrl,
    appUrl,
    setAppUrl,
    onSubmit,
    isLoading
}: ErrorDiagnosisFormProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="error-log">Error Log or Stack Trace</Label>
                <Textarea
                    id="error-log"
                    placeholder="Paste your full error message or stack trace here..."
                    value={errorLog}
                    onChange={(e) => setErrorLog(e.target.value)}
                    rows={10}
                    className="resize-y min-h-[150px] font-mono text-xs"
                    required
                />
            </div>
            
            <Separator className="my-6" />

            <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="screenshot-url">Screenshot URL (Optional)</Label>
                    <Input
                        id="screenshot-url"
                        type="url"
                        placeholder="https://example.com/screenshot.png"
                        value={screenshotUrl}
                        onChange={(e) => setScreenshotUrl(e.target.value)}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="app-url">Application URL (Optional)</Label>
                    <Input
                        id="app-url"
                        type="url"
                        placeholder="https://myapp-123.web.app"
                        value={appUrl}
                        onChange={(e) => setAppUrl(e.target.value)}
                    />
                </div>
            </div>

            <Button onClick={onSubmit} disabled={isLoading || !errorLog.trim()} className="w-full sm:w-auto">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Diagnosing...
                    </>
                ) : (
                    "Diagnose Error"
                )}
            </Button>
        </div>
    );
}
