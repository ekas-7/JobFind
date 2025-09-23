
'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, ArrowLeft, CheckCircle, AlertCircle, FileType } from 'lucide-react';

interface ResumeUploaderProps {
  onSuccess: (file: File) => void;
  onBack: () => void;
}

export default function ResumeUploader({ onSuccess, onBack }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = useCallback((selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      setError('');
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file for your resume.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Resume file must be smaller than 5MB.');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    handleFileChange(selectedFile || null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    handleFileChange(droppedFile || null);
  };

  const handleContinue = () => {
    if (file) {
      onSuccess(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Upload Your Resume</h2>
          <p className="text-muted-foreground">
            Your resume will be attached to the emails you send.
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <Card
        className={\`border-2 border-dashed transition-colors \${
          dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-border hover:border-primary/60'
        }\`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            
            {!file ? (
              <div>
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <span className="text-lg font-medium">
                    Click to upload or drag and drop
                  </span>
                  <input
                    id="resume-upload"
                    name="resume-upload"
                    type="file"
                    className="sr-only"
                    accept="application/pdf"
                    onChange={handleFileInputChange}
                  />
                </label>
                <p className="text-sm text-muted-foreground mt-2">
                  PDF only, up to 5MB
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-3 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Badge variant="outline">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                  <Badge variant="secondary" className="flex items-center">
                    <FileType className="w-3 h-3 mr-1.5" />
                    PDF
                  </Badge>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleFileChange(null)}
                >
                  Remove file
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center space-x-2 text-destructive text-sm font-medium">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <Card className="bg-secondary/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">💡 Pro Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Ensure your PDF resume is well-formatted and tailored for the jobs you're applying for. A single, polished resume works best for broad outreach.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!file}
          size="lg"
        >
          Continue
          <FileText className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
