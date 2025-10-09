import { NextResponse } from 'next/server';
import { getStripeClient, getCheckoutConfig, type PricingPlanId } from '@/services/payments/stripe';
import { platformEnv } from '@/services/platform/env';
import { captureError } from '@/services/platform/observability';

export const runtime = 'nodejs';

interface CheckoutBody {
  planId?: PricingPlanId;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const planId = body.planId;
    const config = planId ? getCheckoutConfig(planId) : null;

    if (!planId || !config) {
      return NextResponse.json({ error: 'Invalid plan selection.' }, { status: 400 });
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: config.mode,
      billing_address_collection: 'auto',
      customer_creation: 'if_required',
      line_items: [
        {
          price: config.priceId,
          quantity: 1
        }
      ],
      metadata: {
        product: planId
      },
      success_url: `${platformEnv.siteUrl}/pricing?purchase=success`,
      cancel_url: `${platformEnv.siteUrl}/pricing?purchase=cancelled`
    });

    if (!session.url) {
      throw new Error('Stripe session missing redirect URL');
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    captureError(error, { scope: 'checkout-session' });
    return NextResponse.json({ error: 'Unable to start checkout.' }, { status: 500 });
  }
}
