"use client";

import React, { useState, useCallback } from "react";
import { LetterData, LetterTemplate } from "../../types/builder";
import MinimalModernLetterTemplate from "./Letter-templates/MinimalModernLetterTemplate";
import CleanBusinessLetterTemplate from "./Letter-templates/CleanBusinessLetterTemplate";
import ElegantLetterTemplate from "./Letter-templates/ElegantLetterTemplate";
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
                    ? 'bg-purple-500 border-purple-500 text-white'
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

interface InteractiveLetterBuilderProps {
  initialData: LetterData;
}

export default function InteractiveLetterBuilder({ initialData }: InteractiveLetterBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate>('formal');
  const [letterData, setLetterData] = useState<LetterData>(initialData);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated, getFreeDownloadLimit } = usePublicAccess();

  const steps = ['Template', 'Personalizar', 'Revisar', 'Baixar'];

  const templates: { id: LetterTemplate; name: string; description: string; preview: string }[] = [
    {
      id: 'formal',
      name: 'Minimal Modern',
      description: 'Design limpo e contemporâneo para correspondência moderna',
      preview: '/thumbs/letter-formal.png'
    },
    {
      id: 'polite',
      name: 'Clean Business',
      description: 'Carta comercial profissional com cabeçalho elegante',
      preview: '/thumbs/letter-business.png'
    },
    {
      id: 'firm',
      name: 'Executive Elite',
      description: 'Template premium para correspondência executiva',
      preview: '/thumbs/letter-executive.png'
    }
  ];

  const updateLetterData = useCallback((field: string, value: any) => {
    setLetterData(prev => {
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
      data: letterData,
      config: { template: selectedTemplate, tone: 'formal' as const, letterhead: true },
      preview: false
    };

    switch (selectedTemplate) {
      case 'polite':
        return <CleanBusinessLetterTemplate {...props} />;
      case 'firm':
        return <ElegantLetterTemplate {...props} />;
      default:
        return <MinimalModernLetterTemplate {...props} />;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Template Selection
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Escolha seu template de carta
            </h3>
            <div className="grid gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`glass-panel border p-6 text-left transition-all hover:scale-105 ${
                    selectedTemplate === template.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-gray-200 rounded flex-shrink-0 bg-gradient-to-br from-purple-100 to-purple-300">
                      <div className="w-full h-full bg-white/50 rounded flex items-center justify-center text-xs text-gray-600">
                        Preview
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2">{template.name}</h4>
                      <p className="text-sm text-neutral-300">{template.description}</p>
                      {selectedTemplate === template.id && (
                        <div className="mt-2 inline-block bg-purple-500 text-white px-3 py-1 rounded text-xs">
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
              Personalize sua carta
            </h3>
            <div className="glass-panel border-white/10 p-6 space-y-4">
              {/* Sender Info */}
              <div className="border-b border-white/10 pb-4 mb-4">
                <h4 className="text-lg font-semibold text-white mb-3">Suas Informações</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Nome</label>
                    <input
                      type="text"
                      value={letterData.senderInfo.name}
                      onChange={(e) => updateLetterData('senderInfo.name', e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <input
                      type="email"
                      value={letterData.senderInfo.email}
                      onChange={(e) => updateLetterData('senderInfo.email', e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-white mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={letterData.senderInfo.phone}
                    onChange={(e) => updateLetterData('senderInfo.phone', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-white mb-2">Endereço</label>
                  <textarea
                    value={letterData.senderInfo.address}
                    onChange={(e) => updateLetterData('senderInfo.address', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Recipient Info */}
              <div className="border-b border-white/10 pb-4 mb-4">
                <h4 className="text-lg font-semibold text-white mb-3">Destinatário</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Nome</label>
                    <input
                      type="text"
                      value={letterData.recipientInfo.name}
                      onChange={(e) => updateLetterData('recipientInfo.name', e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Título/Cargo</label>
                    <input
                      type="text"
                      value={letterData.recipientInfo.title || ''}
                      onChange={(e) => updateLetterData('recipientInfo.title', e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-white mb-2">Empresa</label>
                  <input
                    type="text"
                    value={letterData.recipientInfo.company || ''}
                    onChange={(e) => updateLetterData('recipientInfo.company', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-white mb-2">Endereço</label>
                  <textarea
                    value={letterData.recipientInfo.address}
                    onChange={(e) => updateLetterData('recipientInfo.address', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Letter Content */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Conteúdo da Carta</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Assunto</label>
                    <input
                      type="text"
                      value={letterData.letterInfo.subject}
                      onChange={(e) => updateLetterData('letterInfo.subject', e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Saudação</label>
                    <input
                      type="text"
                      value={letterData.letterInfo.salutation}
                      onChange={(e) => updateLetterData('letterInfo.salutation', e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      placeholder="Ex: Prezado(a) Sr(a). Silva,"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Corpo da Carta</label>
                    <textarea
                      value={letterData.letterInfo.body}
                      onChange={(e) => updateLetterData('letterInfo.body', e.target.value)}
                      rows={8}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none"
                      placeholder="Escreva o conteúdo principal da sua carta aqui..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Fechamento</label>
                    <input
                      type="text"
                      value={letterData.letterInfo.closing}
                      onChange={(e) => updateLetterData('letterInfo.closing', e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      placeholder="Ex: Atenciosamente,"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Review
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Revise sua carta
            </h3>
            <div className="glass-panel border-white/10 p-6">
              <p className="text-neutral-300 mb-4">
                Confira se todas as informações estão corretas. Você pode voltar para fazer ajustes se necessário.
              </p>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Remetente:</span>
                  <span className="text-white ml-2">{letterData.senderInfo.name}</span>
                </div>
                <div>
                  <span className="text-gray-400">Destinatário:</span>
                  <span className="text-white ml-2">{letterData.recipientInfo.name} - {letterData.recipientInfo.company}</span>
                </div>
                <div>
                  <span className="text-gray-400">Assunto:</span>
                  <span className="text-white ml-2">{letterData.letterInfo.subject}</span>
                </div>
                <div>
                  <span className="text-gray-400">Template:</span>
                  <span className="text-white ml-2">{templates.find(t => t.id === selectedTemplate)?.name}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Download
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Baixe sua carta
            </h3>
            <div className="glass-panel border-white/10 p-6 text-center">
              <div className="text-6xl mb-4">📄</div>
              <h4 className="text-lg font-semibold text-white mb-2">Carta Pronta!</h4>
              <p className="text-neutral-300 mb-6">
                Sua carta profissional está pronta para download. Clique no botão abaixo para baixar em PDF.
              </p>
              
              {isAuthenticated ? (
                <PDFDownloadButton
                  targetId="letter-preview"
                  filename={`${letterData.senderInfo.name.replace(/\s+/g, '_')}_Letter.pdf`}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg font-semibold"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    <span>Baixar Carta em PDF</span>
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
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg font-semibold text-white rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                    </svg>
                    <span>Baixar Carta Grátis</span>
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
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
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
                id="letter-preview" 
                className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200"
                style={{ 
                  width: '420px',
                  height: '594px', // A4 proportion
                  maxWidth: '100%',
                  transform: 'scale(0.85)',
                  transformOrigin: 'top center',
                  marginBottom: '-60px'
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