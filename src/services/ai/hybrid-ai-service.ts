/**
 * Hybrid AI Service: Local GGUF Model + Web Search
 * Runs offline by default, activates web search when needed
 */

import { freeAIService } from './free-ai-service-v2';

export interface HybridAIResponse {
  content: string;
  tokensUsed: number;
  model: string;
  mode: 'offline' | 'hybrid' | 'web-search';
  sources?: string[];
  searchQuery?: string;
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

/**
 * Hybrid AI Service
 * Local GGUF model with intelligent web search activation
 */
export class HybridAIService {
  private localModelUrl = 'http://localhost:11434'; // Ollama with GGUF
  private isLocalAvailable = false;
  
  constructor() {
    this.checkLocalModel();
  }
  
  /**
   * Check if local GGUF model is available
   */
  private async checkLocalModel(): Promise<void> {
    try {
      const response = await fetch(`${this.localModelUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      this.isLocalAvailable = response.ok;
    } catch {
      this.isLocalAvailable = false;
    }
  }
  
  /**
   * Main AI generation with hybrid approach
   */
  async generateResponse(
    message: string,
    conversationHistory: { role: string; content: string }[],
    userId: string = 'anonymous'
  ): Promise<HybridAIResponse> {
    
    // 1. Analyze if web search is needed
    const needsWebSearch = this.detectWebSearchNeed(message);
    
    // 2. Try local model first (always preferred for privacy/speed)
    if (this.isLocalAvailable && !needsWebSearch) {
      try {
        return await this.generateLocalResponse(message, conversationHistory, userId);
      } catch (error) {
        console.log('Local model failed, trying hybrid approach');
      }
    }
    
    // 3. If needs web search or local failed, use hybrid approach
    if (needsWebSearch) {
      return await this.generateHybridResponse(message, conversationHistory, userId);
    }
    
    // 4. Fallback to external AI services
    return await this.generateExternalResponse(message, conversationHistory, userId);
  }
  
  /**
   * Detect if message needs web search
   */
  private detectWebSearchNeed(message: string): boolean {
    const webSearchTriggers = [
      // Time-sensitive queries
      /\b(current|latest|recent|today|2024|2025|now|atual|recente|hoje)\b/i,
      
      // News and events
      /\b(news|notícias|events|acontecimentos|breaking|último)\b/i,
      
      // Market/salary information
      /\b(salary|salário|market|mercado|hiring|contratação|job market|vagas)\b/i,
      
      // Technology trends
      /\b(trend|tendência|popular|new technology|nova tecnologia)\b/i,
      
      // Company specific info
      /\b(company|empresa|specific|específico|about.*company)\b/i,
      
      // Current requirements
      /\b(requirements|requisitos|skills needed|habilidades necessárias)\b/i,
      
      // Location-specific
      /\b(in.*city|na cidade|local|região|area|área)\b/i,
      
      // Direct search requests
      /\b(search|pesquis|find|encontr|look up|buscar)\b/i
    ];
    
    return webSearchTriggers.some(trigger => trigger.test(message));
  }
  
  /**
   * Generate response using local GGUF model
   */
  private async generateLocalResponse(
    message: string,
    conversationHistory: { role: string; content: string }[],
    userId: string
  ): Promise<HybridAIResponse> {
    
    const systemPrompt = this.getLocalSystemPrompt();
    const fullPrompt = this.buildPrompt(systemPrompt, message, conversationHistory);
    
    const response = await fetch(`${this.localModelUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:8b', // Seu modelo GGUF baixado
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1000,
          top_k: 40,
          top_p: 0.9
        }
      })
    });
    
    if (!response.ok) {
      throw new Error('Local model not responding');
    }
    
    const data = await response.json();
    const content = data.response ?? 'Sorry, I could not generate a response.';
    
    return {
      content: this.formatLocalResponse(content),
      tokensUsed: this.estimateTokens(message + content),
      model: 'Local GGUF (Qwen 3 8B)',
      mode: 'offline'
    };
  }
  
  /**
   * Generate hybrid response (local + web search)
   */
  private async generateHybridResponse(
    message: string,
    conversationHistory: { role: string; content: string }[],
    userId: string
  ): Promise<HybridAIResponse> {
    
    try {
      // 1. Extract search query from message
      const searchQuery = this.extractSearchQuery(message);
      
      // 2. Perform web search
      const searchResults = await this.performWebSearch(searchQuery);
      
      // 3. Generate context-aware response
      let response: HybridAIResponse;
      
      if (this.isLocalAvailable) {
        // Use local model with web context
        response = await this.generateLocalWithWebContext(
          message, 
          conversationHistory, 
          searchResults, 
          userId
        );
      } else {
        // Use external AI with web context
        response = await this.generateExternalWithWebContext(
          message,
          conversationHistory,
          searchResults,
          userId
        );
      }
      
      response.mode = 'hybrid';
      response.searchQuery = searchQuery;
      response.sources = searchResults.map(r => r.url);
      
      return response;
      
    } catch (error) {
      console.error('Hybrid search failed:', error);
      // Fallback to local or external without web search
      return await this.generateLocalResponse(message, conversationHistory, userId);
    }
  }
  
  /**
   * Perform web search using free search APIs
   */
  private async performWebSearch(query: string): Promise<SearchResult[]> {
    try {
      // Using DuckDuckGo Instant Answer API (free)
      const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      const results: SearchResult[] = [];
      
      // Process DuckDuckGo results
      if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        data.RelatedTopics.slice(0, 5).forEach((topic: any, index: number) => {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.substring(0, 100),
              url: topic.FirstURL,
              snippet: topic.Text,
              relevance: 1 - (index * 0.1)
            });
          }
        });
      }
      
      // Add abstract if available
      if (data.Abstract) {
        results.unshift({
          title: data.Heading ?? 'Overview',
          url: data.AbstractURL ?? '#',
          snippet: data.Abstract,
          relevance: 1.0
        });
      }
      
      return results.length > 0 ? results : this.getFallbackSearchResults(query);
      
    } catch (error) {
      console.error('Web search failed:', error);
      return this.getFallbackSearchResults(query);
    }
  }
  
  /**
   * Generate response using local model with web context
   */
  private async generateLocalWithWebContext(
    message: string,
    conversationHistory: { role: string; content: string }[],
    searchResults: SearchResult[],
    userId: string
  ): Promise<HybridAIResponse> {
    
    const webContext = this.formatWebContext(searchResults);
    const systemPrompt = this.getHybridSystemPrompt();
    const enhancedPrompt = this.buildHybridPrompt(systemPrompt, message, conversationHistory, webContext);
    
    const response = await fetch(`${this.localModelUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:8b',
        prompt: enhancedPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1200,
          top_k: 40,
          top_p: 0.9
        }
      })
    });
    
    const data = await response.json();
    const content = data.response ?? 'Sorry, I could not generate a response with web search.';
    
    return {
      content: this.formatHybridResponse(content, searchResults),
      tokensUsed: this.estimateTokens(message + content + webContext),
      model: 'Local GGUF + Web Search',
      mode: 'hybrid'
    };
  }
  
  /**
   * Generate response using external AI services as fallback
   */
  private async generateExternalResponse(
    message: string,
    conversationHistory: { role: string; content: string }[],
    userId: string
  ): Promise<HybridAIResponse> {
    
    try {
      const aiResponse = await freeAIService.generateResponse(
        message,
        conversationHistory,
        'premium' // Use premium for better quality
      );
      
      return {
        content: aiResponse.content,
        tokensUsed: aiResponse.tokensUsed,
        model: `${aiResponse.provider} (${aiResponse.model})`,
        mode: 'offline'
      };
    } catch (error) {
      return {
        content: this.getFallbackResponse(message),
        tokensUsed: 50,
        model: 'Fallback Local',
        mode: 'offline'
      };
    }
  }
  
  /**
   * Generate external AI response with web context
   */
  private async generateExternalWithWebContext(
    message: string,
    conversationHistory: { role: string; content: string }[],
    searchResults: SearchResult[],
    userId: string
  ): Promise<HybridAIResponse> {
    
    const webContext = this.formatWebContext(searchResults);
    const enhancedMessage = `${message}\n\nWeb Search Results:\n${webContext}`;
    
    try {
      const aiResponse = await freeAIService.generateResponse(
        enhancedMessage,
        conversationHistory,
        'premium'
      );
      
      return {
        content: this.formatHybridResponse(aiResponse.content, searchResults),
        tokensUsed: aiResponse.tokensUsed,
        model: `${aiResponse.provider} + Web Search`,
        mode: 'hybrid'
      };
    } catch (error) {
      return {
        content: this.getFallbackResponse(message),
        tokensUsed: 50,
        model: 'Fallback + Web',
        mode: 'hybrid'
      };
    }
  }
  
  /**
   * Helper methods
   */
  private extractSearchQuery(message: string): string {
    // Simple extraction - could be improved with NLP
    const cleaned = message
      .replace(/\b(what|how|when|where|why|como|quando|onde|porque|o que)\b/gi, '')
      .replace(/\b(is|are|was|were|é|são|era|eram)\b/gi, '')
      .replace(/[?!.]/g, '')
      .trim();
    
    return cleaned.substring(0, 100); // Limit query length
  }
  
  private formatWebContext(results: SearchResult[]): string {
    return results.map((result, index) => 
      `${index + 1}. ${result.title}\n   ${result.snippet.substring(0, 200)}...`
    ).join('\n\n');
  }
  
  private buildPrompt(systemPrompt: string, message: string, history: { role: string; content: string }[]): string {
    const historyText = history.slice(-3).map(h => `${h.role}: ${h.content}`).join('\n');
    return `${systemPrompt}\n\nConversation History:\n${historyText}\n\nUser: ${message}\n\nAssistant:`;
  }
  
  private buildHybridPrompt(systemPrompt: string, message: string, history: { role: string; content: string }[], webContext: string): string {
    const historyText = history.slice(-3).map(h => `${h.role}: ${h.content}`).join('\n');
    return `${systemPrompt}\n\nWeb Search Results:\n${webContext}\n\nConversation History:\n${historyText}\n\nUser: ${message}\n\nAssistant:`;
  }
  
  private getLocalSystemPrompt(): string {
    return `You are CVLetterAI, an expert assistant for CV/resume creation and career guidance. You provide helpful, professional advice based on your knowledge. Be concise and actionable. If you don't have current information, say so and suggest the user might need updated data.`;
  }
  
  private getHybridSystemPrompt(): string {
    return `You are CVLetterAI with access to current web search results. Use both your knowledge and the provided web search results to give comprehensive, up-to-date advice on CV/resume creation and career guidance. Cite sources when using web information.`;
  }
  
  private formatLocalResponse(content: string): string {
    return `🧠 **Local AI Response**\n\n${content}\n\n*Generated offline using local model*`;
  }
  
  private formatHybridResponse(content: string, sources: SearchResult[]): string {
    const sourceList = sources.slice(0, 3).map((s, i) => `${i + 1}. [${s.title}](${s.url})`).join('\n');
    return `🌐 **AI + Web Search**\n\n${content}\n\n**Sources:**\n${sourceList}`;
  }
  
  private getFallbackSearchResults(query: string): SearchResult[] {
    return [{
      title: 'Search unavailable',
      url: '#',
      snippet: `I couldn't search for "${query}" right now, but I'll provide advice based on my training data.`,
      relevance: 0.5
    }];
  }
  
  private getFallbackResponse(message: string): string {
    return `🤖 **CVLetterAI**\n\nI understand you're asking about career and CV topics. While I can't access current information right now, I can help with general CV creation, formatting, and career advice. Could you rephrase your question focusing on general best practices?`;
  }
  
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
  
  /**
   * Public methods for status checking
   */
  async isLocalModelReady(): Promise<boolean> {
    await this.checkLocalModel();
    return this.isLocalAvailable;
  }
  
  getCapabilities(): { offline: boolean; webSearch: boolean; hybrid: boolean } {
    return {
      offline: this.isLocalAvailable,
      webSearch: true, // Always available with free APIs
      hybrid: this.isLocalAvailable // Requires local model for best hybrid experience
    };
  }
}

export const hybridAIService = new HybridAIService();
