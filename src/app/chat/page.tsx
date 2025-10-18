"use client";

import React, { useState } from "react";
import { PublicLayout } from "../../components/layout/PublicLayout";
import { LanguageSelector } from "../../components/shared/LanguageSelector";
import { useI18n } from "../../lib/i18n/context";
import { useChatLanguage } from "../../lib/i18n/useChatLanguage";
import { SUPPORTED_LANGUAGES } from "../../lib/i18n/config";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  language?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: Date;
}

export default function ChatPage() {
  const { t } = useI18n();
  const { chatLanguage, setChatLanguage } = useChatLanguage();
  
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: t.chat.title,
      messages: [
        {
          id: '1',
          content: t.chat.messages.welcome,
          isUser: false,
          timestamp: new Date(),
          language: chatLanguage
        }
      ],
      lastUpdated: new Date()
    }
  ]);
  
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Prompts multilinguagem dinâmicos
  const getProfessionalPrompts = () => {
    if (chatLanguage === 'pt') {
      return [
        {
          title: "Escritor de CV",
          prompt: "Me ajude a escrever bullet points convincentes para minha experiência de trabalho que destaquem conquistas e resultados quantificáveis."
        },
        {
          title: "Especialista em Carta de Apresentação", 
          prompt: "Escreva uma carta de apresentação profissional que combine minha experiência com os requisitos do trabalho e cultura da empresa."
        },
        {
          title: "Otimizador de LinkedIn",
          prompt: "Otimize meu resumo do LinkedIn e descrições de experiência para atrair recrutadores e mostrar minha expertise."
        },
        {
          title: "Preparação para Entrevista",
          prompt: "Me ajude a me preparar para entrevistas de trabalho criando respostas para perguntas comuns baseadas no meu background."
        }
      ];
    } else if (chatLanguage === 'es') {
      return [
        {
          title: "Escritor de CV",
          prompt: "Ayúdame a escribir puntos convincentes para mi experiencia laboral que destaquen logros y resultados cuantificables."
        },
        {
          title: "Experto en Carta de Presentación",
          prompt: "Redacta una carta de presentación profesional que combine mi experiencia con los requisitos del trabajo y cultura de la empresa."
        },
        {
          title: "Optimizador de LinkedIn", 
          prompt: "Optimiza mi resumen de LinkedIn y descripciones de experiencia para atraer reclutadores y mostrar mi experiencia."
        },
        {
          title: "Preparación para Entrevistas",
          prompt: "Ayúdame a prepararme para entrevistas laborales creando respuestas a preguntas comunes basadas en mi experiencia."
        }
      ];
    } else {
      return [
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
        }
      ];
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isGenerating) return;

    setIsGenerating(true);
    
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
      language: chatLanguage
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
      // Use advanced AI with language and context
      const response = await fetch('/api/ai/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          language: chatLanguage,
          tone: 'professional',
          context: 'general'
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
        timestamp: new Date(),
        language: chatLanguage
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
        content: t.chat.messages.error,
        isUser: false,
        timestamp: new Date(),
        language: chatLanguage
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
      title: t.chat.title,
      messages: [
        {
          id: '1',
          content: t.chat.messages.welcome,
          isUser: false,
          timestamp: new Date(),
          language: chatLanguage
        }
      ],
      lastUpdated: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  };

  const professionalPrompts = getProfessionalPrompts();

  return (
    <PublicLayout
      title={t.chat.title}
      description={t.chat.subtitle}
    >
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          {/* Language & Settings Bar */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{t.chat.title}</h2>
              <p className="text-gray-300">{t.chat.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.chat.language}
                </label>
                <select
                  value={chatLanguage}
                  onChange={(e) => setChatLanguage(e.target.value as any)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-gray-800 text-white">
                      {lang.flag} {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">🚀 {chatLanguage === 'pt' ? 'Prompts Rápidos' : chatLanguage === 'es' ? 'Prompts Rápidos' : 'Quick Start Prompts'}</h3>
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
                  <h2 className="text-xl font-bold text-white mb-1">{t.chat.title}</h2>
                  <p className="text-gray-300 text-sm">{t.chat.subtitle}</p>
                </div>
                <button 
                  onClick={startNewConversation}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg text-sm"
                >
                  ✨ {chatLanguage === 'pt' ? 'Novo Chat' : chatLanguage === 'es' ? 'Nuevo Chat' : 'New Chat'}
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
                      <span className="font-medium text-sm">{t.chat.thinking}</span>
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
                placeholder={t.chat.placeholder}
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                disabled={isGenerating}
              />
              <button
                onClick={() => sendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isGenerating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm"
              >
                <span className="flex items-center gap-2">
                  <span>{t.chat.send}</span>
                  <span>🚀</span>
                </span>
              </button>
            </div>

            <div className="mt-3 text-center">
              <p className="text-xs text-gray-400">
                💡 <strong>{chatLanguage === 'pt' ? 'Experimente perguntar:' : chatLanguage === 'es' ? 'Prueba preguntar:' : 'Try asking:'}</strong> {
                  chatLanguage === 'pt' ? '"Me ajude a escrever bullet points" • "Crie uma carta de apresentação"' :
                  chatLanguage === 'es' ? '"Ayúdame a escribir puntos clave" • "Crea una carta de presentación"' :
                  '"Help me write bullet points for my role" • "Create a cover letter"'
                }
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