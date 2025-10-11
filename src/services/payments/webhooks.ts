import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { platformEnv } from '@/services/platform/env';
import { getStripeClient } from '@/services/payments/stripe';

export async function handleStripeWebhook(request: Request) {
  const signature = request.headers.get('stripe-signature') ?? '';
  if (!platformEnv.stripeWebhookSecret) {
    return NextResponse.json({ received: false }, { status: 500 });
  }
  const payload = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      platformEnv.stripeWebhookSecret
    );
  } catch (error) {
    console.error('Stripe webhook signature verification failed', error);
    return NextResponse.json({ received: false }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      console.info('Checkout completed', event.data.object.id);
      break;
    case 'customer.subscription.updated':
      console.info('Subscription updated', event.data.object.id);
      break;
    default:
      console.debug(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
