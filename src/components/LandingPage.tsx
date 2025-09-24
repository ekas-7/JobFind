import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/mode-toggle';
import { 
  Mail, 
  Upload, 
  Target, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Github, 
  Twitter,
  Globe,
  FileSpreadsheet,
  FileText,
  Send,
  BarChart3,
  Shield,
  Clock
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                JobFind Pro
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
                Pricing
              </Link>
              <Link href="#docs" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
                Docs
              </Link>
              <ModeToggle />
              <Link href="/dashboard">
                <Button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6 px-3 py-1 border-gray-300 dark:border-gray-700">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered Job Applications
            </Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                Find Your Dream Job
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Through Cold Email
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Upload your contact list, customize your message, attach your resume, and let our platform handle the rest. 
              Send personalized job applications at scale with intelligent automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard">
                <Button size="lg" className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 text-lg">
                  Start Applying Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="https://github.com/ekas-7/JobFind" target="_blank" rel="noopener noreferrer" aria-label="View JobFind Pro on GitHub">
                <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-gray-300 dark:border-gray-700">
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </Button>
              </a>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">10k+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Emails Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600">Delivery Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4">
              <Zap className="w-3 h-3 mr-1" />
              Watch How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              See JobFind Pro in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Learn how to set up and send your first job application campaign in just 3 minutes.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-2xl">
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/b_zTWBS59EE" 
                title="JobFind Pro Demo"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2">3-Minute Setup</Badge>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2">100+ Applications/Day</Badge>
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2">Step-by-Step Tutorial</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Target className="w-3 h-3 mr-1" />
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to land your dream job
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed to help you create and send professional job applications at scale.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Excel Integration</CardTitle>
                <CardDescription>
                  Upload your contact lists and let our system automatically detect email columns and validate addresses.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Gmail Integration</CardTitle>
                <CardDescription>
                  Secure Gmail SMTP integration with App Password authentication and rate limiting for reliable delivery.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Resume Attachment</CardTitle>
                <CardDescription>
                  Automatically attach your resume to every email with support for multiple formats and templates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Send className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Bulk Email Sending</CardTitle>
                <CardDescription>
                  Send personalized emails to hundreds of recipients with intelligent rate limiting and error handling.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Analytics & Tracking</CardTitle>
                <CardDescription>
                  Real-time progress tracking with detailed success/failure statistics and comprehensive error reporting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>URL Parsing</CardTitle>
                <CardDescription>
                  Intelligent link parsing to extract company information from job postings and career pages.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Clock className="w-3 h-3 mr-1" />
              How it works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get started in 4 simple steps
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                title: 'Upload Contacts',
                description: 'Import your Excel file with company contacts and job opportunities.',
                icon: Upload,
                color: 'blue'
              },
              {
                step: '02',
                title: 'Customize Email',
                description: 'Write your personalized message with our built-in templates.',
                icon: Mail,
                color: 'green'
              },
              {
                step: '03',
                title: 'Attach Resume',
                description: 'Upload your resume and cover letter in multiple formats.',
                icon: FileText,
                color: 'purple'
              },
              {
                step: '04',
                title: 'Send & Track',
                description: 'Launch your campaign and monitor progress in real-time.',
                icon: Send,
                color: 'orange'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 bg-${item.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <item.icon className={`w-8 h-8 text-${item.color}-600`} />
                </div>
                <div className="text-sm font-mono text-gray-500 mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to accelerate your job search?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully landed their dream jobs using our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg">
                Start Your Campaign
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">JobFind Pro</span>
              </div>
              <p className="text-gray-600">
                The modern way to find jobs through intelligent cold email campaigns.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="#features" className="hover:text-gray-900">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link></li>
                <li><Link href="#docs" className="hover:text-gray-900">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">Help Center</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Contact</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Connect</h3>
              <div className="flex space-x-4">
                <a href="https://x.com/ekas-7" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Button variant="outline" size="sm">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </a>
                <a href="https://github.com/ekas-7/JobFind" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Button variant="outline" size="sm">
                    <Github className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 JobFind Pro. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-600 mt-4 sm:mt-0">
              <Link href="#" className="hover:text-gray-900">Privacy</Link>
              <Link href="#" className="hover:text-gray-900">Terms</Link>
              <Link href="#" className="hover:text-gray-900">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}