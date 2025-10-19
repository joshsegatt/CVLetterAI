'use client';

import React, { useCallback, useState } from 'react';
import { X, AlertCircle, Paperclip } from 'lucide-react';

interface PDFUploaderProps {
  onFileUpload: (content: string, fileName: string) => void;
  disabled?: boolean;
}

export function PDFUploader({ onFileUpload, disabled = false }: PDFUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.includes('pdf')) {
      return 'Please upload a PDF file only.';
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB.';
    }
    
    return null;
  };

  const processFile = async (file: File) => {
    setUploading(true);
    setError(null);
    
    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Create FormData for upload
      const formData = new FormData();
      formData.append('pdf', file);

      // Send to backend for processing
      const response = await fetch('/api/ai/process-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const { content } = await response.json() as { content: string };
      onFileUpload(content, file.name);
    } catch (error) {
      console.error('PDF processing error:', error);
      setError('Failed to process PDF. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || uploading) return;
    
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      void processFile(files[0]);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled || uploading}
          id="pdf-upload"
        />
        
        <label
          htmlFor="pdf-upload"
          className={`
            w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer
            ${disabled || uploading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
            }
          `}
          title="Upload PDF"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Paperclip className="w-4 h-4" />
          )}
        </label>
      </div>

      {error && (
        <div className="absolute top-full left-0 mt-1 z-10 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 min-w-max">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}