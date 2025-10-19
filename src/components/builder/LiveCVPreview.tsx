"use client";

import React from "react";
import { CVData } from "../../types/builder";
import ProfessionalLinkedInCV from "./cv-templates/ProfessionalLinkedInCV";
import ExecutiveMinimalistCV from "./cv-templates/ExecutiveMinimalistCV";
import ModernTechCorporateCV from "./cv-templates/ModernTechCorporateCV";

interface LiveCVPreviewProps {
  data: CVData;
  template: string;
  colorScheme: string;
  scale?: number;
}

export default function LiveCVPreview({ data, template, colorScheme, scale = 0.5 }: LiveCVPreviewProps) {
  const renderTemplate = () => {
    const baseProps = {
      data,
      showPhoto: true
    };

    switch (template) {
      case 'professional-linkedin':
        return <ProfessionalLinkedInCV 
          {...baseProps} 
          colorScheme={colorScheme as "corporate-blue" | "executive-gray" | "professional-black" | "modern-teal" | "premium-navy" | "classic-charcoal"}
        />;
      case 'executive-minimalist':
        return <ExecutiveMinimalistCV 
          {...baseProps} 
          colorScheme={colorScheme as "charcoal-elite" | "platinum-executive" | "navy-corporate" | "slate-professional" | "graphite-modern" | "steel-premium"}
        />;
      case 'modern-tech-corporate':
        return <ModernTechCorporateCV 
          {...baseProps} 
          colorScheme={colorScheme as "tech-blue" | "silicon-gray" | "startup-green" | "innovation-purple" | "digital-orange" | "cyber-dark"}
        />;
      default:
        return <ProfessionalLinkedInCV 
          {...baseProps} 
          colorScheme="corporate-blue"
        />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top left',
          width: `${100 / scale}%`,
          height: `${100 / scale}%`
        }}
      >
        <div style={{ width: '794px', minHeight: '1123px', margin: '0 auto' }}>
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}