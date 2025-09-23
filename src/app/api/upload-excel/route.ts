import { NextRequest, NextResponse } from 'next/server';
import { ExcelProcessor } from '@/lib/excel';
import { UploadResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json<UploadResponse>(
        { success: false, message: 'No file uploaded', error: 'Missing file' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      return NextResponse.json<UploadResponse>(
        { success: false, message: 'Invalid file type', error: 'Only .xlsx and .xls files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json<UploadResponse>(
        { success: false, message: 'File too large', error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process Excel file
    const schema = ExcelProcessor.processExcelFile(buffer);

    if (schema.data.length === 0) {
      return NextResponse.json<UploadResponse>(
        { success: false, message: 'Empty file', error: 'Excel file contains no data rows' },
        { status: 400 }
      );
    }

    return NextResponse.json<UploadResponse>({
      success: true,
      message: `Successfully processed ${schema.data.length} rows with ${schema.headers.length} columns`,
      schema
    });

  } catch (error) {
    console.error('Excel upload error:', error);
    
    return NextResponse.json<UploadResponse>(
      { 
        success: false, 
        message: 'Failed to process Excel file', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}