import { streamObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { auth } from "@clerk/nextjs/server";
import { AGENTS, CareerSectionSchema } from "@/lib/ai/agents";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { section, context, jobDescription } = await req.json();

    let schema: any = z.object({ content: z.string() });
    let system = AGENTS.WRITER.system;
    let prompt = "";

    switch (section) {
      case "summary":
        prompt = `Write a powerful 3-sentence professional summary for a ${context.role} role. Use this context: ${JSON.stringify(context)}. Target Job: ${jobDescription}`;
        break;
      case "experience":
        schema = CareerSectionSchema;
        prompt = `Rewrite this experience section to be more impactful and ATS-optimized. \n\nContext: ${JSON.stringify(context)} \n\nJob: ${jobDescription}`;
        break;
      case "skills":
        schema = z.object({ skills: z.array(z.string()) });
        prompt = `Suggest the top 10 most relevant skills for a ${context.role} applying to this job: ${jobDescription}`;
        break;
      default:
        return new Response("Invalid section", { status: 400 });
    }

    const result = await streamObject({
      model: anthropic("claude-3-5-sonnet-20240620"),
      system,
      prompt,
      schema,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("[STREAM_ERROR]", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
