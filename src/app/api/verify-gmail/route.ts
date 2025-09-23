import { NextRequest, NextResponse } from 'next/server';
import { GmailService } from '@/lib/gmail';

export async function POST(request: NextRequest) {
  try {
    const { from } = await request.json();

    if (!from) {
      return NextResponse.json(
        { success: false, message: 'Email address is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(from)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if it's a Gmail address
    if (!from.toLowerCase().includes('gmail.com')) {
      return NextResponse.json(
        { success: false, message: 'Only Gmail addresses are supported' },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Gmail credentials not configured. Please check your environment variables.' 
        },
        { status: 500 }
      );
    }

    // Test Gmail connection
    const gmailService = new GmailService();
    const isConnected = await gmailService.verifyConnection();

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Gmail connection verified successfully!'
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to connect to Gmail. Please check your App Password and ensure 2FA is enabled.' 
        },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Gmail verification error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Gmail verification failed. Please check your credentials.' 
      },
      { status: 500 }
    );
  }
}