import { eq } from "drizzle-orm";
import { inngest } from "@/inngest/client";
import { db } from "@/db";
import { documents, generationJobs, users, userProfiles } from "@/db/schema";
import { CareerOrchestrator } from "@/lib/ai/orchestrator";

export const generateDocument = (inngest as any).createFunction(
  { id: "generate-document", name: "Ultra-Elite Document Generator" },
  { event: "document/generate" },
  async ({ event, step }: any) => {
    const { documentId, userId, jobDescription: overrideJd } = event.data;

    // 1. Fetch document and user profile
    const document = await step.run("fetch-document", async () => {
      const results = await db.select().from(documents).where(eq(documents.id, documentId)).limit(1);
      return results[0];
    });

    if (!document) throw new Error("Document not found");

    const userProfile = await step.run("fetch-profile", async () => {
      const results = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
      return results[0];
    });

    const jobDescription = overrideJd || document.jobDescription || "";

    // 2. Mark as processing
    await step.run("mark-processing", async () => {
      await db.update(documents)
        .set({ generationStatus: "processing", updatedAt: new Date() })
        .where(eq(documents.id, documentId));
    });

    // 3. Create generation job record
    const jobId = await step.run("create-job", async () => {
      const [job] = await db.insert(generationJobs).values({
        userId,
        documentId,
        inngestEventId: event.id,
        status: "processing",
        type: document.type as any,
        startedAt: new Date(),
        input: {
          jobTitle: document.jobTitle,
          jobDescription,
          companyName: document.companyName,
        },
      }).returning({ id: generationJobs.id });
      return job.id;
    });

    // 4. Run the Multi-Agent Pipeline (The "Brain")
    const result = await step.run("run-orchestrator", async () => {
      return await CareerOrchestrator.generateTailoredDocument(userProfile, jobDescription);
    });

    // 5. Save generated content & Audit
    await step.run("save-content", async () => {
      await db.update(documents)
        .set({
          content: JSON.stringify(result.document),
          generationStatus: "completed",
          metadata: {
            audit: result.audit,
            strategy: result.strategy,
          },
          updatedAt: new Date(),
        })
        .where(eq(documents.id, documentId));
    });

    // 6. Complete job and deduct credits
    await step.run("finalize", async () => {
      await db.update(generationJobs)
        .set({ status: "completed", completedAt: new Date() })
        .where(eq(generationJobs.id, jobId));

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (user && (user.creditsRemaining ?? 0) > 0) {
        await db.update(users)
          .set({ creditsRemaining: (user.creditsRemaining ?? 1) - 1, updatedAt: new Date() })
          .where(eq(users.id, userId));
      }
    });

    return { success: true, documentId };
  }
);
