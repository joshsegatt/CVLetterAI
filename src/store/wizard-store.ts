import { create } from "zustand";

export type WizardStep = "personal" | "experience" | "education" | "skills" | "summary" | "template" | "review";

interface WizardState {
  currentStep: WizardStep;
  documentId: string | null;
  data: {
    personalInfo: {
      name: string;
      email: string;
      phone: string;
      location: string;
      photo?: string;
    };
    experience: any[];
    education: any[];
    skills: string[];
    summary: string;
    targetJobDescription: string;
  };
  isAuditSidebarOpen: boolean;
  audit: {
    score: number;
    suggestions: string[];
    passed: boolean;
  } | null;
  selectedTemplate: string;
  documentType: "resume" | "cover_letter";
  focusedSection: string | null;
  
  // Actions
  setStep: (step: WizardStep) => void;
  setAudit: (audit: WizardState["audit"]) => void;
  setTemplate: (templateId: string) => void;
  setAuditSidebarOpen: (isOpen: boolean) => void;
  updatePersonalInfo: (info: Partial<WizardState["data"]["personalInfo"]>) => void;
  updateExperience: (experience: any[]) => void;
  updateEducation: (education: any[]) => void;
  updateSkills: (skills: string[]) => void;
  updateSummary: (summary: string) => void;
  updateTargetJobDescription: (jd: string) => void;
  setFocusedSection: (section: string | null) => void;
  setDocumentType: (type: "resume" | "cover_letter") => void;
  
  // Navigation
  nextStep: () => void;
  prevStep: () => void;
}

const STEPS: WizardStep[] = ["personal", "experience", "education", "skills", "summary", "review"];

export const useWizardStore = create<WizardState>((set, get) => ({
  currentStep: "personal",
  documentId: null,
  data: {
    personalInfo: { name: "", email: "", phone: "", location: "" },
    experience: [],
    education: [],
    skills: [],
    summary: "",
    targetJobDescription: "",
  },
  isAuditSidebarOpen: false,

  audit: null,
  selectedTemplate: "executive",
  documentType: "resume",
  focusedSection: null,

  setStep: (step) => set({ currentStep: step }),

  setAudit: (audit) => set({ audit }),

  setTemplate: (templateId) => set({ selectedTemplate: templateId }),

  setAuditSidebarOpen: (isOpen) => set({ isAuditSidebarOpen: isOpen }),

  updatePersonalInfo: (info) => set((state) => ({
    data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } }
  })),

  updateExperience: (experience) => set((state) => ({
    data: { ...state.data, experience }
  })),

  updateEducation: (education) => set((state) => ({
    data: { ...state.data, education }
  })),

  updateSkills: (skills) => set((state) => ({
    data: { ...state.data, skills }
  })),

  updateSummary: (summary) => set((state) => ({
    data: { ...state.data, summary }
  })),

  updateTargetJobDescription: (targetJobDescription) => set((state) => ({
    data: { ...state.data, targetJobDescription }
  })),

  setFocusedSection: (section) => set({ focusedSection: section }),

  setDocumentType: (type) => set({ documentType: type }),

  nextStep: () => {
    const { currentStep } = get();
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      set({ currentStep: STEPS[idx + 1] });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) {
      set({ currentStep: STEPS[idx - 1] });
    }
  },
}));
