import type { LanguageConfig, TranslationKeys } from './types';

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '��'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹'
  }
];

export const DEFAULT_LANGUAGE = 'en' as const;

/**
 * Detects the browser language and returns a supported language code
 * Falls back to English UK if the browser language is not supported
 */
export function detectBrowserLanguage(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  // Get browser language preferences
  const browserLanguages = navigator.languages || [navigator.language];
  const supportedCodes = SUPPORTED_LANGUAGES.map(lang => lang.code);

  // Check each browser language preference
  for (const browserLang of browserLanguages) {
    // Extract just the language code (e.g., 'pt' from 'pt-BR')
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // If we support this language, use it
    if (supportedCodes.includes(langCode as any)) {
      return langCode;
    }
  }

  // Default to English UK if no supported language found
  return DEFAULT_LANGUAGE;
}

export const LANGUAGE_STORAGE_KEY = 'cvletterai-language';
export const CHAT_LANGUAGE_STORAGE_KEY = 'cvletterai-chat-language';
