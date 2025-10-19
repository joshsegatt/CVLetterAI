/**
 * Free AI API Integration Service
 * Integrates multiple free AI APIs for better chat quality
 */

export interface AIResponse {
  content: string;
  tokensUsed: number;
  model: string;
  quality: 'basic' | 'premium' | 'enterprise';
  provider: string;
}

export interface AIProvider {
  name: string;
  endpoint: string;
  apiKey?: string;
  maxTokens: number;
  quality: 'basic' | 'premium' | 'enterprise';
  available: boolean;
}

/**
 * Free AI API Service
 * Manages multiple AI providers for different quality levels
 */
export class FreeAIService {
  private providers: Map<string, AIProvider> = new Map();
  
  constructor() {
    this.initializeProviders();
  }
  
  private initializeProviders() {
    // Groq (Free tier with Llama models)
    this.providers.set('groq-llama', {
      name: 'Groq Llama 3.1',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      apiKey: process.env.GROQ_API_KEY,
      maxTokens: 8192,
      quality: 'premium',
      available: !!process.env.GROQ_API_KEY
    });
    
    // Together AI (Free tier)
    this.providers.set('together', {
      name: 'Together AI',
      endpoint: 'https://api.together.xyz/v1/chat/completions',
      apiKey: process.env.TOGETHER_API_KEY,
      maxTokens: 4096,
      quality: 'premium',
      available: !!process.env.TOGETHER_API_KEY
    });
    
    // Hugging Face Inference API (Free)
    this.providers.set('huggingface', {
      name: 'Hugging Face',
      endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
      apiKey: process.env.HUGGINGFACE_API_KEY,
      maxTokens: 2048,
      quality: 'basic',
      available: !!process.env.HUGGINGFACE_API_KEY
    });
    
    // Ollama Local (Free, self-hosted)
    this.providers.set('ollama-local', {
      name: 'Ollama Local',
      endpoint: 'http://localhost:11434/api/generate',
      maxTokens: 4096,
      quality: 'basic',
      available: true // Always available if running locally
    });
    
    // Fallback to our enhanced local system
    this.providers.set('local-enhanced', {
      name: 'Enhanced Local AI',
      endpoint: '/api/ai/enhanced-local',
      maxTokens: 2048,
      quality: 'basic',
      available: true // Always available
    });
  }
  
  /**
   * Generate AI response based on user plan quality level
   */
  async generateResponse(
    message: string,
    conversationHistory: { role: string; content: string }[],
    qualityLevel: 'basic' | 'premium' | 'enterprise',
    userId: string
  ): Promise<AIResponse> {
    
    try {
      // Select best available provider for quality level
      const provider = this.selectProvider(qualityLevel);
      
      if (provider.name === 'Enhanced Local AI') {
        return await this.generateLocalEnhancedResponse(message, conversationHistory, userId);
      }
      
      return await this.callExternalProvider(provider, message, conversationHistory, userId);
      
    } catch (error) {
      console.error('AI generation error:', error);
      // Fallback to local enhanced system
      return await this.generateLocalEnhancedResponse(message, conversationHistory, userId);
    }
  }
  
  /**
   * Select best provider based on quality level and availability
   */
  private selectProvider(qualityLevel: 'basic' | 'premium' | 'enterprise'): AIProvider {
    const availableProviders = Array.from(this.providers.values()).filter(p => p.available);
    
    if (qualityLevel === 'enterprise') {
      // For Enterprise: Try Groq first, then Together AI
      return availableProviders.find(p => p.name === 'Groq Llama 3.1') ||
             availableProviders.find(p => p.name === 'Together AI') ||
             availableProviders.find(p => p.name === 'Enhanced Local AI')!;
    }
    
    if (qualityLevel === 'premium') {
      // For Pro: Try Groq, Together, or Ollama
      return availableProviders.find(p => p.name === 'Groq Llama 3.1') ||
             availableProviders.find(p => p.name === 'Together AI') ||
             availableProviders.find(p => p.name === 'Ollama Local') ||
             availableProviders.find(p => p.name === 'Enhanced Local AI')!;
    }
    
    // For Free: Use basic providers or local
    return availableProviders.find(p => p.name === 'Ollama Local') ||
           availableProviders.find(p => p.name === 'Hugging Face') ||
           availableProviders.find(p => p.name === 'Enhanced Local AI')!;
  }
  
  /**
   * Call external AI provider
   */
  private async callExternalProvider(
    provider: AIProvider,
    message: string,
    conversationHistory: { role: string; content: string }[],
    userId: string
  ): Promise<AIResponse> {
    
    const messages = [
      {
        role: 'system',
        content: this.getSystemPrompt(provider.quality)
      },
      ...conversationHistory.slice(-10), // Last 10 messages for context
      {
        role: 'user',
        content: message
      }
    ];
    
    if (provider.name === 'Ollama Local') {
      return await this.callOllama(provider, message, userId);
    }
    
    if (provider.name === 'Hugging Face') {
      return await this.callHuggingFace(provider, message, userId);
    }
    
    // Standard OpenAI-compatible API call (Groq, Together AI)
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: this.getModelName(provider),
        messages,
        max_tokens: Math.min(provider.maxTokens, 2048),
        temperature: 0.7,
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`${provider.name} API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content ?? 'Sorry, I could not generate a response.';
    const tokensUsed = data.usage?.total_tokens ?? this.estimateTokens(message + content);
    
    return {
      content,
      tokensUsed,
      model: this.getModelName(provider),
      quality: provider.quality,
      provider: provider.name
    };
  }
  
  /**
   * Call Ollama local API
   */
  private async callOllama(
    provider: AIProvider,
    message: string,
    userId: string
  ): Promise<AIResponse> {
    
    try {
      const response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:latest',
          prompt: `${this.getSystemPrompt('basic')}\n\nUser: ${message}\n\nAssistant:`,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 512
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Ollama not available');
      }
      
      const data = await response.json();
      const content = data.response ?? 'Sorry, I could not generate a response.';
      
      return {
        content,
        tokensUsed: this.estimateTokens(message + content),
        model: 'llama3.2:latest',
        quality: 'basic',
        provider: 'Ollama Local'
      };
      
    } catch (error) {
      console.log('Ollama not available, using fallback');
      throw error;
    }
  }
  
  /**
   * Call Hugging Face API
   */
  private async callHuggingFace(
    provider: AIProvider,
    message: string,
    userId: string
  ): Promise<AIResponse> {
    
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        inputs: {
          past_user_inputs: [message],
          generated_responses: [],
          text: message
        },
        options: {
          wait_for_model: true
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.generated_text ?? data.response ?? 'Sorry, I could not generate a response.';
    
    return {
      content,
      tokensUsed: this.estimateTokens(message + content),
      model: 'DialoGPT-large',
      quality: 'basic',
      provider: 'Hugging Face'
    };
  }
  
  /**
   * Enhanced local AI response using our super intelligent system
   */
  private async generateLocalEnhancedResponse(
    message: string,
    conversationHistory: { role: string; content: string }[],
    userId: string
  ): Promise<AIResponse> {
    
    // Import our super intelligent system
    const { SuperIntelligentAI } = await import('./super-intelligent-ai');
    
    const response = await SuperIntelligentAI.generateSuperIntelligentResponse(
      message,
      `${userId}-enhanced`
    );
    
    return {
      content: response.response,
      tokensUsed: this.estimateTokens(message + response.response),
      model: 'Super Intelligent Local AI',
      quality: 'basic',
      provider: 'Enhanced Local AI'
    };
  }
  
  /**
   * Get system prompt based on quality level
   */
  private getSystemPrompt(quality: 'basic' | 'premium' | 'enterprise'): string {
    const basePrompt = `You are CVLetterAI, an advanced AI assistant specializing in CV/resume creation, cover letters, and career guidance. You provide helpful, professional, and personalized advice.`;
    
    switch (quality) {
      case 'enterprise':
        return `${basePrompt} You have access to enterprise-level insights, industry-specific knowledge, and advanced analytics. Provide comprehensive, strategic advice with data-driven insights.`;
      
      case 'premium':
        return `${basePrompt} You provide detailed, professional responses with practical examples and actionable advice. You can analyze documents and provide optimization suggestions.`;
      
      case 'basic':
        return `${basePrompt} Provide helpful and concise advice to help users improve their CVs and career prospects.`;
    }
  }
  
  /**
   * Get model name for provider
   */
  private getModelName(provider: AIProvider): string {
    switch (provider.name) {
      case 'Groq Llama 3.1':
        return 'llama-3.1-70b-versatile';
      case 'Together AI':
        return 'meta-llama/Llama-2-70b-chat-hf';
      case 'Hugging Face':
        return 'microsoft/DialoGPT-large';
      case 'Ollama Local':
        return 'llama3.2:latest';
      default:
        return 'enhanced-local';
    }
  }
  
  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokens(text: string): number {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
  
  /**
   * Get available providers status
   */
  getProvidersStatus(): { name: string; quality: string; available: boolean }[] {
    return Array.from(this.providers.values()).map(provider => ({
      name: provider.name,
      quality: provider.quality,
      available: provider.available
    }));
  }
  
  /**
   * Test provider connectivity
   */
  async testProvider(providerName: string): Promise<boolean> {
    const provider = Array.from(this.providers.values()).find(p => p.name === providerName);
    if (!provider) return false;
    
    try {
      if (provider.name === 'Ollama Local') {
        const response = await fetch('http://localhost:11434/api/version');
        return response.ok;
      }
      
      // For other providers, assume they're working if we have API keys
      return provider.available;
    } catch {
      return false;
    }
  }
}

export const freeAIService = new FreeAIService();
