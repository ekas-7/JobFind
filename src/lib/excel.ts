import * as XLSX from 'xlsx';
import { ExcelSchema, EmailData } from '@/types';

export class ExcelProcessor {
  static processExcelFile(buffer: Buffer): ExcelSchema {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        throw new Error('Excel file is empty');
      }

      // First row contains headers
      const headers = jsonData[0] as string[];
      
      // Rest of the rows contain data
      const data: EmailData[] = jsonData.slice(1).map((row: any) => {
        const rowData: EmailData = { email: '' };
        headers.forEach((header, index) => {
          rowData[header] = row[index] || '';
        });
        return rowData;
      });

      return {
        headers: headers.filter(header => header && header.trim() !== ''),
        data: data.filter(row => Object.values(row).some(value => value && value.toString().trim() !== ''))
      };
    } catch (error) {
      console.error('Excel processing error:', error);
      throw new Error(`Failed to process Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static detectEmailColumns(headers: string[]): string[] {
    const emailKeywords = ['email', 'mail', 'e-mail', 'e_mail', 'contact', 'address'];
    
    return headers.filter(header => 
      emailKeywords.some(keyword => 
        header.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

  static validateEmailColumn(data: EmailData[], emailColumn: string): {
    isValid: boolean;
    validEmails: number;
    totalRows: number;
    sampleEmails: string[];
  } {
    let validEmails = 0;
    const sampleEmails: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    data.forEach(row => {
      const email = row[emailColumn];
      if (email && emailRegex.test(email.toString())) {
        validEmails++;
        if (sampleEmails.length < 5) {
          sampleEmails.push(email.toString());
        }
      }
    });

    return {
      isValid: validEmails > 0,
      validEmails,
      totalRows: data.length,
      sampleEmails
    };
  }
}