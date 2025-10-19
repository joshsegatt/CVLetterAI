'use client';

import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

interface PDFUploaderProps {
  onFileUpload: (content: string, fileName: string) => void;
  disabled?: boolean;
}

export function PDFUploader({ onFileUpload, disabled = false }: PDFUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
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

      const { content } = await response.json();
      onFileUpload(content, file.name);
    } catch (error) {
      console.error('PDF processing error:', error);
      setError('Failed to process PDF. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || uploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [disabled, uploading]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || uploading) return;
    
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="relative">
      <div
        className={`
          relative overflow-hidden rounded-lg border-2 border-dashed transition-all duration-200
          ${dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${uploading ? 'animate-pulse' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled || uploading}
        />
        
        <div className="flex items-center gap-3 p-4">
          <div className={`
            w-10 h-10 rounded-lg flex items-center justify-center transition-all
            ${dragActive 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600'
            }
          `}>
            {uploading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {uploading ? 'Processing PDF...' : 'Upload PDF'}
            </div>
            <div className="text-xs text-gray-500">
              {dragActive 
                ? 'Drop your PDF here' 
                : 'Click or drag to upload (max 10MB)'
              }
            </div>
          </div>
          
          <FileText className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}