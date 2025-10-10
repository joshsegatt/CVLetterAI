import Stripe from 'stripe';
import { platformEnv } from '@/services/platform/env';

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
    label: 'One-time 48h',
    amount: 599,
    currency: 'gbp',
    interval: null,
    mode: 'payment',
    priceId: platformEnv.stripePriceOneTime || undefined
  },
  {
    id: 'price_subscription',
    label: 'Pro monthly',
    amount: 999,
    currency: 'gbp',
    interval: 'month',
    mode: 'subscription',
    priceId: platformEnv.stripePriceSubscription || undefined
  }
];

export function getCheckoutConfig(planId: PricingPlanId) {
  const plan = pricingTable.find((item) => item.id === planId);
  if (!plan || plan.mode === 'free' || !plan.priceId) {
    return null;
  }

  return {
    priceId: plan.priceId,
    mode: plan.mode === 'subscription' ? 'subscription' : 'payment'
  } as const;
}
