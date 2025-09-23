import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // If no password provided, use the environment variables
    // This is useful for just validating that the app can connect to Gmail
    const user = email || process.env.GMAIL_USER;
    const pass = password || process.env.GMAIL_APP_PASSWORD;

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    try {
      // Verify the connection
      await transporter.verify();
      return NextResponse.json({ 
        success: true, 
        message: 'Gmail connection verified successfully' 
      });
    } catch (error) {
      console.error('Gmail verification error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to verify Gmail connection',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Gmail verification endpoint error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error while verifying Gmail connection',
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}