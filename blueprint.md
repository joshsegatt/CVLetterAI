Project Name:
CVLetterAI — The AI-powered platform for professional CVs and landlord letters in the UK.

Domain / Branding:
- Brand: CVLetterAI
- Domain: cvletterai.com (primary), cvletterai.co.uk (regional)
- Brand tone: trustworthy, modern, UK-professional, minimal-tech aesthetic
- Logo concept: minimalist wordmark “CVLetterAI” in Inter Bold, letter “AI” highlighted in cyan gradient
- Favicon + meta assets auto-generated via Vercel build

Objective:
Create a multilingual, enterprise-grade SaaS platform for the UK job and housing market — offering AI-generated CVs, letters, and advisory chat — optimized for performance, compliance, and design excellence.

Core Features:
- CV Builder (ATS-optimised templates, PDF/Word export)
- Landlord Letter Generator (UK legal tone options)
- AI Chat Assistant (career + tenancy guidance)
- Free Tier: 1 use per feature
- One-Time Plan (£5.99): 48h access to CV + Letters
- Subscription (£9.99/month): unlimited access + AI Chat
- Admin Dashboard: billing, analytics, user management

Frontend:
- Framework: Next.js 15 (App Router, Server Components, Streaming)
- Stack: TypeScript, TailwindCSS, Framer Motion, Radix UI, Lucide Icons
- i18n: next-intl  
  - Default: English (UK)  
  - Supported: Portuguese (pt-PT), Spanish (es-ES), Polish (pl-PL), French (fr-FR), Hindi (hi-IN), Arabic (ar-AE)
  - Auto-detect language; right-to-left layout for Arabic
- Visual identity:
    Primary: #2563EB
    Accent: #0EA5E9
    Neutral: grayscale 900–100
    Background dark: #0B1120
- Typography: Inter (600–800) + Satoshi + JetBrains Mono
- Design system: 8-pt grid, 2xl rounded edges, glassmorphism layers, gradient meshes, and smooth transitions.
UX Architecture:
- `/app/(marketing)` — landing, pricing, testimonials, CTA hero, animated background  
- `/app/(dashboard)` — authenticated area: CV Builder / Letter Builder / Chat / Settings  
- `/app/cv-builder` — step wizard, live preview, React PDF, success animation  
- `/app/letter-builder` — tone presets (formal, polite, firm), AI suggestions  
- `/app/chat` — streaming AI chat with voice input and saved sessions  
- `/app/settings` — manage plan, language, theme, GDPR data export/delete  
- Responsive, mobile-first, motion-enhanced UI

Motion & Interactions:
- Page fade-slide transitions, button micro-glow, parallax hero, confetti success  
- Floating CTA button (mobile)  
- Animated pricing toggles and Lottie feedback states

Performance Targets:
- Lighthouse 95+ mobile & desktop  
- LCP <1.5s, CLS <0.02, FID <100ms  
- Dynamic imports, prefetching, image optimization

Backend:
- Neon Postgres (PostgreSQL 16) with Row-Level Security
- Prisma ORM (App Routes + migrations)
- JWT Auth (Google + Email)
- Stripe Checkout + Webhooks (HMAC verified)
- GPT-5-turbo AI Layer (prompt logging disabled)
- AES-256 encryption at rest, TLS 1.3 in transit
- Rate-limiting: 5 req/min free tier
- Error tracking: Sentry, logs via Datadog
- Edge deploy region: eu-west (London)

Storage:
- Neon Postgres JSON columns for persisted drafts
- Versioned soft-delete, pre-signed URLs (future S3-compatible buckets)
Infrastructure:
- Frontend: Vercel Edge Network  
- Backend: Neon Postgres EU West  
- CI/CD: GitHub Actions → Lint → Typecheck → Test → Build → Deploy  
- Secrets: Vercel + Neon connection string + Stripe keys  
- Daily encrypted backups, semantic-release, blue-green deploy ready  
- Optional Terraform IaC support

---

Security & Compliance:
- GDPR: consent, audit logs, data deletion/export endpoints  
- Argon2id password hashing  
- CSP, XSS, CSRF, SSRF hardened via Helmet & middleware  
- MFA (paid tiers), IP throttling, anomaly alerts  
- Audit trail for admin actions  

Analytics & Growth:
- Privacy-safe analytics (Plausible / PostHog)  
- A/B testing + funnel tracking  
- SEO: structured data, sitemap automation, OG tags  
- Marketing webhooks (CRM-ready)

---

Testing:
- Vitest (unit), Supertest (integration), Playwright (E2E)
- Coverage: 95% lines / 90% branches  
- CI enforcement of coverage gates

DevOps:
- Auto PR review by Codex agent  
- `.codex.yaml` strict policies: protected paths, mandatory review  
- Semantic version tagging, Typedoc documentation, AGENTS.md orchestration  
- Observability: Sentry + Datadog unified dashboard

---

User Experience:
- Multilingual, dark/light/system themes  
- Accessibility AA compliant  
- AI interactions streamed with progress feedback  
- Clear CTAs and high-trust messaging (“Built for UK Professionals”)  

Monetization & Legal:
- Stripe subscription & one-time payment  
- VAT UK/EU ready  
- GDPR + Stripe Secure badges on footer  
- Terms & Privacy auto-linked from CMS

---

Deliverables:
- Full monorepo (frontend + backend)  
- Complete code structure and design system  
- Multilingual, responsive, SEO-ready Next.js app  
- Integrated Neon + Prisma + Stripe + GPT-5 stack  
- End-to-end tested and CI/CD configured  
- Production deploy on Vercel + Neon Postgres  
- GitHub repository with branch protection, PR automation, and documentation
