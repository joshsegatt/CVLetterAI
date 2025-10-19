import { en } from './translations/en';
import { pt } from './translations/pt';
import { es } from './translations/es';
import type { Language, TranslationKeys } from './types';
import { DEFAULT_LANGUAGE } from './config';

const translations: Record<Language, TranslationKeys> = {
  en,
  pt,
  es,
  // Fallback for incomplete translations
  fr: en, // TODO: Add French translations
  de: en, // TODO: Add German translations
  it: en, // TODO: Add Italian translations
};

export function getTranslations(language: Language): TranslationKeys {
  return translations[language] || translations[DEFAULT_LANGUAGE];
}

export function getNestedTranslation(
  translations: TranslationKeys,
  key: string
): string {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}
