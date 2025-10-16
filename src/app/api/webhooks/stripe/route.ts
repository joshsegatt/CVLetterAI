import { handleStripeWebhook } from '../../../../services/payments/webhooks';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  return handleStripeWebhook(request);
}
