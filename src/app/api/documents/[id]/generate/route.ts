import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { db } from "@/db";
import { documents, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { inngest } from "@/inngest/client";
import { eq, and, isNull } from "drizzle-orm";
import { z } from "zod";

const generateSchema = z.object({
  model: z.enum(["gpt-4o", "gpt-4o-mini", "claude-opus-4-5", "claude-sonnet-4-5"]).optional().default("gpt-4o-mini"),
  additionalContext: z.string().max(2000).optional(),
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

  if (doc.generationStatus === "processing") {
    return NextResponse.json(
      { error: "Document is already being generated" },
      { status: 409 }
    );
  }

  // Check the user's credit balance and plan limits
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if ((user.creditsRemaining ?? 0) <= 0) {
    return NextResponse.json(
      { error: "No credits remaining" },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { model, additionalContext } = parsed.data;

  // Mark document as processing
  await db
    .update(documents)
    .set({ generationStatus: "processing", updatedAt: new Date() })
    .where(eq(documents.id, id));

  // Send event to Inngest
  await inngest.send({
    name: "document/generate",
    data: {
      documentId: id,
      userId: userId,
      model,
      additionalContext,
    },
  });

  return NextResponse.json(
    { message: "Generation started", documentId: id },
    { status: 202 }
  );
}
