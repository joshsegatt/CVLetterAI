"use client";

import { Button } from "../ui/Button";

export type TemplateSelectorOnSelect = (id: string) => void;

export interface TemplateItem {
  id: string;
  title: string;
  description?: string;
}

const DEFAULT_CV_TEMPLATES: TemplateItem[] = [
  { 
    id: "modern", 
    title: "Modern Professional", 
    description: "Contemporary design with clean lines and modern typography" 
  },
  { 
    id: "elegant", 
    title: "Elegant Luxury", 
    description: "Sophisticated design with gold accents and serif fonts" 
  },
  { 
    id: "executive", 
    title: "Executive Elite", 
    description: "Premium corporate design with luxury elements" 
  },
];

const DEFAULT_LETTER_TEMPLATES: TemplateItem[] = [
  { 
    id: "modern", 
    title: "Modern Business", 
    description: "Professional letter design with contemporary styling" 
  },
  { 
    id: "elegant", 
    title: "Elegant Formal", 
    description: "Sophisticated letter with ornamental design elements" 
  },
  { 
    id: "executive", 
    title: "Executive Premium", 
    description: "Luxury business correspondence template" 
  },
];

interface TemplateSelectorProps {
  templates?: TemplateItem[];
  onSelect?: TemplateSelectorOnSelect;
  type?: 'cv' | 'letter';
}

export default function TemplateSelector({ 
  templates, 
  onSelect, 
  type = 'cv' 
}: TemplateSelectorProps) {
  const defaultTemplates = templates || (type === 'cv' ? DEFAULT_CV_TEMPLATES : DEFAULT_LETTER_TEMPLATES);
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {defaultTemplates.map((template) => (
        <article
          key={template.id}
          className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
        >
          {/* Preview Area */}
          <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative overflow-hidden">
            {/* Template Preview Mock */}
            <div className="h-full w-full bg-white shadow-lg rounded-lg p-4 relative">
              {/* Header simulation */}
              <div className={`h-20 rounded-t-lg mb-4 ${
                template.id === 'modern' ? 'bg-gradient-to-r from-slate-800 to-slate-600' :
                template.id === 'elegant' ? 'bg-gradient-to-r from-gray-900 to-black' :
                'bg-gradient-to-r from-gray-800 to-gray-900'
              }`}>
                <div className="p-3">
                  <div className="h-3 w-24 bg-white/80 rounded mb-2"></div>
                  <div className="h-2 w-16 bg-white/60 rounded"></div>
                </div>
              </div>
              
              {/* Content simulation */}
              <div className="space-y-3">
                <div className="h-2 w-full bg-gray-300 rounded"></div>
                <div className="h-2 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-2 w-1/2 bg-gray-300 rounded"></div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="h-2 w-full bg-gray-200 rounded"></div>
                  <div className="h-2 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
              
              {/* Accent elements */}
              {template.id === 'elegant' && (
                <div className="absolute top-4 right-4 w-4 h-4 border-2 border-yellow-600 rotate-45"></div>
              )}
              {template.id === 'executive' && (
                <div className="absolute bottom-4 left-4 w-6 h-px bg-yellow-600"></div>
              )}
            </div>
            
            {/* Premium badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              PREMIUM
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <header className="space-y-3 mb-6">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {template.title}
              </h3>
              {template.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {template.description}
                </p>
              )}
            </header>
            
            <Button
              size="sm"
              intent="primary"
              onClick={() => onSelect?.(template.id)}
              className="w-full group-hover:scale-105 transition-transform duration-200"
            >
              Select Template
            </Button>
          </div>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </article>
      ))}
    </div>
  );
}
