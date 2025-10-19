"use client";

import React, { useState, useCallback } from "react";
import { LetterData, LetterTemplate } from "../../types/builder";
import MinimalModernLetterTemplate from "./Letter-templates/MinimalModernLetterTemplate";
import CleanBusinessLetterTemplate from "./Letter-templates/CleanBusinessLetterTemplate";
import ElegantLetterTemplate from "./Letter-templates/ElegantLetterTemplate";
import PDFDownloadButton from "../shared/PDFDownloadButton";
import { AuthRequiredModal } from "../shared/AuthRequiredModal";
import { usePublicAccess } from "../../lib/auth/publicAccess";
import { 
  FileText, 
  User, 
  Mail, 
  Eye, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Palette,
  Edit3
} from "lucide-react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; icon: React.ComponentType<any>; description: string }[];
}

function StepProgress({ currentStep, totalSteps, steps }: StepProgressProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;
          
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center min-w-0 flex-1">
                <div className={`
                  relative w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                    : isCurrent 
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25 scale-110' 
                    : 'bg-gray-100 text-gray-400'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <Icon className="w-8 h-8" />
                  )}
                  {isCurrent && (
                    <div className="absolute -inset-1 bg-purple-500/20 rounded-2xl animate-pulse" />
                  )}
                </div>
                <div className="text-center">
                  <h3 className={`text-sm font-semibold mb-1 ${
                    isCurrent ? 'text-purple-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-tight max-w-20">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex items-center justify-center w-12 h-1 mx-2">
                  <div className={`w-full h-0.5 transition-all duration-300 ${
                    index < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                  }`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
        <div className="text-sm text-gray-600">
          Step <span className="font-semibold text-purple-600">{currentStep + 1}</span> of {totalSteps}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
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

  const steps = [
    { 
      title: "Template", 
      icon: Palette, 
      description: "Choose design" 
    },
    { 
      title: "Content", 
      icon: Edit3, 
      description: "Write letter" 
    },
    { 
      title: "Review", 
      icon: Eye, 
      description: "Final check" 
    },
    { 
      title: "Download", 
      icon: Download, 
      description: "Get your letter" 
    }
  ];

  const templates: { id: LetterTemplate; name: string; description: string; preview: string }[] = [
    {
      id: 'formal',
      name: 'Minimal Modern',
      description: 'Clean contemporary design for modern correspondence',
      preview: '/thumbs/letter-formal.png'
    },
    {
      id: 'polite',
      name: 'Clean Business',
      description: 'Professional business letter with elegant header',
      preview: '/thumbs/letter-business.png'
    },
    {
      id: 'firm',
      name: 'Executive Elite',
      description: 'Premium template for executive correspondence',
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
          <div className="space-y-8">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Palette className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Choose Your Template</h2>
                    <p className="text-small text-gray-600">Select a professional letter design</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                        selectedTemplate === template.id
                          ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/10'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                      aria-label={`Select ${template.name} template - ${template.description}`}
                      role="radio"
                      aria-checked={selectedTemplate === template.id}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h4>
                          <p className="text-body text-gray-600">{template.description}</p>
                          {selectedTemplate === template.id && (
                            <div className="mt-3 inline-flex items-center gap-2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                              <CheckCircle className="w-4 h-4" />
                              Selected
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Customize Content
        return (
          <div className="space-y-8">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Letter Content</h2>
                    <p className="text-small text-gray-600">Customize your letter details</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Sender Info */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-600" />
                      Your Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="sender-name" className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          id="sender-name"
                          type="text"
                          value={letterData.senderInfo.name}
                          onChange={(e) => updateLetterData('senderInfo.name', e.target.value)}
                          className="input input-lg"
                          placeholder="Enter your full name"
                          aria-required="true"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          type="email"
                          value={letterData.senderInfo.email}
                          onChange={(e) => updateLetterData('senderInfo.email', e.target.value)}
                          className="input input-lg"
                          placeholder="your.email@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          value={letterData.senderInfo.phone}
                          onChange={(e) => updateLetterData('senderInfo.phone', e.target.value)}
                          className="input input-lg"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Address</label>
                        <textarea
                          value={letterData.senderInfo.address}
                          onChange={(e) => updateLetterData('senderInfo.address', e.target.value)}
                          rows={2}
                          className="input input-lg min-h-16"
                          placeholder="Your complete address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recipient Info */}
                  <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-gray-600" />
                      Recipient Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Recipient Name</label>
                        <input
                          type="text"
                          value={letterData.recipientInfo.name}
                          onChange={(e) => updateLetterData('recipientInfo.name', e.target.value)}
                          className="input input-lg"
                          placeholder="Recipient's full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Title/Position</label>
                        <input
                          type="text"
                          value={letterData.recipientInfo.title || ''}
                          onChange={(e) => updateLetterData('recipientInfo.title', e.target.value)}
                          className="input input-lg"
                          placeholder="e.g. HR Manager, CEO"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company</label>
                        <input
                          type="text"
                          value={letterData.recipientInfo.company || ''}
                          onChange={(e) => updateLetterData('recipientInfo.company', e.target.value)}
                          className="input input-lg"
                          placeholder="Company name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company Address</label>
                        <textarea
                          value={letterData.recipientInfo.address}
                          onChange={(e) => updateLetterData('recipientInfo.address', e.target.value)}
                          rows={2}
                          className="input input-lg min-h-16"
                          placeholder="Company's complete address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Letter Content */}
                  <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-600" />
                      Letter Content
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Subject Line</label>
                        <input
                          type="text"
                          value={letterData.letterInfo.subject}
                          onChange={(e) => updateLetterData('letterInfo.subject', e.target.value)}
                          className="input input-lg"
                          placeholder="Brief description of the letter's purpose"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Salutation</label>
                        <input
                          type="text"
                          value={letterData.letterInfo.salutation}
                          onChange={(e) => updateLetterData('letterInfo.salutation', e.target.value)}
                          className="input input-lg"
                          placeholder="e.g. Dear Mr. Smith, Dear Hiring Manager,"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Letter Body</label>
                        <textarea
                          value={letterData.letterInfo.body}
                          onChange={(e) => updateLetterData('letterInfo.body', e.target.value)}
                          rows={8}
                          className="input input-lg min-h-48"
                          placeholder="Write the main content of your letter here. Be clear, concise, and professional..."
                        />
                        <p className="text-xs text-gray-500">Write 2-4 paragraphs covering your main points</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Closing</label>
                        <input
                          type="text"
                          value={letterData.letterInfo.closing}
                          onChange={(e) => updateLetterData('letterInfo.closing', e.target.value)}
                          className="input input-lg"
                          placeholder="e.g. Sincerely, Best regards, Kind regards"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Review
        return (
          <div className="space-y-8">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Review Your Letter</h2>
                    <p className="text-small text-gray-600">Final check before download</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-subtle rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Letter Summary</h3>
                    <div className="space-y-3 text-body">
                      <div className="flex justify-between">
                        <span className="text-gray-600">From:</span>
                        <span className="text-gray-900 font-medium">{letterData.senderInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">To:</span>
                        <span className="text-gray-900 font-medium">
                          {letterData.recipientInfo.name} 
                          {letterData.recipientInfo.company && ` - ${letterData.recipientInfo.company}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subject:</span>
                        <span className="text-gray-900 font-medium">{letterData.letterInfo.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Template:</span>
                        <span className="text-gray-900 font-medium">
                          {templates.find(t => t.id === selectedTemplate)?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                      aria-label="Change template - Go back to template selection"
                    >
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Change Template</div>
                        <div className="text-small text-gray-600">Select a different design</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                      aria-label="Edit content - Go back to content editing"
                    >
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Edit Content</div>
                        <div className="text-small text-gray-600">Modify letter details</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Download
        return (
          <div className="text-center">
            <div className="card">
              <div className="card-body py-16">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your Letter is Ready! 🎉
                </h2>
                <p className="text-body text-gray-600 mb-8 max-w-md mx-auto">
                  Your professional letter is ready for download. Click below to get your PDF document.
                </p>
                
                <div className="space-y-4">
                  {isAuthenticated ? (
                    <PDFDownloadButton
                      targetId="letter-preview"
                      filename={`${letterData.senderInfo.name.replace(/\s+/g, '_')}_Letter.pdf`}
                      className="btn btn-primary btn-xl w-full max-w-md mx-auto"
                    >
                      <Download className="w-6 h-6 mr-3" />
                      Download Letter as PDF
                      {(() => {
                        const limits = getFreeDownloadLimit();
                        return limits.hasLimit ? (
                          <span className="ml-2 bg-white/20 px-2 py-1 rounded text-sm">
                            {limits.remaining}/{limits.total} remaining
                          </span>
                        ) : null;
                      })()}
                    </PDFDownloadButton>
                  ) : (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="btn btn-primary btn-xl w-full max-w-md mx-auto"
                    >
                      <Download className="w-6 h-6 mr-3" />
                      Download Free Letter
                      <span className="ml-2 bg-white/20 px-2 py-1 rounded text-sm">
                        Sign up required
                      </span>
                    </button>
                  )}
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-xl max-w-md mx-auto">
                  <div className="text-small text-gray-600 mb-2">Next Steps:</div>
                  <ul className="text-xs text-gray-500 space-y-1 text-left">
                    <li>• Print on quality letterhead paper</li>
                    <li>• Proofread for any final corrections</li>
                    <li>• Send via email or traditional mail</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container-lg py-8 space-y-8">
        <StepProgress 
          currentStep={currentStep} 
          totalSteps={steps.length} 
          steps={steps}
        />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Step Content */}
          <div className="space-y-8">
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="btn btn-ghost btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Go to previous step in letter building process"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>
              
              {currentStep < steps.length - 1 && (
                <button
                  onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                  className="btn btn-primary btn-lg"
                  aria-label="Go to next step in letter building process"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </div>

          {/* Right Side - Live Preview */}
          <div className="lg:sticky lg:top-8">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Live Preview</h3>
                  <div className="badge badge-primary">Real-time</div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 overflow-auto max-h-[600px] lg:max-h-[700px]">
                  <div className="flex justify-center">
                    <div 
                      id="letter-preview" 
                      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 w-full max-w-[420px] mx-auto"
                      style={{ 
                        aspectRatio: '210 / 297', // A4 proportion (210mm x 297mm)
                        minHeight: '400px'
                      }}
                    >
                      <div className="w-full h-full overflow-hidden">
                        {renderTemplate()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Professional layout • PDF quality guaranteed
                </p>
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
