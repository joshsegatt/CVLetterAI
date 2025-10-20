import { z } from 'zod';

export const letterBuilderSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  recipientName: z.string().min(2, 'Recipient is required'),
  propertyAddress: z.string().min(4, 'Add the full property address'),
  context: z
    .string()
    .min(10, 'Describe the scenario for accurate drafting')
    .max(1200, 'Keep context under 1200 characters'),
  tone: z.enum(['formal', 'polite', 'firm']),
  includeLegalReference: z.boolean()
});

export type LetterBuilderForm = {
  id?: string;
  userId?: string;
  recipientName: string;
  propertyAddress: string;
  context: string;
  tone: 'formal' | 'polite' | 'firm';
  includeLegalReference: boolean;
};

export const defaultLetterBuilderValues: LetterBuilderForm = {
  id: undefined,
  userId: undefined,
  recipientName: 'Ms. Patel',
  propertyAddress: 'Flat 4B, 21 Riverbank Way, London, W1',
  context:
    'Notice regarding rent arrears and next steps aligned with the tenancy agreement section 4.3.',
  tone: 'formal',
  includeLegalReference: true
};
