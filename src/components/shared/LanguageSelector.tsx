'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/config';
import type { Language } from '@/lib/i18n/types';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export function LanguageSelector({ 
  className = '', 
  showLabel = true, 
  compact = false 
}: LanguageSelectorProps) {
  const { language, setLanguage, translate } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === language);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  if (compact) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex items-center gap-1.5 px-3 py-2.5 text-white/90 hover:text-white transition-all duration-200 font-medium rounded-lg hover:bg-white/8 active:scale-95"
          aria-label="Select language"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-semibold">{currentLanguage?.flag}</span>
          <ChevronDown className={`h-4 w-4 transition-all duration-200 ${isOpen ? 'rotate-180 text-primary-400' : ''}`} />
        </button>

        {isOpen && (
          <div 
            className="absolute top-full right-0 mt-2 w-64 bg-surface-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl animate-fade-in z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-white mb-1">Select Language</h3>
                <p className="text-xs text-surface-400">Choose your preferred language</p>
              </div>
              
              <div className="grid gap-1">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`group flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-500/10 hover:to-primary-600/10 transition-all duration-300 cursor-pointer ${
                      language === lang.code ? 'bg-primary-500/10 ring-1 ring-primary-500/20' : ''
                    }`}
                  >
                    <div className="text-2xl">{lang.flag}</div>
                    <div className="flex-1 text-left">
                      <div className={`font-medium text-sm ${language === lang.code ? 'text-primary-300' : 'text-white group-hover:text-primary-300'} transition-colors`}>
                        {lang.name}
                      </div>
                      <div className={`text-xs ${language === lang.code ? 'text-primary-400/80' : 'text-surface-400 group-hover:text-surface-300'} transition-colors`}>
                        {lang.nativeName}
                      </div>
                    </div>
                    {language === lang.code && (
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {translate('common.language')}
        </label>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{currentLanguage?.flag}</span>
          <div className="text-left">
            <div className="font-medium text-gray-900">{currentLanguage?.name}</div>
            <div className="text-sm text-gray-500">{currentLanguage?.nativeName}</div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl border border-white/20 shadow-xl z-50">
          <div className="py-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                  language === lang.code ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div>
                  <div className="font-medium">{lang.name}</div>
                  <div className="text-sm text-gray-500">{lang.nativeName}</div>
                </div>
                {language === lang.code && (
                  <svg className="w-5 h-5 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}