import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  CheckCircle, 
  Download, 
  Globe, 
  Zap,
  Star,
  Award,
  Lock,
  Database
} from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "../../components/payments/CheckoutButton";
import { Button } from "../../components/ui/Button";
import { Header } from "../../components/marketing/Header";
import type { PricingPlanId } from "../../services/payments/stripe";

interface LinkCTA {
  type: "link";
  label: string;
  href: string;
}

interface CheckoutCTA {
  type: "checkout";
  label: string;
  planId: PricingPlanId;
}

type PlanCTA = LinkCTA | CheckoutCTA;

interface Plan {
  name: string;
  price: string;
  description: string;
  highlights: string[];
  featured?: boolean;
  cta: PlanCTA;
}

const features = [
  {
    title: "ATS-optimised CV builder",
    description:
      "Guided, multilingual workflow with compliance guardrails to match UK hiring standards and tenancy requirements.",
    icon: Sparkles,
    color: "text-purple-400",
  },
  {
    title: "Landlord letters with legal tone",
    description:
      "Generate tailored letters for references, notices, and tenancy updates — reviewable by legal templates.",
    icon: ShieldCheck,
    color: "text-emerald-400",
  },
  {
    title: "AI advisory copilot",
    description:
      "Ask nuanced questions about jobs or tenancy obligations and receive referenced, trackable responses.",
    icon: Users,
    color: "text-blue-400",
  },
];

const benefits = [
  {
    title: "Instant Export",
    description: "Download in PDF, Word, or plain text formats",
    icon: Download,
  },
  {
    title: "Multi-language Support",
    description: "Create documents in English, Spanish, French, and more",
    icon: Globe,
  },
  {
    title: "Lightning Fast",
    description: "Generate professional documents in under 60 seconds",
    icon: Zap,
  },
  {
    title: "Quality Guaranteed",
    description: "Industry-standard templates reviewed by HR professionals",
    icon: Award,
  },
];

const plans: Plan[] = [
  {
    name: "Free",
    price: "£0",
    description: "One CV, letter, and chat session to experience the workflow.",
    highlights: [
      "Single export per feature",
      "Generative suggestions",
      "Email support",
    ],
    cta: { type: "link", label: "Start free", href: "/sign-up" },
  },
  {
    name: "Pro",
    price: "£5.99",
    description: "48 hours of unlimited CV and letter generation for urgent needs.",
    highlights: [
      "Unlimited CV drafts for 48h",
      "Multiple landlord letter formats",
      "Priority response times",
    ],
    featured: true,
    cta: {
      type: "checkout",
      label: "Unlock 48h pass",
      planId: "price_one_time",
    },
  },
  {
    name: "Enterprise",
    price: "£9.99",
    description:
      "Unlimited workflows with live AI guidance and admin controls.",
    highlights: [
      "Unlimited CV + letters",
      "AI advisory chat",
      "Multi-language exports",
    ],
    cta: {
      type: "checkout",
      label: "Subscribe now",
      planId: "price_subscription",
    },
  },
];

const testimonials = [
  {
    quote:
      "My CV went from generic to landing interviews within a week. The AI coach highlighted UK strengths I had overlooked.",
    author: "Anika Sharma",
    role: "Product Manager, London",
    rating: 5,
  },
  {
    quote:
      "Drafted a compliant Section 21 notice in minutes. Having tone presets prevented common landlord mistakes.",
    author: "James Connor",
    role: "Property Manager, Manchester",
    rating: 5,
  },
];

const securityFeatures = [
  {
    title: "GDPR Compliant",
    description: "Full data protection compliance",
    icon: Lock,
  },
  {
    title: "Secure Database",
    description: "Neon Postgres with row-level security",
    icon: Database,
  },
  {
    title: "Verified Payments",
    description: "Stripe-powered secure transactions",
    icon: ShieldCheck,
  },
];

interface MarketingPageProps {
  searchParams: Promise<{
    purchase?: string;
  }>;
}

export default async function MarketingPage({ searchParams }: MarketingPageProps) {
  const resolvedSearchParams = await searchParams;
  const purchaseState = resolvedSearchParams?.purchase ?? "";
  const banner =
    purchaseState === "success"
      ? {
          tone: "success" as const,
          message: "Payment confirmed. Your upgraded features are now active.",
        }
      : purchaseState === "cancelled"
      ? {
          tone: "warning" as const,
          message:
            "Checkout cancelled. You can resume your purchase at any time.",
        }
      : null;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 space-y-28 pb-24">
        {/* Banner de confirmação */}
        {banner ? (
          <div
            role="status"
            aria-live="polite"
            className={`rounded-2xl border px-4 py-3 text-sm flex items-center gap-2 ${
              banner.tone === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : "border-amber-500/40 bg-amber-500/10 text-amber-200"
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            {banner.message}
          </div>
        ) : null}

        {/* HERO SECTION - Enhanced */}
        <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-glass-panel px-8 py-24 shadow-card lg:px-20">
          <div className="absolute -left-12 top-12 h-48 w-48 rounded-full bg-brand/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-neutral-400">Trusted by 10,000+ users</span>
              </div>
              
              <h1 className="text-5xl font-extrabold leading-tight text-white">
                Build <span className="text-gradient bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Resumes</span> &{" "}
                <span className="text-gradient bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Letters</span> that stand out
              </h1>
              <p className="mt-6 text-lg text-neutral-300 sm:text-xl max-w-lg">
                Create professional documents in minutes with AI-powered design.
                Modern, fast, and tailored to help you land your next opportunity.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="group">
                  <Link href="/sign-up">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild intent="secondary" size="lg">
                  <Link href="#pricing">View Plans</Link>
                </Button>
              </div>
            </div>

            {/* Mockup/Preview */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30"></div>
              <div className="relative w-full h-[400px] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                <img 
                  src="/thumbs/cv-elegant.png" 
                  alt="Professional CV Template Preview" 
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION - New */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex items-center gap-4 glass-panel border-white/10 p-4 hover:border-white/20 transition-colors"
            >
              <benefit.icon className="h-8 w-8 text-indigo-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white text-sm">{benefit.title}</h3>
                <p className="text-xs text-neutral-400 mt-1">{benefit.description}</p>
              </div>
            </div>
          ))}
        </section>

        {/* FEATURES SECTION - Enhanced */}
        <section id="features" className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-panel flex h-full flex-col gap-4 border-white/10 p-6 text-center hover:border-white/20 transition-all group"
            >
              <div className="mx-auto p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                <feature.icon
                  className={`h-8 w-8 ${feature.color}`}
                  aria-hidden
                />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-300">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        {/* PRICING - Enhanced */}
        <section id="pricing" className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-white">Choose Your Plan</h2>
            <p className="mt-4 text-lg text-neutral-300">
              Align pricing with your hiring or tenancy workload. Switch or cancel
              any time, VAT ready for UK & EU customers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass-panel flex h-full flex-col justify-between gap-6 p-6 hover:border-white/20 transition-all relative ${
                  plan.featured ? "border-white/30 ring-2 ring-accent/60 transform scale-105" : ""
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-neutral-400">
                      {plan.name}
                    </p>
                    <p className="mt-2 text-4xl font-bold text-white">
                      {plan.price}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-300">
                    {plan.description}
                  </p>
                  <ul className="space-y-3 text-sm text-neutral-200">
                    {plan.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                {plan.cta.type === "checkout" ? (
                  <CheckoutButton
                    planId={plan.cta.planId}
                    label={plan.cta.label}
                    intent={plan.featured ? "primary" : "secondary"}
                  />
                ) : (
                  <Button asChild intent={plan.featured ? "primary" : "secondary"}>
                    <Link href={plan.cta.href}>{plan.cta.label}</Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS - Enhanced */}
        <section id="testimonials" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-white">What Our Users Say</h2>
            <p className="mt-4 text-lg text-neutral-300">
              From global talent to local property managers, CVLetterAI supports faster
              approvals with consistent documentation.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.author}
                className="glass-panel border-white/10 p-6 text-neutral-200 hover:border-white/20 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed text-white mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <footer className="text-sm">
                  <span className="font-semibold text-white">{testimonial.author}</span>{" "}
                  <span className="text-neutral-400">— {testimonial.role}</span>
                </footer>
              </blockquote>
          ))}
          </div>
        </section>

        {/* SECURITY - Enhanced */}
        <section id="security" className="glass-panel border border-white/10 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Enterprise-Grade Security</h2>
            <p className="mt-4 text-neutral-300">
              Your data is protected with industry-leading security standards
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {securityFeatures.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/security">View Compliance Details</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
