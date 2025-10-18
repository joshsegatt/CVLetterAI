import { NextRequest, NextResponse } from 'next/server';
import { conversationMemory } from '../../../../services/ai/conversation-memory';
import { intelligentPDFService } from '../../../../services/ai/intelligent-pdf';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, type } = await request.json();

    if (!sessionId || !type) {
      return NextResponse.json(
        { error: 'Session ID and type are required' },
        { status: 400 }
      );
    }

    if (type !== 'cv' && type !== 'letter') {
      return NextResponse.json(
        { error: 'Type must be either "cv" or "letter"' },
        { status: 400 }
      );
    }

    // Get session data
    const session = conversationMemory.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Generate PDF
    let result;
    if (type === 'cv') {
      result = await intelligentPDFService.generateCVFromConversation(session);
    } else {
      result = await intelligentPDFService.generateLetterFromConversation(session);
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate PDF' },
        { status: 500 }
      );
    }

    // Mark PDF as generated
    conversationMemory.markPDFGenerated(sessionId);

    return NextResponse.json({
      success: true,
      downloadUrl: result.downloadUrl,
      type: result.type,
      message: `${type === 'cv' ? 'CV' : 'Cover Letter'} generated successfully! 🎉`
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = conversationMemory.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const canGenerate = intelligentPDFService.shouldOfferPDFGeneration(session);
    
    return NextResponse.json({
      sessionId,
      canGenerateCV: canGenerate.cv,
      canGenerateLetter: canGenerate.letter,
      message: canGenerate.message,
      conversationSummary: conversationMemory.getConversationSummary(sessionId),
      extractedData: {
        hasPersonalInfo: !!(session.extractedData.cv?.personal?.firstName && session.extractedData.cv?.personal?.email),
        hasWorkExperience: !!(session.extractedData.cv?.experience?.length),
        hasSkills: !!(session.extractedData.cv?.skills?.length),
        letterReady: !!(session.extractedData.letter?.senderInfo?.name && session.extractedData.letter?.senderInfo?.email)
      }
    });

  } catch (error) {
    console.error('Session Check Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}