import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

import { eq } from "drizzle-orm";
import { z } from "zod";

const ProfileSchema = z.object({
  headline: z.string().max(200).optional(),
  summary: z.string().max(2000).optional(),
  targetRole: z.string().max(120).optional(),
  targetIndustry: z.string().max(120).optional(),
  yearsOfExperience: z.number().int().min(0).max(60).optional(),
  skills: z.array(z.string().max(80)).max(50).optional(),
  location: z.string().max(120).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId),
  });

  return NextResponse.json({ profile: profile ?? null });
}

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = ProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const existing = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, userId),
    columns: { id: true },
  });

  let profile;
  if (existing) {
    [profile] = await db
      .update(userProfiles)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
  } else {
    [profile] = await db
      .insert(userProfiles)
      .values({ userId, ...parsed.data })
      .returning();
  }

  return NextResponse.json({ profile });
}

export async function PATCH(req: NextRequest) {
  return PUT(req);
}
