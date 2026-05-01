import { inngest } from "@/inngest/client";
import { db } from "@/db";
import { documents, generationJobs } from "@/db/schema";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { eq } from "drizzle-orm";

export const optimizeDocument = inngest.createFunction(
  {
    id: "optimize-document",
    name: "Optimize Document",
    retries: 2,
    triggers: [{ event: "document/optimize" }],
  },
  async ({ event, step }: any) => {
    const { documentId, userId, optimizationType, jobDescription } = event.data;

    // Fetch the document
    const document = await step.run("fetch-document", async () => {
      const [doc] = await db
        .select()
        .from(documents)
        .where(eq(documents.id, documentId));
      if (!doc) throw new Error(`Document ${documentId} not found`);
      return doc;
    });

    // Create optimization job
    const job = await step.run("create-job", async () => {
      const [newJob] = await db
        .insert(generationJobs)
        .values({
          documentId,
          userId,
          type: document.type,
          status: "processing",
          input: { optimizationType, jobDescription },
        })
        .returning();
      return newJob;
    });

    // Build optimization prompt
    const optimizationPrompts: Record<string, string> = {
      ats: `You are an expert ATS (Applicant Tracking System) optimizer. Analyze and improve this document to pass ATS screening while keeping it compelling for human readers.

Key ATS optimization techniques:
- Use standard section headers (Experience, Education, Skills)
- Include keywords from the job description naturally
- Use standard formatting (avoid tables, graphics)
- Quantify achievements with numbers
- Match exact phrases from the job posting

Job Description:
${jobDescription || "No job description provided"}

Current Document:
${document.content}

Return the optimized document with clear improvements made.`,

      keywords: `You are an expert at keyword optimization for job applications. Enhance this document by strategically incorporating relevant industry keywords and skills.

Job Description:
${jobDescription || "No job description provided"}

Current Document:
${document.content}

Return the keyword-optimized document.`,

      impact: `You are an expert at writing high-impact, results-driven professional documents. Transform this document to emphasize measurable achievements and quantifiable results.

Focus on:
- Converting responsibilities to achievements
- Adding specific metrics (%, $, numbers)
- Using powerful action verbs
- Highlighting business impact

Current Document:
${document.content}

Return the impact-optimized document.`,

      format: `You are a professional document formatting expert. Improve the structure, flow, and presentation of this document.

Focus on:
- Clear, logical structure
- Consistent formatting
- Appropriate length
- Professional tone
- Easy readability

Current Document:
${document.content}

Return the formatted document.`,
    };

    const systemPrompt =
      optimizationPrompts[optimizationType] ||
      optimizationPrompts["ats"];

    // Optimize document using AI
    const result = await step.run("optimize-with-ai", async () => {
      const { text, usage } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: `Please optimize this ${document.type} for ${optimizationType}.`,
        temperature: 0.3,
        maxOutputTokens: 4000,
      });

      return { text, usage };
    });

    // Create new version of document
    await step.run("save-optimized-version", async () => {
      await db.insert(documents).values({
        userId,
        title: `${document.title} (${optimizationType} optimized)`,
        type: document.type,
        content: result.text,
        jobTitle: document.jobTitle,
        jobDescription: document.jobDescription ?? jobDescription,
        companyName: document.companyName,
        tone: document.tone,
        targetRole: document.targetRole,
        yearsOfExperience: document.yearsOfExperience,
        generationStatus: "completed",
        model: "gpt-4o",
        promptTokens: result.usage.promptTokens,
        completionTokens: result.usage.completionTokens,
        version: (document.version ?? 1) + 1,
        parentDocumentId: document.id,
        metadata: { optimizationType, sourceDocumentId: documentId },
      });
    });

    // Update job status
    await step.run("complete-job", async () => {
      await db
        .update(generationJobs)
        .set({
          status: "completed",
          completedAt: new Date(),
        })
        .where(eq(generationJobs.id, job.id));
    });

    return {
      success: true,
      documentId,
      optimizationType,
      tokensUsed: result.usage.promptTokens + result.usage.completionTokens,
    };
  }
);
