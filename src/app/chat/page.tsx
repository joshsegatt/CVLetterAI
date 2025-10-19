"use client";

import React, { useState, useEffect, useRef } from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { 
  Send, 
  Sparkles, 
  User, 
  Crown, 
  Menu, 
  X, 
  Plus, 
  MessageSquare, 
  ChevronRight, 
  Trash2,
  Upload,
  FileText,
  Clock
} from "lucide-react";
import { useChatAssistant } from "../../features/chat/hooks/useChatAssistant";
import { FreeChatTokenManager, estimateTokens } from "../../lib/freeChatTokens";
import { PDFUploader } from "../../components/chat/PDFUploader";
import { StaticPrompts } from "../../components/chat/StaticPrompts";
import Link from "next/link";

// Quick prompt suggestions
const quickPrompts = [
  "Help me write CV bullet points for a software engineer",
  "Create a cover letter for a marketing manager position",
  "Prepare me for a product manager interview",
  "Review my CV and suggest improvements",
  "Write a LinkedIn summary for me",
  "Help me negotiate salary offer"
];

// Conversation history (simulated - in real app would come from database)
const conversationHistory = [
  { id: '1', title: 'CV Review for Tech Role', date: '2 hours ago', preview: 'Can you help me improve my software engineer CV?' },
  { id: '2', title: 'Cover Letter Help', date: 'Yesterday', preview: 'I need a cover letter for a startup position...' },
  { id: '3', title: 'Interview Preparation', date: '2 days ago', preview: 'How should I prepare for a PM interview?' }
];

export default function ChatPage() {
  const { messages, input, setInput, isLoading, streamAssistantReply } = useChatAssistant();
  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [sessionId, setSessionId] = useState<string>('');
  const [freeUsage, setFreeUsage] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string } | null>(null);
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize free session
  useEffect(() => {
    const storedSessionId = localStorage.getItem('cvletterai_free_session');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = FreeChatTokenManager.generateSessionId();
      localStorage.setItem('cvletterai_free_session', newSessionId);
      setSessionId(newSessionId);
    }
    
    // Check URL for plan override
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan') as 'free' | 'pro' | 'enterprise';
    setUserPlan(planParam || 'free');
  }, []);

  // Update usage info when sessionId changes
  useEffect(() => {
    if (sessionId && userPlan === 'free') {
      const usage = FreeChatTokenManager.getUsageInfo(sessionId);
      setFreeUsage(usage);
    }
  }, [sessionId, userPlan]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Hide prompts when conversation starts
  useEffect(() => {
    if (messages.length > 0) {
      setShowPrompts(false);
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    setInput(''); // Clear input immediately
    
    // Prepare the message content, including uploaded PDF if present
    let messageContent = content;
    if (uploadedFile) {
      messageContent = `${content}\n\n[PDF File: ${uploadedFile.name}]\n${uploadedFile.content}`;
    }
    
    // For free users, check token limits and use real AI
    if (userPlan === 'free' && sessionId) {
      const estimatedTokens = estimateTokens(messageContent);
      const canUse = FreeChatTokenManager.canUseTokens(sessionId, estimatedTokens);
      
      if (!canUse.allowed) {
        // Show limit reached message
        alert(`🚫 Daily Free Limit Reached!\n\nMessages remaining: ${canUse.remaining.messages}\nTokens remaining: ${canUse.remaining.tokens}\n\nUpgrade to Pro (£5.99) for unlimited access!`);
        return;
      }
      
      // Update usage
      FreeChatTokenManager.updateSession(sessionId, estimatedTokens);
      setFreeUsage(FreeChatTokenManager.getUsageInfo(sessionId));
      
      // Call real AI for free users
      await streamAssistantReply(messageContent);
      // Clear uploaded file after sending
      setUploadedFile(null);
      return;
    }
    
    // For Pro/Enterprise users, use full AI functionality
    await streamAssistantReply(messageContent);
    // Clear uploaded file after sending
    setUploadedFile(null);
  };

  const handleFileUpload = (content: string, fileName: string) => {
    setUploadedFile({ name: fileName, content });
  };

  const handlePromptSelect = (prompt: string) => {
    setInput(prompt);
    setShowPrompts(false);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <PublicLayout
      title="AI Career Assistant"
      description="Get personalized advice for your CV, cover letters, and job search strategy"
    >
      <div className="flex h-screen bg-white">
        {/* Sidebar - GPT Style */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 bg-gray-950 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">CVLetterAI</h2>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* New Chat Button */}
            <div className="p-4 border-b border-gray-800">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-colors group">
                <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">New conversation</span>
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-4 border-b border-gray-800">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Quick Start</h3>
              <div className="space-y-2">
                {quickPrompts.slice(0, 4).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(prompt);
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left text-xs text-gray-300 hover:text-white hover:bg-gray-800/50 p-3 rounded-lg transition-colors line-clamp-2 border border-gray-800 hover:border-gray-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation History */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent Chats</h3>
              <div className="space-y-1">
                {conversationHistory.map((conv) => (
                  <div key={conv.id} className="group">
                    <button className="w-full text-left p-3 hover:bg-gray-800/50 rounded-lg transition-colors border border-transparent hover:border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-200 truncate mb-1">{conv.title}</h4>
                          <p className="text-xs text-gray-400 mb-1">{conv.date}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">{conv.preview}</p>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all ml-2">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Status in Sidebar */}
            <div className="p-4 border-t border-gray-800">
              {userPlan === 'free' && (
                <Link 
                  href="/pricing" 
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition-all text-white group"
                >
                  <Crown className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <div className="flex-1 text-sm">
                    <div className="font-semibold">Upgrade to Pro</div>
                    <div className="text-xs opacity-90">Unlimited conversations</div>
                  </div>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              
              {userPlan === 'pro' && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
                  <Crown className="h-5 w-5 text-emerald-400" />
                  <div className="text-sm text-emerald-300 font-medium">Pro Plan Active</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area - Redesigned */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Top Bar - Ultra Compact */}
          <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4 bg-white/95 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-sm font-semibold text-gray-900">AI Assistant</h1>
              </div>
            </div>
            
            {/* Compact Plan indicator */}
            {userPlan === 'free' && freeUsage && (
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span className="font-medium">{freeUsage.messagesRemaining} left</span>
                </div>
                <Link 
                  href="/pricing" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                >
                  Upgrade
                </Link>
              </div>
            )}
          </div>

          {/* Main Content - Split Layout */}
          <div className="flex-1 flex overflow-hidden">
            
            {/* Chat Messages Panel - Compact Scrollable */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">AI Career Assistant</h2>
                      <p className="text-sm text-gray-600 mb-6">Choose a prompt or ask me anything about CVs, cover letters, and career advice.</p>
                      
                      {userPlan === 'free' && freeUsage && (
                        <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3 inline-flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">{freeUsage.messagesRemaining} messages remaining today</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={message.id} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-blue-600' 
                            : 'bg-emerald-600'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-900">
                              {message.role === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(new Date())}
                            </span>
                          </div>
                          
                          <div className={`text-sm leading-relaxed rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-blue-50 text-blue-900 border border-blue-100'
                              : 'bg-gray-50 text-gray-900 border border-gray-100'
                          }`}>
                            <div className="whitespace-pre-wrap">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg flex-shrink-0 bg-emerald-600 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-900">AI Assistant</span>
                            <span className="text-xs text-gray-500">typing...</span>
                          </div>
                          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-75"></div>
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-150"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Prompts Panel - Right Side (Desktop) / Full Overlay (Mobile) */}
            {showPrompts && (
              <>
                {/* Desktop Panel */}
                <div className="hidden lg:flex w-80 border-l border-gray-200 bg-gray-50 flex-col">
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
                      <button
                        onClick={() => setShowPrompts(false)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    <StaticPrompts 
                      onPromptSelect={handlePromptSelect}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Mobile Overlay */}
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
                  <div className="w-full bg-white rounded-t-2xl max-h-[80vh] flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                        <button
                          onClick={() => setShowPrompts(false)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4">
                      <StaticPrompts 
                        onPromptSelect={(prompt) => {
                          handlePromptSelect(prompt);
                          setShowPrompts(false);
                        }}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Input Area - Modernized */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="max-w-4xl mx-auto space-y-3">
              
              {/* PDF Upload Section */}
              {!uploadedFile && (
                <div className="mb-3">
                  <PDFUploader 
                    onFileUpload={handleFileUpload}
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Uploaded File Display */}
              {uploadedFile && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-blue-900">{uploadedFile.name}</div>
                    <div className="text-xs text-blue-600">Ready to analyze</div>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="p-1 text-blue-400 hover:text-blue-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Message Input */}
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                      e.preventDefault();
                      handleSendMessage(input);
                    }
                  }}
                  placeholder="Ask me about CVs, cover letters, or upload a PDF to analyze..."
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  disabled={isLoading}
                  rows={2}
                />
                
                <div className="absolute right-2 bottom-2 flex items-center gap-2">
                  {!showPrompts && messages.length > 0 && (
                    <button
                      onClick={() => setShowPrompts(true)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                      title="Show prompts"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleSendMessage(input)}
                    disabled={!input.trim() || isLoading}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Footer Info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Press Enter to send • Shift+Enter for new line</span>
                {userPlan === 'free' && freeUsage && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">{freeUsage.messagesRemaining} left</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </PublicLayout>
  );
}