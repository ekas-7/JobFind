'use client';

import { useState } from 'react';
import { EmailConfig } from '@/types';

interface EmailConfigFormProps {
  onSubmit: (config: EmailConfig) => void;
  onBack: () => void;
}

export default function EmailConfigForm({ onSubmit, onBack }: EmailConfigFormProps) {
  const [config, setConfig] = useState<EmailConfig>({
    from: '',
    subject: '',
    body: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleInputChange = (field: keyof EmailConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setVerificationResult(null);
  };

  const verifyGmailConnection = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const response = await fetch('/api/verify-gmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: config.from }),
      });

      const result = await response.json();

      setVerificationResult({
        success: result.success,
        message: result.message
      });
    } catch (error) {
      setVerificationResult({
        success: false,
        message: 'Failed to verify Gmail connection'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(config);
    }
  };

  const isFormValid = () => {
    return config.from.trim() !== '' && 
           config.subject.trim() !== '' && 
           config.body.trim() !== '';
  };

  const emailTemplates = [
    {
      name: 'Job Application',
      subject: 'Application for [Position] - [Your Name]',
      body: `Dear Hiring Manager,

I am writing to express my interest in opportunities at your company. I believe my skills and experience would be a valuable addition to your team.

Please find my resume attached for your consideration. I would welcome the opportunity to discuss how my background could contribute to your organization's success.

Thank you for your time and consideration.

Best regards,
[Your Name]`
    },
    {
      name: 'Networking',
      subject: 'Connecting with [Company Name] - [Your Name]',
      body: `Hello,

I hope this message finds you well. I am reaching out to connect and learn more about potential opportunities at [Company Name].

I have attached my resume and would appreciate any insights you might have about your team or upcoming positions that might align with my background.

Thank you for your time, and I look forward to hearing from you.

Best regards,
[Your Name]`
    }
  ];

  const applyTemplate = (template: typeof emailTemplates[0]) => {
    setConfig(prev => ({
      ...prev,
      subject: template.subject,
      body: template.body
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Step 2: Configure Email Settings
        </h2>
        <p className="text-gray-600 mb-4">
          Set up your Gmail configuration and compose your email template. Make sure to enable 2-factor authentication and use an App Password for Gmail.
        </p>
      </div>

      {/* Gmail Setup Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Gmail Setup Instructions:</h3>
        <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
          <li>Enable 2-factor authentication on your Google account</li>
          <li>Generate an App Password: Google Account → Security → App passwords</li>
          <li>Use your Gmail address and the 16-digit App Password below</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* From Email */}
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-2">
            From Email (Your Gmail Address)
          </label>
          <input
            type="email"
            id="from"
            value={config.from}
            onChange={(e) => handleInputChange('from', e.target.value)}
            placeholder="your.email@gmail.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Verify Gmail Connection */}
        {config.from && (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={verifyGmailConnection}
              disabled={isVerifying}
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Test Gmail Connection'}
            </button>
            {verificationResult && (
              <div className={`text-sm ${
                verificationResult.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {verificationResult.message}
              </div>
            )}
          </div>
        )}

        {/* Email Templates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Templates (Optional)
          </label>
          <div className="flex space-x-2 mb-2">
            {emailTemplates.map((template, index) => (
              <button
                key={index}
                type="button"
                onClick={() => applyTemplate(template)}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
              >
                Use {template.name} Template
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Email Subject
          </label>
          <input
            type="text"
            id="subject"
            value={config.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder="Application for [Position] - [Your Name]"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Body */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
            Email Body
          </label>
          <textarea
            id="body"
            value={config.body}
            onChange={(e) => handleInputChange('body', e.target.value)}
            placeholder="Compose your email message here..."
            rows={12}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Tip: Use placeholders like [Your Name], [Position], [Company Name] that you can replace manually in the template.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Back to Excel Upload
          </button>
          <button
            type="submit"
            disabled={!isFormValid()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Resume Upload
          </button>
        </div>
      </form>
    </div>
  );
}