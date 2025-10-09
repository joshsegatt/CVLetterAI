import { handleStripeWebhook } from '@/services/payments/webhooks';

export const runtime = 'edge';

export async function POST(request: Request) {
  return handleStripeWebhook(request);
}
