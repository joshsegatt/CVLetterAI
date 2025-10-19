"use client";

import React, { useState, useEffect } from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { Send, Sparkles, User, Crown, Menu, X, Plus, MessageSquare, ChevronRight, Trash2 } from "lucide-react";
import { useChatAssistant } from "../../features/chat/hooks/useChatAssistant";
import { FreeChatTokenManager, estimateTokens } from "../../lib/freeChatTokens";
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

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    setInput(''); // Clear input immediately
    
    // For free users, check token limits and use real AI
    if (userPlan === 'free' && sessionId) {
      const estimatedTokens = estimateTokens(content);
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
      await streamAssistantReply(content);
      return;
    }
    
    // For Pro/Enterprise users, use full AI functionality
    await streamAssistantReply(content);
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

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Top Bar - Compact */}
          <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white/95 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">AI Career Assistant</h1>
                  <p className="text-xs text-gray-500">Powered by advanced AI</p>
                </div>
              </div>
            </div>
            
            {/* Plan indicator in top bar */}
            {userPlan === 'free' && freeUsage && (
              <div className="hidden sm:flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="font-medium">{freeUsage.messagesRemaining} messages left</span>
                </div>
                <Link 
                  href="/pricing" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
                >
                  Upgrade Pro
                </Link>
              </div>
            )}
          </div>

          {/* Messages Area - GPT Style */}
          <div className="flex-1 overflow-y-auto bg-gray-50/30">
            <div className="max-w-4xl mx-auto px-6">
              {messages.length === 0 && (
                <div className="flex items-center justify-center min-h-[70vh]">
                  <div className="text-center max-w-2xl">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-xl shadow-purple-500/25 transform hover:scale-105 transition-transform">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How can I help you today?</h2>
                    <p className="text-lg text-gray-600 mb-12 leading-relaxed">I'm your AI career assistant, here to help with CVs, cover letters, job search, and interview preparation.</p>
                    
                    {/* Quick Start Suggestions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                      {quickPrompts.slice(0, 4).map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => setInput(prompt)}
                          className="p-6 text-left bg-white hover:bg-gray-50 border border-gray-200 hover:border-purple-300 rounded-2xl transition-all text-sm text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-lg group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                              <MessageSquare className="h-5 w-5 text-purple-600" />
                            </div>
                            <span className="font-medium leading-relaxed">{prompt}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {userPlan === 'free' && freeUsage && (
                      <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-2xl p-4 inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">You have {freeUsage.messagesRemaining} free messages remaining today</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`py-8 ${
                    message.role === 'user' 
                      ? 'bg-transparent' 
                      : 'bg-white/50'
                  }`}
                >
                  <div className="flex gap-6 max-w-none">
                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-purple-600 to-purple-700 shadow-purple-500/25' 
                        : 'bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-500/25'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="py-8 bg-white/50">
                  <div className="flex gap-6 max-w-none">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse delay-150"></div>
                        <span className="text-gray-600 ml-2 font-medium">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area - GPT Style */}
          <div className="border-t border-gray-100 bg-white/95 backdrop-blur-sm p-6">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                      e.preventDefault();
                      handleSendMessage(input);
                    }
                  }}
                  placeholder="Message CVLetterAI..."
                  className="w-full bg-white border border-gray-300 rounded-2xl px-6 py-4 pr-16 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-lg font-medium"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-purple-500/25 hover:scale-105"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              
              {/* Compact disclaimer */}
              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
                <span className="font-medium">CVLetterAI can make mistakes. Check important info.</span>
                {userPlan === 'free' && freeUsage && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="font-semibold">{freeUsage.messagesRemaining} messages left</span>
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