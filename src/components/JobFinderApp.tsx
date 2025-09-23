'use client';

import { useState } from 'react';
import { ExcelSchema, EmailConfig } from '@/types';
import ExcelUploader from './ExcelUploader';
import EmailConfigForm from './EmailConfigForm';
import ResumeUploader from './ResumeUploader';
import EmailSender from './EmailSender';

export default function JobFinderApp() {
  const [excelData, setExcelData] = useState<ExcelSchema | null>(null);
  const [selectedEmailColumn, setSelectedEmailColumn] = useState<string>('');
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
    }
    if (step <= 2) {
      setEmailConfig({ email: '', password: '', subject: '', message: '' });
    }
    if (step <= 3) {
      setResumeFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            JobFind Pro
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your dream job through cold mailing. Upload your Excel list, configure your email, attach your resume, and let us handle the rest.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center space-x-4">
              {[
                { id: 1, name: 'Upload Excel', desc: 'Upload contact list' },
                { id: 2, name: 'Email Config', desc: 'Setup email details' },
                { id: 3, name: 'Resume', desc: 'Upload resume file' },
                { id: 4, name: 'Send Emails', desc: 'Send bulk emails' }
              ].map((step, stepIdx) => (
                <li key={step.id} className="flex items-center">
                  <button
                    onClick={() => resetToStep(step.id)}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                      currentStep >= step.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-white text-gray-400'
                    } ${currentStep > step.id ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                    disabled={currentStep < step.id}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-500'
                    }`}>
                      {step.id}
                    </div>
                    <div className="text-xs font-medium mt-1">{step.name}</div>
                    <div className="text-xs text-gray-500">{step.desc}</div>
                  </button>
                  {stepIdx < 3 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {currentStep === 1 && (
            <ExcelUploader
              onSuccess={(data, emailColumn) => {
                setExcelData(data);
                setSelectedEmailColumn(emailColumn);
                setCurrentStep(2);
              }}
            />
          )}

          {currentStep === 2 && excelData && (
            <EmailConfigForm
              onSubmit={(config) => {
                setEmailConfig(config);
                setCurrentStep(3);
              }}
              onBack={() => resetToStep(1)}
            />
          )}

          {currentStep === 3 && (
            <ResumeUploader
              onSuccess={(file) => {
                setResumeFile(file);
                setCurrentStep(4);
              }}
              onBack={() => resetToStep(2)}
            />
          )}

          {currentStep === 4 && excelData && resumeFile && (
            <EmailSender
              excelData={excelData}
              emailColumn={selectedEmailColumn}
              emailConfig={emailConfig}
              resumeFile={resumeFile}
              onBack={() => resetToStep(3)}
              onComplete={() => {
                // Reset everything for a new session
                resetToStep(1);
              }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Made with ❤️ for job seekers. Good luck with your applications!</p>
        </div>
      </div>
    </div>
  );
}