'use client';

import { useState } from 'react';
import { EmailConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Sparkles,
  Copy,
  Shield,
  Key,
  ExternalLink,
  Info
} from 'lucide-react';

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
    } catch {
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
      subject: 'Application for {position} - {your_name}',
      body: `Dear Hiring Manager,

I hope this email finds you well. I am writing to express my strong interest in the {position} role at {company}.

After researching your company and the position requirements, I believe my background in {your_field} makes me an excellent candidate for this opportunity.

Key highlights of my experience include:
• {highlight_1}
• {highlight_2}
• {highlight_3}

I have attached my resume for your review and would welcome the opportunity to discuss how my skills and enthusiasm can contribute to {company}'s continued success.

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
{your_name}
{your_phone}
{your_email}`
    },
    {
      name: 'Networking Outreach',
      subject: 'Exploring Opportunities at {company} - {your_name}',
      body: `Hello,

I hope you're doing well. I'm {your_name}, a {your_title} with experience in {your_field}.

I've been following {company}'s work and am impressed by {specific_company_detail}. I'm currently exploring new opportunities and would love to learn more about your team and any potential openings that might align with my background.

A bit about me:
• {experience_years} years of experience in {your_field}
• Expertise in {skill_1}, {skill_2}, and {skill_3}
• Passionate about {relevant_interest}

I've attached my resume and would greatly appreciate any insights you might have about opportunities at {company} or the industry in general.

Thank you for your time, and I look forward to potentially connecting.

Best regards,
{your_name}`
    },
    {
      name: 'Cold Outreach',
      subject: 'Passionate {your_field} Professional - {your_name}',
      body: `Hi there,

I hope this message finds you well. My name is {your_name}, and I'm a {your_title} with a passion for {relevant_field}.

I came across {company} while researching innovative companies in {industry}, and I'm truly impressed by {specific_achievement_or_value}.

I'm currently seeking new opportunities where I can contribute my skills in:
• {core_skill_1}
• {core_skill_2}
• {core_skill_3}

While I know you may not have any current openings, I'd love to introduce myself and learn more about {company}'s future plans. Sometimes the best opportunities come from building relationships before positions are posted.

I've attached my resume for your reference. Would you be open to a brief 15-minute call to discuss potential synergies?

Thank you for your consideration.

Warm regards,
{your_name}
{your_contact_info}`
    }
  ];

  const applyTemplate = (template: typeof emailTemplates[0]) => {
    setConfig(prev => ({
      ...prev,
      subject: template.subject,
      body: template.body
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Configuration</h2>
          <p className="text-gray-600">
            Set up your Gmail credentials and craft your perfect outreach message.
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Gmail Setup Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-900 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Gmail App Password Setup Guide
          </CardTitle>
          <CardDescription className="text-blue-700">
            Follow these steps to securely connect your Gmail account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Step 1: Enable 2-Step Verification
              </h4>
              <ol className="text-sm text-blue-800 space-y-1 ml-6">
                <li className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                  <span>Go to <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 inline-flex items-center">
                    Google Account Security <ExternalLink className="w-3 h-3 ml-1" />
                  </a></span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                  <span>Under "Signing in to Google", click <strong>2-Step Verification</strong> and enable it</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                  <span>Follow the setup steps (phone number, authenticator app, etc.)</span>
                </li>
              </ol>
            </div>

            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <Key className="w-4 h-4 mr-2" />
                Step 2: Create App Password
              </h4>
              <ol className="text-sm text-blue-800 space-y-1 ml-6">
                <li className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                  <span>Go back to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 inline-flex items-center">
                    App Passwords <ExternalLink className="w-3 h-3 ml-1" />
                  </a></span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                  <span>Under "Select app", choose <strong>Mail</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                  <span>Under "Select device", choose <strong>Other (Custom name)</strong> and type "NodeMailerApp"</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</span>
                  <span>Click <strong>Generate</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">5</span>
                  <span>Copy the 16-character password and use it in the "App Password" field below</span>
                </li>
              </ol>
            </div>

            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <strong>Important:</strong> Use your regular Gmail email address and the 16-digit App Password (not your regular password) in the form below.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Gmail Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Gmail Configuration
            </CardTitle>
            <CardDescription>
              Your Gmail credentials for sending emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-2">
                Gmail Address
              </label>
              <Input
                type="email"
                id="from"
                value={config.from}
                onChange={(e) => handleInputChange('from', e.target.value)}
                placeholder="your.email@gmail.com"
                required
              />
            </div>

            {config.from && (
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={verifyGmailConnection}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Test Connection'}
                </Button>
                {verificationResult && (
                  <div className="flex items-center space-x-2">
                    {verificationResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm ${
                      verificationResult.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {verificationResult.message}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Email Templates
            </CardTitle>
            <CardDescription>
              Choose from pre-built templates or create your own
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {emailTemplates.map((template, index) => (
                <Card key={index} className="border-dashed hover:border-solid hover:border-blue-300 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => applyTemplate(template)}
                      >
                        Use Template
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {template.body.substring(0, 100)}...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Email Content */}
        <Card>
          <CardHeader>
            <CardTitle>Email Content</CardTitle>
            <CardDescription>
              Customize your subject line and message body
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject Line
              </label>
              <Input
                type="text"
                id="subject"
                value={config.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Application for [Position] - [Your Name]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Use placeholders like {'{position}'}, {'{company}'}, {'{your_name}'} for personalization
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                  Email Body
                </label>
                {config.body && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(config.body)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                )}
              </div>
              <Textarea
                id="body"
                value={config.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                placeholder="Compose your email message here..."
                rows={12}
                className="min-h-[300px]"
                required
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Use placeholders for personalization: {'{company}'}, {'{position}'}, {'{your_name}'}</span>
                <span>{config.body.length} characters</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isFormValid()}
            size="lg"
            className="min-w-[200px]"
          >
            Continue to Resume Upload
          </Button>
        </div>
      </form>
    </div>
  );
}