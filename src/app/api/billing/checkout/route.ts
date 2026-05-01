import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe, getOrCreateStripeCustomer, createCheckoutSession, STRIPE_PRICES } from "@/lib/stripe";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return new NextResponse("Email not found", { status: 400 });
    }

    const { plan, interval = "monthly" } = await req.json();
    
    if (plan !== "pro" && plan !== "executive") {
      return new NextResponse("Invalid plan", { status: 400 });
    }

    const priceId = STRIPE_PRICES[plan as "pro" | "executive"][interval as "monthly" | "annual"];

    const customerId = await getOrCreateStripeCustomer({
      userId,
      email,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
    });

    const checkoutSession = await createCheckoutSession({
      customerId,
      priceId,
      userId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/delivery?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/builder`, // Or current builder ID
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[STRIPE_CHECKOUT]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
