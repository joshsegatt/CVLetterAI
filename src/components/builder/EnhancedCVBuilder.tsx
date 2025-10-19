"use client";

import React, { useState, useCallback } from "react";
import { CVData, CVTemplate, CVConfig } from "../../types/builder";
import TemplateGallery from "./TemplateGallery";
import ProfessionalPhotoUploader from "./ProfessionalPhotoUploader";
import CustomizationControls from "./CustomizationControls";
import LuxuryExperienceEditor from "./LuxuryExperienceEditor";
import LuxurySkillsManager from "./LuxurySkillsManager";
import LiveCVPreview from "./LiveCVPreview";
import PDFDownloadButton from "../shared/PDFDownloadButton";
import { AuthRequiredModal } from "../shared/AuthRequiredModal";
import { usePublicAccess } from "../../lib/auth/publicAccess";
import { User, Briefcase, Palette, FileText, Download, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

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
                  <h3 className={`text-sm font-semibold mb-1 ${
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
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
          Step <span className="font-semibold text-blue-600">{currentStep + 1}</span> of {totalSteps}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function EnhancedCVBuilder() {
  const { canDownload, requireAuthForAction } = usePublicAccess();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('professional-linkedin');
  const [selectedColorScheme, setSelectedColorScheme] = useState('corporate-blue');
  const [showPhoto, setShowPhoto] = useState(true);
  
  const steps = [
    { 
      title: "Personal Info", 
      icon: User, 
      description: "Basic details & summary" 
    },
    { 
      title: "Experience", 
      icon: Briefcase, 
      description: "Work history & skills" 
    },
    { 
      title: "Template", 
      icon: Palette, 
      description: "Design & styling" 
    },
    { 
      title: "Review", 
      icon: FileText, 
      description: "Final preview" 
    },
    { 
      title: "Download", 
      icon: Download, 
      description: "Get your CV" 
    }
  ];

  const [cvData, setCvData] = useState<CVData>({
    personal: {
      firstName: "John",
      lastName: "Doe", 
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      linkedin: "linkedin.com/in/johndoe",
      summary: "Experienced professional with a proven track record in delivering high-quality solutions and leading cross-functional teams to achieve business objectives.",
      title: "Senior Software Engineer"
    },
    experience: [
      {
        id: "1",
        company: "Tech Corp",
        position: "Senior Software Engineer",
        location: "New York, NY",
        startDate: "2020",
        endDate: "Present",
        current: true,
        description: [
          "Led development of microservices architecture serving 1M+ users",
          "Mentored junior developers and improved team productivity by 40%",
          "Implemented CI/CD pipelines reducing deployment time by 60%"
        ]
      },
      {
        id: "2", 
        company: "StartupCo",
        position: "Full Stack Developer",
        location: "San Francisco, CA",
        startDate: "2018",
        endDate: "2020",
        current: false,
        description: [
          "Built responsive web applications using React and Node.js",
          "Collaborated with design team to implement pixel-perfect UIs",
          "Optimized database queries improving performance by 50%"
        ]
      }
    ],
    education: [
      {
        id: "1",
        institution: "Stanford University",
        degree: "Master of Science",
        field: "Computer Science",
        startDate: "2016",
        endDate: "2018",
        current: false,
        gpa: "3.8"
      }
    ],
    skills: [
      { id: "1", name: "JavaScript", level: "Expert", category: "Technical" },
      { id: "2", name: "React", level: "Expert", category: "Technical" },
      { id: "3", name: "Node.js", level: "Advanced", category: "Technical" },
      { id: "4", name: "Python", level: "Advanced", category: "Technical" },
      { id: "5", name: "Leadership", level: "Advanced", category: "Soft" },
      { id: "6", name: "Team Management", level: "Advanced", category: "Soft" }
    ],
    projects: [
      {
        id: "1",
        name: "E-commerce Platform",
        description: "Built a scalable e-commerce platform handling 10K+ transactions daily",
        technologies: ["React", "Node.js", "MongoDB", "AWS"],
        startDate: "2021"
      },
      {
        id: "2",
        name: "Mobile Analytics Dashboard", 
        description: "Created real-time analytics dashboard for mobile app performance",
        technologies: ["Vue.js", "Python", "PostgreSQL", "Docker"],
        startDate: "2020"
      }
    ],
    languages: [
      { id: "1", name: "English", level: "Native" },
      { id: "2", name: "Spanish", level: "Conversational" }
    ],
    certificates: [
      {
        id: "1",
        name: "AWS Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023"
      }
    ]
  });

  const [config, setConfig] = useState<CVConfig>({
    template: 'modern' as CVTemplate,
    primaryColor: '#3B82F6',
    accentColor: '#1E40AF',
    fontFamily: 'Inter',
    fontSize: 'medium',
    spacing: 'normal',
    showPhoto: true,
    highlightSkills: true,
    twoColumn: false,
    sectionIcons: true
  });

  const handleConfigChange = useCallback((updates: Partial<CVConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const handleTemplateSelect = useCallback((template: string, colorScheme: string) => {
    setSelectedTemplate(template);
    setSelectedColorScheme(colorScheme);
  }, []);

  const handlePhotoUpload = useCallback((photoUrl: string) => {
    setCvData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        photo: photoUrl
      }
    }));
  }, []);

  const handlePersonalInfoChange = (field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Personal Information Form */}
            <div className="space-y-8">
              <div className="card">
                <div className="card-body space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                      <p className="text-small text-gray-600">Tell us about yourself</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        value={cvData.personal.firstName}
                        onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                        className="input input-lg"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        value={cvData.personal.lastName}
                        onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                        className="input input-lg"
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        value={cvData.personal.email}
                        onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        className="input input-lg"
                        placeholder="your.email@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        value={cvData.personal.phone}
                        onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        className="input input-lg"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-700">Professional Title</label>
                      <input
                        type="text"
                        value={cvData.personal.title || ''}
                        onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                        className="input input-lg"
                        placeholder="e.g. Senior Software Engineer"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        value={cvData.personal.location}
                        onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                        className="input input-lg"
                        placeholder="City, State/Country"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-700">Professional Summary</label>
                      <textarea
                        value={cvData.personal.summary}
                        onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                        rows={4}
                        className="input input-lg min-h-24"
                        placeholder="Write a compelling summary of your professional experience and key achievements..."
                      />
                      <p className="text-xs text-gray-500">2-3 sentences highlighting your expertise and value proposition</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Photo</h3>
                  <ProfessionalPhotoUploader
                    onPhotoUpload={handlePhotoUpload}
                    currentPhoto={cvData.personal.photo}
                  />
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="lg:sticky lg:top-8">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Live Preview</h3>
                    <div className="badge badge-primary">Real-time</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 overflow-auto max-h-[500px] lg:max-h-[600px]">
                    <div className="flex justify-center">
                      <div className="w-full max-w-[300px]">
                        <LiveCVPreview
                          data={cvData}
                          template={selectedTemplate}
                          colorScheme={selectedColorScheme}
                          scale={0.6}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Changes appear instantly • PDF quality guaranteed
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Experience & Skills Editor */}
            <div className="space-y-8">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Professional Experience</h2>
                      <p className="text-small text-gray-600">Add your work history and achievements</p>
                    </div>
                  </div>
                  <LuxuryExperienceEditor
                    experiences={cvData.experience}
                    onExperiencesChange={(experiences) => setCvData(prev => ({ ...prev, experience: experiences }))}
                  />
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Skills & Expertise</h3>
                  <LuxurySkillsManager
                    skills={cvData.skills}
                    onSkillsChange={(skills) => setCvData(prev => ({ ...prev, skills }))}
                  />
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="lg:sticky lg:top-8">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Live Preview</h3>
                    <div className="badge badge-success">Updated</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 overflow-auto max-h-[500px] lg:max-h-[600px]">
                    <div className="flex justify-center">
                      <div className="w-full max-w-[300px]">
                        <LiveCVPreview
                          data={cvData}
                          template={selectedTemplate}
                          colorScheme={selectedColorScheme}
                          scale={0.6}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Template & Customization */}
            <div className="space-y-8">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Palette className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Choose Your Template</h2>
                      <p className="text-small text-gray-600">Select a professional design that fits your style</p>
                    </div>
                  </div>
                  <TemplateGallery
                    data={cvData}
                    onTemplateSelect={handleTemplateSelect}
                    showPhoto={showPhoto}
                  />
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Customization Options</h3>
                  <CustomizationControls
                    config={config}
                    onConfigChange={handleConfigChange}
                  />
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="lg:sticky lg:top-8">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Live Preview</h3>
                    <div className="badge badge-warning">Customizing</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 overflow-auto max-h-[500px] lg:max-h-[600px]">
                    <div className="flex justify-center">
                      <div className="w-full max-w-[300px]">
                        <LiveCVPreview
                          data={cvData}
                          template={selectedTemplate}
                          colorScheme={selectedColorScheme}
                          scale={0.6}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Review Panel */}
            <div className="space-y-8">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Review Your CV</h2>
                      <p className="text-small text-gray-600">Final check before download</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-subtle rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">CV Summary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{cvData.experience.length}</div>
                          <div className="text-small text-gray-600">Work Experiences</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-emerald-600">{cvData.skills.length}</div>
                          <div className="text-small text-gray-600">Skills Listed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{cvData.education.length}</div>
                          <div className="text-small text-gray-600">Education</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{cvData.projects.length}</div>
                          <div className="text-small text-gray-600">Projects</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-900">Template</div>
                          <div className="text-small text-gray-600 capitalize">
                            {selectedTemplate.replace('-', ' ')}
                          </div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="btn btn-ghost text-blue-600"
                        >
                          Change
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-900">Color Scheme</div>
                          <div className="text-small text-gray-600 capitalize">
                            {selectedColorScheme.replace('-', ' ')}
                          </div>
                        </div>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="btn btn-ghost text-blue-600"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Preview */}
            <div className="lg:sticky lg:top-8">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Final Preview</h3>
                    <div className="badge badge-success">Ready to Download</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 overflow-auto max-h-[500px] lg:max-h-[600px]">
                    <div className="flex justify-center">
                      <div className="w-full max-w-[300px]">
                        <LiveCVPreview
                          data={cvData}
                          template={selectedTemplate}
                          colorScheme={selectedColorScheme}
                          scale={0.6}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <PDFDownloadButton
                      targetId="cv-final-preview"
                      filename={`${cvData.personal.firstName}_${cvData.personal.lastName}_CV.pdf`}
                      className="btn btn-primary w-full btn-lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download CV as PDF
                    </PDFDownloadButton>
                    <p className="text-xs text-gray-500 text-center">
                      High-quality PDF • ATS-friendly format
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center max-w-2xl mx-auto">
            <div className="card">
              <div className="card-body py-16">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Congratulations! 🎉
                </h2>
                <p className="text-body text-gray-600 mb-8">
                  Your professional CV is ready. You can download it now or make additional edits.
                </p>
                
                <div className="space-y-4">
                  <PDFDownloadButton
                    targetId="cv-final-download"
                    filename={`${cvData.personal.firstName}_${cvData.personal.lastName}_CV.pdf`}
                    className="btn btn-primary btn-xl w-full"
                  >
                    <Download className="w-6 h-6 mr-3" />
                    Download Your Professional CV
                  </PDFDownloadButton>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="btn btn-ghost flex-1"
                    >
                      Edit Information
                    </button>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="btn btn-ghost flex-1"
                    >
                      Change Design
                    </button>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <div className="text-small text-gray-600 mb-2">Next Steps:</div>
                  <ul className="text-xs text-gray-500 space-y-1 text-left">
                    <li>• Tailor your CV for each job application</li>
                    <li>• Create matching cover letters</li>
                    <li>• Use our AI chat for interview preparation</li>
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
        
        <div className="min-h-[600px]">
          {renderStepContent()}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="btn btn-ghost btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>
          
          {currentStep < steps.length - 1 && (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              className="btn btn-primary btn-lg"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
      
      <AuthRequiredModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        action="download"
      />
    </div>
  );
}
