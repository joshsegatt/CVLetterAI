'use client';

import React from 'react';
import { 
  FileText, 
  PenTool, 
  MessageSquare, 
  Search, 
  Lightbulb, 
  Target, 
  Star, 
  Briefcase 
} from 'lucide-react';

interface PromptButton {
  id: string;
  label: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'cv' | 'letter' | 'interview' | 'general';
}

const promptButtons: PromptButton[] = [
  {
    id: 'summarize-cv',
    label: 'Summarize CV',
    prompt: 'Please analyze and summarize the key points from my CV, highlighting strengths and areas for improvement.',
    icon: FileText,
    category: 'cv'
  },
  {
    id: 'improve-writing',
    label: 'Improve Writing',
    prompt: 'Help me improve the writing and structure of my professional documents. Make them more impactful and ATS-friendly.',
    icon: PenTool,
    category: 'general'
  },
  {
    id: 'cv-bullets',
    label: 'CV Bullet Points',
    prompt: 'Generate powerful CV bullet points for my work experience that demonstrate impact and achievements using action verbs and metrics.',
    icon: Target,
    category: 'cv'
  },
  {
    id: 'cover-letter',
    label: 'Cover Letter',
    prompt: 'Help me write a compelling cover letter for a job application that highlights my relevant skills and experience.',
    icon: MessageSquare,
    category: 'letter'
  },
  {
    id: 'interview-prep',
    label: 'Interview Prep',
    prompt: 'Prepare me for a job interview by providing common questions and suggested answers based on my background.',
    icon: Briefcase,
    category: 'interview'
  },
  {
    id: 'linkedin-summary',
    label: 'LinkedIn Summary',
    prompt: 'Create a professional LinkedIn summary that showcases my expertise and attracts recruiters in my field.',
    icon: Star,
    category: 'general'
  },
  {
    id: 'salary-negotiation',
    label: 'Salary Tips',
    prompt: 'Provide guidance on salary negotiation strategies and help me prepare for compensation discussions.',
    icon: Lightbulb,
    category: 'interview'
  },
  {
    id: 'job-search',
    label: 'Job Search Strategy',
    prompt: 'Help me develop an effective job search strategy and identify the best opportunities in my field.',
    icon: Search,
    category: 'general'
  }
];

interface StaticPromptsProps {
  onPromptSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function StaticPrompts({ onPromptSelect, disabled = false }: StaticPromptsProps) {
  const categories = {
    cv: 'CV & Resume',
    letter: 'Cover Letters',
    interview: 'Interviews',
    general: 'Career Tips'
  };

  const categoryColors = {
    cv: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
    letter: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
    interview: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
    general: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
  };

  const iconColors = {
    cv: 'text-blue-600',
    letter: 'text-purple-600', 
    interview: 'text-emerald-600',
    general: 'text-amber-600'
  };

  const groupedPrompts = promptButtons.reduce((acc, prompt) => {
    if (!acc[prompt.category]) {
      acc[prompt.category] = [];
    }
    acc[prompt.category].push(prompt);
    return acc;
  }, {} as Record<string, PromptButton[]>);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Start Prompts</h3>
        <p className="text-sm text-gray-600">Click any prompt to get started instantly</p>
      </div>

      {Object.entries(groupedPrompts).map(([category, prompts]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 px-1">
            {categories[category as keyof typeof categories]}
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {prompts.map((prompt) => {
              const IconComponent = prompt.icon;
              return (
                <button
                  key={prompt.id}
                  onClick={() => onPromptSelect(prompt.prompt)}
                  disabled={disabled}
                  className={`
                    p-4 rounded-xl border text-left transition-all duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:shadow-md active:scale-95
                    ${categoryColors[prompt.category]}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${prompt.category === 'cv' ? 'bg-blue-100' : 
                        prompt.category === 'letter' ? 'bg-purple-100' :
                        prompt.category === 'interview' ? 'bg-emerald-100' : 'bg-amber-100'}
                    `}>
                      <IconComponent className={`w-5 h-5 ${iconColors[prompt.category]}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1">
                        {prompt.label}
                      </div>
                      <div className="text-xs opacity-75 line-clamp-2">
                        {prompt.prompt.length > 80 
                          ? `${prompt.prompt.substring(0, 80)}...` 
                          : prompt.prompt}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}