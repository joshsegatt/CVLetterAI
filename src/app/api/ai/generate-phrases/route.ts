import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { CareerOrchestrator } from "@/lib/ai/orchestrator";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { role, industry, focusArea } = await req.json();

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // Check credits (Costs 1 credit for batch generation)
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || user.creditsRemaining < 1) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 403 });
    }

    // Generate Phrases
    const phrases = await CareerOrchestrator.generateBulletPoints(role, industry, focusArea);

    // Deduct 1 credit
    await db.update(users)
      .set({ creditsRemaining: sql`${users.creditsRemaining} - 1` })
      .where(eq(users.id, userId));

    return NextResponse.json({ phrases });
  } catch (error: any) {
    console.error("[GENERATE_PHRASES_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
