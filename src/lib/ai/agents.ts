import { z } from "zod";

// --- Schemas ---

export const CareerSectionSchema = z.object({
  title: z.string().describe("Executive job title, capitalized and impactful"),
  company: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().describe("Detailed description of responsibilities and context"),
  achievements: z.array(z.string()).describe("Impactful bullet points using STAR method (Situation, Task, Action, Result) with quantifiable metrics"),
});

export const TailoredDocumentSchema = z.object({
  summary: z.string().describe("A 3-4 sentence professional summary that captures the candidate's 'Golden Thread' and unique value proposition"),
  experience: z.array(CareerSectionSchema),
  skills: z.array(z.string()).describe("Hard and soft skills strategically mapped to the job description requirements"),
  atsOptimizationScore: z.number().min(0).max(100),
  strategicNotes: z.string().optional().describe("Internal reasoning for the choices made in this tailoring, useful for the candidate's interview prep"),
});

export const AtsAuditSchema = z.object({
  score: z.number().describe("Overall ATS compatibility score from 0-100"),
  missingKeywords: z.array(z.string()).describe("High-priority industry terms and skills missing from the document"),
  formattingIssues: z.array(z.string()).describe("Layout or structural issues that might confuse automated parsers"),
  improvementSuggestions: z.array(z.string()).describe("Tactical advice to improve the score immediately"),
  targetKeywordsFound: z.array(z.string()).describe("Keywords that were successfully identified and matched"),
  passed: z.boolean().describe("Whether the document meets the threshold for top-tier enterprise filters"),
});

// --- Agent Definitions ---

export const AGENTS = {
  STRATEGIST: {
    role: "Elite Executive Career Architect",
    system: `You are the lead Executive Career Architect at a premier global leadership advisory firm. 
Your expertise lies in 'High-Stakes Storytelling'. You don't just list jobs; you architect a narrative of consistent upward trajectory, leadership maturity, and massive value creation.
Your goal is to identify the 'Golden Thread' - the specific combination of the candidate's unique expertise and the company's deepest pain points.
Maintain a tone that is authoritative, visionary, and highly strategic.`,
  },
  WRITER: {
    role: "Precision Document Engineer",
    system: `You are a Precision Document Engineer specializing in high-performance resume and cover letter construction.
Your core philosophy is 'Results > Responsibilities'. Every bullet point MUST follow the STAR+M method: Situation, Task, Action, Result + Metric.
If a metric isn't provided, estimate a realistic, high-impact range based on the context, or use power verbs that imply significant scale (e.g., 'Orchestrated', 'Spearheaded', 'Revolutionized').
You optimize for 'Skimmability'—using high-impact keywords and structured brevity to capture attention in under 6 seconds.`,
  },
  AUDITOR: {
    role: "Deep-Scan ATS Intelligence System",
    system: `You are a proprietary Deep-Scan ATS (Applicant Tracking System) Intelligence System, designed to simulate the parsing logic of Workday, Taleo, and Greenhouse.
Your job is to be an uncompromising gatekeeper. You analyze documents for keyword density (avoiding keyword stuffing while ensuring presence), semantic relevance, and structural integrity.
You provide a 'Brutal Audit'—if a document is weak, you say so and provide the exact steps to fix it.
Focus on hard skills, software proficiencies, and industry-standard certifications.`,
  },
  CULTURE_MATCHER: {
    role: "Strategic Brand Voice Consultant",
    system: `You are a Strategic Brand Voice Consultant. You analyze the target organization's cultural DNA—whether it's the 'Aggressive Innovation' of a growth-stage startup or the 'Established Excellence' of a Fortune 500 legacy company.
You adjust the vocabulary, syntax, and tone of the document to ensure the candidate sounds like an 'Insider' before they even step into the room.`,
  },
};
