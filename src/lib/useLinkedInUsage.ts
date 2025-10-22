import { useState, useEffect } from 'react';

interface LinkedInUsage {
  generationsToday: number;
  totalGenerations: number;
  lastGenerationDate: string;
  daysUsed: number;
  firstUseDate: string;
}

const LINKEDIN_USAGE_KEY = 'linkedin_boost_usage';

export const useLinkedInUsage = () => {
  const [usage, setUsage] = useState<LinkedInUsage>({
    generationsToday: 0,
    totalGenerations: 0,
    lastGenerationDate: '',
    daysUsed: 0,
    firstUseDate: ''
  });

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = () => {
    try {
      const stored = localStorage.getItem(LINKEDIN_USAGE_KEY);
      if (stored) {
        const parsedUsage = JSON.parse(stored);
        
        // Reset daily count if it's a new day
        const today = new Date().toDateString();
        if (parsedUsage.lastGenerationDate !== today) {
          parsedUsage.generationsToday = 0;
        }
        
        setUsage(parsedUsage);
      }
    } catch (error) {
      console.error('Error loading LinkedIn usage:', error);
    }
  };

  const incrementUsage = () => {
    const today = new Date().toDateString();
    const now = new Date().toISOString();
    
    setUsage(prev => {
      const newUsage = {
        ...prev,
        generationsToday: prev.lastGenerationDate === today ? prev.generationsToday + 1 : 1,
        totalGenerations: prev.totalGenerations + 1,
        lastGenerationDate: today,
        daysUsed: prev.firstUseDate ? prev.daysUsed + (prev.lastGenerationDate !== today ? 1 : 0) : 1,
        firstUseDate: prev.firstUseDate || now
      };
      
      // Save to localStorage
      localStorage.setItem(LINKEDIN_USAGE_KEY, JSON.stringify(newUsage));
      
      return newUsage;
    });
  };

  const resetUsage = () => {
    const resetUsage = {
      generationsToday: 0,
      totalGenerations: 0,
      lastGenerationDate: '',
      daysUsed: 0,
      firstUseDate: ''
    };
    
    setUsage(resetUsage);
    localStorage.removeItem(LINKEDIN_USAGE_KEY);
  };

  return {
    usage,
    incrementUsage,
    resetUsage,
    canGenerateToday: usage.generationsToday < 10, // Future limit
    isFirstTime: usage.totalGenerations === 0
  };
};