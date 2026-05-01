import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);

function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}

/** GET /api/admin/credits?userId=<id>  — look up a user's credits */
export async function GET(request: NextRequest) {
  try {
    const { userId: authUserId } = await auth();
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;

    if (!authUserId || !isAdmin(email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        creditsRemaining: users.creditsRemaining,
        creditsTotal: users.creditsTotal,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[admin/credits GET] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** POST /api/admin/credits — add or set credits for a user
 *  Body: { userId: string; amount: number; operation: "add" | "set" }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId: authUserId } = await auth();
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;

    if (!authUserId || !isAdmin(email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, amount, operation } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    if (typeof amount !== "number" || amount < 0) {
      return NextResponse.json(
        { error: "amount must be a non-negative number" },
        { status: 400 }
      );
    }
    if (operation !== "add" && operation !== "set") {
      return NextResponse.json(
        { error: "operation must be 'add' or 'set'" },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId));

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let updateValues: any;

    if (operation === "set") {
      updateValues = {
        creditsRemaining: amount,
        creditsTotal: amount,
      };
    } else {
      // operation === "add"
      updateValues = {
        creditsRemaining: sql`${users.creditsRemaining} + ${amount}`,
        creditsTotal: sql`${users.creditsTotal} + ${amount}`,
      };
    }

    const [updated] = await db
      .update(users)
      .set(updateValues)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        creditsRemaining: users.creditsRemaining,
        creditsTotal: users.creditsTotal,
      });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("[admin/credits POST] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
