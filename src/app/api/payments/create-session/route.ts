import { NextResponse } from 'next/server';
import { getStripeClient, getCheckoutConfig, type PricingPlanId } from '../../../../services/payments/stripe';
import { platformEnv } from '../../../../services/platform/env';
import { captureError } from '../../../../services/platform/observability';

export const runtime = 'nodejs';

const ALLOWED_PLAN_IDS: PricingPlanId[] = ['price_one_time', 'price_subscription'];

interface CheckoutBody {
  planId?: unknown;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const planId = typeof body.planId === 'string' ? (body.planId as PricingPlanId) : undefined;

    if (!planId || !ALLOWED_PLAN_IDS.includes(planId)) {
      return NextResponse.json({ error: 'Invalid plan selection.' }, { status: 400 });
    }

    const config = getCheckoutConfig(planId);

    if (!config) {
      // Verificar se é problema de configuração
      if (!platformEnv.stripePriceOneTime && planId === 'price_one_time') {
        return NextResponse.json({ 
          error: 'Pro plan payment not configured. Please contact support.' 
        }, { status: 503 });
      }
      if (!platformEnv.stripePriceSubscription && planId === 'price_subscription') {
        return NextResponse.json({ 
          error: 'Enterprise plan payment not configured. Please contact support.' 
        }, { status: 503 });
      }
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
