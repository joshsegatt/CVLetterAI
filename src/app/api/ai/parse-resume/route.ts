import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { CareerOrchestrator } from "@/lib/ai/orchestrator";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rawText } = await req.json();
    if (!rawText) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // 1. Run the AI Parser
    const structuredProfile = await CareerOrchestrator.parseRawProfile(rawText);

    // 2. Save/Update User Profile
    await db.insert(userProfiles)
      .values({
        userId,
        headline: structuredProfile.headline,
        summary: structuredProfile.summary,
        skills: structuredProfile.skills,
        experience: structuredProfile.experience,
        education: structuredProfile.education,
        rawResumeText: rawText,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userProfiles.userId,
        set: {
          headline: structuredProfile.headline,
          summary: structuredProfile.summary,
          skills: structuredProfile.skills,
          experience: structuredProfile.experience,
          education: structuredProfile.education,
          rawResumeText: rawText,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ success: true, profile: structuredProfile });
  } catch (error) {
    console.error("[PARSE_RESUME_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
