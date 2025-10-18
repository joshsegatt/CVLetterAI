/**
 * Super Intelligent AI System
 * Combines natural conversation, web search, and multilingual capabilities
 * Equivalent to commercial LLMs like ChatGPT, LLaMA, Claude
 */

import { NaturalConversationalAI, NaturalResponse } from './natural-conversational-ai';
import { MassiveMultilingualAI } from './massive-multilingual-ai';
import { InvisibleWebSearch } from './invisible-web-search';

export interface SuperIntelligentResponse {
  response: string;
  language: string;
  confidence: number;
  conversationStyle: 'informal' | 'professional' | 'mixed';
  followUpSuggestions: string[];
  webInsights?: string[];
  processingTime: number;
  intelligenceLevel: 'basic' | 'enhanced' | 'super-intelligent';
}

export interface ConversationSession {
  sessionId: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>;
  userProfile: {
    language: string;
    personality: string;
    interests: string[];
    conversationStyle: string;
  };
  context: {
    currentTopic: string;
    expertiseLevel: string;
    culturalBackground: string;
  };
}

/**
 * Super Intelligent AI System
 * High-IQ conversational AI with web search and multilingual capabilities
 */
export class SuperIntelligentAI {
  private static sessions = new Map<string, ConversationSession>();

  /**
   * Main intelligent response generation
   * Processes any question with super-intelligent capabilities
   */
  static async generateSuperIntelligentResponse(
    userMessage: string,
    sessionId: string = 'default'
  ): Promise<SuperIntelligentResponse> {
    
    const startTime = Date.now();
    
    // Get or create conversation session
    const session = this.getOrCreateSession(sessionId, userMessage);
    
    // Detect language with high accuracy
    const detectedLanguageResult = MassiveMultilingualAI.detectLanguage(userMessage);
    const detectedLanguage = detectedLanguageResult.language;
    
    // Update session with current message
    session.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    });
    
    // Generate natural conversational response
    const naturalResponse = await NaturalConversationalAI.generateNaturalResponse(
      userMessage,
      session.messages.slice(-10), // Last 10 messages for context
      detectedLanguage
    );
    
    // Enhance with multilingual intelligence if needed
    let finalResponse = naturalResponse.mainResponse;
    let intelligenceLevel: SuperIntelligentResponse['intelligenceLevel'] = 'enhanced';
    
    if (detectedLanguage !== 'en' || this.requiresMultilingualEnhancement(userMessage)) {
      const userProfile = this.extractUserProfile(session);
      const multilingualResponse = await MassiveMultilingualAI.generateMultilingualResponse(
        userMessage,
        session.messages.slice(-5).map(m => ({ role: m.role, content: m.content })),
        userProfile.location
      );
      
      // Blend natural conversation with multilingual intelligence
      finalResponse = this.blendResponses(naturalResponse.mainResponse, multilingualResponse.content, detectedLanguage);
      intelligenceLevel = 'super-intelligent';
    }
    
    // Add response to session
    session.messages.push({
      role: 'assistant',
      content: finalResponse,
      timestamp: Date.now()
    });
    
    // Update session context
    this.updateSessionContext(session, userMessage, finalResponse, detectedLanguage);
    
    const processingTime = Date.now() - startTime;
    
    return {
      response: finalResponse,
      language: detectedLanguage,
      confidence: naturalResponse.confidence,
      conversationStyle: naturalResponse.conversationStyle,
      followUpSuggestions: naturalResponse.followUpSuggestions,
      webInsights: naturalResponse.webInsights,
      processingTime,
      intelligenceLevel
    };
  }

  /**
   * Get or create conversation session
   */
  private static getOrCreateSession(sessionId: string, initialMessage: string): ConversationSession {
    if (this.sessions.has(sessionId)) {
      return this.sessions.get(sessionId)!;
    }
    
    const detectedLanguageResult = MassiveMultilingualAI.detectLanguage(initialMessage);
    const detectedLanguage = detectedLanguageResult.language;
    
    const session: ConversationSession = {
      sessionId,
      messages: [],
      userProfile: {
        language: detectedLanguage,
        personality: this.detectPersonality(initialMessage),
        interests: this.extractInterests(initialMessage),
        conversationStyle: 'adaptive'
      },
      context: {
        currentTopic: this.extractTopic(initialMessage),
        expertiseLevel: 'intermediate',
        culturalBackground: this.detectCulturalBackground(detectedLanguage)
      }
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Determine if multilingual enhancement is needed
   */
  private static requiresMultilingualEnhancement(message: string): boolean {
    // Complex queries that benefit from cultural context
    const complexPatterns = [
      // Cultural references
      /cultura/i, /tradition/i, /costume/i, /tradição/i,
      
      // Local market information
      /mercado local/i, /local market/i, /salário aqui/i, /salary here/i,
      
      // Regional specific questions
      /no brasil/i, /in brazil/i, /em portugal/i, /in portugal/i,
      
      // Professional context requiring cultural understanding
      /networking/i, /entrevista/i, /interview/i, /trabalho remoto/i, /remote work/i
    ];
    
    return complexPatterns.some(pattern => pattern.test(message));
  }

  /**
   * Blend natural conversation with multilingual intelligence
   */
  private static blendResponses(naturalResponse: string, multilingualResponse: string, language: string): string {
    // If responses are similar, prefer the natural one
    if (this.calculateSimilarity(naturalResponse, multilingualResponse) > 0.7) {
      return naturalResponse;
    }
    
    // If multilingual adds cultural context, blend them intelligently
    if (language === 'pt') {
      return `${naturalResponse}\n\nPelo contexto brasileiro, vale adicionar que ${multilingualResponse.slice(0, 200)}...`;
    } else {
      return `${naturalResponse}\n\nFrom a cultural perspective, it's worth noting that ${multilingualResponse.slice(0, 200)}...`;
    }
  }

  /**
   * Calculate similarity between two responses
   */
  private static calculateSimilarity(response1: string, response2: string): number {
    const words1 = response1.toLowerCase().split(/\s+/);
    const words2 = response2.toLowerCase().split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  /**
   * Extract user profile from session
   */
  private static extractUserProfile(session: ConversationSession) {
    return {
      location: session.context.culturalBackground,
      industry: session.context.currentTopic.includes('tech') ? 'Technology' : 'General',
      experienceLevel: session.context.expertiseLevel,
      goals: session.userProfile.interests,
      communicationStyle: session.userProfile.conversationStyle
    };
  }

  /**
   * Update session context based on conversation
   */
  private static updateSessionContext(
    session: ConversationSession,
    userMessage: string,
    aiResponse: string,
    language: string
  ): void {
    
    // Update current topic
    const newTopic = this.extractTopic(userMessage);
    if (newTopic !== 'general') {
      session.context.currentTopic = newTopic;
    }
    
    // Update user interests
    const interests = this.extractInterests(userMessage);
    interests.forEach(interest => {
      if (!session.userProfile.interests.includes(interest)) {
        session.userProfile.interests.push(interest);
      }
    });
    
    // Update expertise level based on question complexity
    const complexity = this.assessQuestionComplexity(userMessage);
    if (complexity === 'expert' && session.context.expertiseLevel !== 'expert') {
      session.context.expertiseLevel = 'advanced';
    }
    
    // Update language preference
    session.userProfile.language = language;
  }

  /**
   * Detect user personality from message patterns
   */
  private static detectPersonality(message: string): string {
    const patterns = {
      analytical: /analis/i,
      creative: /criativ/i,
      direct: /direto/i,
      friendly: /amigável/i,
      professional: /profissional/i
    };
    
    for (const [personality, pattern] of Object.entries(patterns)) {
      if (pattern.test(message)) {
        return personality;
      }
    }
    
    return 'adaptive';
  }

  /**
   * Extract interests from message
   */
  private static extractInterests(message: string): string[] {
    const interestKeywords = {
      'technology': ['tech', 'programming', 'code', 'development', 'software'],
      'design': ['design', 'ui', 'ux', 'creative', 'visual'],
      'business': ['business', 'management', 'strategy', 'leadership'],
      'career': ['career', 'job', 'work', 'professional', 'carreira', 'emprego'],
      'education': ['learn', 'study', 'course', 'training', 'aprender', 'estudar']
    };
    
    const lowerMessage = message.toLowerCase();
    const interests: string[] = [];
    
    Object.entries(interestKeywords).forEach(([interest, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        interests.push(interest);
      }
    });
    
    return interests.length > 0 ? interests : ['general'];
  }

  /**
   * Extract main topic from message
   */
  private static extractTopic(message: string): string {
    const topicKeywords = {
      'cv': ['cv', 'resume', 'curriculum', 'currículo'],
      'job_search': ['job', 'work', 'employment', 'emprego', 'trabalho', 'vaga'],
      'interview': ['interview', 'entrevista'],
      'salary': ['salary', 'pay', 'salário', 'remuneração'],
      'skills': ['skill', 'habilidade', 'competência', 'learn'],
      'career': ['career', 'carreira', 'profession', 'profissão'],
      'technology': ['tech', 'programming', 'development', 'software']
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return topic;
      }
    }
    
    return 'general';
  }

  /**
   * Assess question complexity
   */
  private static assessQuestionComplexity(message: string): 'basic' | 'intermediate' | 'expert' {
    const expertIndicators = ['advanced', 'expert', 'professional', 'complex', 'avançado', 'especialista'];
    const basicIndicators = ['basic', 'simple', 'beginner', 'básico', 'simples', 'iniciante'];
    
    const lowerMessage = message.toLowerCase();
    
    if (expertIndicators.some(indicator => lowerMessage.includes(indicator))) {
      return 'expert';
    }
    
    if (basicIndicators.some(indicator => lowerMessage.includes(indicator))) {
      return 'basic';
    }
    
    return 'intermediate';
  }

  /**
   * Detect cultural background from language
   */
  private static detectCulturalBackground(language: string): string {
    const backgrounds = {
      'pt': 'Brazilian',
      'en': 'International', 
      'es': 'Hispanic',
      'de': 'German',
      'fr': 'French'
    };
    
    return backgrounds[language as keyof typeof backgrounds] || 'International';
  }

  /**
   * Get session statistics for analytics
   */
  static getSessionStats(sessionId: string): any {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    return {
      messageCount: session.messages.length,
      language: session.userProfile.language,
      mainTopics: session.userProfile.interests,
      conversationLength: session.messages.length > 0 ? 
        session.messages[session.messages.length - 1].timestamp - session.messages[0].timestamp : 0,
      averageResponseTime: this.calculateAverageResponseTime(session)
    };
  }

  /**
   * Calculate average response time
   */
  private static calculateAverageResponseTime(session: ConversationSession): number {
    const assistantMessages = session.messages.filter(m => m.role === 'assistant');
    if (assistantMessages.length === 0) return 0;
    
    return assistantMessages.reduce((sum, msg) => sum + (msg.timestamp || 0), 0) / assistantMessages.length;
  }

  /**
   * Clear old sessions to prevent memory leaks
   */
  static cleanupOldSessions(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    Array.from(this.sessions.entries()).forEach(([sessionId, session]) => {
      const lastActivity = session.messages.length > 0 ? 
        session.messages[session.messages.length - 1].timestamp : 0;
      
      if (now - lastActivity > maxAge) {
        this.sessions.delete(sessionId);
      }
    });
  }
}

// Auto cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    SuperIntelligentAI.cleanupOldSessions();
  }, 60 * 60 * 1000);
}