"use client";

import React, { useState, useEffect, useRef } from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { Paywall } from "../../components/payments/Paywall";
import { usePaymentStatus } from "../../lib/persistence/localStorage";
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
  Clock,
  Paperclip,
  MoreHorizontal,
  Lock
} from "lucide-react";
import { useChatAssistant } from "../../features/chat/hooks/useChatAssistant";
import { FreeChatTokenManager, estimateTokens } from "../../lib/freeChatTokens";
import { PDFUploader } from "../../components/chat/PDFUploader";
import { StaticPrompts } from "../../components/chat/StaticPrompts";
import Link from "next/link";

// Essential prompts for sidebar
const sidebarPrompts = [
  "Help me write CV bullet points",
  "Create a professional cover letter", 
  "Prepare for job interview",
  "Review and improve my CV",
  "Write LinkedIn summary",
  "Salary negotiation tips"
];

// Conversation history (simulated - in real app would come from database)
const conversationHistory = [
  { id: '1', title: 'CV Review for Tech Role', date: '2h', preview: 'Can you help me improve my software engineer CV?' },
  { id: '2', title: 'Cover Letter Help', date: '1d', preview: 'I need a cover letter for a startup position...' },
  { id: '3', title: 'Interview Preparation', date: '2d', preview: 'How should I prepare for a PM interview?' },
  { id: '4', title: 'LinkedIn Profile', date: '3d', preview: 'Help me write a professional summary...' },
  { id: '5', title: 'Salary Discussion', date: '5d', preview: 'Tips for negotiating a higher salary?' }
];

export default function ChatPage() {
  const { messages, input, setInput, isLoading, streamAssistantReply } = useChatAssistant();
  const { paymentStatus, markAsPaid, canUseChat } = usePaymentStatus();
  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [sessionId, setSessionId] = useState<string>('');
  const [freeUsage, setFreeUsage] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string } | null>(null);
  const [showPaywall, setShowPaywall] = useState(!canUseChat);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

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



  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handlePaymentClick = async () => {
    setIsPaymentLoading(true);
    try {
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      markAsPaid(`payment_${Date.now()}`);
      setShowPaywall(false);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  // Show paywall if user hasn't paid
  if (showPaywall) {
    return (
      <PublicLayout
        title="AI Career Assistant"
        description="Unlock AI-powered career assistance with premium features"
      >
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get personalized advice for your CV, cover letters, interview preparation, and job search strategy.
              </p>
            </div>
            
            <Paywall 
              onPaymentClick={handlePaymentClick}
              isLoading={isPaymentLoading}
            />
            
            <div className="mt-8 text-center">
              <Link href="/cv-builder" className="text-blue-600 hover:text-blue-700 font-medium">
                ← Back to CV Builder
              </Link>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout
      title="AI Career Assistant"
      description="Get personalized advice for your CV, cover letters, and job search strategy"
    >
      <div className="flex h-screen bg-gray-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Sidebar - Modern GPT/Copilot Style */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`} style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex h-full flex-col">
            
            {/* Sidebar Header - Compact */}
            <div className="flex h-14 items-center justify-between px-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">CVLetterAI</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* New Chat Button - Clean */}
            <div className="p-3 border-b border-gray-100">
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all group border border-gray-200 hover:border-gray-300">
                <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">New chat</span>
              </button>
            </div>

            {/* Quick Prompts - Minimal */}
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="space-y-1">
                {sidebarPrompts.slice(0, 3).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(prompt);
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Conversations - Compact */}
            <div className="flex-1 overflow-y-auto px-3 py-2">
              <div className="space-y-0.5">
                {conversationHistory.map((conv) => (
                  <div key={conv.id} className="group">
                    <button className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate mb-0.5">{conv.title}</div>
                          <div className="text-xs text-gray-500">{conv.date}</div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all">
                          <MoreHorizontal className="h-3 w-3" />
                        </button>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Status - Minimal */}
            <div className="p-3 border-t border-gray-100">
              {userPlan === 'free' && freeUsage && (
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Free messages</span>
                    <span className="font-medium">{freeUsage.messagesRemaining} left</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full transition-all" 
                      style={{ width: `${(freeUsage.messagesRemaining / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {userPlan === 'free' && (
                <Link 
                  href="/linkedin-boost" 
                  className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all text-white text-sm group"
                >
                  <Crown className="h-4 w-4" />
                  <span className="font-medium">Try LinkedIn Boost</span>
                  <ChevronRight className="h-3 w-3 ml-auto group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
              
              {userPlan === 'pro' && (
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <Crown className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">Pro Active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Chat Area - GPT/Copilot Style */}
        <div className="flex-1 flex flex-col bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {/* Top Bar - Minimal */}
          <div className="h-12 border-b border-gray-100 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-all"
              >
                <Menu className="h-4 w-4" />
              </button>
              <h1 className="text-sm font-medium text-gray-900">CVLetterAI Assistant</h1>
            </div>
            
            {userPlan === 'free' && freeUsage && (
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  {freeUsage.messagesRemaining} messages left
                </div>
                <Link 
                  href="/linkedin-boost" 
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-md font-medium transition-all"
                >
                  Try LinkedIn Boost
                </Link>
              </div>
            )}
          </div>

          {/* Chat Messages - Clean & Minimal */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 py-6">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center max-w-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-600 mb-8">I can help with CVs, cover letters, interviews, and career advice.</p>
                    
                    {/* Quick action buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {sidebarPrompts.slice(0, 4).map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => setInput(prompt)}
                          className="p-4 text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl transition-all group"
                        >
                          <div className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {prompt}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {userPlan === 'free' && freeUsage && (
                      <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{freeUsage.messagesRemaining} free messages remaining</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {messages.map((message) => (
                    <div key={message.id} className="group">
                      <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                        </div>
                        
                        {/* Message Content */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {message.role === 'user' ? 'You' : 'CVLetterAI'}
                            </span>
                          </div>
                          
                          <div className="prose prose-sm max-w-none">
                            <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="group">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <span className="text-sm font-semibold text-gray-900">CVLetterAI</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
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

          {/* Input Area - GPT/Copilot Style */}
          <div className="border-t border-gray-100 bg-white p-4" style={{ paddingBottom: `calc(1rem + env(safe-area-inset-bottom))` }}>
            <div className="max-w-3xl mx-auto">
              
              {/* Uploaded File Display */}
              {uploadedFile && (
                <div className="mb-3 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-blue-900">{uploadedFile.name}</div>
                    <div className="text-xs text-blue-600">Attached for analysis</div>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Message Input */}
              <div className="relative">
                <div className="flex items-end gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-300 focus-within:bg-white transition-all">
                  
                  {/* PDF Upload Button */}
                  <div className="flex-shrink-0">
                    <PDFUploader 
                      onFileUpload={handleFileUpload}
                      disabled={isLoading}
                    />
                  </div>
                  
                  {/* Text Input */}
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                        e.preventDefault();
                        handleSendMessage(input);
                      }
                    }}
                    placeholder="Message CVLetterAI..."
                    className="flex-1 bg-transparent resize-none border-none outline-none text-gray-900 placeholder-gray-500 text-sm py-1 max-h-32"
                    disabled={isLoading}
                    rows={1}
                    style={{ minHeight: '24px' }}
                  />
                  
                  {/* Send Button */}
                  <button
                    onClick={() => handleSendMessage(input)}
                    disabled={!input.trim() || isLoading}
                    className="flex-shrink-0 w-8 h-8 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 text-white rounded-lg flex items-center justify-center transition-all"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Footer Info */}
                <div className="mt-2 text-xs text-gray-500 text-center">
                  CVLetterAI can make mistakes. Check important info.
                </div>
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