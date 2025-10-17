import { NextRequest } from 'next/server';
import { SimpleLocalAI } from '../../../../services/ai/simple-local';

// Instância global da AI local
const localAI = new SimpleLocalAI();

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Processar com AI local
    const response = localAI.processQuery(message);

    // Simular streaming para UX melhor
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // Adicionar header com emoji baseado no tipo
        const emoji = response.type === 'cv' ? '📄' : response.type === 'letter' ? '📝' : '🤖';
        
        // Quebrar resposta em chunks para simular streaming
        const words = response.content.split(' ');
        
        for (let i = 0; i < words.length; i++) {
          const chunk = words[i] + ' ';
          controller.enqueue(encoder.encode(chunk));
          
          // Pequeno delay para simular processamento
          if (i % 5 === 0) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
        
        // Adicionar sugestões no final
        if (response.suggestions && response.suggestions.length > 0) {
          controller.enqueue(encoder.encode('\n\n💡 **Sugestões:**\n'));
          response.suggestions.forEach((suggestion: string, index: number) => {
            controller.enqueue(encoder.encode(`${index + 1}. ${suggestion}\n`));
          });
        }
        
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('AI Local Error:', error);
    
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}