"use client";

import React, { useState, useCallback } from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { useI18n } from "../../lib/i18n/context";
import { Upload, FileText, CheckCircle, AlertCircle, Download, Sparkles, Target, TrendingUp } from "lucide-react";

interface AnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  optimizedSections: {
    personalStatement: string;
    experience: string[];
    skills: string[];
  };
}

export default function CVAnalysisPage() {
  const { translate } = useI18n();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setUploadedFile(pdfFile);
      setError('');
    } else {
      setError('Please upload a PDF file only');
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setError('');
    } else {
      setError('Please select a PDF file only');
    }
  }, []);

  const analyzeCV = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setError('');

    try {
      // Simulate PDF analysis with local AI
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock analysis result - in real implementation, this would process the PDF
      const mockResult: AnalysisResult = {
        score: 78,
        strengths: [
          "Clear professional experience progression",
          "Relevant technical skills for UK market",
          "Proper UK CV format and length"
        ],
        improvements: [
          "Personal statement needs more impact and specificity",
          "Experience bullets need quantified achievements",
          "Missing keywords for ATS optimization",
          "Skills section could be better organized"
        ],
        suggestions: [
          "Add specific metrics to demonstrate impact (e.g., 'Increased sales by 25%')",
          "Include more UK-specific terminology and certifications",
          "Optimize for Applicant Tracking Systems with industry keywords",
          "Strengthen personal statement with career objectives"
        ],
        optimizedSections: {
          personalStatement: "Dynamic Marketing Professional with 5+ years driving digital growth strategies for UK SMEs. Proven track record of increasing online engagement by 40% and generating £250K+ in qualified leads. Seeking to leverage data-driven marketing expertise to accelerate growth at innovative tech companies.",
          experience: [
            "• Developed and executed integrated digital marketing campaigns, resulting in 35% increase in qualified leads and £180K additional revenue",
            "• Led cross-functional team of 6 marketing specialists to launch 12 successful product campaigns across UK and EU markets",
            "• Implemented marketing automation workflows that improved lead qualification efficiency by 45% and reduced cost-per-acquisition by 30%"
          ],
          skills: [
            "Digital Marketing Strategy & Execution",
            "Google Analytics, AdWords & Facebook Business Manager",
            "Marketing Automation (HubSpot, Marketo)",
            "SEO/SEM & Content Strategy",
            "Data Analysis & Performance Optimization",
            "Team Leadership & Cross-functional Collaboration"
          ]
        }
      };

      setAnalysisResult(mockResult);
    } catch (err) {
      setError('Failed to analyze CV. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadOptimizedCV = () => {
    // Mock download functionality
    const element = document.createElement('a');
    const file = new Blob(['Optimized CV content would be here...'], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = 'optimized-cv.pdf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetAnalysis = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setError('');
  };

  return (
    <PublicLayout
      title="CV Analysis & Optimization"
      description="Upload your CV for instant AI-powered analysis and optimization for the UK job market"
    >
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl">
                <Target className="h-8 w-8 text-white" />
              </div>
              <span className="inline-block bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-medium">
                🎯 Análise IA Profissional
              </span>
            </div>
          </div>

          {!analysisResult ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="glass-panel border-white/10 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Upload className="h-6 w-6" />
                  Upload Your CV
                </h2>

                {!uploadedFile ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                      isDragOver
                        ? 'border-purple-400 bg-purple-500/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl">
                        <FileText className="h-12 w-12 text-purple-400" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Drag & Drop your CV here
                        </h3>
                        <p className="text-gray-400 mb-4">
                          Or click to browse files (PDF only, max 10MB)
                        </p>
                      </div>

                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileInput}
                        className="hidden"
                        id="cv-upload"
                      />
                      <label
                        htmlFor="cv-upload"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                      >
                        Choose File
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-green-400" />
                        <div>
                          <h3 className="font-semibold text-white">{uploadedFile.name}</h3>
                          <p className="text-sm text-gray-400">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={analyzeCV}
                        disabled={isAnalyzing}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5" />
                            Analyze CV
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={resetAnalysis}
                        className="px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <span className="text-red-400">{error}</span>
                  </div>
                )}
              </div>

              {/* Features Section */}
              <div className="glass-panel border-white/10 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">What You'll Get</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">CV Score & Analysis</h3>
                      <p className="text-gray-400">Get an overall score and detailed breakdown of your CV's effectiveness for UK employers.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg">
                      <Target className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">ATS Optimization</h3>
                      <p className="text-gray-400">Ensure your CV passes Applicant Tracking Systems used by UK companies.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg">
                      <Sparkles className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Content Optimization</h3>
                      <p className="text-gray-400">Get rewritten sections with improved impact and UK market alignment.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-lg">
                      <Download className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Optimized CV Download</h3>
                      <p className="text-gray-400">Download your improved CV ready for UK job applications.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-lg">
                  <p className="text-sm text-purple-300">
                    <strong>100% Secure:</strong> Your CV is processed locally and never stored on our servers.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Analysis Results Section
            <div className="space-y-8">
              {/* Score Header */}
              <div className="glass-panel border-white/10 p-8 rounded-2xl text-center">
                <div className="inline-flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{analysisResult.score}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">%</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <h2 className="text-3xl font-bold text-white">CV Analysis Complete!</h2>
                    <p className="text-gray-300">Your CV has good potential with room for improvement</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={downloadOptimizedCV}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download Optimized CV
                  </button>
                  
                  <button
                    onClick={resetAnalysis}
                    className="border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Analyze Another CV
                  </button>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Strengths */}
                <div className="glass-panel border-white/10 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="glass-panel border-white/10 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-orange-400" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Optimized Content */}
              <div className="glass-panel border-white/10 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                  Optimized Content Suggestions
                </h3>

                <div className="space-y-6">
                  {/* Personal Statement */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">✨ Improved Personal Statement</h4>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <p className="text-gray-300 leading-relaxed">{analysisResult.optimizedSections.personalStatement}</p>
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">💼 Enhanced Experience Bullets</h4>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <ul className="space-y-2">
                        {analysisResult.optimizedSections.experience.map((bullet, index) => (
                          <li key={index} className="text-gray-300">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">🎯 Optimized Skills Section</h4>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {analysisResult.optimizedSections.skills.map((skill, index) => (
                          <div key={index} className="text-gray-300">• {skill}</div>
                        ))}
                      </div>
                    </div>
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