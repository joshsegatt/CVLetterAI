import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { documents, subscriptions } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { BuilderClient } from "./builder-client";

export default async function BuilderLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;

  // Handle Demo Mode
  if (id === "demo") {
    const mockDoc = {
      id: "demo",
      userId: "guest",
      title: "Executive Resume Demo",
      type: "resume",
      content: JSON.stringify({
        summary: "Results-driven executive with a track record of...",
        experience: [],
        education: [],
        skills: [],
      }),
      generationStatus: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      deletedAt: null,
      parentDocumentId: null,
      jobTitle: null,
      jobDescription: null,
      companyName: null,
      tone: "professional",
      targetRole: null,
      yearsOfExperience: null,
    } as any;

    return (
      <BuilderClient
        document={mockDoc}
        model="gpt-4o-mini"
        autoGenerate={false}
        isPro={false}
      >
        {children}
      </BuilderClient>
    );
  }

  if (!userId) redirect("/sign-in");

  const doc = await db.query.documents.findFirst({
    where: and(
      eq(documents.id, id),
      eq(documents.userId, userId),
      isNull(documents.deletedAt)
    ),
  });

  const sub = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });

  if (!doc) redirect("/dashboard");

  return (
    <BuilderClient
      document={doc}
      model="gpt-4o-mini"
      autoGenerate={false}
      isPro={sub?.status === "active"}
    >
      {children}
    </BuilderClient>
  );
}
