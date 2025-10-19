import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// @ts-ignore - pdf-parse doesn't have TypeScript definitions
const pdf = require('pdf-parse');

// PDF text extraction using pdf-parse library
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extract text using pdf-parse
    const data = await pdf(buffer);
    
    // Clean and format the extracted text
    const cleanText = data.text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();
    
    if (!cleanText || cleanText.length < 10) {
      throw new Error('No readable text found in PDF');
    }
    
    return `PDF Document: ${file.name} (${Math.round(file.size / 1024)}KB)
    
${cleanText}

--- End of PDF Content ---`;

  } catch (error) {
    console.error('PDF extraction error:', error);
    // Fallback for when PDF parsing fails
    return `PDF File Uploaded: ${file.name} (${Math.round(file.size / 1024)}KB)

Unable to extract text content from this PDF file. This may be due to:
- The PDF contains only images or scanned content
- The PDF is password protected
- The file is corrupted or in an unsupported format

Please try uploading a different PDF file or describe the content manually.`;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the uploaded file
    const formData = await request.formData();
    const file = formData.get('pdf') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF file.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(file);

    return NextResponse.json({
      success: true,
      content: extractedText,
      fileName: file.name,
      fileSize: file.size
    });

  } catch (error) {
    console.error('PDF processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF. Please try again.' },
      { status: 500 }
    );
  }
}