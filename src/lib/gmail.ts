import nodemailer from 'nodemailer';
import { EmailConfig, EmailData } from '@/types';

export class GmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Gmail connection error:', error);
      return false;
    }
  }

  async sendEmail(
    to: string,
    emailConfig: EmailConfig,
    resume?: Buffer,
    resumeFilename?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.GMAIL_USER,
        to: to,
        subject: emailConfig.subject,
        text: emailConfig.message,
        attachments: resume ? [{
          filename: resumeFilename || 'resume.txt',
          content: resume,
          contentType: 'text/plain'
        }] : undefined,
      };

      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async sendBulkEmails(
    recipients: EmailData[],
    emailColumn: string,
    emailConfig: EmailConfig,
    resume?: Buffer,
    resumeFilename?: string
  ): Promise<{
    sent: number;
    failed: number;
    errors: string[];
  }> {
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const recipient of recipients) {
      const email = recipient[emailColumn];
      const emailString = email ? String(email) : '';
      if (!emailString || !this.isValidEmail(emailString)) {
        failed++;
        errors.push(`Invalid email: ${emailString}`);
        continue;
      }

      const result = await this.sendEmail(emailString, emailConfig, resume, resumeFilename);
      
      if (result.success) {
        sent++;
      } else {
        failed++;
        errors.push(`Failed to send to ${emailString}: ${result.error}`);
      }

      // Add delay to avoid rate limiting
      await this.delay(1000);
    }

    return { sent, failed, errors };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}