export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/env";
import { getPlanFromPriceId } from "@/lib/stripe";


const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const stripeCustomerId = sub.customer as string;
        const priceId = sub.items.data[0]?.price.id ?? null;
        const productId = (sub.items.data[0]?.price.product as string) ?? null;

        const user = await db.query.users.findFirst({
          where: eq(users.stripeCustomerId, stripeCustomerId),
        });

        if (!user) break;

        const planName = getPlanFromPriceId(priceId ?? "");
        const credits = planName === "executive" ? 9999 : planName === "pro" ? 50 : 5;

        await db
          .insert(subscriptions)
          .values({
            userId: user.id,
            stripeSubscriptionId: sub.id,
            stripePriceId: priceId ?? "",
            stripeProductId: productId,
            currentPeriodStart: new Date((sub as any).current_period_start * 1000),
            currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
            status: sub.status,
          })
          .onConflictDoUpdate({
            target: subscriptions.stripeSubscriptionId,
            set: {
              stripePriceId: priceId ?? "",
              stripeProductId: productId,
              currentPeriodStart: new Date((sub as any).current_period_start * 1000),
              currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
              status: sub.status,
              updatedAt: new Date(),
            },
          });

        // Update user credits based on plan (grant credits if active OR trialing)
        const isActive = sub.status === "active" || sub.status === "trialing";
        if (isActive) {
          await db.update(users)
            .set({ 
              creditsRemaining: credits,
              creditsTotal: credits,
              stripeCustomerId: stripeCustomerId
            })
            .where(eq(users.id, user.id));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await db
          .update(subscriptions)
          .set({ status: "canceled", updatedAt: new Date() })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as any).subscription as string | null;
        if (!subId) break;

        const sub = await stripe.subscriptions.retrieve(subId);
        await db
          .update(subscriptions)
          .set({
            currentPeriodStart: new Date((sub as any).current_period_start * 1000),
            currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
            status: sub.status,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, subId));
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as any).subscription as string | null;
        if (!subId) break;

        await db
          .update(subscriptions)
          .set({ status: "past_due", updatedAt: new Date() })
          .where(eq(subscriptions.stripeSubscriptionId, subId));
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
