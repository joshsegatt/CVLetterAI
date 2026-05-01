import { inngest } from "@/inngest/client";
import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export const paymentFailed = (inngest as any).createFunction(
  {
    id: "payment-failed",
    name: "Handle Payment Failed",
    retries: 3,
  },
  { event: "billing/invoice.payment_failed" },
  async ({ event, step }: any) => {
    const { stripeCustomerId, invoiceId, attemptCount } = event.data;

    const user = await step.run("fetch-user-by-customer", async () => {
      const foundUser = await db.query.users.findFirst({
        where: eq(users.stripeCustomerId, stripeCustomerId),
        columns: { id: true, email: true, name: true },
      });
      if (!foundUser) return null;
      return { userId: foundUser.id, userEmail: foundUser.email, userName: foundUser.name };
    });

    if (!user?.userEmail) return { success: false, reason: "user-not-found" };

    await step.run("update-subscription-past-due", async () => {
      await db
        .update(subscriptions)
        .set({ status: "past_due", updatedAt: new Date() })
        .where(eq(subscriptions.userId, user!.userId));
    });

    await step.run("send-payment-failed-email", async () => {
      const isLastAttempt = attemptCount >= 3;

      await resend.emails.send({
        from: `CVLetterAI <${env.RESEND_FROM_EMAIL}>`,
        to: user.userEmail as string,
        subject: isLastAttempt
          ? "⚠️ Final notice: Payment failed — action required"
          : "Payment failed — please update your payment method",
        html: `
<html><body style="margin:0;padding:40px 20px;background:#0a0a0a;font-family:-apple-system,sans-serif;color:#e0e0e0;">
  <div style="max-width:560px;margin:0 auto;background:#111;border-radius:16px;border:1px solid #1f1f1f;padding:40px;">
    <div style="width:48px;height:48px;background:#2a1a1a;border-radius:12px;margin-bottom:24px;font-size:28px;line-height:48px;text-align:center;">⚠️</div>
    <h1 style="color:#fff;font-size:26px;margin:0 0 16px;">Payment Failed</h1>
    <p style="color:#a0a0b0;line-height:1.7;margin:0 0 24px;">
      We were unable to process your payment${attemptCount > 1 ? ` (attempt ${attemptCount})` : ""}. 
      ${isLastAttempt ? "This is our final attempt. Please update your payment method immediately to avoid losing access." : "Please update your payment method to continue using CVLetterAI."}
    </p>
    ${
      isLastAttempt
        ? `<div style="background:#2a1a1a;border:1px solid #3a2020;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="color:#f87171;margin:0;font-weight:600;">Your subscription will be cancelled if payment is not received within 24 hours.</p>
    </div>`
        : ""
    }
    <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;">
      Update Payment Method
    </a>
    <p style="color:#505060;font-size:13px;margin-top:32px;">Invoice ID: ${invoiceId} · CVLetterAI Billing</p>
  </div>
</body></html>`,
      });
    });

    return { success: true, stripeCustomerId, attemptCount };
  }
);
