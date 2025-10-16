'use client';

import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import type { ChatCompletionMessage } from '../../../services/ai/types';

export interface ChatMessage extends ChatCompletionMessage {
  id: string;
}

export function useChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const streamAssistantReply = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content: input.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantId = nanoid();
    let accumulated = '';

    const history: ChatCompletionMessage[] = [...messages, userMessage].map(
      ({ role, content }) => ({ role, content })
    );

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: history,
          locale: typeof navigator !== 'undefined' ? navigator.language : 'en-GB'
        })
      });

      if (!response.body || !response.ok) {
        throw new Error('Chat service unavailable');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let done = false;
      while (!done) {
        const result = await reader.read();
        done = result.done ?? false;
        const chunkValue = result.value ? decoder.decode(result.value, { stream: !done }) : '';
        if (chunkValue) {
          accumulated += chunkValue;
          setMessages((prev) => {
            const existing = prev.find((message) => message.id === assistantId);
            if (existing) {
              return prev.map((message) =>
                message.id === assistantId ? { ...message, content: accumulated } : message
              );
            }
            return [...prev, { id: assistantId, role: 'assistant', content: accumulated }];
          });
        }
      }
    } catch (error) {
      console.error('Failed to stream assistant reply', error);
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content:
            '⚠️ Sorry, I could not connect to the AI service right now. Please try again shortly.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages]);

  const startVoiceCapture = useCallback(() => {
    // Placeholder for voice input integration (e.g., Web Speech API).
    console.info('Voice capture requested');
  }, []);

  return {
    messages,
    input,
    setInput,
    isLoading,
    streamAssistantReply,
    startVoiceCapture
  };
}
