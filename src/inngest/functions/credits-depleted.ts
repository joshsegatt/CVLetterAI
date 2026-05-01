import { inngest } from "@/inngest/client";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export const creditsDepleted = (inngest as any).createFunction(
  {
    id: "credits-depleted",
    name: "Handle Credits Depleted",
    retries: 2,
  },
  { event: "user/credits.depleted" },
  async ({ event, step }: any) => {
    const { userId } = event.data;

    const user = await step.run("fetch-user", async () => {
      const [u] = await db
        .select({ email: users.email, name: users.name })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      return u;
    });

    if (!user?.email) return { success: false, reason: "user-not-found" };

    await step.run("send-credits-depleted-email", async () => {
      await resend.emails.send({
        from: "Executive Studio <hello@executivestudio.ai>",
        to: user.email as string,
        subject: "You've used all your generation credits",
        html: `
<html><body style="margin:0;padding:40px 20px;background:#0a0a0a;font-family:-apple-system,sans-serif;color:#e0e0e0;">
  <div style="max-width:560px;margin:0 auto;background:#111;border-radius:16px;border:1px solid #1f1f1f;padding:40px;">
    <div style="width:48px;height:48px;background:#2a1a1a;border-radius:12px;margin-bottom:24px;display:flex;align-items:center;justify-content:center;font-size:24px;">⚡</div>
    <h1 style="color:#fff;font-size:28px;margin:0 0 16px;">Credits Depleted</h1>
    <p style="color:#a0a0b0;line-height:1.7;margin:0 0 24px;">
      You've used all of your available generation credits. Upgrade your plan to continue creating world-class career documents.
    </p>
    <div style="background:#1a1a2e;border:1px solid #2a2a4e;border-radius:12px;padding:24px;margin-bottom:28px;">
      <h3 style="color:#fff;margin:0 0 16px;font-size:16px;">Upgrade Benefits</h3>
      <ul style="color:#a0a0b0;line-height:2;margin:0;padding-left:20px;">
        <li>Unlimited AI document generation</li>
        <li>Advanced optimization features</li>
        <li>Priority processing</li>
        <li>Premium AI models (Claude, GPT-4o)</li>
      </ul>
    </div>
    <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;">
      Upgrade Now →
    </a>
    <p style="color:#505060;font-size:13px;margin-top:32px;">Executive Studio · AI Career Intelligence Platform</p>
  </div>
</body></html>`,
      });
    });

    return { success: true, userId };
  }
);
