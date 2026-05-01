import { inngest } from "@/inngest/client";
import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export const sendWelcomeEmail = (inngest as any).createFunction(
  {
    id: "send-welcome-email",
    name: "Send Welcome Email",
    retries: 3,
  },
  { event: "user/welcome" },
  async ({ event, step }: any) => {
    const { userId, email, name } = event.data;

    const firstName = name?.split(" ")[0] ?? "there";

    await step.run("send-email", async () => {
      const { error } = await resend.emails.send({
        from: `CVLetterAI <${env.RESEND_FROM_EMAIL}>`,
        to: email,
        subject: "Welcome to CVLetterAI — Your AI Career Intelligence Platform",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to CVLetterAI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #111111; border-radius: 16px; border: 1px solid #1f1f1f; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 48px 48px 40px;">
              <p style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                ✦ CVLetterAI
              </p>
              <h1 style="margin: 24px 0 0; font-size: 32px; font-weight: 700; color: #ffffff; line-height: 1.2;">
                Welcome, ${firstName}.
              </h1>
              <p style="margin: 12px 0 0; font-size: 16px; color: #a0a0b0; line-height: 1.6;">
                Your AI-powered career intelligence platform is ready.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 48px;">
              <p style="margin: 0 0 24px; font-size: 16px; color: #c0c0c0; line-height: 1.7;">
                You now have access to the most advanced AI career tools available. Here's what you can do with your free account:
              </p>

              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 16px; background: #1a1a1a; border-radius: 12px; margin-bottom: 12px; border: 1px solid #2a2a2a;">
                    <p style="margin: 0; font-size: 15px; font-weight: 600; color: #ffffff;">📄 AI Document Generation</p>
                    <p style="margin: 6px 0 0; font-size: 14px; color: #808090; line-height: 1.5;">Generate professional resumes, cover letters, and LinkedIn profiles tailored to any role.</p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 16px; background: #1a1a1a; border-radius: 12px; border: 1px solid #2a2a2a;">
                    <p style="margin: 0; font-size: 15px; font-weight: 600; color: #ffffff;">🎯 ATS Optimization</p>
                    <p style="margin: 6px 0 0; font-size: 14px; color: #808090; line-height: 1.5;">Optimize your documents to pass applicant tracking systems at top companies.</p>
                  </td>
                </tr>
                <tr><td style="height: 10px;"></td></tr>
                <tr>
                  <td style="padding: 16px; background: #1a1a1a; border-radius: 12px; border: 1px solid #2a2a2a;">
                    <p style="margin: 0; font-size: 15px; font-weight: 600; color: #ffffff;">⚡ 5 Free Generations</p>
                    <p style="margin: 6px 0 0; font-size: 14px; color: #808090; line-height: 1.5;">Start with 5 free document generations. Upgrade anytime for unlimited access.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard"
                       style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: -0.2px;">
                       Open Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 48px; border-top: 1px solid #1f1f1f;">
              <p style="margin: 0; font-size: 13px; color: #505060; line-height: 1.6; text-align: center;">
                You're receiving this because you signed up for CVLetterAI.<br />
                <a href="${env.NEXT_PUBLIC_APP_URL}" style="color: #6366f1; text-decoration: none;">CVLetterAI</a> · AI Career Intelligence Platform
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `.trim(),
      });

      if (error) {
        throw new Error(`Failed to send welcome email: ${error.message}`);
      }
    });

    return { success: true, userId, email };
  }
);
