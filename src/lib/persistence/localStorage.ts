/**
 * Local Storage Persistence System for CVLetterAI
 * Saves user progress automatically without requiring login
 */

import { useEffect, useState, useCallback } from 'react';

// Definir as chaves únicas para localStorage
export const STORAGE_KEYS = {
  CV_PROGRESS: 'cvletterai-cv-progress',
  LETTER_PROGRESS: 'cvletterai-letter-progress',
  USER_PREFERENCES: 'cvletterai-user-preferences',
  PAYMENT_STATUS: 'cvletterai-payment-status',
  SESSION_ID: 'cvletterai-session-id',
} as const;

// Tipos para os dados salvos
export interface CVProgress {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    linkedIn: string;
    website: string;
  };
  workExperience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
  languages: Array<{
    id: string;
    name: string;
    level: 'basic' | 'conversational' | 'fluent' | 'native';
  }>;
  template: string;
  colorScheme: string;
  lastSaved: string;
  version: number;
}

export interface LetterProgress {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  jobDetails: {
    jobTitle: string;
    company: string;
    jobDescription: string;
  };
  content: {
    introduction: string;
    body: string;
    conclusion: string;
  };
  template: string;
  lastSaved: string;
  version: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  autoSave: boolean;
  notifications: boolean;
}

export interface PaymentStatus {
  hasPaid: boolean;
  paymentId?: string;
  paymentDate?: string;
  features: {
    cvDownload: boolean;
    letterDownload: boolean;
    chatAccess: boolean;
  };
  sessionId: string;
}

// Hook para localStorage seguro
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(defaultValue);

  // Carregar do localStorage na inicialização
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        setValue(parsed);
      }
    } catch (error) {
      console.warn(`Failed to load from localStorage key "${key}":`, error);
    }
  }, [key]);

  // Função para salvar no localStorage
  const saveValue = useCallback((newValue: T | ((prev: T) => T)) => {
    try {
      const valueToSave = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(value)
        : newValue;
      
      setValue(valueToSave);
      localStorage.setItem(key, JSON.stringify(valueToSave));
    } catch (error) {
      console.error(`Failed to save to localStorage key "${key}":`, error);
    }
  }, [key, value]);

  // Função para limpar
  const clearValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setValue(defaultValue);
    } catch (error) {
      console.error(`Failed to clear localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [value, saveValue, clearValue];
}

// Hook específico para progresso do CV
export function useCVProgress() {
  const defaultCV: CVProgress = {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      linkedIn: '',
      website: '',
    },
    workExperience: [],
    education: [],
    skills: [],
    languages: [],
    template: 'modern',
    colorScheme: 'blue',
    lastSaved: new Date().toISOString(),
    version: 1,
  };

  const [cvData, setCvData, clearCvData] = useLocalStorage(STORAGE_KEYS.CV_PROGRESS, defaultCV);

  // Auto-save com debounce
  const saveCVProgress = useCallback((updates: Partial<CVProgress>) => {
    setCvData(prev => ({
      ...prev,
      ...updates,
      lastSaved: new Date().toISOString(),
      version: prev.version + 1,
    }));
  }, [setCvData]);

  return {
    cvData,
    saveCVProgress,
    clearCvData,
    lastSaved: cvData.lastSaved,
  };
}

// Hook específico para progresso da Letter
export function useLetterProgress() {
  const defaultLetter: LetterProgress = {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
    },
    jobDetails: {
      jobTitle: '',
      company: '',
      jobDescription: '',
    },
    content: {
      introduction: '',
      body: '',
      conclusion: '',
    },
    template: 'professional',
    lastSaved: new Date().toISOString(),
    version: 1,
  };

  const [letterData, setLetterData, clearLetterData] = useLocalStorage(STORAGE_KEYS.LETTER_PROGRESS, defaultLetter);

  const saveLetterProgress = useCallback((updates: Partial<LetterProgress>) => {
    setLetterData(prev => ({
      ...prev,
      ...updates,
      lastSaved: new Date().toISOString(),
      version: prev.version + 1,
    }));
  }, [setLetterData]);

  return {
    letterData,
    saveLetterProgress,
    clearLetterData,
    lastSaved: letterData.lastSaved,
  };
}

// Hook para status de pagamento
export function usePaymentStatus() {
  const defaultPayment: PaymentStatus = {
    hasPaid: false,
    features: {
      cvDownload: false,
      letterDownload: false,
      chatAccess: false,
    },
    sessionId: generateSessionId(),
  };

  const [paymentStatus, setPaymentStatus, clearPaymentStatus] = useLocalStorage(STORAGE_KEYS.PAYMENT_STATUS, defaultPayment);

  const markAsPaid = useCallback((paymentId: string) => {
    setPaymentStatus(prev => ({
      ...prev,
      hasPaid: true,
      paymentId,
      paymentDate: new Date().toISOString(),
      features: {
        cvDownload: true,
        letterDownload: true,
        chatAccess: true,
      },
    }));
  }, [setPaymentStatus]);

  const resetPayment = useCallback(() => {
    clearPaymentStatus();
  }, [clearPaymentStatus]);

  return {
    paymentStatus,
    markAsPaid,
    resetPayment,
    hasPaid: paymentStatus.hasPaid,
    canDownloadCV: paymentStatus.features.cvDownload,
    canDownloadLetter: paymentStatus.features.letterDownload,
    canUseChat: paymentStatus.features.chatAccess,
  };
}

// Hook para auto-save com debounce
export function useAutoSave<T>(
  data: T,
  saveFunction: (data: T) => void,
  delay: number = 2000
) {
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  useEffect(() => {
    setIsAutoSaving(true);
    const timeoutId = setTimeout(() => {
      saveFunction(data);
      setIsAutoSaving(false);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      setIsAutoSaving(false);
    };
  }, [data, saveFunction, delay]);

  return { isAutoSaving };
}

// Utilitários
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Função para exportar todos os dados salvos (backup)
export function exportUserData() {
  const data = {
    cvProgress: localStorage.getItem(STORAGE_KEYS.CV_PROGRESS),
    letterProgress: localStorage.getItem(STORAGE_KEYS.LETTER_PROGRESS),
    userPreferences: localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES),
    paymentStatus: localStorage.getItem(STORAGE_KEYS.PAYMENT_STATUS),
    exportDate: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `cvletterai-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}

// Função para importar dados de backup
export function importUserData(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.cvProgress) {
          localStorage.setItem(STORAGE_KEYS.CV_PROGRESS, data.cvProgress);
        }
        if (data.letterProgress) {
          localStorage.setItem(STORAGE_KEYS.LETTER_PROGRESS, data.letterProgress);
        }
        if (data.userPreferences) {
          localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, data.userPreferences);
        }
        if (data.paymentStatus) {
          localStorage.setItem(STORAGE_KEYS.PAYMENT_STATUS, data.paymentStatus);
        }
        
        resolve(true);
      } catch (error) {
        console.error('Failed to import user data:', error);
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
}

// Utilitário para formatar última data de salvamento
export function formatLastSaved(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'Saved just now';
  if (diff < 3600000) return `Saved ${Math.floor(diff / 60000)} minutes ago`;
  if (diff < 86400000) return `Saved ${Math.floor(diff / 3600000)} hours ago`;
  return `Saved on ${date.toLocaleDateString()}`;
}