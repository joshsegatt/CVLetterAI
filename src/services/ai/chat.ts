import type { ChatCompletionMessage } from './types';

interface StreamOptions {
  locale?: string;
  useSimple?: boolean;
}

export async function* streamChatCompletion(
  history: ChatCompletionMessage[],
  options: StreamOptions = {}
) {
  // Pegar a última mensagem do usuário
  const lastMessage = history[history.length - 1]?.content || '';
  
  try {
    // Usar nossa AI local simples
    const response = await fetch('/api/ai/simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: lastMessage
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    // Stream da resposta
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      yield chunk;
    }

  } catch (error) {
    yield '🤖 **CVLetterAI - AI Local Ativo**\n\n';
    yield 'Sou sua assistente de CV e Letters especializada no mercado UK!\n\n';
    yield '📄 **Para CV:** Pergunte sobre structure, skills, summary, etc.\n';
    yield '📝 **Para Letters:** Cover letters, landlord communications, etc.\n\n';
    yield '💡 **Exemplos:**\n';
    yield '• "Como escrever professional summary?"\n';
    yield '• "Template para cover letter"\n';
    yield '• "Como me comunicar com landlord?"\n\n';
    yield 'Faça uma pergunta específica! ✨\n';
  }
}
