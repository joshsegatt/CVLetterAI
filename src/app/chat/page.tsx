"use client";

import React, { useState } from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { Send, Sparkles, FileText, PenTool, User, MessageSquare } from "lucide-react";

const quickPrompts = [
  {
    icon: FileText,
    title: "CV Writer",
    prompt: "Help me write compelling bullet points for my work experience."
  },
  {
    icon: PenTool,
    title: "Cover Letter",
    prompt: "Draft a professional cover letter for a specific job role."
  },
  {
    icon: User,
    title: "Interview Prep",
    prompt: "Help me prepare for job interviews with practice questions."
  },
  {
    icon: MessageSquare,
    title: "LinkedIn Profile",
    prompt: "Optimize my LinkedIn profile to attract recruiters."
  }
];

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hey there! 👋 I'm here to help you nail the UK job market. What would you like assistance with today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "Great question! Let me help you with that. Based on your request, here are some personalized suggestions to improve your career prospects...",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <PublicLayout
      title="AI Career Assistant"
      description="Get personalized advice for your CV, cover letters, and job search strategy"
    >
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">AI Career Assistant</h1>
            </div>
            <p className="text-xl text-gray-300">
              Get instant, personalized advice for your career journey
            </p>
          </div>

          {/* Chat Container */}
          <div className="glass-panel border-white/10 rounded-2xl overflow-hidden max-w-3xl mx-auto">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white/10 text-gray-100 border border-white/10'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="border-t border-white/10 p-4">
              <p className="text-sm text-gray-400 mb-3">Quick start prompts:</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-left text-sm"
                  >
                    <prompt.icon className="h-4 w-4 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300 truncate">{prompt.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Ask me anything about your career..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
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