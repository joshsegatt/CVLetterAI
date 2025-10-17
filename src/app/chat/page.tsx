"use client";

import React, { useState } from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";

const professionalPrompts = [
  {
    title: "CV Content Writer",
    prompt: "Help me write compelling bullet points for my work experience that highlight achievements and quantifiable results."
  },
  {
    title: "Cover Letter Expert",
    prompt: "Draft a professional cover letter that matches my experience with the job requirements and company culture."
  },
  {
    title: "LinkedIn Profile Optimizer",
    prompt: "Optimize my LinkedIn profile summary and experience descriptions to attract recruiters and showcase my expertise."
  },
  {
    title: "Interview Preparation",
    prompt: "Help me prepare for job interviews by creating answers to common questions based on my background and target role."
  },
  {
    title: "Salary Negotiation",
    prompt: "Advise me on salary negotiation strategies and help me prepare talking points based on my experience and market rates."
  },
  {
    title: "Career Transition Guide",
    prompt: "Guide me through a career transition by identifying transferable skills and creating a strategic career change plan."
  },
  {
    title: "Professional Email Writer",
    prompt: "Help me write professional emails for various business scenarios including follow-ups, networking, and proposals."
  },
  {
    title: "Skills Assessment",
    prompt: "Analyze my current skills and recommend areas for development based on industry trends and career goals."
  }
];

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: Date;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Career Chat',
      messages: [
        {
          id: '1',
          content: 'Hello! I\'m your AI Career Assistant. How can I help you advance your career today?',
          isUser: false,
          timestamp: new Date()
        }
      ],
      lastUpdated: new Date()
    }
  ]);
  
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isGenerating) return;

    setIsGenerating(true);
    
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };

    // Update conversation with user message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, userMessage],
            lastUpdated: new Date()
          }
        : conv
    ));

    setInputMessage('');

    try {
      // Use our local AI instead of external service
      const response = await fetch('/api/ai/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Read streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let aiContent = '';

      // Create AI message placeholder
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: '',
        isUser: false,
        timestamp: new Date()
      };

      // Add empty AI message to start streaming
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, aiMessage],
              lastUpdated: new Date()
            }
          : conv
      ));

      // Read stream chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;
        
        // Update the AI message with accumulated content
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversationId 
            ? { 
                ...conv, 
                messages: conv.messages.map(msg => 
                  msg.id === aiMessage.id 
                    ? { ...msg, content: aiContent }
                    : msg
                ),
                lastUpdated: new Date()
              }
            : conv
        ));
      }

    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "🤖 AI Local está ativo!\n\nEu sou seu assistente especializado em CV e Letters para o mercado UK.\n\n💡 Pergunte sobre:\n• Como escrever CV profissional\n• Templates para cover letter\n• Dicas para interview\n• Comunicação com landlord\n\nFaça uma pergunta específica! ✨",
        isUser: false,
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, errorMessage],
              lastUpdated: new Date()
            }
          : conv
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Career Chat',
      messages: [
        {
          id: '1',
          content: 'Hello! I\'m ready to help you with your career goals. What would you like to work on?',
          isUser: false,
          timestamp: new Date()
        }
      ],
      lastUpdated: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  };

  return (
    <PublicLayout
      title="AI Career Assistant"
      description="Get personalized career advice, CV help, and professional guidance from our AI assistant"
    >
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          {/* Quick Prompts Bar */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">🚀 Quick Start Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {professionalPrompts.slice(0, 4).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(prompt.prompt)}
                  className="glass-panel border-white/10 p-3 text-left hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-blue-600/10 text-gray-300 hover:text-white transition-all duration-200 hover:border-purple-500/30 group"
                >
                  <div className="font-medium text-sm mb-1 group-hover:text-purple-300">{prompt.title}</div>
                  <div className="text-xs text-gray-400 line-clamp-2">{prompt.prompt.substring(0, 70)}...</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Chat Container */}
          <div className="glass-panel border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">AI Career Assistant</h2>
                  <p className="text-gray-300 text-sm">Get personalized career guidance and professional advice</p>
                </div>
                <button 
                  onClick={startNewConversation}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg text-sm"
                >
                  ✨ New Chat
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-black/5">
            {activeConversation?.messages.map(message => (
              <div key={message.id} className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.isUser 
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600' 
                    : 'bg-gradient-to-br from-emerald-600 to-blue-600'
                }`}>
                  <span className="text-white text-sm">
                    {message.isUser ? '👤' : '🤖'}
                  </span>
                </div>

                {/* Message */}
                <div className={`flex-1 max-w-2xl ${message.isUser ? 'text-right' : ''}`}>
                  <div className={`inline-block p-3 rounded-xl shadow-lg ${
                    message.isUser
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white ml-auto'
                      : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-100'
                  }`}>
                    <div className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-blue-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-gray-100 p-3 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="text-lg animate-pulse">🧠</div>
                    <span className="font-medium text-sm">AI is thinking...</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                placeholder="Ask for career advice, CV help, interview prep..."
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                disabled={isGenerating}
              />
              <button
                onClick={() => sendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isGenerating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm"
              >
                <span className="flex items-center gap-2">
                  <span>Send</span>
                  <span>🚀</span>
                </span>
              </button>
            </div>

            <div className="mt-3 text-center">
              <p className="text-xs text-gray-400">
                💡 <strong>Try asking:</strong> "Help me write bullet points for my role" • "Create a cover letter"
              </p>
            </div>
          </div>
        </div>

        {/* Additional Prompts */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {professionalPrompts.slice(4, 6).map((prompt, index) => (
            <button
              key={index + 4}
              onClick={() => sendMessage(prompt.prompt)}
              className="glass-panel border-white/10 p-3 text-left hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-blue-600/10 text-gray-300 hover:text-white transition-all duration-200 hover:border-purple-500/30 group"
            >
              <div className="font-medium text-sm mb-1 group-hover:text-purple-300">{prompt.title}</div>
              <div className="text-xs text-gray-400 line-clamp-2">{prompt.prompt.substring(0, 60)}...</div>
            </button>
          ))}
        </div>
        </div>
      </div>
    </PublicLayout>
  );
}