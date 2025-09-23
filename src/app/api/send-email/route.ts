import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get form data
    const to = formData.get('to') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const senderEmail = formData.get('senderEmail') as string;
    const senderPassword = formData.get('senderPassword') as string;
    const resumeFile = formData.get('resume') as File;

    // Validate required fields
    if (!to || !subject || !message || !resumeFile) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields',
          error: 'Please provide all required fields: to, subject, message, resume'
        },
        { status: 400 }
      );
    }

    // Validate resume file type
    if (!resumeFile.name.match(/\.(txt|pdf)$/)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid resume file type',
          error: 'Resume must be a .txt or .pdf file'
        },
        { status: 400 }
      );
    }

    // Get credentials (from form data or environment variables)
    const user = senderEmail || process.env.GMAIL_USER;
    const pass = senderPassword || process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing email credentials',
          error: 'Email credentials are required'
        },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    // Convert resume file to buffer
    const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());
    const contentType = resumeFile.name.toLowerCase().endsWith('.pdf') 
      ? 'application/pdf' 
      : 'text/plain';

    // Send email
    try {
      await transporter.sendMail({
        from: user,
        to: to,
        subject: subject,
        text: message,
        attachments: [{
          filename: resumeFile.name,
          content: resumeBuffer,
          contentType: contentType
        }]
      });

      return NextResponse.json({
        success: true,
        message: `Email sent successfully to ${to}`
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send email',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}