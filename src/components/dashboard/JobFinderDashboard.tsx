'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExcelSchema, EmailConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModeToggle } from '@/components/mode-toggle';
import { 
  Mail, 
  ArrowLeft, 
  Upload, 
  Settings, 
  FileText, 
  Send,
  Home,
  BarChart3
} from 'lucide-react';

import ExcelUploader from './ExcelUploader';
import EmailConfigForm from './EmailConfigForm';
import ResumeUploader from './ResumeUploader';
import EmailSender from './EmailSender';

export default function JobFinderDashboard() {
  const [excelData, setExcelData] = useState<ExcelSchema | null>(null);
  const [selectedEmailColumn, setSelectedEmailColumn] = useState<string>('');
  const [selectedCompanyColumn, setSelectedCompanyColumn] = useState<string>("none");
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    email: '',
    password: '',
    subject: '',
    message: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const resetToStep = (step: number) => {
    setCurrentStep(step);
    if (step <= 1) {
      setExcelData(null);
      setSelectedEmailColumn('');
      setSelectedCompanyColumn('none');
    }
    if (step <= 2) {
      setEmailConfig({ email: '', password: '', subject: '', message: '' });
    }
    if (step <= 3) {
      setResumeFile(null);
    }
  };

  const steps = [
    { id: 1, name: 'Upload Data', icon: Upload, desc: 'Excel & URLs' },
    { id: 2, name: 'Email Setup', icon: Settings, desc: 'Configuration' },
    { id: 3, name: 'Resume', icon: FileText, desc: 'Attachment' },
    { id: 4, name: 'Send Campaign', icon: Send, desc: 'Launch' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">JobFind Pro</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email Campaign Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ModeToggle />
              <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Campaign Progress</CardTitle>
            <CardDescription>Complete each step to launch your job application campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Progress value={(currentStep - 1) * 33.33} className="h-2" />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Step {currentStep} of 4</span>
                <span>{Math.round((currentStep - 1) * 33.33)}% Complete</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => resetToStep(step.id)}
                  disabled={currentStep < step.id}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    currentStep >= step.id
                      ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                      : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  } ${currentStep === step.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="font-medium text-gray-900 text-sm">{step.name}</div>
                  <div className="text-xs text-gray-500">{step.desc}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Primary Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {currentStep === 1 && (
                  <ExcelUploader
                    onSuccess={(data: ExcelSchema, emailColumn: string, companyColumn?: string) => {
                      setExcelData(data);
                      setSelectedEmailColumn(emailColumn);
                      setSelectedCompanyColumn(companyColumn || '');
                      setCurrentStep(2);
                    }}
                  />
                )}

                {currentStep === 2 && excelData && (
                  <EmailConfigForm
                    onSubmit={(config: EmailConfig) => {
                      setEmailConfig(config);
                      setCurrentStep(3);
                    }}
                    onBack={() => resetToStep(1)}
                  />
                )}

                {currentStep === 3 && (
                  <ResumeUploader
                    onSuccess={(file: File) => {
                      setResumeFile(file);
                      setCurrentStep(4);
                    }}
                    onBack={() => resetToStep(2)}
                  />
                )}

                {currentStep === 4 && excelData && resumeFile && (
                  <EmailSender
                    excelData={excelData.data}
                    selectedEmailColumn={selectedEmailColumn}
                    selectedCompanyColumn={selectedCompanyColumn}
                    emailConfig={emailConfig}
                    resumeFile={resumeFile}
                    onBack={() => resetToStep(3)}
                    onReset={() => resetToStep(1)}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Campaign Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Campaign Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Contacts</span>
                  <Badge variant="outline">{excelData?.data.length || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Company Personalization</span>
                  {selectedCompanyColumn !== "none" ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="outline">Disabled</Badge>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valid Emails</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {excelData?.data.filter(row => {
                      const email = row[selectedEmailColumn];
                      return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toString());
                    }).length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email Column</span>
                  <Badge variant="secondary">{selectedEmailColumn || 'None'}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Resume</span>
                  <Badge variant={resumeFile ? "default" : "outline"}>
                    {resumeFile ? 'Attached' : 'Not set'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">💡 Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use professional email templates for better response rates</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Include company-specific details in your subject line</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Keep your resume file under 1MB for better deliverability</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Test with a small batch before sending to all contacts</p>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}