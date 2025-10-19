"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Skill } from "../../types/builder";

interface SkillsManagerProps {
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
}

const SKILL_CATEGORIES = {
  'Technical': {
    icon: '💻',
    color: 'from-blue-500 to-cyan-500',
    suggestions: ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB']
  },
  'Soft': {
    icon: '🤝',
    color: 'from-green-500 to-emerald-500',
    suggestions: ['Leadership', 'Communication', 'Problem Solving', 'Team Management', 'Project Management', 'Strategic Planning', 'Critical Thinking', 'Adaptability']
  },
  'Language': {
    icon: '🌍',
    color: 'from-purple-500 to-violet-500',
    suggestions: ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Mandarin', 'Japanese', 'Italian']
  },
  'Tool': {
    icon: '🛠️',
    color: 'from-orange-500 to-red-500',
    suggestions: ['Figma', 'Adobe Creative Suite', 'Jira', 'Slack', 'Microsoft Office', 'Google Workspace', 'Salesforce', 'HubSpot']
  }
} as const;

const SKILL_LEVELS = [
  { value: 'Beginner', label: 'Beginner', percentage: 25, color: 'bg-red-500' },
  { value: 'Intermediate', label: 'Intermediate', percentage: 50, color: 'bg-yellow-500' },
  { value: 'Advanced', label: 'Advanced', percentage: 75, color: 'bg-blue-500' },
  { value: 'Expert', label: 'Expert', percentage: 100, color: 'bg-green-500' },
  { value: 'Native', label: 'Native', percentage: 100, color: 'bg-purple-500' },
  { value: 'Fluent', label: 'Fluent', percentage: 90, color: 'bg-indigo-500' },
  { value: 'Conversational', label: 'Conversational', percentage: 60, color: 'bg-teal-500' },
  { value: 'Basic', label: 'Basic', percentage: 30, color: 'bg-gray-500' },
] as const;

export default function LuxurySkillsManager({ skills, onSkillsChange }: SkillsManagerProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Technical');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState<{
    name: string;
    level: Skill['level'];
    category: Skill['category'];
  }>({
    name: '',
    level: 'Intermediate',
    category: 'Technical'
  });

  const skillsByCategory = useMemo(() => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
  }, [skills]);

  const addSkill = useCallback(() => {
    if (!newSkill.name.trim()) return;
    
    const skill: Skill = {
      id: Date.now().toString(),
      ...newSkill,
      name: newSkill.name.trim()
    };
    
    onSkillsChange([...skills, skill]);
    setNewSkill({ name: '', level: 'Intermediate', category: 'Technical' });
    setShowAddForm(false);
  }, [newSkill, skills, onSkillsChange]);

  const updateSkill = useCallback((id: string, updates: Partial<Skill>) => {
    const updated = skills.map(skill => 
      skill.id === id ? { ...skill, ...updates } : skill
    );
    onSkillsChange(updated);
  }, [skills, onSkillsChange]);

  const removeSkill = useCallback((id: string) => {
    const updated = skills.filter(skill => skill.id !== id);
    onSkillsChange(updated);
  }, [skills, onSkillsChange]);

  const addSuggestedSkill = useCallback((skillName: string, category: keyof typeof SKILL_CATEGORIES) => {
    const skill: Skill = {
      id: Date.now().toString(),
      name: skillName,
      level: 'Intermediate',
      category: category as Skill['category']
    };
    onSkillsChange([...skills, skill]);
  }, [skills, onSkillsChange]);

  const getSkillLevel = (level: string) => {
    return SKILL_LEVELS.find(l => l.value === level) || SKILL_LEVELS[1];
  };

  const renderSkillRadar = () => {
    const categories = Object.keys(SKILL_CATEGORIES);
    const categorySkills = categories.map(category => {
      const categorySkillsList = skillsByCategory[category] || [];
      const averageLevel = categorySkillsList.length > 0 
        ? categorySkillsList.reduce((sum, skill) => sum + getSkillLevel(skill.level).percentage, 0) / categorySkillsList.length
        : 0;
      return { category, level: averageLevel };
    });

    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4">Skills Overview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categorySkills.map(({ category, level }) => {
            const categoryInfo = SKILL_CATEGORIES[category as keyof typeof SKILL_CATEGORIES];
            return (
              <div key={category} className="text-center">
                <div className="text-2xl mb-2">{categoryInfo.icon}</div>
                <div className="text-sm text-gray-300 mb-2">{category}</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${categoryInfo.color}`}
                    style={{ width: `${level}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400">{Math.round(level)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">Professional Skills</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          + Add Skill
        </button>
      </div>

      {/* Skills Overview Radar */}
      {skills.length > 0 && renderSkillRadar()}

      {/* Add Skill Form */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4">Add New Skill</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skill Name
              </label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., React, Leadership, Spanish"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value as Skill['category'] }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {Object.keys(SKILL_CATEGORIES).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Proficiency Level
              </label>
              <select
                value={newSkill.level}
                onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value as Skill['level'] }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {SKILL_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addSkill}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Add Skill
            </button>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        {Object.entries(SKILL_CATEGORIES).map(([category, info]) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
              activeCategory === category
                ? `bg-gradient-to-r ${info.color} text-white shadow-lg`
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <span className="text-lg">{info.icon}</span>
            <span className="font-medium">{category}</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {skillsByCategory[category]?.length || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="space-y-4">
        {/* Current Category Skills */}
        {skillsByCategory[activeCategory] && skillsByCategory[activeCategory].length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillsByCategory[activeCategory].map((skill) => {
              const levelInfo = getSkillLevel(skill.level);
              const categoryInfo = SKILL_CATEGORIES[skill.category as keyof typeof SKILL_CATEGORIES];
              
              return (
                <div
                  key={skill.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{categoryInfo.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white">{skill.name}</h4>
                        <p className="text-sm text-gray-400">{skill.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-gray-300">Proficiency Level</label>
                        <span className="text-xs text-gray-400">{levelInfo.percentage}%</span>
                      </div>
                      <select
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, { level: e.target.value as Skill['level'] })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {SKILL_LEVELS.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${levelInfo.color} transition-all duration-300`}
                        style={{ width: `${levelInfo.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">
              {SKILL_CATEGORIES[activeCategory as keyof typeof SKILL_CATEGORIES].icon}
            </div>
            <h4 className="text-lg font-medium text-gray-300 mb-2">
              No {activeCategory.toLowerCase()} skills added yet
            </h4>
            <p className="text-gray-500 mb-6">
              Add your {activeCategory.toLowerCase()} skills to showcase your expertise
            </p>
            
            {/* Skill Suggestions */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-gray-400 mb-3">Quick add suggestions:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SKILL_CATEGORIES[activeCategory as keyof typeof SKILL_CATEGORIES].suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => addSuggestedSkill(suggestion, activeCategory as keyof typeof SKILL_CATEGORIES)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-sm rounded-full transition-colors border border-gray-600 hover:border-gray-500"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Skills Summary */}
      {skills.length > 0 && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Skills Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{skills.length}</div>
              <div className="text-sm text-gray-400">Total Skills</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {skills.filter(s => s.level === 'Expert' || s.level === 'Native').length}
              </div>
              <div className="text-sm text-gray-400">Expert Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {Object.keys(skillsByCategory).length}
              </div>
              <div className="text-sm text-gray-400">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">
                {Math.round(skills.reduce((sum, skill) => sum + getSkillLevel(skill.level).percentage, 0) / skills.length || 0)}%
              </div>
              <div className="text-sm text-gray-400">Avg. Proficiency</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}