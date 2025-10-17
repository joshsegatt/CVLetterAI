"use client";

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '../ui/Button';

interface PDFDownloadButtonProps {
  targetId: string;
  filename?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function PDFDownloadButton({ 
  targetId, 
  filename = 'document.pdf',
  className = '',
  children 
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      setProgress(10);

      const element = document.getElementById(targetId);
      if (!element) {
        throw new Error('Element not found');
      }

      setProgress(25);

      // Configure html2canvas options for better quality
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      setProgress(60);

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      setProgress(80);

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      setProgress(95);

      // Download the PDF
      pdf.save(filename);
      
      setProgress(100);
      
      // Reset after successful download
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 1000);

    } catch (error) {
      console.error('PDF generation failed:', error);
      setIsGenerating(false);
      setProgress(0);
      // You could show an error toast here
    }
  };

  if (children) {
    return (
      <button
        onClick={generatePDF}
        disabled={isGenerating}
        className={`${className} ${isGenerating ? 'cursor-not-allowed opacity-70' : ''}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        intent="primary"
        size="lg"
        className={`
          relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 
          hover:from-purple-700 hover:to-blue-700 text-white font-bold
          shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
          transition-all duration-300 px-8 py-4 rounded-lg
          ${className}
        `}
      >
        {isGenerating ? (
          <div className="flex items-center gap-3">
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 border-2 border-white/30 rounded-full"></div>
              <div 
                className="absolute inset-0 border-2 border-white border-r-transparent rounded-full animate-spin"
              ></div>
            </div>
            <span>Generating PDF... {progress}%</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <svg 
              className="w-5 h-5" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>Download PDF</span>
          </div>
        )}
        
        {/* Progress bar */}
        {isGenerating && (
          <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full overflow-hidden w-full">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-green-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </Button>
    </div>
  );
}