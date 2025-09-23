'use client';

import { useState, useCallback } from 'react';

interface ResumeUploaderProps {
  onSuccess: (file: File) => void;
  onBack: () => void;
}

export default function ResumeUploader({ onSuccess, onBack }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = useCallback(async (selectedFile: File) => {
    if (!selectedFile.name.match(/\.txt$/)) {
      setError('Please select a .txt file for your resume');
      return;
    }

    if (selectedFile.size > 1024 * 1024) { // 1MB limit
      setError('Resume file must be smaller than 1MB');
      return;
    }

    setError('');
    setFile(selectedFile);

    // Read file content for preview
    try {
      const text = await selectedFile.text();
      setPreviewContent(text.substring(0, 500)); // First 500 characters
    } catch {
      setError('Failed to read file content');
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
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
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleContinue = () => {
    if (file) {
      onSuccess(file);
    }
  };

  const createSampleResume = () => {
    const sampleText = `John Doe
Software Developer
Email: john.doe@email.com
Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software developer with 5+ years of experience in full-stack development. Proficient in JavaScript, React, Node.js, and Python. Passionate about creating efficient, scalable solutions and collaborating with cross-functional teams.

TECHNICAL SKILLS
• Languages: JavaScript, Python, TypeScript, Java
• Frontend: React, Next.js, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express, Django, Flask
• Databases: PostgreSQL, MongoDB, Redis
• Tools: Git, Docker, AWS, Jenkins

WORK EXPERIENCE

Senior Software Developer | Tech Company Inc. | 2021 - Present
• Developed and maintained web applications serving 100,000+ users
• Led a team of 3 junior developers and mentored new hires
• Improved application performance by 40% through code optimization
• Collaborated with product managers and designers on feature planning

Software Developer | StartupXYZ | 2019 - 2021
• Built responsive web applications using React and Node.js
• Implemented RESTful APIs and integrated third-party services
• Participated in agile development processes and code reviews
• Contributed to architecture decisions and technical documentation

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2018

PROJECTS
• E-commerce Platform: Built a full-stack e-commerce solution using React and Node.js
• Task Management App: Created a collaborative task management tool with real-time updates
• API Gateway: Developed a microservices API gateway using Python and Docker

Let me know if you'd like to discuss how I can contribute to your team!`;

    const blob = new Blob([sampleText], { type: 'text/plain' });
    const sampleFile = new File([blob], 'sample_resume.txt', { type: 'text/plain' });
    handleFileChange(sampleFile);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Step 3: Upload Your Resume
        </h2>
        <p className="text-gray-600 mb-4">
          Upload your resume as a .txt file. This will be attached to all your emails. Plain text format ensures maximum compatibility across all email clients.
        </p>
      </div>

      {/* Sample Resume Option */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              Don&apos;t have a resume ready?
            </h3>
            <p className="mt-1 text-sm text-yellow-700">
              Use our sample resume template to get started quickly.
            </p>
            <button
              type="button"
              onClick={createSampleResume}
              className="mt-2 text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
            >
              Use Sample Resume
            </button>
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M24 8v24m0-24l-8 8m8-8l8 8M8 40h32"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          {!file ? (
            <>
              <div>
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-gray-900">
                    Click to upload or drag and drop
                  </span>
                  <input
                    id="resume-upload"
                    name="resume-upload"
                    type="file"
                    className="sr-only"
                    accept=".txt"
                    onChange={handleFileInputChange}
                  />
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Only .txt files up to 1MB
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="text-lg font-medium text-green-600">
                ✓ {file.name}
              </div>
              <div className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreviewContent('');
                  setError('');
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove file
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      {/* File Preview */}
      {previewContent && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Resume Preview:</h3>
          <div className="text-sm text-gray-700 whitespace-pre-line font-mono bg-white p-3 rounded border max-h-40 overflow-y-auto">
            {previewContent}
            {previewContent.length >= 500 && (
              <div className="text-gray-500 italic mt-2">
                ... (showing first 500 characters)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Resume Tips:</h3>
        <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>Use plain text format for maximum compatibility</li>
          <li>Include your contact information at the top</li>
          <li>Keep it concise and relevant to the positions you&apos;re applying for</li>
          <li>Use clear section headers like EXPERIENCE, EDUCATION, SKILLS</li>
          <li>Avoid special characters that might not display correctly</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Back to Email Config
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!file}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Send Emails
        </button>
      </div>
    </div>
  );
}