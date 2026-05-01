export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, isNull, desc } from "drizzle-orm";
import { z } from "zod";

const createDocumentSchema = z.object({
  title: z.string().min(1).max(255),
  type: z.enum([
    "resume",
    "cover_letter",
    "linkedin_summary",
    "executive_bio",
    "other",
  ]),
  jobTitle: z.string().optional(),
  jobDescription: z.string().optional(),
  companyName: z.string().optional(),
  tone: z.string().optional(),
  targetRole: z.string().optional(),
  yearsOfExperience: z.number().int().min(0).max(50).optional(),
  content: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);
  const offset = Number(searchParams.get("offset") ?? "0");

  const conditions = [
    eq(documents.userId, userId),
    isNull(documents.deletedAt),
    isNull(documents.parentDocumentId),
  ];

  if (type) {
    conditions.push(
      eq(
        documents.type,
        type as "resume" | "cover_letter" | "linkedin_summary" | "executive_bio" | "other"
      )
    );
  }

  const results = await db.query.documents.findMany({
    where: and(...conditions),
    orderBy: [desc(documents.updatedAt)],
    limit,
    offset,
  });

  return NextResponse.json({ documents: results });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createDocumentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const [doc] = await db
    .insert(documents)
    .values({
      userId: userId,
      title: data.title,
      type: data.type,
      content: data.content ?? "",
      jobTitle: data.jobTitle ?? null,
      jobDescription: data.jobDescription ?? null,
      companyName: data.companyName ?? null,
      tone: data.tone ?? null,
      targetRole: data.targetRole ?? null,
      yearsOfExperience: data.yearsOfExperience ?? null,
      generationStatus: "pending",
      version: 1,
    })
    .returning();

  return NextResponse.json({ document: doc }, { status: 201 });
}
