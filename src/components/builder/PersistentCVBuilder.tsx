/**
 * Enhanced CV Builder with Local Persistence
 * No login required - automatically saves to localStorage
 */

"use client";

import React, { useState, useCallback, useEffect } from "react";
import { CVData, CVTemplate, CVConfig } from "../../types/builder";
import TemplateGallery from "./TemplateGallery";
import ProfessionalPhotoUploader from "./ProfessionalPhotoUploader";
import CustomizationControls from "./CustomizationControls";
import LuxuryExperienceEditor from "./LuxuryExperienceEditor";
import LuxurySkillsManager from "./LuxurySkillsManager";
import LiveCVPreview from "./LiveCVPreview";
import AutoSaveStatus from "../shared/AutoSaveStatus";
import { Paywall } from "../payments/Paywall";
import { 
  useCVProgress, 
  usePaymentStatus, 
  useAutoSave 
} from "../../lib/persistence/localStorage";
import { 
  User, 
  Briefcase, 
  Palette, 
  FileText, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Lock,
  Save
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
          
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center min-w-0 flex-1">
                <div className={`
                  relative w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                    : isCurrent 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-110' 
                    : 'bg-gray-100 text-gray-400'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <Icon className="w-8 h-8" />
                  )}
                  {isCurrent && (
                    <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl animate-pulse" />
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className={`text-sm font-semibold mb-1 transition-colors duration-300 ${
                    isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs transition-colors duration-300 ${
                    isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
              
              {index < totalSteps - 1 && (
                <div className={`flex-shrink-0 w-12 h-0.5 mx-4 transition-colors duration-300 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

const defaultCVData: CVData = {
  personal: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
    photo: "",
    title: "",
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certificates: [],
  projects: [],
};

export default function PersistentCVBuilder() {
  // Persistence hooks
  const { cvData, saveCVProgress, lastSaved } = useCVProgress();
  const { paymentStatus, markAsPaid, canDownloadCV } = usePaymentStatus();
  
  // Local state
  const [currentStep, setCurrentStep] = useState(0);
  const [localCVData, setLocalCVData] = useState<CVData>(defaultCVData);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  // Initialize local state from saved data
  useEffect(() => {
    if (cvData) {
      setLocalCVData({
        ...defaultCVData,
        ...cvData,
        personal: { ...defaultCVData.personal, ...cvData.personalInfo },
      });
    }
  }, [cvData]);

  // Auto-save with debounce
  const { isAutoSaving } = useAutoSave(
    localCVData,
    (data) => saveCVProgress(data),
    2000
  );

  const steps = [
    {
      title: "Personal Info",
      icon: User,
      description: "Basic details",
    },
    {
      title: "Experience", 
      icon: Briefcase,
      description: "Work history",
    },
    {
      title: "Customize",
      icon: Palette,
      description: "Design & style",
    },
    {
      title: "Preview",
      icon: FileText,
      description: "Final review",
    },
  ];

  const handleUpdateCVData = useCallback((updates: Partial<CVData>) => {
    setLocalCVData(prev => ({ ...prev, ...updates }));
  }, []);

  const handlePersonalInfoUpdate = useCallback((personalInfo: CVData['personalInfo']) => {
    handleUpdateCVData({ personalInfo });
  }, [handleUpdateCVData]);

  const handleWorkExperienceUpdate = useCallback((workExperience: CVData['workExperience']) => {
    handleUpdateCVData({ workExperience });
  }, [handleUpdateCVData]);

  const handleEducationUpdate = useCallback((education: CVData['education']) => {
    handleUpdateCVData({ education });
  }, [handleUpdateCVData]);

  const handleSkillsUpdate = useCallback((skills: CVData['skills']) => {
    handleUpdateCVData({ skills });
  }, [handleUpdateCVData]);

  const handleConfigUpdate = useCallback((config: CVConfig) => {
    handleUpdateCVData({ config });
  }, [handleUpdateCVData]);

  const handleTemplateSelect = useCallback((template: CVTemplate) => {
    handleUpdateCVData({ template });
  }, [handleUpdateCVData]);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDownloadClick = () => {
    if (!canDownloadCV) {
      setShowPaywall(true);
    } else {
      // Handle actual download
      console.log('Download CV');
    }
  };

  const handlePaymentClick = async () => {
    setIsPaymentLoading(true);
    try {
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      markAsPaid(`payment_${Date.now()}`);
      setShowPaywall(false);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  if (showPaywall) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => setShowPaywall(false)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to CV Builder
          </button>
        </div>
        <Paywall 
          onPaymentClick={handlePaymentClick}
          isLoading={isPaymentLoading}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with auto-save status */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CV Builder</h1>
          <p className="text-gray-600 mt-2">Create your professional CV in minutes</p>
        </div>
        <div className="flex items-center gap-4">
          <AutoSaveStatus isAutoSaving={isAutoSaving} lastSaved={lastSaved} />
          <button
            onClick={handleDownloadClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              canDownloadCV 
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {canDownloadCV ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {canDownloadCV ? 'Download PDF' : 'Unlock Download'}
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <StepProgress
        currentStep={currentStep}
        totalSteps={steps.length}
        steps={steps}
      />

      {/* Content based on current step */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Panel - Form */}
        <div className="space-y-8">
          {currentStep === 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={localCVData.personalInfo.firstName}
                      onChange={(e) => handlePersonalInfoUpdate({
                        ...localCVData.personalInfo,
                        firstName: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={localCVData.personalInfo.lastName}
                      onChange={(e) => handlePersonalInfoUpdate({
                        ...localCVData.personalInfo,
                        lastName: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={localCVData.personalInfo.email}
                    onChange={(e) => handlePersonalInfoUpdate({
                      ...localCVData.personalInfo,
                      email: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={localCVData.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoUpdate({
                      ...localCVData.personalInfo,
                      phone: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+44 7XXX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={localCVData.personalInfo.address}
                    onChange={(e) => handlePersonalInfoUpdate({
                      ...localCVData.personalInfo,
                      address: e.target.value
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="London, UK"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={localCVData.personalInfo.linkedIn}
                      onChange={(e) => handlePersonalInfoUpdate({
                        ...localCVData.personalInfo,
                        linkedIn: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website/Portfolio
                    </label>
                    <input
                      type="url"
                      value={localCVData.personalInfo.website}
                      onChange={(e) => handlePersonalInfoUpdate({
                        ...localCVData.personalInfo,
                        website: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="johndoe.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <LuxuryExperienceEditor
              workExperience={localCVData.workExperience}
              education={localCVData.education}
              onWorkExperienceUpdate={handleWorkExperienceUpdate}
              onEducationUpdate={handleEducationUpdate}
            />
          )}

          {currentStep === 2 && (
            <>
              <TemplateGallery
                selectedTemplate={localCVData.template}
                onTemplateSelect={handleTemplateSelect}
              />
              <CustomizationControls
                config={localCVData.config}
                onConfigUpdate={handleConfigUpdate}
              />
              <LuxurySkillsManager
                skills={localCVData.skills}
                onSkillsUpdate={handleSkillsUpdate}
              />
            </>
          )}

          {currentStep === 3 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your CV</h2>
              <p className="text-gray-600 mb-6">
                Your CV looks great! Review the preview on the right and make any final adjustments.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Save className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Auto-saved!</h3>
                    <p className="text-sm text-blue-700">
                      Your progress is automatically saved to your browser. You can continue editing anytime.
                    </p>
                  </div>
                </div>
              </div>

              {!canDownloadCV && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-900">Unlock Premium Features</h3>
                      <p className="text-sm text-amber-700 mb-3">
                        Get PDF downloads, AI optimization, and more for just £5.99 one-time payment.
                      </p>
                      <button
                        onClick={() => setShowPaywall(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        Unlock Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleNextStep}
              disabled={currentStep === steps.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:sticky lg:top-8 lg:h-fit">
          <LiveCVPreview cvData={localCVData} />
        </div>
      </div>
    </div>
  );
}