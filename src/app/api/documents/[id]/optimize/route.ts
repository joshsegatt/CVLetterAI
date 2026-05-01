import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { inngest } from "@/inngest/client";
import { eq, and, isNull } from "drizzle-orm";
import { z } from "zod";

const optimizeSchema = z.object({
  model: z.enum(["gpt-4o", "gpt-4o-mini", "claude-opus-4-5", "claude-sonnet-4-5"]).optional().default("gpt-4o-mini"),
  optimizationGoal: z
    .enum(["ats", "impact", "concise", "comprehensive"])
    .optional()
    .default("ats"),
  targetJobDescription: z.string().max(5000).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Fetch the document
  const doc = await db.query.documents.findFirst({
    where: and(
      eq(documents.id, id),
      eq(documents.userId, userId),
      isNull(documents.deletedAt)
    ),
  });

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!doc.content || doc.content.trim().length === 0) {
    return NextResponse.json(
      { error: "Document has no content to optimize. Generate content first." },
      { status: 422 }
    );
  }

  if (doc.generationStatus === "processing") {
    return NextResponse.json(
      { error: "Document is currently being processed" },
      { status: 409 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = optimizeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { model, optimizationGoal, targetJobDescription } = parsed.data;

  // Mark document as processing
  await db
    .update(documents)
    .set({ generationStatus: "processing", updatedAt: new Date() })
    .where(eq(documents.id, id));

  // Send event to Inngest
  await inngest.send({
    name: "document/optimize",
    data: {
      documentId: id,
      userId: userId,
      model,
      optimizationGoal,
      targetJobDescription,
    },
  });

  return NextResponse.json(
    { message: "Optimization started", documentId: id },
    { status: 202 }
  );
}
