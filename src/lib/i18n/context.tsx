'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Language, TranslationKeys } from './types';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from './config';
import { getTranslations, getNestedTranslation } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationKeys;
  translate: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<TranslationKeys>(getTranslations(DEFAULT_LANGUAGE));

  // Load language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      if (savedLanguage && savedLanguage !== language) {
        setLanguageState(savedLanguage);
        setTranslations(getTranslations(savedLanguage));
      }
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    setTranslations(getTranslations(newLanguage));
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    }
  };

  const translate = (key: string): string => {
    return getNestedTranslation(translations, key);
  };

  const value = {
    language,
    setLanguage,
    t: translations,
    translate,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Convenience hook for just getting translations
export function useTranslations() {
  const { t, translate } = useI18n();
  return { t, translate };
}