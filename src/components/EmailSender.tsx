'use client';

import { useState } from 'react';
import { ExcelSchema, EmailConfig, EmailResponse } from '@/types';

interface EmailSenderProps {
  excelData: ExcelSchema;
  emailColumn: string;
  emailConfig: EmailConfig;
  resumeFile: File;
  onBack: () => void;
  onComplete: () => void;
}

export default function EmailSender({
  excelData,
  emailColumn,
  emailConfig,
  resumeFile,
  onBack,
  onComplete
}: EmailSenderProps) {
  const [isSending, setIsSending] = useState(false);
  const [results, setResults] = useState<EmailResponse | null>(null);
  const [progress, setProgress] = useState(0);

  const validEmails = excelData.data.filter(row => {
    const email = row[emailColumn];
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toString());
  });

  const handleSendEmails = async () => {
    setIsSending(true);
    setResults(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('excelData', JSON.stringify(excelData));
      formData.append('emailColumn', emailColumn);
      formData.append('emailConfig', JSON.stringify(emailConfig));
      formData.append('resume', resumeFile);

      const response = await fetch('/api/send-emails', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send emails');
      }

      setResults(result);
    } catch (error) {
      console.error('Email sending failed:', error);
      setResults({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send emails',
        sent: 0,
        failed: validEmails.length,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    } finally {
      setIsSending(false);
    }
  };

  const getSuccessRate = () => {
    if (!results) return 0;
    return Math.round((results.sent / (results.sent + results.failed)) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Step 4: Send Emails
        </h2>
        <p className="text-gray-600 mb-4">
          Review your settings and send your job application emails. This process may take a few minutes depending on the number of recipients.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="font-medium text-gray-900">Email Campaign Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Recipients</dt>
            <dd className="text-lg font-semibold text-gray-900">{validEmails.length}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email Column</dt>
            <dd className="text-sm text-gray-900">{emailColumn}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">From</dt>
            <dd className="text-sm text-gray-900">{emailConfig.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Resume File</dt>
            <dd className="text-sm text-gray-900">{resumeFile.name}</dd>
          </div>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-500 mb-1">Subject</dt>
          <dd className="text-sm text-gray-900 bg-white p-2 rounded border">
            {emailConfig.subject}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-500 mb-1">Email Preview</dt>
          <dd className="text-sm text-gray-900 bg-white p-2 rounded border max-h-32 overflow-y-auto">
            {emailConfig.message.substring(0, 300)}
            {emailConfig.message.length > 300 && '...'}
          </dd>
        </div>
      </div>

      {/* Sample Recipients */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Sample Recipients ({Math.min(5, validEmails.length)} of {validEmails.length}):
        </h3>
        <div className="text-sm text-blue-700 space-y-1">
          {validEmails.slice(0, 5).map((row, index) => (
            <div key={index} className="flex justify-between">
              <span>{row[emailColumn]}</span>
              {row.name && <span className="text-blue-600">({row.name})</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Emails will be sent with a 1-second delay between each to avoid spam filters</li>
                <li>Make sure your Gmail App Password is correctly configured</li>
                <li>Large batches may take several minutes to complete</li>
                <li>Monitor your Gmail sending limits to avoid being blocked</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Send Button */}
      {!isSending && !results && (
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Back to Resume Upload
          </button>
          <button
            onClick={handleSendEmails}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 font-medium"
          >
            Send {validEmails.length} Emails
          </button>
        </div>
      )}

      {/* Progress */}
      {isSending && (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Sending emails...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="text-center text-gray-600">
            Please don&apos;t close this page while emails are being sent...
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-4">
          {/* Success Summary */}
          <div className={`border rounded-lg p-6 ${
            results.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className={`text-lg font-semibold mb-2 ${
              results.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {results.success ? '✓ Email Campaign Completed' : '✗ Email Campaign Failed'}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Success Rate</dt>
                <dd className={`text-2xl font-bold ${
                  getSuccessRate() > 80 ? 'text-green-600' : 
                  getSuccessRate() > 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {getSuccessRate()}%
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Sent Successfully</dt>
                <dd className="text-2xl font-bold text-green-600">{results.sent}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Failed</dt>
                <dd className="text-2xl font-bold text-red-600">{results.failed}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total</dt>
                <dd className="text-2xl font-bold text-gray-900">{results.sent + results.failed}</dd>
              </div>
            </div>

            <div className={`text-sm ${
              results.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {results.message}
            </div>
          </div>

          {/* Errors */}
          {results.errors && results.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Errors ({results.errors.length}):
              </h3>
              <div className="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
                {results.errors.map((error, index) => (
                  <div key={index} className="font-mono text-xs">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Message & Actions */}
          {results.success && results.sent > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Next Steps:</h3>
              <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Monitor your sent folder in Gmail to confirm emails were sent</li>
                <li>Keep track of responses and follow up appropriately</li>
                <li>Consider personalizing follow-up emails for interested companies</li>
                <li>Update your application tracking spreadsheet</li>
              </ul>
            </div>
          )}

          {/* Complete Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={onComplete}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium"
            >
              Start New Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  );
}