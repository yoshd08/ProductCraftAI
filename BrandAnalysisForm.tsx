
'use client';

import type { ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Separator } from '../ui/separator';

interface BrandAnalysisFormProps {
    brandName: string;
    setBrandName: (name: string) => void;
    url: string;
    setUrl: (url: string) => void;
    additionalData: string;
    setAdditionalData: (data: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

export default function BrandAnalysisForm({ 
    brandName, setBrandName, 
    url, setUrl, 
    additionalData, setAdditionalData, 
    onSubmit, isLoading 
}: BrandAnalysisFormProps) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Brand Analysis Input</CardTitle>
                <CardDescription>
                    Provide a brand name and a primary URL (website or social media). The AI will scrape the URL for information.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="brand-name-input">Brand Name</Label>
                    <Input
                        id="brand-name-input"
                        placeholder="e.g., 'Tesla', 'Nike', 'Salesforce'"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        required
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="url-input">Website or Social Media URL</Label>
                    <Input
                        id="url-input"
                        type="url"
                        placeholder="e.g., https://www.company.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                    />
                </div>

                <Separator className="my-6"/>

                <div className="space-y-2">
                    <Label htmlFor="additional-data">Additional Context (Optional)</Label>
                     <Textarea
                        id="additional-data"
                        placeholder="Paste any extra information here: user observations, internal documents, specific questions..."
                        value={additionalData}
                        onChange={(e) => setAdditionalData(e.target.value)}
                        rows={5}
                        className="resize-y min-h-[100px]"
                    />
                </div>

                <Button onClick={onSubmit} disabled={isLoading || !brandName.trim() || !url.trim()} className="w-full sm:w-auto">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        "Start Analysis"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
