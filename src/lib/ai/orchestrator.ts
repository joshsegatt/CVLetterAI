import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { AGENTS, TailoredDocumentSchema, AtsAuditSchema } from "./agents";
import { z } from "zod";

export class CareerOrchestrator {
  /**
   * Stage 1: Smart Parsing
   * Transforms raw text or LinkedIn profile content into a structured UserProfile format.
   */
  static async parseRawProfile(rawText: string) {
    const { object } = await generateObject({
      model: anthropic("claude-3-5-sonnet-20240620"),
      system: "You are an expert data architect specializing in career profiles. Parse the following raw text into a clean, structured JSON format.",
      prompt: rawText,
      schema: z.object({
        headline: z.string(),
        summary: z.string(),
        experience: z.array(z.object({
          title: z.string(),
          company: z.string(),
          startDate: z.string(),
          endDate: z.string().optional(),
          description: z.string(),
        })),
        skills: z.array(z.string()),
        education: z.array(z.object({
          school: z.string(),
          degree: z.string(),
          year: z.string(),
        })),
      }),
    });

    return object;
  }

  /**
   * Stage 2: Ultra-Elite Tailoring Pipeline
   * Runs multiple agents in sequence to produce a high-fidelity tailored document.
   */
  static async generateTailoredDocument(userProfile: any, jobDescription: string) {
    const profileContext = userProfile ? JSON.stringify(userProfile) : "No profile data provided. Use standard best practices for this role.";

    // 1. Strategic Analysis
    const strategyResponse = await generateObject({
      model: anthropic("claude-3-5-sonnet-20240620"),
      system: AGENTS.STRATEGIST.system,
      prompt: `Analyze this profile against this job description. Determine the key strategy for the CV.\n\nProfile: ${profileContext}\n\nJob: ${jobDescription}`,
      schema: z.object({
        focusPoints: z.array(z.string()),
        suggestedTone: z.string(),
        gapAnalysis: z.string(),
      }),
    });

    const strategy = strategyResponse.object;

    // 2. Tactical Writing & Audit Loop
    const { object: tailoredDoc } = await generateObject({
      model: anthropic("claude-3-5-sonnet-20240620"),
      system: AGENTS.WRITER.system,
      prompt: `Write a tailored CV based on this strategy: ${JSON.stringify(strategy)}. \n\nOriginal Profile: ${profileContext}\n\nJob: ${jobDescription}`,
      schema: TailoredDocumentSchema,
    });

    // 3. ATS Final Audit
    const { object: audit } = await generateObject({
      model: anthropic("claude-3-5-sonnet-20240620"),
      system: AGENTS.AUDITOR.system,
      prompt: `Audit this tailored document for ATS compatibility.\n\nDocument: ${JSON.stringify(tailoredDoc)}\n\nJob Description: ${jobDescription}`,
      schema: AtsAuditSchema,
    });

    return {
      document: tailoredDoc,
      audit,
      strategy,
    };
  }
}
