'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  FileText,
  AlertTriangle,
  TrendingUp,
  Download,
  RefreshCw,
  Zap
} from 'lucide-react';

import { EmailData } from '@/types';

interface EmailSenderProps {
  excelData: EmailData[];
  selectedEmailColumn: string;
  emailConfig: {
    email: string;
    password: string;
    subject: string;
    message: string;
  };
  resumeFile: File;
  onBack: () => void;
  onReset: () => void;
}

interface EmailResult {
  email: string;
  status: 'pending' | 'sent' | 'failed';
  error?: string;
  timestamp?: string;
}

export default function EmailSender({
  excelData,
  selectedEmailColumn,
  emailConfig,
  resumeFile,
  onBack,
  onReset
}: EmailSenderProps) {
  const [sending, setSending] = useState(false);
  const [emailResults, setEmailResults] = useState<EmailResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [stats, setStats] = useState({
    sent: 0,
    failed: 0,
    total: 0
  });
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<string>('');

  const validEmails = excelData.filter(row => {
    const email = row[selectedEmailColumn];
    return email && typeof email === 'string' && email.includes('@') && email.includes('.');
  });

  const startSending = async () => {
    setSending(true);
    setStartTime(new Date());
    const total = validEmails.length;
    setStats({ sent: 0, failed: 0, total });
    
    const results: EmailResult[] = validEmails.map(row => ({
      email: String(row[selectedEmailColumn]),
      status: 'pending' as const
    }));
    
    setEmailResults(results);

    for (let i = 0; i < validEmails.length; i++) {
      const row = validEmails[i];
      const email = String(row[selectedEmailColumn]);
      setCurrentEmailIndex(i);
      
      // Update progress
      const progressValue = ((i + 1) / total) * 100;
      setProgress(progressValue);
      
      // Calculate estimated time remaining
      if (startTime && i > 0) {
        const elapsed = Date.now() - startTime.getTime();
        const avgTimePerEmail = elapsed / (i + 1);
        const remaining = (total - i - 1) * avgTimePerEmail;
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setEstimatedTimeRemaining(`${minutes}m ${seconds}s`);
      }

      try {
        // Create FormData for the API call
        const formData = new FormData();
        
        // Format data for current email according to ExcelSchema
        const currentRow = validEmails[i];
        const excelData = {
          headers: Object.keys(currentRow),
          data: [currentRow]
        };
        
        // Prepare email config
        const emailConfigData = {
          email: emailConfig.email,
          password: emailConfig.password,
          subject: emailConfig.subject,
          message: emailConfig.message
        };
        
        formData.append('excelData', JSON.stringify(excelData));
        formData.append('emailColumn', selectedEmailColumn);
        formData.append('emailConfig', JSON.stringify(emailConfigData));
        formData.append('resume', resumeFile);

        const response = await fetch('/api/send-emails', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // Success
          results[i] = {
            ...results[i],
            status: 'sent',
            timestamp: new Date().toISOString()
          };
          setStats(prev => ({ ...prev, sent: prev.sent + 1 }));
        } else {
          const errorData = await response.json().catch(() => ({}));
          results[i] = {
            ...results[i],
            status: 'failed',
            error: errorData.error || 'Unknown error occurred',
            timestamp: new Date().toISOString()
          };
          setStats(prev => ({ ...prev, failed: prev.failed + 1 }));
        }
      } catch (error) {
        results[i] = {
          ...results[i],
          status: 'failed',
          error: error instanceof Error ? error.message : 'Network error',
          timestamp: new Date().toISOString()
        };
        setStats(prev => ({ ...prev, failed: prev.failed + 1 }));
      }

      setEmailResults([...results]);
      
      // Add a small delay between emails to avoid overwhelming the server
      if (i < validEmails.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setSending(false);
    setEstimatedTimeRemaining('');
  };

  const downloadResults = () => {
    const csvContent = [
      ['Email', 'Status', 'Error', 'Timestamp'],
      ...emailResults.map(result => [
        result.email,
        result.status,
        result.error || '',
        result.timestamp || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email_campaign_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSuccessRate = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.sent / stats.total) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const isComplete = !sending && emailResults.length > 0 && emailResults.every(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Email Campaign</h2>
          <p className="text-gray-600">
            Ready to send {validEmails.length} personalized emails with your resume.
          </p>
        </div>
        <Button variant="outline" onClick={onBack} disabled={sending}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Campaign Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Mail className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{validEmails.length}</p>
                <p className="text-sm text-gray-600">Total Recipients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.sent}</p>
                <p className="text-sm text-gray-600">Sent Successfully</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{getSuccessRate()}%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      {(sending || emailResults.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {sending ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Zap className="w-5 h-5 mr-2" />
              )}
              Campaign Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
            
            {sending && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Currently sending to: {validEmails[currentEmailIndex]?.[selectedEmailColumn]}</span>
                {estimatedTimeRemaining && <span>ETA: {estimatedTimeRemaining}</span>}
              </div>
            )}
            
            {isComplete && (
              <div className="flex items-center justify-center space-x-2 text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" />
                <span>Campaign completed successfully!</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Email Configuration Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">From</p>
                <p className="text-sm text-gray-900">{emailConfig.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Subject</p>
                <p className="text-sm text-gray-900">{emailConfig.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Resume File</p>
                <p className="text-sm text-gray-900">{resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Message Preview</p>
              <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded border max-h-32 overflow-y-auto">
                {emailConfig.message.substring(0, 200)}
                {emailConfig.message.length > 200 && '...'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      {emailResults.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Campaign Results</CardTitle>
            <Button variant="outline" size="sm" onClick={downloadResults}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {emailResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <span className="font-medium text-gray-900">{result.email}</span>
                      {result.status === 'sent' && result.timestamp && (
                        <Badge variant="outline" className="text-xs">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={result.status === 'sent' ? 'default' : result.status === 'failed' ? 'destructive' : 'secondary'}
                        className="capitalize"
                      >
                        {result.status}
                      </Badge>
                      {result.error && (
                        <div className="group relative">
                          <AlertTriangle className="w-4 h-4 text-red-500 cursor-help" />
                          <div className="absolute bottom-full mb-2 right-0 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            {result.error}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {!sending && emailResults.length === 0 && (
          <Button onClick={startSending} size="lg" className="flex-1">
            <Send className="w-5 h-5 mr-2" />
            Start Email Campaign
          </Button>
        )}
        
        {isComplete && (
          <Button onClick={onReset} variant="outline" size="lg" className="flex-1">
            <RefreshCw className="w-5 h-5 mr-2" />
            Start New Campaign
          </Button>
        )}
      </div>

      {/* Tips */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-amber-900 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-amber-800 space-y-2">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>Gmail may have daily sending limits (usually 500-2000 emails per day)</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>Monitor your email reputation to avoid being marked as spam</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>Personalize your messages for better response rates</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>Follow up appropriately - usually wait 1-2 weeks between emails</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}