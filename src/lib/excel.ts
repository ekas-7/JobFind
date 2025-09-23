import * as XLSX from 'xlsx';
import { ExcelSchema, EmailData } from '@/types';

export class ExcelProcessor {
  static processExcelFile(buffer: Buffer): ExcelSchema {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON array of arrays to handle any structure
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];
      
      if (jsonData.length === 0) {
        throw new Error('Excel file is empty');
      }

      let headers: string[] = [];
      let dataRows: any[][] = [];

      // Check if the first row looks like a header (no emails)
      const firstRowHasEmail = jsonData[0].some(cell => typeof cell === 'string' && cell.includes('@'));
      
      if (!firstRowHasEmail && jsonData.length > 0) {
        headers = jsonData[0].map(h => String(h));
        dataRows = jsonData.slice(1);
      } else {
        // No header or first row contains data, treat all rows as data
        headers = ['Column 1', 'Column 2', 'Column 3']; // Generic headers
        dataRows = jsonData;
      }

      const processedData: EmailData[] = [];
      dataRows.forEach(row => {
        const rowEmails: string[] = [];
        row.forEach(cell => {
          if (typeof cell === 'string') {
            // Regex to find all email-like strings in a cell
            const emailsInCell = cell.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
            if (emailsInCell) {
              rowEmails.push(...emailsInCell);
            }
          }
        });

        if (rowEmails.length > 0) {
          // Create a new record for each unique email found in the row
          const uniqueEmails = [...new Set(rowEmails)];
          uniqueEmails.forEach(email => {
            const rowData: EmailData = { email: email.trim() };
            headers.forEach((header, index) => {
              rowData[header] = row[index] ? String(row[index]) : '';
            });
            processedData.push(rowData);
          });
        }
      });

      if (processedData.length === 0) {
        throw new Error('No valid email addresses found in the file');
      }

      return {
        headers: [...new Set(processedData.flatMap(Object.keys))].filter(h => h && h.trim() !== ''),
        data: processedData
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