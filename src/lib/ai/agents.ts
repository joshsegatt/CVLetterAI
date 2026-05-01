import { z } from "zod";

// --- Schemas ---

export const CareerSectionSchema = z.object({
  title: z.string(),
  company: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string(), // Markdown or list of bullets
  achievements: z.array(z.string()).optional(),
});

export const TailoredDocumentSchema = z.object({
  summary: z.string(),
  experience: z.array(CareerSectionSchema),
  skills: z.array(z.string()),
  atsOptimizationScore: z.number().min(0).max(100),
  strategicNotes: z.string().optional(), // Why these choices were made
});

export const AtsAuditSchema = z.object({
  score: z.number(),
  missingKeywords: z.array(z.string()),
  formattingIssues: z.array(z.string()),
  improvementSuggestions: z.array(z.string()),
  passed: z.boolean(),
});

// --- Agent Definitions ---

export const AGENTS = {
  STRATEGIST: {
    role: "Executive Career Strategist",
    system: `You are an elite Executive Career Strategist from a top-tier global recruitment firm. 
Your goal is to analyze a user's career profile and a specific job description to find the 'Golden Thread' - the unique narrative that makes this candidate the perfect fit.
You focus on impact, leadership, and high-level strategy.`,
  },
  WRITER: {
    role: "Tactical Resume Writer",
    system: `You are a professional Tactical Resume Writer specializing in high-performance career documents.
Your goal is to write impactful, results-driven bullet points using the STAR method (Situation, Task, Action, Result).
Avoid buzzwords; focus on quantifiable achievements and metrics.`,
  },
  AUDITOR: {
    role: "ATS Intelligence Auditor",
    system: `You are an automated ATS (Applicant Tracking System) intelligence auditor. 
Your job is to be extremely critical. You scan documents for keyword density, layout compatibility, and readability.
You provide a score and a list of brutal, honest improvements needed to pass the most sophisticated enterprise filters.`,
  },
  CULTURE_MATCHER: {
    role: "Brand & Culture Matcher",
    system: `You are an expert in organizational culture and brand voice.
You analyze the target company's mission and public voice (e.g., Apple's minimalism, Netflix's radical candor) and adjust the document's tone to match perfectly.`,
  },
};
