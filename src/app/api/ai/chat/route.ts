import { NextResponse } from 'next/server';
import { streamChatCompletion } from '../../../../services/ai/chat';
import { SuperIntelligentAI } from '../../../../services/ai/super-intelligent-ai';

import type { ChatCompletionMessage } from '../../../../services/ai/types';

export const runtime = 'nodejs';

interface ChatRequestBody {
  messages?: ChatCompletionMessage[];
  locale?: string;
  message?: string;
  conversationHistory?: { role: string; content: string }[];
  sessionId?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    
    // Handle super intelligent chat with multilingual and web search capabilities
    if (body.message) {
      const sessionId = body.sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const response = await SuperIntelligentAI.generateSuperIntelligentResponse(
        body.message,
        sessionId
      );
      
      return NextResponse.json({
        content: response.response,
        language: response.language,
        confidence: response.confidence,
        conversationStyle: response.conversationStyle,
        followUpSuggestions: response.followUpSuggestions,
        webInsights: response.webInsights,
        processingTime: response.processingTime,
        intelligenceLevel: response.intelligenceLevel,
        sessionId: sessionId
      });
    }
    
    // Fallback to streaming chat for compatibility with older interfaces
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const locale = typeof body?.locale === 'string' ? body.locale : undefined;
    const sessionId = body.sessionId || `stream-${Date.now()}`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of streamChatCompletion(messages, { locale, sessionId })) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(
            encoder.encode(
              '⚠️ Something went wrong while contacting the AI service. Please try again.'
            )
          );
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-AI-Model': 'super-intelligent-multilingual'
      }
    });
  } catch (error) {
    console.error('Failed to handle chat request', error);
    return NextResponse.json(
      { error: 'Unable to process chat request at this time.' },
      { status: 500 }
    );
  }
}
