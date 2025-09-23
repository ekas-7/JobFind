# JobFind Pro - Cold Email Job Application System

A Next.js application that helps job seekers send personalized cold emails with resume attachments to potential employers using Excel contact lists.

## Features

- 📊 **Excel Upload & Schema Detection**: Upload Excel files and automatically detect email columns
- 📧 **Gmail Integration**: Send emails through Gmail SMTP with App Password authentication
- 📄 **Resume Attachment**: Attach .txt resume files to all outgoing emails
- 📈 **Bulk Email Sending**: Send to multiple recipients with rate limiting
- 🔍 **Email Validation**: Validate email addresses before sending
- 📊 **Progress Tracking**: Real-time progress tracking for bulk email campaigns
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Email**: Nodemailer with Gmail SMTP
- **File Processing**: XLSX for Excel files
- **File Upload**: Formidable for handling multipart forms

## Prerequisites

Before setting up the application, ensure you have:

1. **Node.js** (v18 or higher)
2. **Gmail Account** with 2-Factor Authentication enabled
3. **Gmail App Password** (see setup instructions below)

## Gmail Setup

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Navigate to Security → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-digit password (e.g., `abcd efgh ijkl mnop`)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd jobfind
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env.local
   ```

4. **Edit `.env.local`** with your Gmail credentials:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=abcd-efgh-ijkl-mnop
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Usage

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser** to [http://localhost:3000](http://localhost:3000)

3. **Follow the 4-step process**:
   - **Step 1**: Upload Excel file with contact information
   - **Step 2**: Configure email settings (subject, body, templates)
   - **Step 3**: Upload resume file (.txt format)
   - **Step 4**: Review and send bulk emails

## File Formats

### Excel Files (.xlsx, .xls)
- Must contain at least one column with email addresses
- Supported formats: .xlsx, .xls
- Maximum file size: 10MB
- Example columns: `email`, `name`, `company`, `position`

### Resume Files (.txt)
- Plain text format for maximum email compatibility
- Maximum file size: 1MB
- Include: contact info, experience, skills, education

## Features in Detail

### Excel Schema Detection
- Automatically detects potential email columns
- Suggests columns with keywords like "email", "mail", "contact"
- Validates email format before sending
- Shows sample data preview

### Email Templates
- Pre-built templates for job applications and networking
- Customizable subject lines and body text
- Support for placeholders like [Your Name], [Position]
- Email preview before sending

### Gmail Integration
- Secure authentication using App Passwords
- Connection verification before sending
- Rate limiting (1 second delay between emails)
- Detailed error reporting

### Bulk Email Management
- Progress tracking with real-time updates
- Success/failure statistics
- Error logging for failed emails
- Ability to retry failed sends

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── upload-excel/     # Excel file processing
│   │   ├── verify-gmail/     # Gmail connection testing
│   │   └── send-emails/      # Bulk email sending
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── JobFinderApp.tsx      # Main application component
│   ├── ExcelUploader.tsx     # Excel file upload & processing
│   ├── EmailConfigForm.tsx   # Email configuration form
│   ├── ResumeUploader.tsx    # Resume file upload
│   └── EmailSender.tsx       # Email sending interface
├── lib/
│   ├── gmail.ts              # Gmail service class
│   └── excel.ts              # Excel processing utilities
└── types/
    └── index.ts              # TypeScript type definitions
```

## API Endpoints

- `POST /api/upload-excel` - Process Excel files and extract schema
- `POST /api/verify-gmail` - Test Gmail connection and credentials
- `POST /api/send-emails` - Send bulk emails with attachments

## Development

To contribute or modify the application:

1. **Install dependencies**: `npm install`
2. **Run development server**: `npm run dev`
3. **Build for production**: `npm run build`
4. **Start production server**: `npm start`

## Security Considerations

- Gmail App Passwords are stored as environment variables
- No email credentials are stored in the frontend
- File uploads are validated for type and size
- Rate limiting prevents Gmail API abuse
- Input validation on all user-provided data

## Troubleshooting

### Gmail Authentication Errors
- Ensure 2-Factor Authentication is enabled
- Verify the App Password is correct (16 digits)
- Check that the Gmail address matches the one used for App Password

### File Upload Issues
- Check file format (.xlsx/.xls for Excel, .txt for resume)
- Verify file size limits (10MB for Excel, 1MB for resume)
- Ensure Excel file contains valid data

### Email Sending Problems
- Verify email addresses are valid
- Check Gmail daily sending limits
- Monitor rate limiting (1 email per second)

## License

This project is for educational and personal use. Please respect email marketing laws and regulations when using for commercial purposes.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review Gmail setup instructions
3. Ensure all environment variables are correctly set
