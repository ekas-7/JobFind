'use client';

import { useState } from 'react';
import { ExcelSchema } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle,
  Link as LinkIcon,
  Plus,
  X
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ExcelUploaderProps {
  onSuccess: (data: ExcelSchema, emailColumn: string) => void;
}

export default function ExcelUploader({ onSuccess }: ExcelUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [urls, setUrls] = useState<string[]>(['']);
  const [uploading, setUploading] = useState(false);
  const [excelData, setExcelData] = useState<ExcelSchema | null>(null);
  const [selectedEmailColumn, setSelectedEmailColumn] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'excel' | 'urls'>('excel');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        setError('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }
      setFile(selectedFile);
      setError('');
      setExcelData(null);
      setSelectedEmailColumn('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setExcelData(result.schema);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const handleUrlsSubmit = async () => {
    const validUrls = urls.filter(url => url.trim() !== '');
    if (validUrls.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const response = await fetch('/api/parse-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: validUrls }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'URL parsing failed');
      }

      setExcelData(result.schema);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'URL parsing failed');
    } finally {
      setUploading(false);
    }
  };

  const handleEmailColumnSelect = () => {
    if (excelData && selectedEmailColumn) {
      onSuccess(excelData, selectedEmailColumn);
    }
  };

  const getEmailColumnSuggestions = () => {
    if (!excelData) return [];
    
    const emailKeywords = ['email', 'mail', 'e-mail', 'e_mail', 'contact'];
    return excelData.headers.filter(header =>
      emailKeywords.some(keyword =>
        header.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  const validateSelectedColumn = () => {
    if (!excelData || !selectedEmailColumn) return null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let validEmails = 0;
    const sampleEmails: string[] = [];

    excelData.data.forEach(row => {
      const email = row[selectedEmailColumn];
      if (email && emailRegex.test(email.toString())) {
        validEmails++;
        if (sampleEmails.length < 3) {
          sampleEmails.push(email.toString());
        }
      }
    });

    return {
      validEmails,
      totalRows: excelData.data.length,
      sampleEmails,
      isValid: validEmails > 0
    };
  };

  const validation = validateSelectedColumn();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Contact Data</h2>
        <p className="text-gray-600">
          Upload an Excel file with contacts or provide URLs to extract company information automatically.
        </p>
      </div>

      {/* Method Selection */}
      <div className="flex space-x-4">
        <Button
          variant={uploadMethod === 'excel' ? 'default' : 'outline'}
          onClick={() => setUploadMethod('excel')}
          className="flex-1"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Upload Excel File
        </Button>
        <Button
          variant={uploadMethod === 'urls' ? 'default' : 'outline'}
          onClick={() => setUploadMethod('urls')}
          className="flex-1"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Parse URLs
        </Button>
      </div>

      {/* Excel Upload */}
      {uploadMethod === 'excel' && (
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mb-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-gray-900">
                    {file ? file.name : 'Choose Excel file'}
                  </span>
                  <Input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Supports .xlsx and .xls files up to 10MB
                </p>
              </div>
              {file && !excelData && (
                <Button onClick={handleUpload} disabled={uploading} className="mt-4">
                  {uploading ? 'Processing...' : 'Process Excel File'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* URL Input */}
      {uploadMethod === 'urls' && (
        <Card>
          <CardHeader>
            <CardTitle>Job Posting URLs</CardTitle>
            <CardDescription>
              Enter URLs from job boards, company career pages, or LinkedIn job posts. We&apos;ll extract contact information automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {urls.map((url, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  type="url"
                  placeholder="https://careers.company.com/jobs/..."
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  className="flex-1"
                />
                {urls.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeUrlField(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={addUrlField} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Another URL
              </Button>
              <Button 
                onClick={handleUrlsSubmit} 
                disabled={uploading || urls.every(url => url.trim() === '')}
                className="flex-1"
              >
                {uploading ? 'Parsing URLs...' : 'Parse URLs'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Success & Column Selection */}
      {excelData && (
        <div className="space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  {uploadMethod === 'excel' ? 'Excel file processed!' : 'URLs parsed successfully!'}
                </span>
              </div>
              <p className="text-green-700 mt-1">
                Found {excelData.data.length} rows with {excelData.headers.length} columns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Email Column</CardTitle>
              <CardDescription>Choose which column contains the email addresses</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedEmailColumn} onValueChange={setSelectedEmailColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose email column..." />
                </SelectTrigger>
                <SelectContent>
                  {excelData.headers.map(header => (
                    <SelectItem key={header} value={header}>
                      {header}
                      {getEmailColumnSuggestions().includes(header) && (
                        <Badge variant="secondary" className="ml-2 text-xs">recommended</Badge>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Validation Results */}
          {validation && (
            <Card className={validation.isValid ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
              <CardContent className="p-4">
                <div className={`font-medium mb-2 ${validation.isValid ? 'text-green-800' : 'text-yellow-800'}`}>
                  {validation.isValid 
                    ? `✓ Found ${validation.validEmails} valid email addresses`
                    : `⚠ Only ${validation.validEmails} valid email addresses found`
                  } out of {validation.totalRows} rows
                </div>
                {validation.sampleEmails.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Sample emails:</p>
                    <div className="flex flex-wrap gap-1">
                      {validation.sampleEmails.map((email, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {email}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Continue Button */}
          {selectedEmailColumn && validation?.isValid && (
            <Button onClick={handleEmailColumnSelect} className="w-full" size="lg">
              Continue with {validation.validEmails} valid emails
              <CheckCircle className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}