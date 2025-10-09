# CVLetterAI Architecture Overview

## Frontend
- **Framework**: Next.js (App Router, React Server Components) with TypeScript.
- **Styling**: Tailwind CSS with bespoke tokens reflecting brand palette, glassmorphism accents, and motion primitives via Framer Motion.
- **Internationalisation**: Scaffolded via `next-intl` (locales pending copy) with planned auto-detection, RTL support for Arabic, and marketing navigation anchors.
- **UI System**: Reusable primitives in `src/components/ui`, feature-specific shells in `src/features/*`, and layout containers for marketing vs dashboard experiences.

## Backend & Services
- **Neon + Prisma**: REST endpoints (`app/api/cv-drafts`, `app/api/letters`) persist builder payloads through the shared Prisma client (`src/lib/prisma.ts`) against the Neon Postgres database defined in `prisma/schema.prisma`.
- **Stripe**: Checkout session creator (`app/api/payments/create-session`) and webhook handler wire into `src/services/payments/stripe.ts` helpers for price configuration.
- **AI Layer**: Streaming OpenAI integration (`src/services/ai/openai.ts`) powers `/api/ai/chat` with system prompts tuned for UK compliance.
- **Analytics**: Lightweight `track` helper to integrate Plausible/PostHog hooks once credentials are wired.

## Security & Compliance
- CSP and security headers defined in `next.config.ts`.
- Settings view surfaces MFA, IP anomaly toggles, and GDPR export/delete affordances.
- `.env` expectations centralised in `src/services/platform/env.ts` with warnings for missing secrets.

## Configuration
- Environment template (`.env.example`) lists Neon `DATABASE_URL`, Stripe, OpenAI, and site URL secrets consumed by `platformEnv`.

## Testing & QA
- Vitest driven tests with integration example (`tests/integration/chatService.test.ts`).
- `tests/setupTests.ts` auto-imports Testing Library matchers.
- Future additions: Supertest for API handlers and Playwright for journey coverage per blueprint.

## Deployment Notes
- Designed for Vercel Edge runtime (chat + webhooks) and Neon Postgres (EU West) region.
- Pricing matrix aligned with Stripe product setup (`pricingTable`).
- OG, favicon, and documentation assets tracked under `public/` and `docs/` with placeholders awaiting design deliverables.
