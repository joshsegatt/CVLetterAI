import Stripe from 'stripe';
import { platformEnv } from '../platform/env';

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (!stripeClient) {
    if (!platformEnv.stripeSecret) {
      throw new Error('Stripe secret key is not configured');
    }
    stripeClient = new Stripe(platformEnv.stripeSecret, {
      apiVersion: '2024-04-10',
      typescript: true
    });
  }
  return stripeClient;
}

export type PricingPlanId = 'price_free' | 'price_one_time' | 'price_subscription';

export interface PricingPlan {
  id: PricingPlanId;
  label: string;
  amount: number;
  currency: string;
  interval: Stripe.Price.Recurring.Interval | null;
  mode: 'free' | 'payment' | 'subscription';
  priceId?: string;
}

export const pricingTable: PricingPlan[] = [
  {
    id: 'price_free',
    label: 'Free',
    amount: 0,
    currency: 'gbp',
    interval: null,
    mode: 'free'
  },
  {
    id: 'price_one_time',
    label: 'Pro Plan',
    amount: 599,
    currency: 'gbp',
    interval: null,
    mode: 'payment',
    priceId: platformEnv.stripePriceOneTime || undefined
  },
  {
    id: 'price_subscription',
    label: 'Enterprise Plan',
    amount: 1299,
    currency: 'gbp',
    interval: 'month',
    mode: 'subscription',
    priceId: platformEnv.stripePriceSubscription || undefined
  }
];

export function getCheckoutConfig(planId: PricingPlanId) {
  const plan = pricingTable.find((item) => item.id === planId);
  if (!plan || plan.mode === 'free') {
    return null;
  }

  // Verificar se o Price ID está configurado
  if (!plan.priceId || plan.priceId === 'undefined') {
    console.error(`Stripe Price ID não configurado para o plano: ${planId}`);
    console.error('Configure as variáveis STRIPE_PRICE_ONE_TIME e STRIPE_PRICE_SUBSCRIPTION no .env');
    return null;
  }

  return {
    priceId: plan.priceId,
    mode: plan.mode === 'subscription' ? 'subscription' : 'payment'
  } as const;
}
