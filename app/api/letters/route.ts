import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { letterBuilderSchema } from '@/features/letter-builder/schema';
import { captureError } from '@/services/platform/observability';
import { getSupabaseServiceRoleClient } from '@/services/supabase/client';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { payload?: unknown };
    const parsed = letterBuilderSchema.parse(body.payload);

    const supabase = getSupabaseServiceRoleClient();
    const draftId = parsed.id ?? randomUUID();
    const userId = parsed.userId ?? 'demo-user';

    const { error } = await supabase.from('letter_drafts').upsert(
      {
        id: draftId,
        user_id: userId,
        payload: parsed,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    );

    if (error) {
      throw error;
    }

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
    const userId = searchParams.get('userId') ?? 'demo-user';

    const supabase = getSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from('letter_drafts')
      .select('id, payload, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return NextResponse.json({ drafts: data ?? [] }, { status: 200 });
  } catch (error) {
    captureError(error, { scope: 'letter-draft-get' });
    return NextResponse.json({ error: 'Unable to fetch letters.' }, { status: 500 });
  }
}
