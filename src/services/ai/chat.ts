import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import type { ChatCompletionMessage } from '@/services/ai/types';
import { createChatCompletionStream } from '@/services/ai/openai';

const systemPrompt =
  'You are CVLetterAI, an AI assistant specialising in UK employment and tenancy documentation. Provide concise, actionable, and compliant guidance. Reference UK regulations when needed, keep tone high-trust, and respect GDPR (do not store prompt contents).';

interface StreamOptions {
  locale?: string;
  model?: string;
}

export async function* streamChatCompletion(
  history: ChatCompletionMessage[],
  options: StreamOptions = {}
) {
  const messages: ChatCompletionMessageParam[] = [
    { role: 'system' as const, content: systemPrompt },
    ...history.map((message) => ({
      role: message.role,
      content: message.content
    }))
  ];

  if (options.locale) {
    messages.push({
      role: 'system',
      content: `User locale preference: ${options.locale}.`
    });
  }

  for await (const chunk of createChatCompletionStream(messages, options)) {
    yield chunk;
  }
}
