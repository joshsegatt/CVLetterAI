"use client";

import React, { useState, useCallback } from "react";
import { CVData, CVTemplate, CVConfig } from "../../types/builder";
import MinimalModernCVTemplate from "./cv-templates/MinimalModernCVTemplate";
import CleanProfessionalCVTemplate from "./cv-templates/CleanProfessionalCVTemplate";
import MinimalistEliteCVTemplate from "./cv-templates/MinimalistEliteCVTemplate";
import CustomizationControls from "./CustomizationControls";
import PDFDownloadButton from "../shared/PDFDownloadButton";
import { AuthRequiredModal } from "../shared/AuthRequiredModal";
import { usePublicAccess } from "../../lib/auth/publicAccess";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

function StepProgress({ currentStep, totalSteps, steps }: StepProgressProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                  index < currentStep
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : index === currentStep
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-400'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className={`text-xs mt-2 font-medium ${
                index <= currentStep ? 'text-white' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-all ${
                  index < currentStep ? 'bg-emerald-500' : 'bg-gray-700'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

function EditableField({ value, onChange, className = "", placeholder = "", multiline = false }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = useCallback(() => {
    onChange(tempValue);
    setIsEditing(false);
  }, [tempValue, onChange]);

  const handleCancel = useCallback(() => {
    setTempValue(value);
    setIsEditing(false);
  }, [value]);

  if (isEditing) {
    if (multiline) {
      return (
        <div className="relative">
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className={`${className} bg-blue-50 border-2 border-blue-500 rounded px-2 py-1 w-full focus:outline-none resize-none`}
            placeholder={placeholder}
            rows={3}
            autoFocus
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleSave();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
          <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
            Ctrl+Enter para salvar, Esc para cancelar
          </div>
        </div>
      );
    }

    return (
      <input
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        className={`${className} bg-blue-50 border-2 border-blue-500 rounded px-2 py-1 focus:outline-none`}
        placeholder={placeholder}
        autoFocus
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSave();
          } else if (e.key === 'Escape') {
            handleCancel();
          }
        }}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-pointer hover:bg-blue-50 hover:shadow-sm transition-all rounded px-1 py-0.5 border border-transparent hover:border-blue-200 group relative`}
      title="Clique para editar"
    >
      {value || (
        <span className="text-gray-400 italic">{placeholder}</span>
      )}
      <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity">
        Clique para editar
      </div>
    </div>
  );
}

interface InteractiveCVBuilderProps {
  initialData: CVData;
}

export default function InteractiveCVBuilder({ initialData }: InteractiveCVBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('modern');
  const [cvData, setCvData] = useState<CVData>(initialData);
  const [cvConfig, setCvConfig] = useState<CVConfig>({
    template: 'modern',
    primaryColor: '#1e40af',
    accentColor: '#60a5fa',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 'medium',
    spacing: 'normal',
    showPhoto: false,
    highlightSkills: true,
    twoColumn: false,
    sectionIcons: true
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, getFreeDownloadLimit } = usePublicAccess();

  const steps = ['Template', 'Personalizar', 'Customizar', 'Revisar', 'Baixar'];

  const templates: { id: CVTemplate; name: string; description: string; preview: string }[] = [
    {
      id: 'modern',
      name: 'Minimal Modern',
      description: 'Design limpo e contemporâneo com espaçamento perfeito',
      preview: '/thumbs/cv-modern.png'
    },
    {
      id: 'elegant',
      name: 'Clean Professional',
      description: 'Layout de duas colunas com sidebar e acentos profissionais',
      preview: '/thumbs/cv-elegant.png'
    },
    {
      id: 'executive',
      name: 'Minimalist Elite',
      description: 'Design ultra-limpo centralizado para executivos',
      preview: '/thumbs/cv-executive.png'
    }
  ];

  const updateCVData = useCallback((field: string, value: any) => {
    setCvData(prev => {
      const keys = field.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  const renderTemplate = () => {
    const props = {
      data: cvData,
      config: { ...cvConfig, template: selectedTemplate },
      preview: false,
      editable: currentStep === 1,
      onFieldChange: updateCVData
    };

    switch (selectedTemplate) {
      case 'elegant':
        return <CleanProfessionalCVTemplate {...props} />;
      case 'executive':
        return <MinimalistEliteCVTemplate {...props} />;
      default:
        return <MinimalModernCVTemplate {...props} />;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Template Selection
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Escolha seu template preferido
            </h3>
            <div className="grid gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`glass-panel border p-6 text-left transition-all hover:scale-105 ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-gray-200 rounded flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-300">
                      <div className="w-full h-full bg-white/50 rounded flex items-center justify-center text-xs text-gray-600">
                        Preview
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">{template.name}</h4>
                      <p className="text-sm text-neutral-300">{template.description}</p>
                      {selectedTemplate === template.id && (
                        <div className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded text-xs">
                          ✓ Selecionado
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 1: // Customize Data
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Personalize suas informações
            </h3>
            <div className="glass-panel border-white/10 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Nome</label>
                  <input
                    type="text"
                    value={cvData.personal.firstName}
                    onChange={(e) => updateCVData('personal.firstName', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Sobrenome</label>
                  <input
                    type="text"
                    value={cvData.personal.lastName}
                    onChange={(e) => updateCVData('personal.lastName', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <input
                  type="email"
                  value={cvData.personal.email}
                  onChange={(e) => updateCVData('personal.email', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Telefone</label>
                <input
                  type="tel"
                  value={cvData.personal.phone}
                  onChange={(e) => updateCVData('personal.phone', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Localização</label>
                <input
                  type="text"
                  value={cvData.personal.location}
                  onChange={(e) => updateCVData('personal.location', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Resumo Profissional</label>
                <textarea
                  value={cvData.personal.summary}
                  onChange={(e) => updateCVData('personal.summary', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 2: // Customize Appearance
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Customize a aparência
            </h3>
            <CustomizationControls 
              config={cvConfig}
              onConfigChange={(updates) => setCvConfig(prev => ({ ...prev, ...updates }))}
            />
          </div>
        );

      case 3: // Review
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Revise seu CV
            </h3>
            <div className="glass-panel border-white/10 p-6">
              <p className="text-neutral-300 mb-4">
                Confira se todas as informações estão corretas. Você pode voltar para fazer ajustes se necessário.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Nome:</span>
                  <span className="text-white ml-2">{cvData.personal.firstName} {cvData.personal.lastName}</span>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white ml-2">{cvData.personal.email}</span>
                </div>
                <div>
                  <span className="text-gray-400">Telefone:</span>
                  <span className="text-white ml-2">{cvData.personal.phone}</span>
                </div>
                <div>
                  <span className="text-gray-400">Template:</span>
                  <span className="text-white ml-2">{templates.find(t => t.id === selectedTemplate)?.name}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Download
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Baixe seu CV
            </h3>
            <div className="glass-panel border-white/10 p-6 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h4 className="text-lg font-semibold text-white mb-2">CV Pronto!</h4>
              <p className="text-neutral-300 mb-6">
                Seu CV profissional está pronto para download. Clique no botão abaixo para baixar em PDF.
              </p>
              
              {isAuthenticated ? (
                <PDFDownloadButton
                  targetId="cv-preview"
                  filename={`${cvData.personal.firstName}_${cvData.personal.lastName}_CV.pdf`}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 px-8 py-4 text-lg font-semibold"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    <span>Baixar CV em PDF</span>
                    {(() => {
                      const limits = getFreeDownloadLimit();
                      return limits.hasLimit ? (
                        <span className="text-sm bg-white/20 px-2 py-1 rounded">
                          {limits.remaining}/{limits.total} restantes
                        </span>
                      ) : null;
                    })()}
                  </div>
                </PDFDownloadButton>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 px-8 py-4 text-lg font-semibold text-white rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    <span>Baixar CV Grátis</span>
                    <span className="text-sm bg-white/20 px-2 py-1 rounded">
                      Registre-se
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Progress */}
      <StepProgress currentStep={currentStep} totalSteps={steps.length} steps={steps} />

      {/* Main Content */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left Sidebar - Step Content */}
        <div className="lg:col-span-2 space-y-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex-1 px-4 py-3 border border-white/30 bg-white/5 backdrop-blur text-white rounded-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                ← Voltar
              </button>
            )}
            
            {currentStep < steps.length - 1 && (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                {currentStep === 0 ? 'Começar Personalização' : 'Próximo'} →
              </button>
            )}
          </div>
        </div>

        {/* Right Side - Live Preview */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-semibold text-white">Preview em Tempo Real</h2>
          
          <div className="glass-panel border-white/10 p-6">
            <div className="flex justify-center">
              <div 
                id="cv-preview" 
                className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200"
                style={{ 
                  width: '420px',
                  height: '594px', // A4 proportion (420 * 1.414)
                  maxWidth: '100%',
                  transform: 'scale(0.85)',
                  transformOrigin: 'top center',
                  marginBottom: '-60px' // Compensate scale spacing
                }}
              >
                <div className="h-full overflow-hidden">
                  {renderTemplate()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="download"
      />
    </div>
  );
}