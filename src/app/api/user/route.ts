export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, userProfiles, subscriptions, documents } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, count, isNull, and } from "drizzle-orm";
import { z } from "zod";

const UpdateUserSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email().optional(),
});

export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user, profile, subscription, docCount] = await Promise.all([
    db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
        creditsRemaining: true,
        creditsTotal: true,
        createdAt: true,
      },
    }),
    db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, userId),
    }),
    db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
      columns: {
        status: true,
        currentPeriodEnd: true,
        stripePriceId: true,
        cancelAtPeriodEnd: true,
      },
    }),
    db
      .select({ count: count() })
      .from(documents)
      .where(and(eq(documents.userId, userId), isNull(documents.deletedAt))),
  ]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      ...user,
      profile: profile ?? null,
      subscription: subscription ?? null,
      documentCount: docCount[0]?.count ?? 0,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = UpdateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name } = parsed.data;

  const [updated] = await db
    .update(users)
    .set({ name, updatedAt: new Date() })
     .where(eq(users.id, userId))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      updatedAt: users.updatedAt,
    });

  return NextResponse.json({ user: updated });
}
