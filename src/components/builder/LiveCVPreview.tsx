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
    <div className="bg-white rounded-lg shadow-2xl overflow-hidden w-full">
      <div 
        className="w-full"
        style={{ 
          transform: scale !== 1 ? `scale(${scale})` : undefined, 
          transformOrigin: scale !== 1 ? 'top center' : undefined,
          aspectRatio: '210 / 297' // A4 proportion
        }}
      >
        <div className="w-full h-full overflow-hidden">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}