import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createBillingPortalSession, getOrCreateStripeCustomer } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    const origin = request.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "";
    const returnUrl = `${origin}/dashboard/billing`;

    const customerId = await getOrCreateStripeCustomer({
      userId,
      email,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
    });

    const portalSession = await createBillingPortalSession({
      customerId,
      returnUrl,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("[billing/portal] Error:", error);
    return NextResponse.json(
      { error: "Failed to create billing portal session" },
      { status: 500 }
    );
  }
}
