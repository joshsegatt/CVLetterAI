import React from 'react';
import { CVConfig } from '../../types/builder';

interface ColorOption {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

interface FontOption {
  name: string;
  family: string;
  category: 'modern' | 'classic' | 'creative';
}

interface CustomizationControlsProps {
  config: CVConfig;
  onConfigChange: (updates: Partial<CVConfig>) => void;
}

const colorPalettes: ColorOption[] = [
  {
    name: 'Professional Blue',
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#60a5fa'
  },
  {
    name: 'Executive Black',
    primary: '#1f2937',
    secondary: '#374151',
    accent: '#6b7280'
  },
  {
    name: 'Modern Teal',
    primary: '#0d9488',
    secondary: '#14b8a6',
    accent: '#5eead4'
  },
  {
    name: 'Creative Purple',
    primary: '#7c3aed',
    secondary: '#a855f7',
    accent: '#c084fc'
  },
  {
    name: 'Corporate Green',
    primary: '#059669',
    secondary: '#10b981',
    accent: '#6ee7b7'
  },
  {
    name: 'Premium Gold',
    primary: '#d97706',
    secondary: '#f59e0b',
    accent: '#fbbf24'
  }
];

const fontOptions: FontOption[] = [
  { name: 'Inter (Modern)', family: 'Inter, system-ui, sans-serif', category: 'modern' },
  { name: 'Roboto (Clean)', family: 'Roboto, sans-serif', category: 'modern' },
  { name: 'Times New Roman (Classic)', family: 'Times New Roman, serif', category: 'classic' },
  { name: 'Georgia (Elegant)', family: 'Georgia, serif', category: 'classic' },
  { name: 'Montserrat (Bold)', family: 'Montserrat, sans-serif', category: 'creative' },
  { name: 'Playfair Display (Luxury)', family: 'Playfair Display, serif', category: 'creative' }
];

const spacingOptions = [
  { name: 'Compact', value: 'compact' as const },
  { name: 'Normal', value: 'normal' as const },
  { name: 'Relaxed', value: 'relaxed' as const }
];

const fontSizeOptions = [
  { name: 'Small', value: 'small' as const },
  { name: 'Medium', value: 'medium' as const },
  { name: 'Large', value: 'large' as const }
];

export default function CustomizationControls({ config, onConfigChange }: CustomizationControlsProps) {
  return (
    <div className="space-y-6">
      {/* Color Palette */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">🎨 Paleta de Cores</h3>
        <div className="grid grid-cols-2 gap-3">
          {colorPalettes.map((palette) => (
            <button
              key={palette.name}
              onClick={() => onConfigChange({
                primaryColor: palette.primary,
                accentColor: palette.accent
              })}
              className={`glass-panel border p-3 rounded-lg transition-all hover:scale-105 ${
                config.primaryColor === palette.primary
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex gap-1 mb-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: palette.primary }}
                />
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: palette.secondary }}
                />
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: palette.accent }}
                />
              </div>
              <span className="text-xs text-white font-medium">{palette.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">📝 Tipografia</h3>
        <div className="space-y-3">
          {fontOptions.map((font) => (
            <button
              key={font.name}
              onClick={() => onConfigChange({ fontFamily: font.family })}
              className={`w-full glass-panel border p-3 rounded-lg text-left transition-all hover:scale-105 ${
                config.fontFamily === font.family
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span 
                  className="text-white font-medium"
                  style={{ fontFamily: font.family }}
                >
                  {font.name}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  font.category === 'modern' ? 'bg-blue-500/20 text-blue-300' :
                  font.category === 'classic' ? 'bg-green-500/20 text-green-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>
                  {font.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">📏 Tamanho da Fonte</h3>
        <div className="grid grid-cols-3 gap-2">
          {fontSizeOptions.map((size) => (
            <button
              key={size.value}
              onClick={() => onConfigChange({ fontSize: size.value })}
              className={`glass-panel border p-3 rounded-lg transition-all hover:scale-105 ${
                config.fontSize === size.value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-white text-sm font-medium">{size.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">📐 Espaçamento</h3>
        <div className="grid grid-cols-3 gap-2">
          {spacingOptions.map((spacing) => (
            <button
              key={spacing.value}
              onClick={() => onConfigChange({ spacing: spacing.value })}
              className={`glass-panel border p-3 rounded-lg transition-all hover:scale-105 ${
                config.spacing === spacing.value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-white text-sm font-medium">{spacing.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layout Options */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">🎯 Opções de Layout</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 glass-panel border border-white/10 rounded-lg">
            <span className="text-white font-medium">Mostrar foto</span>
            <input
              type="checkbox"
              checked={config.showPhoto || false}
              onChange={(e) => onConfigChange({ showPhoto: e.target.checked })}
              className="w-5 h-5 rounded border border-white/20 bg-white/10 checked:bg-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 glass-panel border border-white/10 rounded-lg">
            <span className="text-white font-medium">Destacar habilidades</span>
            <input
              type="checkbox"
              checked={config.highlightSkills || false}
              onChange={(e) => onConfigChange({ highlightSkills: e.target.checked })}
              className="w-5 h-5 rounded border border-white/20 bg-white/10 checked:bg-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 glass-panel border border-white/10 rounded-lg">
            <span className="text-white font-medium">Layout de duas colunas</span>
            <input
              type="checkbox"
              checked={config.twoColumn || false}
              onChange={(e) => onConfigChange({ twoColumn: e.target.checked })}
              className="w-5 h-5 rounded border border-white/20 bg-white/10 checked:bg-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 glass-panel border border-white/10 rounded-lg">
            <span className="text-white font-medium">Mostrar ícones de seção</span>
            <input
              type="checkbox"
              checked={config.sectionIcons || false}
              onChange={(e) => onConfigChange({ sectionIcons: e.target.checked })}
              className="w-5 h-5 rounded border border-white/20 bg-white/10 checked:bg-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Section Order */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">📋 Ordem das Seções</h3>
        <div className="space-y-2">
          <div className="text-sm text-gray-400 mb-3">Arraste para reordenar (em desenvolvimento)</div>
          {['Experiência', 'Educação', 'Habilidades', 'Projetos', 'Idiomas', 'Certificados'].map((section, index) => (
            <div key={section} className="flex items-center justify-between p-3 glass-panel border border-white/10 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">{index + 1}</span>
                <span className="text-white font-medium">{section}</span>
              </div>
              <div className="flex gap-2">
                <button className="text-gray-400 hover:text-white">↑</button>
                <button className="text-gray-400 hover:text-white">↓</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">🌈 Cores Personalizadas</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Cor Primária</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => onConfigChange({ primaryColor: e.target.value })}
                className="w-12 h-10 rounded border border-white/20 bg-transparent"
              />
              <input
                type="text"
                value={config.primaryColor}
                onChange={(e) => onConfigChange({ primaryColor: e.target.value })}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="#1e40af"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Cor de Destaque</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={config.accentColor}
                onChange={(e) => onConfigChange({ accentColor: e.target.value })}
                className="w-12 h-10 rounded border border-white/20 bg-transparent"
              />
              <input
                type="text"
                value={config.accentColor}
                onChange={(e) => onConfigChange({ accentColor: e.target.value })}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="#60a5fa"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}