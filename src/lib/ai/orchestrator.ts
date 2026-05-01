import { generateObject, LanguageModel } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { AGENTS, TailoredDocumentSchema, AtsAuditSchema } from "./agents";
import { ContentGuardrails } from "./guardrails";
import { z } from "zod";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

function getModel(): LanguageModel {
  // 1. Google Gemini (Best Free Tier)
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY.includes("xxx")) {
    return google("gemini-1.5-flash");
  }
  
  // 2. Anthropic Claude (Premium Fallback)
  if (process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("xxx")) {
    return anthropic("claude-3-5-sonnet-20240620");
  }

  // 3. Groq Llama 3 (Fast Free Backup)
  if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("xxx")) {
    return groq("llama-3.1-70b-versatile");
  }

  // Final Fallback (will fail if no keys, but prevents undefined)
  return google("gemini-1.5-flash");
}

export class CareerOrchestrator {
  /**
   * Stage 1: Smart Parsing
   * Transforms raw text or LinkedIn profile content into a structured UserProfile format.
   */
  static async parseRawProfile(rawText: string) {
    const { object } = await generateObject({
      model: getModel(),
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
      model: getModel(),
      system: AGENTS.STRATEGIST.system,
      temperature: 0.4, // Strategic but grounded
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
      model: getModel(),
      system: AGENTS.WRITER.system,
      temperature: 0.3, // High precision
      topP: 0.8,
      prompt: `Write a tailored CV based on this strategy: ${JSON.stringify(strategy)}. \n\nOriginal Profile: ${profileContext}\n\nJob: ${jobDescription}`,
      schema: TailoredDocumentSchema,
    });

    // Apply Guardrails
    tailoredDoc.summary = ContentGuardrails.sanitizeSummary(tailoredDoc.summary);
    tailoredDoc.experience = tailoredDoc.experience.map(exp => ({
      ...exp,
      description: ContentGuardrails.sanitizeSummary(exp.description) // Reusing summary logic for length
    }));

    // 3. ATS Final Audit
    const { object: audit } = await generateObject({
      model: getModel(),
      system: AGENTS.AUDITOR.system,
      temperature: 0.1, // Brutal consistency
      prompt: `Audit this tailored document for ATS compatibility.\n\nDocument: ${JSON.stringify(tailoredDoc)}\n\nJob Description: ${jobDescription}`,
      schema: AtsAuditSchema,
    });

    return {
      document: tailoredDoc,
      audit,
      strategy,
    };
  }

  /**
   * Stage 3: Real-time ATS Audit
   * Analyzes an existing document against a job description.
   */
  static async analyzeATS(documentData: any, jobDescription: string) {
    const { object: audit } = await generateObject({
      model: getModel(),
      system: AGENTS.AUDITOR.system,
      temperature: 0.1,
      prompt: `Audit this document for ATS compatibility against the target job description.\n\nDocument Data: ${JSON.stringify(documentData)}\n\nJob Description: ${jobDescription}`,
      schema: AtsAuditSchema,
    });

    return audit;
  }

  /**
   * Stage 4: Smart Phrase Generation
   * Generates high-impact bullet points for a specific role and industry.
   */
  static async generateBulletPoints(role: string, industry?: string, focusArea?: string) {
    const { object } = await generateObject({
      model: getModel(),
      system: AGENTS.WRITER.system,
      temperature: 0.5, // Some creative flair for phrasing
      prompt: `Generate 5 elite, high-impact bullet points for a ${role} position${industry ? ` in the ${industry} industry` : ""}.${focusArea ? ` Focus specifically on ${focusArea}.` : ""} Use the STAR method and include placeholders for metrics (e.g., [X]%).`,
      schema: z.object({
        phrases: z.array(z.string()),
      }),
    });

    return object.phrases;
  }
}
