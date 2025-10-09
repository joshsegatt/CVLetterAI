import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { platformEnv } from '@/services/platform/env';

let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  if (!platformEnv.openaiApiKey) {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: platformEnv.openaiApiKey,
      baseURL: platformEnv.openaiBaseUrl || undefined
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
    yield '⚠️ OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment.';
    return;
  }

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
}
