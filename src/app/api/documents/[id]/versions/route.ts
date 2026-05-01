import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, isNull, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Fetch the root document to confirm ownership
  const rootDoc = await db.query.documents.findFirst({
    where: and(
      eq(documents.id, id),
      eq(documents.userId, userId),
      isNull(documents.deletedAt)
    ),
  });

  if (!rootDoc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fetch all versions: the root document + any children with parentDocumentId === id
  // Versions are linked via parentDocumentId. We fetch the parent and all its children.
  const versions = await db.query.documents.findMany({
    where: and(
      eq(documents.userId, userId),
      isNull(documents.deletedAt)
    ),
    orderBy: asc(documents.version),
    columns: {
      id: true,
      title: true,
      version: true,
      parentDocumentId: true,
      generationStatus: true,
      model: true,
      promptTokens: true,
      completionTokens: true,
      createdAt: true,
      updatedAt: true,
      type: true,
    },
  });

  // Filter to only documents in this version chain
  const chain = versions.filter(
    (v) => v.id === id || v.parentDocumentId === id
  );

  return NextResponse.json({ versions: chain });
}
