export interface EmailData {
  email: string;
  [key: string]: string | number | boolean;
}

export interface ExcelSchema {
  headers: string[];
  data: EmailData[];
}

export interface EmailConfig {
  from: string;
  subject: string;
  body: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  schema?: ExcelSchema;
  error?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  sent: number;
  failed: number;
  errors?: string[];
}