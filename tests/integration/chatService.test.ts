import { describe, expect, it } from 'vitest';
import { streamChatCompletion } from '@/services/ai/chat';

async function collectStream(iterator: AsyncGenerator<string>) {
  const result: string[] = [];
  for await (const chunk of iterator) {
    result.push(chunk.trim());
  }
  return result.join(' ');
}

describe('streamChatCompletion', () => {
  it('produces a stream even when OpenAI is not configured', async () => {
    const response = await collectStream(
      streamChatCompletion([{ role: 'user', content: 'How do I handle a landlord reference?' }])
    );

    expect(response).toContain('OpenAI API key is not configured');
  });
});
