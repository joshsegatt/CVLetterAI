"use client";

import React, { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { ExperienceItem } from "../../types/builder";

interface ExperienceEditorProps {
  experiences: ExperienceItem[];
  onExperiencesChange: (experiences: ExperienceItem[]) => void;
}

const ACHIEVEMENT_SUGGESTIONS = {
  "Software Engineer": [
    "Led development of microservices architecture serving 1M+ users",
    "Improved application performance by 40% through code optimization",
    "Mentored 5+ junior developers and established coding best practices",
    "Reduced deployment time by 60% implementing CI/CD pipelines",
    "Designed and implemented scalable APIs handling 10K+ requests/minute"
  ],
  "Product Manager": [
    "Launched 3 major product features increasing user engagement by 35%",
    "Managed cross-functional team of 12 members across engineering and design",
    "Reduced customer churn by 25% through data-driven product improvements",
    "Conducted 50+ user interviews to validate product-market fit",
    "Increased revenue by $2M through strategic product positioning"
  ],
  "Marketing Manager": [
    "Increased brand awareness by 45% through integrated marketing campaigns",
    "Generated $500K in qualified leads through content marketing strategy",
    "Managed marketing budget of $1M+ with 25% improvement in ROI",
    "Built social media following from 5K to 50K+ across all platforms",
    "Launched successful product campaigns resulting in 30% sales increase"
  ],
  "Sales Manager": [
    "Exceeded sales targets by 150% for three consecutive quarters",
    "Built and managed sales team of 15+ representatives",
    "Increased customer retention rate from 70% to 90%",
    "Closed $5M+ in new business deals within first year",
    "Implemented CRM system improving sales efficiency by 40%"
  ]
};

export default function LuxuryExperienceEditor({ experiences, onExperiencesChange }: ExperienceEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [showSuggestions, setShowSuggestions] = useState<{ [key: number]: boolean }>({});

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(experiences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onExperiencesChange(items);
  }, [experiences, onExperiencesChange]);

  const addExperience = useCallback(() => {
    const newExperience: ExperienceItem = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""]
    };
    onExperiencesChange([...experiences, newExperience]);
    setExpandedIndex(experiences.length);
  }, [experiences, onExperiencesChange]);

  const updateExperience = useCallback((index: number, field: keyof ExperienceItem, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    onExperiencesChange(updated);
  }, [experiences, onExperiencesChange]);

  const addAchievement = useCallback((index: number) => {
    const updated = [...experiences];
    updated[index].description = [...updated[index].description, ""];
    onExperiencesChange(updated);
  }, [experiences, onExperiencesChange]);

  const updateAchievement = useCallback((expIndex: number, achIndex: number, value: string) => {
    const updated = [...experiences];
    updated[expIndex].description[achIndex] = value;
    onExperiencesChange(updated);
  }, [experiences, onExperiencesChange]);

  const removeAchievement = useCallback((expIndex: number, achIndex: number) => {
    const updated = [...experiences];
    updated[expIndex].description = updated[expIndex].description.filter((_: string, i: number) => i !== achIndex);
    onExperiencesChange(updated);
  }, [experiences, onExperiencesChange]);

  const getSuggestions = (position: string) => {
    const key = Object.keys(ACHIEVEMENT_SUGGESTIONS).find(role => 
      position.toLowerCase().includes(role.toLowerCase().split(' ')[0])
    );
    return key ? ACHIEVEMENT_SUGGESTIONS[key as keyof typeof ACHIEVEMENT_SUGGESTIONS] : [];
  };

  const applySuggestion = (expIndex: number, suggestion: string) => {
    const updated = [...experiences];
    const emptyIndex = updated[expIndex].description.findIndex((desc: string) => desc === "");
    if (emptyIndex >= 0) {
      updated[expIndex].description[emptyIndex] = suggestion;
    } else {
      updated[expIndex].description.push(suggestion);
    }
    onExperiencesChange(updated);
    setShowSuggestions(prev => ({ ...prev, [expIndex]: false }));
  };

  const removeExperience = useCallback((index: number) => {
    const updated = experiences.filter((_, i) => i !== index);
    onExperiencesChange(updated);
    if (expandedIndex === index) setExpandedIndex(null);
  }, [experiences, onExperiencesChange, expandedIndex]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Professional Experience</h3>
        <button
          onClick={addExperience}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          + Add Experience
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="experiences">
          {(provided: DroppableProvided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {experiences.map((experience, index) => (
                <Draggable key={experience.id} draggableId={experience.id} index={index}>
                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-gray-800 rounded-xl border border-gray-700 transition-all duration-300 ${
                        snapshot.isDragging ? 'shadow-2xl scale-105' : 'hover:border-gray-600'
                      }`}
                    >
                      {/* Header */}
                      <div
                        className="p-6 cursor-pointer"
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div 
                              {...provided.dragHandleProps}
                              className="text-gray-400 hover:text-white cursor-grab"
                            >
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M7 2a2 2 0 00-2 2v1a1 1 0 001 1h4a1 1 0 001-1V4a2 2 0 00-2-2H7zM6 6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2H6z"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-white">
                                {experience.position || "New Position"}
                              </h4>
                              <p className="text-gray-300">
                                {experience.company || "Company Name"} • {experience.location || "Location"}
                              </p>
                              <p className="text-sm text-gray-400">
                                {experience.startDate} - {experience.current ? "Present" : experience.endDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeExperience(index);
                              }}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                              </svg>
                            </button>
                            <svg 
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                expandedIndex === index ? 'rotate-180' : ''
                              }`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedIndex === index && (
                        <div className="px-6 pb-6 border-t border-gray-700">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Position Title
                                </label>
                                <input
                                  type="text"
                                  value={experience.position}
                                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                  placeholder="e.g., Senior Software Engineer"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Company
                                </label>
                                <input
                                  type="text"
                                  value={experience.company}
                                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                  placeholder="e.g., Microsoft Corporation"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Location
                                </label>
                                <input
                                  type="text"
                                  value={experience.location}
                                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                  placeholder="e.g., San Francisco, CA"
                                />
                              </div>
                            </div>

                            {/* Dates */}
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  Start Date
                                </label>
                                <input
                                  type="text"
                                  value={experience.startDate}
                                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                  placeholder="e.g., Jan 2020"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                  End Date
                                </label>
                                <input
                                  type="text"
                                  value={experience.endDate}
                                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                  disabled={experience.current}
                                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                                  placeholder="e.g., Dec 2022"
                                />
                              </div>

                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`current-${index}`}
                                  checked={experience.current}
                                  onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                />
                                <label 
                                  htmlFor={`current-${index}`}
                                  className="ml-2 text-sm text-gray-300"
                                >
                                  I currently work here
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Achievements */}
                          <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                              <label className="block text-sm font-medium text-gray-300">
                                Key Achievements & Responsibilities
                              </label>
                              <div className="flex space-x-2">
                                {getSuggestions(experience.position).length > 0 && (
                                  <button
                                    onClick={() => setShowSuggestions(prev => ({ 
                                      ...prev, 
                                      [index]: !prev[index] 
                                    }))}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                                  >
                                    💡 AI Suggestions
                                  </button>
                                )}
                                <button
                                  onClick={() => addAchievement(index)}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                                >
                                  + Add Achievement
                                </button>
                              </div>
                            </div>

                            {/* AI Suggestions */}
                            {showSuggestions[index] && getSuggestions(experience.position).length > 0 && (
                              <div className="mb-4 p-4 bg-purple-900/30 border border-purple-600/50 rounded-lg">
                                <h4 className="text-sm font-semibold text-purple-300 mb-3">
                                  AI-Powered Achievement Suggestions for {experience.position}
                                </h4>
                                <div className="grid grid-cols-1 gap-2">
                                  {getSuggestions(experience.position).map((suggestion, suggestionIndex) => (
                                    <button
                                      key={suggestionIndex}
                                      onClick={() => applySuggestion(index, suggestion)}
                                      className="text-left p-3 text-sm text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-700 hover:border-gray-600"
                                    >
                                      • {suggestion}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Achievement List */}
                            <div className="space-y-3">
                              {experience.description.map((achievement: string, achIndex: number) => (
                                <div key={achIndex} className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                                  <textarea
                                    value={achievement}
                                    onChange={(e) => updateAchievement(index, achIndex, e.target.value)}
                                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                                    placeholder="Describe a key achievement or responsibility..."
                                    rows={2}
                                  />
                                  <button
                                    onClick={() => removeAchievement(index, achIndex)}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                                  >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {experiences.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No experience added yet</h3>
          <p className="text-gray-500 mb-4">Start building your professional timeline</p>
          <button
            onClick={addExperience}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Add Your First Experience
          </button>
        </div>
      )}
    </div>
  );
}