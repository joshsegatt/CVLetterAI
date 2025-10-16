'use client';

import type { CvBuilderForm } from '../schema';

interface SaveDraftResponse {
  id: string;
}

export async function saveCvDraft(payload: CvBuilderForm): Promise<SaveDraftResponse> {
  const response = await fetch('/api/cv-drafts', {
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
    throw new Error(message || 'Failed to save CV draft');
  }

  const json = (await response.json()) as SaveDraftResponse;
  return json;
}
