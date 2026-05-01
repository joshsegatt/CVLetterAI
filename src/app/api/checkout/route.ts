import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createCheckoutSession, getOrCreateStripeCustomer, STRIPE_PRICES } from "@/lib/stripe";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { planId } = await req.json();

    let priceId = "";
    if (planId === "pro_monthly") {
      priceId = STRIPE_PRICES.pro.monthly;
    } else if (planId === "executive_annual") {
      priceId = STRIPE_PRICES.executive.annual;
    } else {
      return new NextResponse("Invalid Plan", { status: 400 });
    }

    if (!priceId) {
      return new NextResponse("Price ID not configured", { status: 500 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    // 1. Get or create Stripe Customer
    const customerId = await getOrCreateStripeCustomer({
      userId: user.id,
      email: email || "",
      name,
    });

    // 2. Sync stripeCustomerId back to our DB if not present
    await db.update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, user.id));

    // 3. Create Checkout Session
    const origin = req.headers.get("origin");
    const session = await createCheckoutSession({
      customerId,
      priceId,
      userId: user.id,
      successUrl: `${origin}/dashboard/billing?success=true`,
      cancelUrl: `${origin}/dashboard/billing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
