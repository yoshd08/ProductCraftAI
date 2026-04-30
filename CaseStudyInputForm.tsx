
'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ImagePlus } from 'lucide-react';
import { getDocument, GlobalWorkerOptions, type TextItem } from 'pdfjs-dist';
import mammoth from 'mammoth';
import { Separator } from '../ui/separator';

interface CaseStudyInputFormProps {
  caseStudyText: string;
  setCaseStudyText: (text: string) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  onImageFileChange: (file: File) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

export default function CaseStudyInputForm({
  caseStudyText,
  setCaseStudyText,
  imageUrl,
  setImageUrl,
  onImageFileChange,
  onSubmit,
  isLoading,
}: CaseStudyInputFormProps) {
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCaseStudyText(`Processing "${file.name}"...`); // Provide immediate feedback

      if (typeof window !== 'undefined') {
        GlobalWorkerOptions.workerSrc = `/pdf.worker.js`;
      }

      try {
        let extractedText = '';
        if (file.type === 'text/plain') {
          extractedText = await file.text();
        } else if (file.type === 'application/pdf') {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            const pageText = textContent.items
                .filter((item): item is TextItem => 'str' in item)
                .map(item => item.str)
                .join(' ');
            
            fullText += pageText + '\n';
          }
          extractedText = fullText;
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          extractedText = result.value;
        } else {
          alert(`Unsupported file type: '${file.type}'. Please upload a .txt, .pdf, or .docx file.`);
          setCaseStudyText('');
          return;
        }
        setCaseStudyText(extractedText);
      } catch (error) {
        console.error("Error processing file:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        alert(`Failed to process file: ${errorMessage}.`);
        setCaseStudyText('');
      } finally {
        event.target.value = '';
      }
    }
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageFileChange(file);
    }
    event.target.value = '';
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isLoading && caseStudyText && !caseStudyText.startsWith('Processing')) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Case Study Input</CardTitle>
          <CardDescription>
            Paste your case study text below or upload a .txt, .pdf, or .docx file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your case study text here..."
            value={caseStudyText}
            onChange={(e) => setCaseStudyText(e.target.value)}
            rows={15}
            className="resize-y min-h-[200px] bg-white dark:bg-input"
            aria-label="Case study text input"
            required
          />
          <div>
            <Label htmlFor="file-upload" className="text-sm font-medium">Or upload a document</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="mt-1 bg-white dark:bg-input"
              aria-label="Upload .txt, .pdf, or .docx file"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2"><ImagePlus /> Visual Context (Optional)</CardTitle>
          <CardDescription>Add an image URL or upload a file for a richer analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input 
                id="image-url"
                type="url"
                placeholder="https://example.com/chart.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
           </div>
           <div className="relative">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-muted-foreground text-sm">OR</span>
           </div>
           <div className="space-y-2">
              <Label htmlFor="image-file">Upload Image</Label>
              <Input 
                id="image-file"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageFileChange}
              />
           </div>
           {imageUrl && imageUrl.startsWith('data:image') && (
            <div className='mt-2'>
              <img src={imageUrl} alt="Preview" className="max-h-48 rounded-md border" />
            </div>
           )}
        </CardContent>
      </Card>

      <Button
        type="button"
        onClick={onSubmit}
        className="w-full sm:w-auto"
        disabled={isLoading || !caseStudyText || caseStudyText.startsWith('Processing')}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting Suggestions...
          </>
        ) : (
          'Get Framework Suggestions'
        )}
      </Button>
    </form>
  );
}
