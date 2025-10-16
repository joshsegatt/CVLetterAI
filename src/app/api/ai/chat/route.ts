import { NextResponse } from 'next/server';
import { streamChatCompletion } from '../../../../services/ai/chat';
import type { ChatCompletionMessage } from '../../../../services/ai/types';

export const runtime = 'nodejs';

interface ChatRequestBody {
  messages?: ChatCompletionMessage[];
  locale?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const locale = typeof body?.locale === 'string' ? body.locale : undefined;

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of streamChatCompletion(messages, { locale })) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
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
        'Content-Type': 'text/plain; charset=utf-8'
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
