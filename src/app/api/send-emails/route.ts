import { NextRequest, NextResponse } from 'next/server';
import { GmailService } from '@/lib/gmail';
import { ExcelSchema, EmailConfig, EmailResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Parse form data
    const excelDataString = formData.get('excelData') as string;
    const emailColumn = formData.get('emailColumn') as string;
    const emailConfigString = formData.get('emailConfig') as string;
    const resumeFile = formData.get('resume') as File;

    if (!excelDataString || !emailColumn || !emailConfigString || !resumeFile) {
      return NextResponse.json<EmailResponse>(
        { 
          success: false, 
          message: 'Missing required data', 
          sent: 0, 
          failed: 0,
          errors: ['Missing required form data']
        },
        { status: 400 }
      );
    }

    // Parse JSON data
    let excelData: ExcelSchema;
    let emailConfig: EmailConfig;

    try {
      excelData = JSON.parse(excelDataString);
      emailConfig = JSON.parse(emailConfigString);
    } catch (parseError) {
      return NextResponse.json<EmailResponse>(
        { 
          success: false, 
          message: 'Invalid JSON data', 
          sent: 0, 
          failed: 0,
          errors: ['Failed to parse form data']
        },
        { status: 400 }
      );
    }

    // Validate resume file
    if (!resumeFile.name.match(/\.txt$/)) {
      return NextResponse.json<EmailResponse>(
        { 
          success: false, 
          message: 'Invalid resume file type', 
          sent: 0, 
          failed: 0,
          errors: ['Resume must be a .txt file']
        },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json<EmailResponse>(
        { 
          success: false, 
          message: 'Gmail credentials not configured', 
          sent: 0, 
          failed: 0,
          errors: ['Gmail credentials missing in environment variables']
        },
        { status: 500 }
      );
    }

    // Convert resume file to buffer
    const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());

    // Initialize Gmail service
    const gmailService = new GmailService();

    // Verify connection first
    const isConnected = await gmailService.verifyConnection();
    if (!isConnected) {
      return NextResponse.json<EmailResponse>(
        { 
          success: false, 
          message: 'Failed to connect to Gmail', 
          sent: 0, 
          failed: 0,
          errors: ['Gmail authentication failed']
        },
        { status: 401 }
      );
    }

    // Filter valid email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validRecipients = excelData.data.filter(row => {
      const email = row[emailColumn];
      return email && emailRegex.test(email.toString());
    });

    if (validRecipients.length === 0) {
      return NextResponse.json<EmailResponse>(
        { 
          success: false, 
          message: 'No valid email addresses found', 
          sent: 0, 
          failed: 0,
          errors: ['No valid email addresses in the selected column']
        },
        { status: 400 }
      );
    }

    // Send bulk emails
    const results = await gmailService.sendBulkEmails(
      validRecipients,
      emailColumn,
      emailConfig,
      resumeBuffer,
      resumeFile.name
    );

    const success = results.sent > 0;
    const successRate = Math.round((results.sent / (results.sent + results.failed)) * 100);

    return NextResponse.json<EmailResponse>({
      success,
      message: success 
        ? `Successfully sent ${results.sent} emails (${successRate}% success rate)`
        : `Failed to send emails. ${results.failed} failures.`,
      sent: results.sent,
      failed: results.failed,
      errors: results.errors
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    return NextResponse.json<EmailResponse>(
      { 
        success: false, 
        message: 'Email sending failed', 
        sent: 0, 
        failed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      },
      { status: 500 }
    );
  }
}