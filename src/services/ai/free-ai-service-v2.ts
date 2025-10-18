/**
 * Free AI API Integration Service
 * Integrates multiple 100% FREE AI APIs for better chat quality
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
  isCompletlyFree: boolean;
  dailyLimit?: number;
}

/**
 * Free AI API Service
 * Manages multiple 100% FREE AI providers
 */
export class FreeAIService {
  private providers: Map<string, AIProvider> = new Map();
  
  constructor() {
    this.initializeProviders();
  }
  
  private initializeProviders() {
    // Groq (100% FREE - 6000 tokens/min)
    this.providers.set('groq-llama', {
      name: 'Groq Llama 3.1',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      apiKey: process.env.GROQ_API_KEY,
      maxTokens: 8192,
      quality: 'premium',
      available: !!process.env.GROQ_API_KEY,
      isCompletlyFree: true
    });
    
    // Hugging Face Inference API (100% FREE - 1000 requests/hour)
    this.providers.set('huggingface-llama', {
      name: 'HF Llama 3.1',
      endpoint: 'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-8B-Instruct',
      apiKey: process.env.HUGGINGFACE_API_KEY,
      maxTokens: 4096,
      quality: 'premium',
      available: !!process.env.HUGGINGFACE_API_KEY,
      isCompletlyFree: true,
      dailyLimit: 1000
    });
    
    // Hugging Face Mixtral (100% FREE)
    this.providers.set('huggingface-mixtral', {
      name: 'HF Mixtral',
      endpoint: 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      apiKey: process.env.HUGGINGFACE_API_KEY,
      maxTokens: 4096,
      quality: 'premium',
      available: !!process.env.HUGGINGFACE_API_KEY,
      isCompletlyFree: true,
      dailyLimit: 1000
    });
    
    // Cohere Command (100% FREE - 1000 calls/month)
    this.providers.set('cohere-command', {
      name: 'Cohere Command-R',
      endpoint: 'https://api.cohere.ai/v1/chat',
      apiKey: process.env.COHERE_API_KEY,
      maxTokens: 4000,
      quality: 'premium',
      available: !!process.env.COHERE_API_KEY,
      isCompletlyFree: true,
      dailyLimit: 33 // 1000/month ≈ 33/day
    });
    
    // DeepInfra Llama (100% FREE with $5 credit)
    this.providers.set('deepinfra-llama', {
      name: 'DeepInfra Llama',
      endpoint: 'https://api.deepinfra.com/v1/openai/chat/completions',
      apiKey: process.env.DEEPINFRA_API_KEY,
      maxTokens: 4096,
      quality: 'premium',
      available: !!process.env.DEEPINFRA_API_KEY,
      isCompletlyFree: true
    });
    
    // Perplexity AI (100% FREE - 5 requests/day)
    this.providers.set('perplexity-llama', {
      name: 'Perplexity Llama',
      endpoint: 'https://api.perplexity.ai/chat/completions',
      apiKey: process.env.PERPLEXITY_API_KEY,
      maxTokens: 4096,
      quality: 'premium',
      available: !!process.env.PERPLEXITY_API_KEY,
      isCompletlyFree: true,
      dailyLimit: 5
    });
    
    // Ollama Local (100% FREE, self-hosted)
    this.providers.set('ollama-local', {
      name: 'Ollama Local',
      endpoint: 'http://localhost:11434/api/generate',
      maxTokens: 4096,
      quality: 'basic',
      available: true,
      isCompletlyFree: true
    });
    
    // Together AI (Free tier)
    this.providers.set('together', {
      name: 'Together AI',
      endpoint: 'https://api.together.xyz/v1/chat/completions',
      apiKey: process.env.TOGETHER_API_KEY,
      maxTokens: 4096,
      quality: 'premium',
      available: !!process.env.TOGETHER_API_KEY,
      isCompletlyFree: false // Has paid tiers
    });
    
    // Fallback to our enhanced local system (100% FREE)
    this.providers.set('local-enhanced', {
      name: 'Enhanced Local AI',
      endpoint: '/api/ai/enhanced-local',
      maxTokens: 2048,
      quality: 'basic',
      available: true,
      isCompletlyFree: true
    });
  }
  
  /**
   * Generate AI response using 100% FREE providers first
   */
  async generateResponse(
    message: string,
    conversationHistory: Array<{ role: string; content: string }>,
    qualityLevel: 'basic' | 'premium' | 'enterprise',
    userId: string
  ): Promise<AIResponse> {
    
    try {
      // Select best available FREE provider first
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
   * Select best provider prioritizing 100% FREE options
   */
  private selectProvider(qualityLevel: 'basic' | 'premium' | 'enterprise'): AIProvider {
    const availableProviders = Array.from(this.providers.values()).filter(p => p.available);
    const freeProviders = availableProviders.filter(p => p.isCompletlyFree);
    
    if (qualityLevel === 'enterprise' || qualityLevel === 'premium') {
      // Try 100% FREE premium providers first
      return freeProviders.find(p => p.name === 'Groq Llama 3.1') ||
             freeProviders.find(p => p.name === 'HF Llama 3.1') ||
             freeProviders.find(p => p.name === 'HF Mixtral') ||
             freeProviders.find(p => p.name === 'Cohere Command-R') ||
             freeProviders.find(p => p.name === 'DeepInfra Llama') ||
             freeProviders.find(p => p.name === 'Perplexity Llama') ||
             freeProviders.find(p => p.name === 'Ollama Local') ||
             availableProviders.find(p => p.name === 'Together AI') || // Fallback to paid if needed
             freeProviders.find(p => p.name === 'Enhanced Local AI')!;
    }
    
    // For Free users: Use basic providers or local
    return freeProviders.find(p => p.name === 'Ollama Local') ||
           freeProviders.find(p => p.name === 'HF Llama 3.1') ||
           freeProviders.find(p => p.name === 'Groq Llama 3.1') ||
           freeProviders.find(p => p.name === 'Enhanced Local AI')!;
  }
  
  /**
   * Call external AI provider
   */
  private async callExternalProvider(
    provider: AIProvider,
    message: string,
    conversationHistory: Array<{ role: string; content: string }>,
    userId: string
  ): Promise<AIResponse> {
    
    if (provider.name === 'Ollama Local') {
      return await this.callOllama(provider, message, userId);
    }
    
    if (provider.name.startsWith('HF ')) {
      return await this.callHuggingFace(provider, message, userId);
    }
    
    if (provider.name === 'Cohere Command-R') {
      return await this.callCohere(provider, message, conversationHistory, userId);
    }
    
    // Standard OpenAI-compatible API call (Groq, DeepInfra, Together AI, Perplexity)
    const messages = [
      {
        role: 'system',
        content: this.getSystemPrompt(provider.quality)
      },
      ...conversationHistory.slice(-5), // Last 5 messages for context
      {
        role: 'user',
        content: message
      }
    ];
    
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: this.getModelName(provider),
        messages,
        max_tokens: Math.min(provider.maxTokens, 1500),
        temperature: 0.7,
        stream: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`${provider.name} API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    const tokensUsed = data.usage?.total_tokens || this.estimateTokens(message + content);
    
    return {
      content,
      tokensUsed,
      model: this.getModelName(provider),
      quality: provider.quality,
      provider: provider.name
    };
  }
  
  /**
   * Call Cohere API (different format)
   */
  private async callCohere(
    provider: AIProvider,
    message: string,
    conversationHistory: Array<{ role: string; content: string }>,
    userId: string
  ): Promise<AIResponse> {
    
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: 'command-r',
        message: message,
        chat_history: conversationHistory.slice(-5).map(msg => ({
          role: msg.role === 'user' ? 'USER' : 'CHATBOT',
          message: msg.content
        })),
        max_tokens: 1500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.text || 'Sorry, I could not generate a response.';
    
    return {
      content,
      tokensUsed: this.estimateTokens(message + content),
      model: 'command-r',
      quality: 'premium',
      provider: 'Cohere Command-R'
    };
  }
  
  /**
   * Call Hugging Face API
   */
  private async callHuggingFace(
    provider: AIProvider,
    message: string,
    userId: string
  ): Promise<AIResponse> {
    
    const systemPrompt = this.getSystemPrompt(provider.quality);
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;
    
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }
    
    const data = await response.json();
    let content = '';
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      content = data[0].generated_text;
    } else if (data.generated_text) {
      content = data.generated_text;
    } else {
      content = 'Sorry, I could not generate a response.';
    }
    
    // Clean up the response
    content = content.replace(fullPrompt, '').trim();
    
    return {
      content,
      tokensUsed: this.estimateTokens(message + content),
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
          model: 'qwen3:8b',
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
      const content = data.response || 'Sorry, I could not generate a response.';
      
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
   * Enhanced local AI response using our super intelligent system
   */
  private async generateLocalEnhancedResponse(
    message: string,
    conversationHistory: Array<{ role: string; content: string }>,
    userId: string
  ): Promise<AIResponse> {
    
    try {
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
    } catch (error) {
      // Ultimate fallback to simple response
      return {
        content: `🤖 **CVLetterAI**\n\nHi! I'm your AI assistant for CV and career guidance. I can help you create professional CVs, cover letters, and provide career advice. How can I assist you today?`,
        tokensUsed: 50,
        model: 'Simple Fallback',
        quality: 'basic',
        provider: 'Local Fallback'
      };
    }
  }
  
  /**
   * Get system prompt based on quality level
   */
  private getSystemPrompt(quality: 'basic' | 'premium' | 'enterprise'): string {
    const basePrompt = `You are CVLetterAI, an advanced AI assistant specializing in CV/resume creation, cover letters, and career guidance. Be helpful, professional, and concise.`;
    
    switch (quality) {
      case 'enterprise':
        return `${basePrompt} Provide enterprise-level insights with strategic career advice and industry analysis.`;
      
      case 'premium':
        return `${basePrompt} Provide detailed professional responses with practical examples and actionable advice.`;
      
      case 'basic':
        return `${basePrompt} Provide helpful and concise advice for CV and career improvement.`;
    }
  }
  
  /**
   * Get model name for provider
   */
  private getModelName(provider: AIProvider): string {
    switch (provider.name) {
      case 'Groq Llama 3.1':
        return 'llama-3.1-70b-versatile';
      case 'HF Llama 3.1':
        return 'meta-llama/Meta-Llama-3.1-8B-Instruct';
      case 'HF Mixtral':
        return 'mistralai/Mixtral-8x7B-Instruct-v0.1';
      case 'Cohere Command-R':
        return 'command-r';
      case 'DeepInfra Llama':
        return 'meta-llama/Meta-Llama-3.1-70B-Instruct';
      case 'Perplexity Llama':
        return 'llama-3.1-sonar-small-128k-online';
      case 'Together AI':
        return 'meta-llama/Llama-2-70b-chat-hf';
      case 'Ollama Local':
        return 'qwen3:8b';
      default:
        return 'enhanced-local';
    }
  }
  
  /**
   * Estimate token count (rough approximation)
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
  
  /**
   * Get available FREE providers status
   */
  getProvidersStatus(): Array<{ name: string; quality: string; available: boolean; isFree: boolean }> {
    return Array.from(this.providers.values()).map(provider => ({
      name: provider.name,
      quality: provider.quality,
      available: provider.available,
      isFree: provider.isCompletlyFree
    }));
  }
}

export const freeAIService = new FreeAIService();