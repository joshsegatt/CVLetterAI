'use client';

import { useState, useEffect } from 'react';
import type { Language } from '@/lib/i18n/types';
import { CHAT_LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE } from '@/lib/i18n/config';

export function useChatLanguage() {
  const [chatLanguage, setChatLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  // Load chat language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChatLanguage = localStorage.getItem(CHAT_LANGUAGE_STORAGE_KEY) as Language;
      if (savedChatLanguage && savedChatLanguage !== chatLanguage) {
        setChatLanguageState(savedChatLanguage);
      }
    }
  }, []);

  const setChatLanguage = (newLanguage: Language) => {
    setChatLanguageState(newLanguage);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(CHAT_LANGUAGE_STORAGE_KEY, newLanguage);
    }
  };

  return {
    chatLanguage,
    setChatLanguage,
  };
}
