'use client';

import { useState } from 'react';
import { ExcelSchema } from '@/types';

interface ExcelUploaderProps {
  onSuccess: (data: ExcelSchema, emailColumn: string) => void;
}

export default function ExcelUploader({ onSuccess }: ExcelUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [excelData, setExcelData] = useState<ExcelSchema | null>(null);
  const [selectedEmailColumn, setSelectedEmailColumn] = useState<string>('');
  const [error, setError] = useState<string>('');

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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Step 1: Upload Excel File
        </h2>
        <p className="text-gray-600 mb-4">
          Upload an Excel file containing your contact list. The file should include email addresses and any other relevant information.
        </p>
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {file ? file.name : 'Choose Excel file'}
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Supports .xlsx and .xls files up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      {file && !excelData && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Processing...' : 'Process Excel File'}
        </button>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      {/* Schema Display */}
      {excelData && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="text-green-800 text-sm font-medium">
              ✓ Excel file processed successfully!
            </div>
            <div className="text-green-700 text-sm mt-1">
              Found {excelData.data.length} rows with {excelData.headers.length} columns
            </div>
          </div>

          {/* Email Column Selection */}
          <div>
            <label htmlFor="email-column" className="block text-sm font-medium text-gray-700 mb-2">
              Select Email Column
            </label>
            <select
              id="email-column"
              value={selectedEmailColumn}
              onChange={(e) => setSelectedEmailColumn(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose email column...</option>
              {excelData.headers.map(header => (
                <option key={header} value={header}>
                  {header}
                  {getEmailColumnSuggestions().includes(header) ? ' (recommended)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Column Validation */}
          {validation && (
            <div className={`border rounded-md p-4 ${
              validation.isValid ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className={`text-sm font-medium ${
                validation.isValid ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {validation.isValid 
                  ? `✓ Found ${validation.validEmails} valid email addresses`
                  : `⚠ Only ${validation.validEmails} valid email addresses found`
                } out of {validation.totalRows} rows
              </div>
              {validation.sampleEmails.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-600 mb-1">Sample emails:</div>
                  <div className="text-xs text-gray-500">
                    {validation.sampleEmails.join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Continue Button */}
          {selectedEmailColumn && validation?.isValid && (
            <button
              onClick={handleEmailColumnSelect}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Continue with {validation.validEmails} valid emails
            </button>
          )}
        </div>
      )}
    </div>
  );
}