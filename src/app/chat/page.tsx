"use client";

import React, { useState, useEffect } from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { Send, Sparkles, User, Crown, Lock, Zap } from "lucide-react";
import { useChatAssistant } from "../../features/chat/hooks/useChatAssistant";
import { FreeChatTokenManager, createFreeUsageResponse, estimateTokens } from "../../lib/freeChatTokens";
import Link from "next/link";

export default function ChatPage() {
  const { messages, input, setInput, isLoading, streamAssistantReply } = useChatAssistant();
  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [sessionId, setSessionId] = useState<string>('');
  const [freeUsage, setFreeUsage] = useState<any>(null);

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
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">

          {/* Free Plan Usage Info */}
          {userPlan === 'free' && freeUsage && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Free Plan Active</p>
                    <p className="text-gray-300 text-sm">
                      {freeUsage.messagesRemaining} messages • {freeUsage.tokensRemaining} tokens remaining today
                    </p>
                  </div>
                </div>
                <Link 
                  href="/pricing?highlight=pro" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Crown className="h-4 w-4" />
                  Upgrade £5.99
                </Link>
              </div>
            </div>
          )}

          {/* Plan Status Banner */}
          {userPlan === 'free' && !freeUsage && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Free Plan - Limited Access</p>
                    <p className="text-gray-300 text-sm">Upgrade to Pro for unlimited Super AI conversations</p>
                  </div>
                </div>
                <Link 
                  href="/pricing?highlight=pro" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Crown className="h-4 w-4" />
                  Upgrade £5.99
                </Link>
              </div>
            </div>
          )}

          {userPlan === 'pro' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Pro Plan Active</p>
                  <p className="text-gray-300 text-sm">Unlimited Super AI conversations with advanced features</p>
                </div>
              </div>
            </div>
          )}

          {userPlan === 'enterprise' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-900/50 to-orange-900/50 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="text-white font-medium">Enterprise Plan Active</p>
                  <p className="text-gray-300 text-sm">Full access to all features including team management and API</p>
                </div>
              </div>
            </div>
          )}

          {/* Chat Container - ChatGPT Style */}
          <div className="w-full max-w-4xl mx-auto min-h-screen flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-400 text-lg">How can I help you today?</p>
                    {userPlan === 'free' && freeUsage && (
                      <p className="text-sm text-gray-500 mt-2">
                        {freeUsage.messagesRemaining} free messages remaining today
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`py-6 px-4 ${
                    message.role === 'user' 
                      ? 'bg-transparent' 
                      : 'bg-white/[0.02] border-t border-white/5'
                  }`}
                >
                  <div className="max-w-3xl mx-auto flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-purple-600' 
                        : 'bg-gradient-to-br from-green-500 to-emerald-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="py-6 px-4 bg-white/[0.02] border-t border-white/5">
                  <div className="max-w-3xl mx-auto flex gap-4">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input - Fixed at bottom like ChatGPT */}
            <div className="sticky bottom-0 bg-gray-900/90 backdrop-blur-sm border-t border-white/10 p-4">
              <div className="max-w-3xl mx-auto">
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleSendMessage(input)}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  CVLetterAI can make mistakes. Check important info.
                  {userPlan === 'free' && freeUsage && (
                    <span className="ml-2">• {freeUsage.messagesRemaining} messages left today</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400">
              💡 <strong>Try asking:</strong> "Help me write bullet points for my software engineer role" • "Create a cover letter for a marketing position" • "Prepare me for a product manager interview"
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}