import { serve } from "inngest/next";
export const dynamic = "force-dynamic";
import { inngest } from "@/inngest/client";
import {
  generateDocument,
  optimizeDocument,
  sendWelcomeEmail,
  subscriptionUpdated,
  creditsDepleted,
  paymentFailed,
} from "@/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateDocument,
    optimizeDocument,
    sendWelcomeEmail,
    subscriptionUpdated,
    creditsDepleted,
    paymentFailed,
  ],
});
