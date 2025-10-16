import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import type { LetterBuilderForm } from '../../../features/letter-builder/schema';
import { letterBuilderSchema } from '../../../features/letter-builder/schema';
import { prisma } from '../../../lib/prisma';
import { captureError } from '../../../services/platform/observability';

const DEFAULT_USER_ID = 'demo-user';
const MAX_RESULTS = 10;

export const runtime = 'nodejs';

interface LetterDraftRecord {
  id: string;
  payload: LetterBuilderForm;
  updated_at: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { payload?: unknown };
    const parsed = letterBuilderSchema.parse(body.payload);

    const draftId = parsed.id ?? randomUUID();
    const userId = parsed.userId ?? DEFAULT_USER_ID;

    await prisma.letterDraft.upsert({
      where: { id: draftId },
      update: {
        userId,
        payload: parsed
      },
      create: {
        id: draftId,
        userId,
        payload: parsed
      }
    });

    return NextResponse.json({ id: draftId }, { status: 200 });
  } catch (error) {
    captureError(error, { scope: 'letter-draft-post' });
    return NextResponse.json(
      { error: 'Unable to persist landlord letter.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') ?? DEFAULT_USER_ID;

    const drafts = await prisma.letterDraft.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: MAX_RESULTS
    });

    const responseDrafts: LetterDraftRecord[] = drafts.map((draft: any) => ({
      id: draft.id,
      payload: draft.payload as LetterBuilderForm,
      updated_at: draft.updatedAt.toISOString()
    }));

    return NextResponse.json({ drafts: responseDrafts }, { status: 200 });
  } catch (error) {
    captureError(error, { scope: 'letter-draft-get' });
    return NextResponse.json(
      { error: 'Unable to fetch letters.' },
      { status: 500 }
    );
  }
}
