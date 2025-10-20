'use client';

import { useState } from 'react';
import { CVData } from '@/types/builder';
import ProfessionalLinkedInCV from './cv-templates/ProfessionalLinkedInCV';
import ExecutiveMinimalistCV from './cv-templates/ExecutiveMinimalistCV';
import ModernTechCorporateCV from './cv-templates/ModernTechCorporateCV';

interface TemplateGalleryProps {
  data: CVData;
  onTemplateSelect: (template: string, colorScheme: string) => void;
  showPhoto?: boolean;
}

export default function TemplateGallery({ data, onTemplateSelect, showPhoto = true }: TemplateGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('professional-linkedin');
  const [selectedColorScheme, setSelectedColorScheme] = useState('corporate-blue');

  const templates = {
    'professional-linkedin': {
      name: 'LinkedIn Professional',
      description: 'Clean, corporate design inspired by LinkedIn profiles',
      component: ProfessionalLinkedInCV,
      colorSchemes: [
        { id: 'corporate-blue', name: 'Corporate Blue', primary: 'rgb(0, 119, 181)' },
        { id: 'executive-gray', name: 'Executive Gray', primary: 'rgb(68, 68, 68)' },
        { id: 'professional-black', name: 'Professional Black', primary: 'rgb(34, 34, 34)' },
        { id: 'modern-teal', name: 'Modern Teal', primary: 'rgb(0, 150, 136)' },
        { id: 'premium-navy', name: 'Premium Navy', primary: 'rgb(25, 77, 130)' },
        { id: 'classic-charcoal', name: 'Classic Charcoal', primary: 'rgb(85, 85, 85)' }
      ]
    },
    'executive-minimalist': {
      name: 'Executive Minimalist',
      description: 'Ultra-clean design for senior executives and leaders',
      component: ExecutiveMinimalistCV,
      colorSchemes: [
        { id: 'charcoal-elite', name: 'Charcoal Elite', primary: 'rgb(45, 45, 45)' },
        { id: 'platinum-executive', name: 'Platinum Executive', primary: 'rgb(70, 70, 70)' },
        { id: 'navy-corporate', name: 'Navy Corporate', primary: 'rgb(35, 55, 75)' },
        { id: 'slate-professional', name: 'Slate Professional', primary: 'rgb(55, 65, 75)' },
        { id: 'graphite-modern', name: 'Graphite Modern', primary: 'rgb(40, 40, 40)' },
        { id: 'steel-premium', name: 'Steel Premium', primary: 'rgb(65, 75, 85)' }
      ]
    },
    'modern-tech': {
      name: 'Modern Tech Corporate',
      description: 'Tech-focused design with modern gradients and clean typography',
      component: ModernTechCorporateCV,
      colorSchemes: [
        { id: 'tech-blue', name: 'Tech Blue', primary: 'rgb(59, 130, 246)' },
        { id: 'silicon-gray', name: 'Silicon Gray', primary: 'rgb(71, 85, 105)' },
        { id: 'startup-green', name: 'Startup Green', primary: 'rgb(34, 197, 94)' },
        { id: 'innovation-purple', name: 'Innovation Purple', primary: 'rgb(147, 51, 234)' },
        { id: 'digital-orange', name: 'Digital Orange', primary: 'rgb(249, 115, 22)' },
        { id: 'cyber-dark', name: 'Cyber Dark', primary: 'rgb(45, 45, 45)' }
      ]
    }
  };

  const currentTemplate = templates[selectedTemplate as keyof typeof templates];
  const TemplateComponent = currentTemplate.component;

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates[templateId as keyof typeof templates];
    setSelectedColorScheme(template.colorSchemes[0].id);
    onTemplateSelect(templateId, template.colorSchemes[0].id);
  };

  const handleColorSchemeChange = (colorSchemeId: string) => {
    setSelectedColorScheme(colorSchemeId);
    onTemplateSelect(selectedTemplate, colorSchemeId);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      gap: '24px',
      height: '80vh',
      fontFamily: '"Inter", sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        backgroundColor: 'rgb(249, 250, 251)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgb(229, 231, 235)',
        overflowY: 'auto'
      }}>
        {/* Template Selection */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'rgb(17, 24, 39)',
            margin: '0 0 16px 0'
          }}>
            Template Style
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(templates).map(([key, template]) => (
              <button
                key={key}
                onClick={() => handleTemplateChange(key)}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: selectedTemplate === key 
                    ? '2px solid rgb(59, 130, 246)' 
                    : '1px solid rgb(209, 213, 219)',
                  backgroundColor: selectedTemplate === key 
                    ? 'rgb(239, 246, 255)' 
                    : 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'rgb(17, 24, 39)',
                  margin: '0 0 4px 0'
                }}>
                  {template.name}
                </h4>
                <p style={{
                  fontSize: '12px',
                  color: 'rgb(107, 114, 128)',
                  margin: '0',
                  lineHeight: '1.4'
                }}>
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Color Scheme Selection */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'rgb(17, 24, 39)',
            margin: '0 0 16px 0'
          }}>
            Color Scheme
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {currentTemplate.colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => handleColorSchemeChange(scheme.id)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: selectedColorScheme === scheme.id 
                    ? '2px solid rgb(59, 130, 246)' 
                    : '1px solid rgb(209, 213, 219)',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: scheme.primary,
                  border: '2px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
                <span style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  color: 'rgb(55, 65, 81)',
                  textAlign: 'center'
                }}>
                  {scheme.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'rgb(17, 24, 39)',
            margin: '0 0 16px 0'
          }}>
            Display Options
          </h3>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: 'rgb(55, 65, 81)'
          }}>
            <input
              type="checkbox"
              checked={showPhoto}
              onChange={() => {}}
              style={{
                width: '16px',
                height: '16px',
                accentColor: 'rgb(59, 130, 246)'
              }}
            />
            Show Professional Photo
          </label>
        </div>
      </div>

      {/* Preview Area */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgb(229, 231, 235)',
        overflowY: 'auto'
      }}>
        <div style={{
          transform: 'scale(0.6)',
          transformOrigin: 'top center',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <TemplateComponent
            data={data}
            {...({colorScheme: selectedColorScheme} as any)}
            showPhoto={showPhoto}
          />
        </div>
      </div>
    </div>
  );
}