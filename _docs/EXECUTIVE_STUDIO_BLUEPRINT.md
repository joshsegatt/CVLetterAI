# EXECUTIVE STUDIO: SYSTEM BLUEPRINT & AI CODING INSTRUCTIONS
**CRITICAL RULE FOR AI:** You are building "Executive Studio", a premium B2B AI Career Intelligence Platform. Do not write generic, cheap, or bloated code. Think like a Staff Engineer at Stripe mixed with a UX Designer at Apple.

## 1. THE VIBE & DESIGN SYSTEM (FRONTEND)
- **Aesthetic:** High-Fidelity, "Silicon Valley Elite". Light mode default. 
- **Colors:** Zinc (text/borders), White (backgrounds), Indigo-600 (primary actions/CTAs). 
- **Spacing:** Massive whitespace. Use `gap-8`, `py-16`, `px-8` generously. No cluttered UI.
- **Components:** Radix UI / Shadcn UI as base, but heavily polished.
- **Animations:** Framer Motion for micro-interactions. Every button click needs physical feedback (scale: 0.98). Page transitions must be fluid.
- **Typography:** Sans-serif (Inter or Geist) for UI, high-end Serif for generated document previews.
- **Rule:** Never use default browser scrollbars. Never use pure black (`#000000`); use `zinc-950`.

## 2. TECH STACK (FULLSTACK)
- **Framework:** Next.js 14+ (App Router, strict TypeScript).
- **Styling:** Tailwind CSS + clsx + tailwind-merge.
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security enabled).
- **Payments:** Stripe (Checkout Sessions, Webhooks).
- **AI Engine:** OpenAI gpt-4o (for heavy parsing) or Claude 3.5 Sonnet (for elite copywriting). Use `ai-sdk` (Vercel) for streaming responses.
- **Background Jobs:** Inngest or Trigger.dev (CRITICAL: Do not run 20-second AI generation on Next.js API routes due to Vercel timeout. Use async jobs).
- **PDF Generation:** React-pdf or Puppeteer microservice.

## 3. CORE ARCHITECTURE & DATA FLOW
### The "One-Click Magic" Flow:
1. User uploads old CV (PDF) and pastes Job Description URL.
2. Next.js calls API `/api/jobs/extract`.
3. Background Worker (Inngest) triggers:
   a. Extracts text from PDF (OCR/Text parser).
   b. Scrapes Job Description URL.
   c. Sends both to LLM with STRICT System Prompt: "Map user skills to job requirements using STAR method. Output ONLY valid JSON".
4. Background Worker saves JSON to Supabase and fires event `generation.completed`.
5. Frontend listens via Supabase Realtime or polling, transitions UI to "Done", and shows the Live Preview.

## 4. DATABASE SCHEMA (SUPABASE / POSTGRESQL)

Table: users
- id (uuid, pk)
- email (text)
- stripe_customer_id (text)
- plan_type (enum: 'free', 'pro', 'elite')
- created_at (timestamp)

Table: profiles (Extracted raw data from user's old CV/LinkedIn)
- id (uuid, pk)
- user_id (uuid, fk)
- raw_json_data (jsonb) -> Contains all parsed history.
- updated_at (timestamp)

Table: applications (Each job target)
- id (uuid, pk)
- user_id (uuid, fk)
- job_title (text)
- company_name (text)
- job_description_raw (text)
- status (enum: 'analyzing', 'generating', 'completed', 'failed')

Table: documents (The generated assets)
- id (uuid, pk)
- application_id (uuid, fk)
- type (enum: 'cv', 'cover_letter')
- content_json (jsonb) -> The structured data for the template.
- pdf_url (text, nullable)
- created_at (timestamp)

## 5. AI GENERATION RULES (JSON SCHEMA ENFORCEMENT)
When prompting the LLM, ALWAYS enforce this Zod schema for structured output. The frontend relies on this exact structure to render the High-Fidelity Templates.
```typescript
// CV Output Schema Example
const cvSchema = z.object({
  header: z.object({
    name: z.string(),
    title: z.string(), // Optimized for the specific job
    summary: z.string().describe("High-impact executive summary max 3 sentences"),
  }),
  experience: z.array(z.object({
    company: z.string(),
    role: z.string(),
    duration: z.string(),
    bulletPoints: z.array(z.string()).describe("Must use STAR format and metrics"),
  })),
  skills: z.array(z.string()).describe("Only skills relevant to the target job description"),
});

6. MONETIZATION & FRICTION

    Rule: The user NEVER pays before seeing the "Wow" moment.

    Flow: They see the generated Cover Letter/CV in the web preview (low resolution or watermarked). When they click "Download High-Res PDF" or "Export to ATS Word", the Stripe Paywall triggers.

    Code: Rely on Stripe Webhooks (checkout.session.completed) to update users.plan_type and unlock the documents.pdf_url.