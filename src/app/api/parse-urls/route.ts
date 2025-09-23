import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { ExcelSchema, UploadResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json<UploadResponse>(
        { success: false, message: 'No URLs provided', error: 'URLs array is required' },
        { status: 400 }
      );
    }

    const results = [];
    
    for (const url of urls) {
      if (!url || typeof url !== 'string') continue;
      
      try {
        // Validate URL format
        const urlObj = new URL(url);
        
        // Fetch the webpage
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; JobFinder/1.0)',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`Failed to fetch ${url}: ${response.status}`);
          continue;
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract various types of contact information
        const extractedData = {
          url: url,
          domain: urlObj.hostname,
          title: $('title').text().trim(),
          company: '',
          email: '',
          contact_email: '',
          hr_email: '',
          careers_email: '',
          position: '',
          location: '',
          description: ''
        };

        // Extract company name from various sources
        extractedData.company = 
          $('meta[property="og:site_name"]').attr('content') ||
          $('meta[name="application-name"]').attr('content') ||
          $('.company-name').text().trim() ||
          $('[class*="company"]').first().text().trim() ||
          urlObj.hostname.replace('www.', '').split('.')[0];

        // Extract job position
        extractedData.position = 
          $('h1').first().text().trim() ||
          $('.job-title').text().trim() ||
          $('[class*="title"]').first().text().trim();

        // Extract location
        extractedData.location = 
          $('.location').text().trim() ||
          $('[class*="location"]').text().trim() ||
          $('.job-location').text().trim();

        // Extract description (first paragraph or job description)
        extractedData.description = 
          $('.job-description').text().trim().substring(0, 200) ||
          $('.description').text().trim().substring(0, 200) ||
          $('p').first().text().trim().substring(0, 200);

        // Look for email addresses in various forms
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const pageText = $.text();
        const foundEmails = pageText.match(emailRegex) || [];

        // Prioritize different types of emails
        const careerEmails = foundEmails.filter(email => 
          email.includes('career') || email.includes('jobs') || email.includes('hr')
        );
        const contactEmails = foundEmails.filter(email => 
          email.includes('contact') || email.includes('info')
        );
        
        // Set email priority: careers > hr > contact > first found
        extractedData.email = careerEmails[0] || contactEmails[0] || foundEmails[0] || '';
        
        // Generate common email patterns if no email found
        if (!extractedData.email && extractedData.company) {
          const domain = urlObj.hostname;
          const companyName = extractedData.company.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          // Common email patterns
          const emailPatterns = [
            `careers@${domain}`,
            `jobs@${domain}`,
            `hr@${domain}`,
            `contact@${domain}`,
            `info@${domain}`,
            `hello@${domain}`
          ];
          
          extractedData.email = emailPatterns[0]; // Use careers@ as default
          extractedData.contact_email = `contact@${domain}`;
          extractedData.hr_email = `hr@${domain}`;
          extractedData.careers_email = `careers@${domain}`;
        }

        if (extractedData.email) {
          results.push(extractedData);
        }

      } catch (error) {
        console.error(`Error processing ${url}:`, error);
        // Continue with next URL
      }
    }

    if (results.length === 0) {
      return NextResponse.json<UploadResponse>(
        { 
          success: false, 
          message: 'No contact information found', 
          error: 'Could not extract email addresses from any of the provided URLs'
        },
        { status: 400 }
      );
    }

    // Create schema compatible with Excel format
    const headers = ['url', 'domain', 'company', 'position', 'email', 'contact_email', 'hr_email', 'careers_email', 'location', 'title', 'description'];
    const schema: ExcelSchema = {
      headers,
      data: results.map(item => ({
        url: item.url,
        domain: item.domain,
        company: item.company,
        position: item.position,
        email: item.email,
        contact_email: item.contact_email,
        hr_email: item.hr_email,
        careers_email: item.careers_email,
        location: item.location,
        title: item.title,
        description: item.description
      }))
    };

    return NextResponse.json<UploadResponse>({
      success: true,
      message: `Successfully parsed ${results.length} URLs and extracted contact information`,
      schema
    });

  } catch (error) {
    console.error('URL parsing error:', error);
    
    return NextResponse.json<UploadResponse>(
      { 
        success: false, 
        message: 'Failed to parse URLs', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}