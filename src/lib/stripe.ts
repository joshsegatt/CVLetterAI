import Stripe from "stripe";
import { env } from "@/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia",
  typescript: true,
});

// ─── Price IDs ──────────────────────────────────────────────────────────────

export const STRIPE_PRICES = {
  pro: {
    monthly: env.STRIPE_PRO_MONTHLY_PRICE_ID,
    annual: env.STRIPE_PRO_ANNUAL_PRICE_ID,
  },
  executive: {
    monthly: env.STRIPE_EXECUTIVE_MONTHLY_PRICE_ID,
    annual: env.STRIPE_EXECUTIVE_ANNUAL_PRICE_ID,
  },
} as const;

// ─── Plan limits ─────────────────────────────────────────────────────────────

export const PLAN_LIMITS = {
  free: {
    documentsPerMonth: 3,
    aiRewritesPerMonth: 5,
    atsScans: 1,
    coverLetters: 1,
    storedDocuments: 3,
  },
  pro: {
    documentsPerMonth: 25,
    aiRewritesPerMonth: 50,
    atsScans: 25,
    coverLetters: 25,
    storedDocuments: 50,
  },
  executive: {
    documentsPerMonth: -1, // unlimited
    aiRewritesPerMonth: -1,
    atsScans: -1,
    coverLetters: -1,
    storedDocuments: -1,
  },
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Create or retrieve a Stripe customer for a given user.
 */
export async function getOrCreateStripeCustomer({
  userId,
  email,
  name,
}: {
  userId: string;
  email: string;
  name?: string | null;
}): Promise<string> {
  // Search for existing customer by metadata userId
  const existing = await stripe.customers.search({
    query: `metadata['userId']:'${userId}'`,
    limit: 1,
  });

  if (existing.data.length > 0) {
    return existing.data[0].id;
  }

  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { userId },
  });

  return customer.id;
}

/**
 * Create a Stripe Checkout Session for upgrading to a paid plan.
 */
export async function createCheckoutSession({
  customerId,
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: {
  customerId: string;
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
    },
    allow_promotion_codes: true,
  });
}

/**
 * Create a Stripe Billing Portal Session for managing existing subscription.
 */
export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

/**
 * Retrieve a subscription with expanded items.
 */
export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data.price"],
  });
}

/**
 * Map a Stripe Price ID back to our internal plan name.
 */
export function getPlanFromPriceId(priceId: string): PlanName {
  const allPrices = [
    { id: STRIPE_PRICES.pro.monthly, plan: "pro" as PlanName },
    { id: STRIPE_PRICES.pro.annual, plan: "pro" as PlanName },
    { id: STRIPE_PRICES.executive.monthly, plan: "executive" as PlanName },
    { id: STRIPE_PRICES.executive.annual, plan: "executive" as PlanName },
  ];

  return allPrices.find((p) => p.id === priceId)?.plan ?? "free";
}
