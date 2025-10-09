'use client';

import type { LetterBuilderForm } from '@/features/letter-builder/schema';

interface SaveLetterResponse {
  id: string;
}

export async function saveLetterDraft(payload: LetterBuilderForm): Promise<SaveLetterResponse> {
  const response = await fetch('/api/letters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      payload
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to save letter draft');
  }

  const json = (await response.json()) as SaveLetterResponse;
  return json;
}
