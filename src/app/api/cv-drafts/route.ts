import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import type { CvBuilderForm } from '../../../features/cv-builder/schema';
import { cvBuilderSchema } from '../../../features/cv-builder/schema';
import { prisma } from '../../../lib/prisma';
import { captureError } from '../../../services/platform/observability';

const DEFAULT_USER_ID = 'demo-user';
const MAX_RESULTS = 10;

export const runtime = 'nodejs';

interface CvDraftRecord {
  id: string;
  payload: CvBuilderForm;
  updated_at: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { payload?: unknown };
    const parsed = cvBuilderSchema.parse(body.payload);

    const draftId = parsed.id ?? randomUUID();
    const userId = parsed.userId ?? DEFAULT_USER_ID;

    await prisma.cvDraft.upsert({
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
    captureError(error, { scope: 'cv-draft-post' });
    return NextResponse.json(
      { error: 'Unable to persist CV draft. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') ?? DEFAULT_USER_ID;

    const drafts = await prisma.cvDraft.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: MAX_RESULTS
    });

    const responseDrafts: CvDraftRecord[] = drafts.map((draft) => ({
      id: draft.id,
      payload: draft.payload as CvBuilderForm,
      updated_at: draft.updatedAt.toISOString()
    }));

    return NextResponse.json({ drafts: responseDrafts }, { status: 200 });
  } catch (error) {
    captureError(error, { scope: 'cv-draft-get' });
    return NextResponse.json(
      { error: 'Unable to fetch CV drafts.' },
      { status: 500 }
    );
  }
}
