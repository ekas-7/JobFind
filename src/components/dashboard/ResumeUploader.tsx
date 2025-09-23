'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  FileText, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Sparkles
} from 'lucide-react';

interface ResumeUploaderProps {
  onSuccess: (file: File) => void;
  onBack: () => void;
}

export default function ResumeUploader({ onSuccess, onBack }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [customResume, setCustomResume] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [resumeMethod, setResumeMethod] = useState<'upload' | 'generate'>('upload');

  const handleFileChange = useCallback(async (selectedFile: File) => {
    if (!selectedFile.name.match(/\.(txt|pdf)$/)) {
      setError('Please select a .txt or .pdf file for your resume');
      return;
    }

    if (selectedFile.size > 3 * 1024 * 1024) { // 3MB limit
      setError('Resume file must be smaller than 3MB');
      return;
    }

    setError('');
    setFile(selectedFile);

    // Read file content for preview
    try {
      if (selectedFile.name.endsWith('.pdf')) {
        // For PDF files, we just show a placeholder
        setPreviewContent('[PDF Document] Preview not available for PDF files');
      } else {
        const text = await selectedFile.text();
        setPreviewContent(text.substring(0, 500)); // First 500 characters
      }
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

  const createCustomResume = () => {
    if (!customResume.trim()) return;

    const blob = new Blob([customResume], { type: 'text/plain' });
    const customFile = new File([blob], 'custom_resume.txt', { type: 'text/plain' });
    setFile(customFile);
    setPreviewContent(customResume.substring(0, 500));
    setError('');
  };

  const handleContinue = () => {
    if (file) {
      onSuccess(file);
    }
  };

  const sampleResume = `John Doe
Software Developer & Full Stack Engineer
📧 john.doe@email.com | 📱 (555) 123-4567 | 🌐 linkedin.com/in/johndoe
🏠 San Francisco, CA | 💻 github.com/johndoe

═══════════════════════════════════════
PROFESSIONAL SUMMARY
═══════════════════════════════════════
Innovative Software Developer with 5+ years of experience building scalable web applications and leading cross-functional teams. Proven track record of delivering high-quality solutions that improve user experience and drive business growth. Passionate about emerging technologies and best practices in software development.

═══════════════════════════════════════
CORE COMPETENCIES
═══════════════════════════════════════
• Languages: JavaScript, TypeScript, Python, Java, Go
• Frontend: React, Next.js, Vue.js, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express, Django, Flask, FastAPI
• Databases: PostgreSQL, MongoDB, Redis, MySQL
• Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Terraform
• Tools: Git, Jest, Webpack, Vite, Figma

═══════════════════════════════════════
PROFESSIONAL EXPERIENCE
═══════════════════════════════════════

Senior Software Developer | TechCorp Inc. | 2021 - Present
• Led development of customer-facing web platform serving 100,000+ users
• Architected and implemented microservices reducing system latency by 40%
• Mentored 3 junior developers and established code review best practices
• Collaborated with product team to define technical requirements and roadmap

Software Developer | StartupXYZ | 2019 - 2021
• Built responsive web applications using React and Node.js
• Developed RESTful APIs handling 1M+ requests per day
• Implemented automated testing reducing bug reports by 60%
• Contributed to technical architecture decisions and documentation

Junior Developer | WebSolutions Ltd. | 2018 - 2019
• Maintained and enhanced existing web applications
• Participated in agile development process and daily standups
• Gained expertise in modern web technologies and frameworks

═══════════════════════════════════════
KEY PROJECTS
═══════════════════════════════════════

🚀 E-Commerce Platform Redesign
Built modern, responsive platform using Next.js and PostgreSQL
Result: 35% increase in conversion rate, 50% faster load times

📱 Mobile-First Task Management App
Developed progressive web app with offline capabilities
Result: 10,000+ active users, 4.8/5 app store rating

☁️ Cloud Infrastructure Migration
Led migration from monolithic to microservices architecture
Result: 99.9% uptime, 60% reduction in hosting costs

═══════════════════════════════════════
EDUCATION & CERTIFICATIONS
═══════════════════════════════════════

Bachelor of Science in Computer Science
University of Technology | 2018
Relevant Coursework: Data Structures, Algorithms, Database Design

AWS Certified Solutions Architect (2022)
Google Cloud Professional Developer (2021)

═══════════════════════════════════════
ACHIEVEMENTS & INTERESTS
═══════════════════════════════════════

🏆 Tech Innovation Award - Best Web Application (2022)
🎯 Hackathon Winner - AI/ML Category (2021)
📝 Technical blog with 5,000+ monthly readers
🌱 Open source contributor with 500+ GitHub stars

Interests: Machine Learning, Blockchain, Sustainable Tech, Rock Climbing

═══════════════════════════════════════

Thank you for considering my application. I'm excited about the opportunity to contribute to your team and would welcome the chance to discuss how my experience aligns with your needs.

Looking forward to hearing from you!

Best regards,
John Doe`;

  const loadSampleResume = () => {
    setCustomResume(sampleResume);
    setResumeMethod('generate');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Resume</h2>
          <p className="text-gray-600">
            Add your resume as a .txt or .pdf file, or create one using our template.
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Method Selection */}
      <div className="flex space-x-4">
        <Button
          variant={resumeMethod === 'upload' ? 'default' : 'outline'}
          onClick={() => setResumeMethod('upload')}
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
        <Button
          variant={resumeMethod === 'generate' ? 'default' : 'outline'}
          onClick={() => setResumeMethod('generate')}
          className="flex-1"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Create Resume
        </Button>
      </div>

      {/* File Upload Method */}
      {resumeMethod === 'upload' && (
        <Card
          className={`border-dashed border-2 transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              
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
                        accept=".txt,.pdf"
                        onChange={handleFileInputChange}
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      .txt or .pdf files up to 3MB
                    </p>
                  </div>
                  <Button variant="outline" onClick={loadSampleResume}>
                    <Eye className="w-4 h-4 mr-2" />
                    Use Sample Template
                  </Button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {(file.size / 1024).toFixed(1)} KB
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setPreviewContent('');
                      setError('');
                    }}
                  >
                    Remove file
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Resume Method */}
      {resumeMethod === 'generate' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Create Your Resume
            </CardTitle>
            <CardDescription>
              Use our template or write your own professional resume
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <label htmlFor="custom-resume" className="block text-sm font-medium text-gray-700">
                Resume Content
              </label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={loadSampleResume}>
                  <Download className="w-4 h-4 mr-2" />
                  Load Template
                </Button>
                {customResume && (
                  <Button variant="outline" size="sm" onClick={createCustomResume}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Use This Resume
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              id="custom-resume"
              value={customResume}
              onChange={(e) => setCustomResume(e.target.value)}
              placeholder="Paste your resume content here or click 'Load Template' to start with our sample..."
              rows={15}
              className="min-h-[400px] font-mono text-sm"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Plain text format recommended for best email compatibility</span>
              <span>{customResume.length} characters</span>
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

      {/* File Preview */}
      {previewContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Resume Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border max-h-60 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {previewContent}
                {previewContent.length >= 500 && (
                  <span className="text-gray-500 italic">
                    \n\n... (showing first 500 characters)
                  </span>
                )}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Best Practices */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-900">💡 Resume Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>Use plain text format for maximum email compatibility</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>Include contact information at the top</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>Keep it concise and relevant to target positions</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>Use clear section headers and bullet points</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>Quantify achievements with specific numbers</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!file}
          size="lg"
          className="min-w-[200px]"
        >
          Continue to Email Campaign
          <FileText className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}