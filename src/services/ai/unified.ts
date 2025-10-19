import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { createChatCompletionStream } from './openai';
import { OllamaClient } from './ollama';

export type AIProvider = 'openai' | 'lmstudio' | 'ollama' | 'transformers' | 'local-api';

export interface AIConfig {
  provider: AIProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
  baseUrl?: string;
}

export class UnifiedAI {
  private config: AIConfig;
  private ollamaClient: OllamaClient;

  constructor(config: AIConfig) {
    this.config = config;
    this.ollamaClient = new OllamaClient(config.baseUrl);
  }

  async isAvailable(): Promise<boolean> {
    switch (this.config.provider) {
      case 'ollama':
        return await this.ollamaClient.isAvailable();
      
      case 'lmstudio':
        try {
          const response = await fetch('http://localhost:1234/v1/models', {
            signal: AbortSignal.timeout(3000)
          });
          return response.ok;
        } catch {
          return false;
        }
      
      case 'openai':
        return !!this.config.apiKey;
      
      case 'transformers':
        return true; // Always available in browser
      
      case 'local-api':
        try {
          const response = await fetch(this.config.baseUrl + '/health', {
            signal: AbortSignal.timeout(3000)
          });
          return response.ok;
        } catch {
          return false;
        }
      
      default:
        return false;
    }
  }

  async *chat(
    messages: ChatCompletionMessageParam[],
    options: { temperature?: number; maxTokens?: number } = {}
  ): AsyncGenerator<string, void, unknown> {
    const mergedOptions = { ...this.config, ...options };

    try {
      switch (this.config.provider) {
        case 'ollama':
          yield* this.ollamaClient.chatStream(
            messages,
            mergedOptions.model ?? 'llama3.2:3b',
            mergedOptions
          );
          break;

        case 'openai':
        case 'lmstudio':
          yield* createChatCompletionStream(messages, mergedOptions);
          break;

        case 'transformers':
          yield '🚧 Use nossa AI local simples em /api/ai/simple';
          break;

        case 'local-api':
          yield* this.handleLocalAPI(messages, mergedOptions);
          break;

        default:
          yield '❌ Provedor de AI não configurado';
      }
    } catch (error) {
      yield `❌ Erro na AI: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
    }
  }

  private async *handleLocalAPI(
    messages: ChatCompletionMessageParam[],
    options: any
  ): AsyncGenerator<string, void, unknown> {
    const response = await fetch(`${this.config.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      },
      body: JSON.stringify({
        messages,
        model: options.model ?? 'default',
        temperature: options.temperature ?? 0.7,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`API Local error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              yield data.content;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }
}

// Factory function para criar AI baseado no ambiente
export function createAI(): UnifiedAI {
  // Prioridades de fallback
  const providers: Array<{ provider: AIProvider; config: Partial<AIConfig> }> = [
    {
      provider: 'ollama',
      config: { baseUrl: 'http://localhost:11434', model: 'llama3.2:3b' }
    },
    {
      provider: 'lmstudio', 
      config: { baseUrl: 'http://localhost:1234/v1', model: 'local-model' }
    },
    {
      provider: 'transformers',
      config: { model: 'gpt2' }
    }
  ];

  // Por enquanto, usar Ollama como padrão
  return new UnifiedAI({
    provider: 'ollama',
    baseUrl: 'http://localhost:11434',
    model: 'llama3.2:3b',
    temperature: 0.7
  });
}

// Instância global
let aiInstance: UnifiedAI | null = null;

export function getAI(): UnifiedAI {
  if (!aiInstance) {
    aiInstance = createAI();
  }
  return aiInstance;
}
