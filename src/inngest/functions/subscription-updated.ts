import { inngest } from "@/inngest/client";
import { db } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { env } from "@/env";
import { getPlanFromPriceId } from "@/lib/stripe";

const resend = new Resend(env.RESEND_API_KEY);

export const subscriptionUpdated = (inngest as any).createFunction(
  {
    id: "subscription-updated",
    name: "Handle Subscription Updated",
    retries: 3,
  },
  { event: "user/subscription.updated" },
  async ({ event, step }: any) => {
    const { userId, stripeSubscriptionId, status, priceId, currentPeriodEnd } =
      event.data;

    // Upsert subscription record
    const plan = getPlanFromPriceId(priceId ?? "");

    await step.run("upsert-subscription", async () => {
      await db
        .insert(subscriptions)
        .values({
          userId,
          stripeSubscriptionId: stripeSubscriptionId ?? "",
          stripePriceId: priceId ?? "",
          currentPeriodEnd: currentPeriodEnd
            ? new Date(currentPeriodEnd * 1000)
            : null,
          status: status as any,
        })
        .onConflictDoUpdate({
          target: subscriptions.userId,
          set: {
            stripeSubscriptionId: stripeSubscriptionId ?? "",
            stripePriceId: priceId ?? "",
            currentPeriodEnd: currentPeriodEnd
              ? new Date(currentPeriodEnd * 1000)
              : null,
            status: status as any,
            updatedAt: new Date(),
          },
        });
    });

    // Look up user email for notification
    const user = await step.run("fetch-user", async () => {
      const [u] = await db
        .select({ email: users.email, name: users.name })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      return u;
    });

    if (!user?.email) return { success: true, userId };

    // Send email based on status
    if (status === "active") {
      await step.run("send-upgrade-email", async () => {
        const planLabel =
          plan === "executive"
            ? "Executive"
            : plan === "pro"
              ? "Pro"
              : "Free";

        await resend.emails.send({
          from: "Executive Studio <hello@executivestudio.ai>",
          to: user.email as string,
          subject: `You're now on the ${planLabel} plan 🎉`,
          html: `
<html><body style="margin:0;padding:40px 20px;background:#0a0a0a;font-family:-apple-system,sans-serif;color:#e0e0e0;">
  <div style="max-width:560px;margin:0 auto;background:#111;border-radius:16px;border:1px solid #1f1f1f;padding:40px;">
    <h1 style="color:#fff;font-size:28px;margin:0 0 16px;">You're on ${planLabel} ✦</h1>
    <p style="color:#a0a0b0;line-height:1.7;margin:0 0 24px;">
      Your subscription has been activated. You now have full access to all ${planLabel} features.
    </p>
    <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;">
      Go to Dashboard →
    </a>
    <p style="color:#505060;font-size:13px;margin-top:32px;">Executive Studio · AI Career Intelligence Platform</p>
  </div>
</body></html>`,
        });
      });
    } else if (status === "canceled") {
      await step.run("send-cancellation-email", async () => {
        await resend.emails.send({
          from: "Executive Studio <hello@executivestudio.ai>",
          to: user.email as string,
          subject: "Your subscription has been canceled",
          html: `
<html><body style="margin:0;padding:40px 20px;background:#0a0a0a;font-family:-apple-system,sans-serif;color:#e0e0e0;">
  <div style="max-width:560px;margin:0 auto;background:#111;border-radius:16px;border:1px solid #1f1f1f;padding:40px;">
    <h1 style="color:#fff;font-size:28px;margin:0 0 16px;">Subscription Canceled</h1>
    <p style="color:#a0a0b0;line-height:1.7;margin:0 0 24px;">
      Your Executive Studio subscription has been canceled. You'll retain access until the end of your current billing period.
    </p>
    <p style="color:#a0a0b0;line-height:1.7;margin:0 0 24px;">
      Changed your mind? You can reactivate anytime from your billing settings.
    </p>
    <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing" style="display:inline-block;background:#1f1f2e;color:#a0a0ff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;border:1px solid #3a3a5c;">
      Reactivate Subscription
    </a>
    <p style="color:#505060;font-size:13px;margin-top:32px;">Executive Studio · AI Career Intelligence Platform</p>
  </div>
</body></html>`,
        });
      });
    }

    return { success: true, userId, plan, status };
  }
);
