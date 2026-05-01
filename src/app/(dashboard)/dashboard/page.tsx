import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { documents, subscriptions, jobApplications } from "@/db/schema";
import { eq, isNull, and, desc } from "drizzle-orm";
import { DashboardOverview } from "./dashboard-overview";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [user, recentDocs, sub, apps] = await Promise.all([
    db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
      columns: { id: true, name: true, creditsRemaining: true, creditsTotal: true },
    }),
    db
      .select()
      .from(documents)
      .where(and(eq(documents.userId, userId), isNull(documents.deletedAt)))
      .orderBy(desc(documents.createdAt))
      .limit(6),
    db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
      columns: { status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true },
    }),
    db.query.jobApplications.findMany({
      where: (a, { eq }) => eq(a.userId, userId),
      orderBy: (a, { desc }) => [desc(a.updatedAt)],
      limit: 10,
    }),
  ]);

  return (
    <DashboardOverview
      user={user}
      recentDocs={recentDocs}
      subscription={sub ?? null}
      applications={apps}
    />
  );
}
