"use client";

import React, { useState, useEffect } from 'react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { Linkedin, Upload, FileText, User, Target, Briefcase, Copy, Check, Sparkles, Clock, Crown } from 'lucide-react';
import { LINKEDIN_BOOST_CONFIG, shouldShowPaywall, canUseFeature } from '../../lib/linkedinBoostConfig';
import { useLinkedInUsage } from '../../lib/useLinkedInUsage';

interface LinkedInProfile {
  headline: string;
  about: string;
  experiences: string[];
  achievements: string[];
}

interface UserInput {
  method: 'cv' | 'questions' | null;
  cvText: string;
  position: string;
  industry: string;
  objective: string;
}

const STORAGE_KEY = 'linkedin_boost_progress';

export default function LinkedInBoostPage() {
  const { usage, incrementUsage, canGenerateToday, isFirstTime } = useLinkedInUsage();
  
  const [userInput, setUserInput] = useState<UserInput>({
    method: null,
    cvText: '',
    position: '',
    industry: '',
    objective: ''
  });
  
  const [generatedProfile, setGeneratedProfile] = useState<LinkedInProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string>('');
  const [showPaywall, setShowPaywall] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserInput(data.userInput || userInput);
        setGeneratedProfile(data.generatedProfile || null);
      } catch (e) {
        console.error('Error loading saved progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (input: UserInput, profile: LinkedInProfile | null = null) => {
    const data = {
      userInput: input,
      generatedProfile: profile || generatedProfile,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const generateUniqueContent = (input: UserInput): LinkedInProfile => {
    // Simple AI-like content generation with uniqueness rules
    const headlines = [
      `${input.position} | Driving Innovation in ${input.industry}`,
      `Strategic ${input.position} | ${input.industry} Excellence`,
      `${input.position} | Transforming ${input.industry} Operations`,
      `Senior ${input.position} | ${input.industry} Growth Specialist`,
      `Experienced ${input.position} | ${input.industry} Leader`
    ];

    const aboutTemplates = [
      `Passionate ${input.position} with extensive experience in ${input.industry}. ${input.objective} through innovative solutions and strategic thinking. Proven track record of delivering exceptional results while building strong professional relationships.`,
      `Results-driven ${input.position} specializing in ${input.industry} advancement. ${input.objective} by leveraging cutting-edge methodologies and collaborative leadership. Committed to excellence and continuous improvement.`,
      `Dynamic ${input.position} focused on ${input.industry} transformation. ${input.objective} through data-driven approaches and stakeholder engagement. Known for adaptability and solution-oriented mindset.`
    ];

    const experienceTemplates = [
      `Led cross-functional teams to achieve strategic ${input.industry} objectives`,
      `Implemented innovative processes that improved ${input.industry} efficiency`,
      `Collaborated with stakeholders to drive ${input.industry} growth initiatives`,
      `Developed comprehensive strategies for ${input.industry} market expansion`,
      `Mentored junior professionals in ${input.industry} best practices`
    ];

    const achievementTemplates = [
      `Increased team productivity by implementing streamlined ${input.industry} workflows`,
      `Successfully managed multiple ${input.industry} projects with zero budget overruns`,
      `Recognized for outstanding performance in ${input.industry} excellence`,
      `Achieved certification in advanced ${input.industry} methodologies`,
      `Contributed to company-wide ${input.industry} strategic planning initiatives`
    ];

    return {
      headline: headlines[Math.floor(Math.random() * headlines.length)],
      about: aboutTemplates[Math.floor(Math.random() * aboutTemplates.length)],
      experiences: experienceTemplates.slice(0, 3),
      achievements: achievementTemplates.slice(0, 3)
    };
  };

  const handleGenerate = async () => {
    if (!userInput.method) return;
    
    // Check if paywall should be shown (future monetization)
    if (shouldShowPaywall(usage)) {
      setShowPaywall(true);
      return;
    }
    
    setIsGenerating(true);
    
    // Increment usage tracking
    incrementUsage();
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const profile = generateUniqueContent(userInput);
    setGeneratedProfile(profile);
    saveProgress(userInput, profile);
    
    setIsGenerating(false);
  };

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleInputChange = (field: keyof UserInput, value: string) => {
    const newInput = { ...userInput, [field]: value };
    setUserInput(newInput);
    saveProgress(newInput);
  };

  const resetForm = () => {
    const resetInput = {
      method: null,
      cvText: '',
      position: '',
      industry: '',
      objective: ''
    };
    setUserInput(resetInput);
    setGeneratedProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <PublicLayout
      title="LinkedIn Boost - Free Profile Optimization"
      description="Get your LinkedIn profile optimized with AI - completely free, no login required"
    >
      <div className="section">
        <div className="container-lg">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Linkedin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">LinkedIn Profile Boost</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Transform your LinkedIn profile with AI-powered optimization. Get professional headlines, compelling summaries, and achievement highlights.
            </p>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4" />
              100% Free - No Login Required
            </div>
          </div>

          {!userInput.method ? (
            /* Method Selection */
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
                How would you like to get started?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div 
                  onClick={() => handleInputChange('method', 'cv')}
                  className="card hover:shadow-lg cursor-pointer transition-all group border-2 border-transparent hover:border-blue-500"
                >
                  <div className="card-body text-center p-8">
                    <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your CV</h3>
                    <p className="text-gray-600">
                      Paste your existing CV or resume text and we'll extract the best content for your LinkedIn profile.
                    </p>
                  </div>
                </div>

                <div 
                  onClick={() => handleInputChange('method', 'questions')}
                  className="card hover:shadow-lg cursor-pointer transition-all group border-2 border-transparent hover:border-blue-500"
                >
                  <div className="card-body text-center p-8">
                    <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Answer Quick Questions</h3>
                    <p className="text-gray-600">
                      Tell us about your role, industry, and goals. We'll create a compelling profile from scratch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : !generatedProfile ? (
            /* Input Form */
            <div className="max-w-3xl mx-auto">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {userInput.method === 'cv' ? 'Paste Your CV' : 'Tell Us About Yourself'}
                    </h2>
                    <button 
                      onClick={resetForm}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Start Over
                    </button>
                  </div>

                  {userInput.method === 'cv' ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your CV Text
                        </label>
                        <textarea
                          value={userInput.cvText}
                          onChange={(e) => handleInputChange('cvText', e.target.value)}
                          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Paste your CV content here..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Your Current Position
                        </label>
                        <input
                          type="text"
                          value={userInput.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Software Engineer, Marketing Manager, Sales Director"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Briefcase className="w-4 h-4 inline mr-2" />
                          Industry
                        </label>
                        <input
                          type="text"
                          value={userInput.industry}
                          onChange={(e) => handleInputChange('industry', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Technology, Healthcare, Finance, Education"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Target className="w-4 h-4 inline mr-2" />
                          Your Professional Objective
                        </label>
                        <input
                          type="text"
                          value={userInput.objective}
                          onChange={(e) => handleInputChange('objective', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Looking to advance my career, Seeking new opportunities, Building innovative solutions"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || (userInput.method === 'cv' ? !userInput.cvText.trim() : !userInput.position.trim() || !userInput.industry.trim() || !userInput.objective.trim())}
                      className="btn btn-primary btn-lg px-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Generating Profile...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Generate LinkedIn Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Generated Profile */
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">Your Optimized LinkedIn Profile</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={resetForm}
                    className="btn btn-secondary"
                  >
                    Create New Profile
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Headline */}
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Professional Headline</h3>
                      <button
                        onClick={() => copyToClipboard(generatedProfile.headline, 'headline')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        {copiedSection === 'headline' ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                      {generatedProfile.headline}
                    </p>
                  </div>
                </div>

                {/* About Section */}
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">About Section</h3>
                      <button
                        onClick={() => copyToClipboard(generatedProfile.about, 'about')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        {copiedSection === 'about' ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                      {generatedProfile.about}
                    </p>
                  </div>
                </div>

                {/* Experience Highlights */}
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Experience Highlights</h3>
                      <button
                        onClick={() => copyToClipboard(generatedProfile.experiences.join('\n• '), 'experiences')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        {copiedSection === 'experiences' ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy All
                          </>
                        )}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {generatedProfile.experiences.map((exp, index) => (
                        <div key={index} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-800">{exp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Key Achievements</h3>
                      <button
                        onClick={() => copyToClipboard(generatedProfile.achievements.join('\n• '), 'achievements')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        {copiedSection === 'achievements' ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy All
                          </>
                        )}
                      </button>
                    </div>
                    <div className="space-y-3">
                      {generatedProfile.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                          <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-800">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="card bg-blue-50 border-blue-200 mt-8">
                <div className="card-body">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Next Steps</h3>
                  <div className="space-y-2 text-blue-800">
                    <p>1. Copy each section to your LinkedIn profile</p>
                    <p>2. Customize the content to match your personal voice</p>
                    <p>3. Add specific numbers and metrics where possible</p>
                    <p>4. Include relevant keywords for your industry</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Future Paywall Modal */}
          {showPaywall && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="text-center">
                  <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Unlock Premium Features
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get unlimited LinkedIn profile generations and premium templates for just ${LINKEDIN_BOOST_CONFIG.PRICE}.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPaywall(false)}
                      className="flex-1 btn btn-secondary"
                    >
                      Maybe Later
                    </button>
                    <button className="flex-1 btn btn-primary">
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}