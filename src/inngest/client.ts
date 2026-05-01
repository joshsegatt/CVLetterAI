import { Inngest } from "inngest";
import { z } from "zod";
import { env } from "@/env";

export const inngest = new Inngest({
  id: "executive-studio",
  schemas: {
    "document/generate": {
      data: z.object({
        userId: z.string(),
        documentId: z.string(),
        documentType: z.enum(["resume", "cover_letter", "linkedin_profile", "interview_prep"]),
        model: z.string().optional(),
        jobDescription: z.string().optional(),
        additionalInstructions: z.string().optional(),
      }),
    },
    "document/optimize": {
      data: z.object({
        userId: z.string(),
        documentId: z.string(),
        optimizationType: z.enum(["ats", "readability", "keywords"]),
        jobDescription: z.string().optional(),
      }),
    },
    "user/welcome": {
      data: z.object({
        userId: z.string(),
        email: z.string().email(),
        name: z.string().nullable(),
      }),
    },
    "user/subscription.updated": {
      data: z.object({
        userId: z.string(),
        stripeCustomerId: z.string(),
        stripeSubscriptionId: z.string().optional(),
        priceId: z.string().optional(),
        plan: z.enum(["free", "pro", "executive"]),
        status: z.string(),
        currentPeriodEnd: z.number().optional(),
      }),
    },
    "user/credits.depleted": {
      data: z.object({
        userId: z.string(),
        email: z.string().email(),
      }),
    },
    "billing/invoice.payment_failed": {
      data: z.object({
        userId: z.string(),
        stripeCustomerId: z.string(),
        invoiceId: z.string(),
        attemptCount: z.number(),
      }),
    },
  },
  eventKey: env.INNGEST_EVENT_KEY,
  signingKey: env.INNGEST_SIGNING_KEY,
});
