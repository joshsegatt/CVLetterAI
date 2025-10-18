import { NextRequest } from 'next/server';
import { SimpleLocalAI } from '../../../../services/ai/simple-local-advanced';

// Instância global da AI local avançada
const localAI = new SimpleLocalAI();

export async function POST(request: NextRequest) {
  try {
    const { message, language = 'en', tone = 'professional', industry, experience, context } = await request.json();

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Processar com AI local avançada
    const response = await localAI.generateAdvancedResponse(message, {
      language,
      tone,
      industry,
      experience,
      context
    });

    // Streaming avançado com chunks inteligentes
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // Header com emoji e contexto
        const emoji = response.type === 'cv' ? '📄' : response.type === 'letter' ? '📝' : 
                     response.type === 'interview' ? '🎯' : '🤖';
        
        // Quebrar resposta em chunks semânticos
        const sentences = response.content.split(/(?<=[.!?])\s+/);
        
        for (let i = 0; i < sentences.length; i++) {
          const chunk = sentences[i] + (i < sentences.length - 1 ? ' ' : '');
          controller.enqueue(encoder.encode(chunk));
          
          // Delay baseado na complexidade da sentença
          const delay = Math.min(sentences[i].length * 2, 150);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        // Adicionar sugestões avançadas
        if (response.suggestions && response.suggestions.length > 0) {
          controller.enqueue(encoder.encode('\n\n💡 **Smart Suggestions:**\n'));
          response.suggestions.forEach((suggestion: string, index: number) => {
            controller.enqueue(encoder.encode(`${index + 1}. ${suggestion}\n`));
          });
        }

        // Adicionar follow-up questions
        if (response.followUpQuestions && response.followUpQuestions.length > 0) {
          controller.enqueue(encoder.encode('\n\n❓ **Follow-up Questions:**\n'));
          response.followUpQuestions.forEach((question: string, index: number) => {
            controller.enqueue(encoder.encode(`• ${question}\n`));
          });
        }

        // Adicionar confiança se alta
        if (response.confidence > 0.8) {
          controller.enqueue(encoder.encode(`\n\n✅ **Confidence Level:** ${Math.round(response.confidence * 100)}%`));
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
    console.error('Advanced AI Local Error:', error);
    
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}