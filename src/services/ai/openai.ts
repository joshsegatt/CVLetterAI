import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { platformEnv } from '../platform/env';

let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  // For LM Studio, we always create a client even with dummy API key
  if (platformEnv.openaiBaseUrl?.includes('localhost') ?? platformEnv.openaiBaseUrl?.includes('127.0.0.1')) {
    if (!openaiClient) {
      openaiClient = new OpenAI({
        apiKey: platformEnv.openaiApiKey ?? 'lm-studio',
        baseURL: platformEnv.openaiBaseUrl
      });
    }
    return openaiClient;
  }

  // For external APIs like OpenAI, require valid API key
  if (!platformEnv.openaiApiKey || platformEnv.openaiApiKey === 'lm-studio') {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: platformEnv.openaiApiKey,
      baseURL: platformEnv.openaiBaseUrl ?? undefined
    });
  }

  return openaiClient;
}

interface StreamOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function* createChatCompletionStream(
  messages: ChatCompletionMessageParam[],
  options: StreamOptions = {}
) {
  const client = getOpenAIClient();

  if (!client) {
    yield '🤖 AI Chat não configurado. Para usar:\n\n';
    yield '1. **LM Studio (Recomendado)**: Baixe em https://lmstudio.ai\n';
    yield '2. Inicie um modelo local na porta 1234\n';
    yield '3. Configure OPENAI_BASE_URL=http://localhost:1234/v1\n\n';
    yield '**Ou use OpenAI API**: Configure OPENAI_API_KEY com sua chave da OpenAI\n';
    return;
  }

  try {
    const response = await client.chat.completions.create({
      model: options.model ?? platformEnv.openaiModel,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens,
      stream: true,
      messages
    });

    for await (const part of response) {
      const delta = part.choices[0]?.delta?.content;
      if (typeof delta === 'string' && delta.length > 0) {
        yield delta;
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      yield '🔌 **LM Studio não está rodando**\n\n';
      yield '1. Abra LM Studio\n';
      yield '2. Vá em "Local Server"\n';
      yield '3. Carregue um modelo\n';
      yield '4. Clique em "Start Server"\n';
      yield '5. Tente novamente\n';
    } else {
      yield `❌ Erro na AI: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
    }
  }
}
