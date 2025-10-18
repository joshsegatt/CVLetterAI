'use client';

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
  Database,
  FileText,
  PenTool,
  Brain,
  Rocket,
  Shield,
  Trophy,
  Eye,
  Layers,
  BarChart3,
  Clock,
  MessageSquare,
  Heart
} from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "../../components/payments/CheckoutButton";
import { Button } from "../../components/ui/Button";
import { Header } from "../../components/marketing/Header";
import { CompanyLogos } from "../../components/marketing/CompanyLogos";
import { useI18n } from "../../lib/i18n/context";
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
    title: "AI-Powered CV Builder",
    description:
      "Create ATS-optimized resumes with intelligent design suggestions, industry-specific templates, and real-time optimization feedback.",
    icon: Brain,
    color: "text-primary-400",
    gradient: "from-primary-400 to-primary-600"
  },
  {
    title: "Smart Cover Letters",
    description:
      "Generate personalized cover letters that match job descriptions perfectly with AI-driven content optimization and tone adjustment.",
    icon: PenTool,
    color: "text-luxury-400", 
    gradient: "from-luxury-400 to-luxury-600"
  },
  {
    title: "AI Career Assistant",
    description:
      "Get personalized career advice, interview tips, and job market insights with our advanced AI companion that learns your goals.",
    icon: MessageSquare,
    color: "text-accent-400",
    gradient: "from-accent-400 to-accent-600"
  },
];

const benefits = [
  {
    title: "Lightning Fast",
    description: "Create professional documents in under 30 seconds",
    icon: Zap,
    metric: "30s",
    color: "text-yellow-400"
  },
  {
    title: "ATS Optimized",
    description: "99% compatibility with applicant tracking systems",
    icon: Eye,
    metric: "99%",
    color: "text-green-400"
  },
  {
    title: "Multi-Format Export", 
    description: "Export to PDF, Word, or plain text instantly",
    icon: Download,
    metric: "3+",
    color: "text-blue-400"
  },
  {
    title: "Global Ready",
    description: "Support for 25+ languages and international formats",
    icon: Globe,
    metric: "25+",
    color: "text-purple-400"
  },
  {
    title: "Success Rate",
    description: "Users report 3x more interview callbacks",
    icon: Trophy,
    metric: "3x",
    color: "text-orange-400"
  },
  {
    title: "Secure & Private",
    description: "Enterprise-grade security with GDPR compliance", 
    icon: Shield,
    metric: "100%",
    color: "text-emerald-400"
  },
];

const plans: Plan[] = [
  {
    name: "Free",
    price: "£0",
    description: "Get started with basic CV creation",
    highlights: [
      "1 CV creation per month",
      "Basic templates",
      "PDF export",
      "Email support"
    ],
    cta: { type: "link", label: "Get Started Free", href: "/sign-up" },
  },
  {
    name: "Pro",
    price: "£5.99",
    description: "Perfect for job seekers who need professional results",
    highlights: [
      "🚀 Unlimited CV & Cover Letters",
      "🤖 Super AI Chat Assistant", 
      "✨ AI Content Optimization",
      "🎨 Premium Templates (20+)",
      "📊 ATS Optimization",
      "📋 PDF Analysis & Feedback",
      "🌍 Multi-language Support",
      "⚡ Priority Support"
    ],
    featured: true,
    cta: {
      type: "checkout",
      label: "Unlock Pro Features",
      planId: "price_one_time",
    },
  },
  {
    name: "Enterprise",
    price: "£12.99",
    description: "For teams and organizations with advanced needs",
    highlights: [
      "👑 Everything in Pro",
      "👥 Team Management Dashboard",
      "🏢 Custom Company Templates",
      "🔌 API Access & Integration",
      "📈 Advanced Analytics & Reports",
      "🎯 White-label Option",
      "📞 Dedicated Account Manager"
    ],
    cta: {
      type: "checkout",
      label: "Get Enterprise Access",
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

function MarketingPageContent({ searchParams }: { searchParams: any }) {
  const { translate } = useI18n();
  const purchaseState = searchParams?.purchase ?? "";
  
  const banner =
    purchaseState === "success"
      ? {
          tone: "success" as const,
          message: "Payment confirmed. Your upgraded features are now active.",
        }
      : purchaseState === "cancelled"
      ? {
          tone: "warning" as const,
          message: "Checkout cancelled. You can resume your purchase at any time.",
        }
      : null;

  return (
    <div className="min-h-screen force-transparent-bg">
      <Header />
      <main className="container mx-auto px-4 space-y-16 pb-16 force-transparent-bg">
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

        {/* HERO SECTION - Tipografia Equilibrada */}
        <section className="relative py-16 md:py-24 flex items-center justify-center">
          <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
            <div className="text-center">
              {/* Subtle Trust Indicator */}
              <div className="subsection-spacing">
                <div className="flex items-center justify-center gap-2 text-caption text-gray-400 tight-spacing">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  <span>Trusted by professionals worldwide</span>
                </div>
                <CompanyLogos />
              </div>

              {/* Headline Equilibrado */}
              <h1 className="text-hero md:text-hero text-white tight-spacing">
                {translate('home.title')}
                <span className="text-blue-400 block">get you hired</span>
              </h1>

              {/* Subtitle Proporcional */}
              <p className="text-body-large text-gray-300 max-w-2xl mx-auto subsection-spacing">
                {translate('home.subtitle')}
              </p>

              {/* Clean CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg transition-colors duration-200"
                >
                  <Link href="/sign-up" className="flex items-center gap-2">
                    <span>Get started free</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="ghost" 
                  size="lg"
                  className="text-gray-400 hover:text-white px-8 py-4"
                >
                  <Link href="#how-it-works">
                    See how it works
                  </Link>
                </Button>
              </div>

              {/* Minimal Social Proof */}
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <span>50,000+ CVs created</span>
                <span>•</span>
                <span>30-second setup</span>
                <span>•</span>
                <span>ATS-optimized</span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - Design Moderno Profissional */}
        <section id="how-it-works" className="section-spacing py-16">
          <div className="max-w-6xl mx-auto">
            {/* Header Moderno */}
            <div className="text-center subsection-spacing">
              <h2 className="text-section text-white element-spacing">
                How it works
              </h2>
              <p className="text-body text-gray-400 max-w-2xl mx-auto">
                Create your professional CV in three simple steps
              </p>
            </div>

            {/* Steps Grid Moderno */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Step 1 */}
              <div className="relative group">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-300 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
                  <div className="flex items-center gap-4 subsection-spacing">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-subsection text-white">Enter Details</h3>
                      <div className="w-full bg-white/10 h-1 rounded-full mt-2">
                        <div className="w-1/3 bg-blue-400 h-1 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-body text-gray-300">Add your work experience, education, and skills in minutes with our intuitive interface</p>
                </div>
                
                {/* Connection Line */}
                <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-transparent"></div>
              </div>
              
              {/* Step 2 */}
              <div className="relative group">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-300 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
                  <div className="flex items-center gap-4 subsection-spacing">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-subsection text-white">AI Optimization</h3>
                      <div className="w-full bg-white/10 h-1 rounded-full mt-2">
                        <div className="w-2/3 bg-purple-400 h-1 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-body text-gray-300">Our AI analyzes and enhances your content for maximum impact and ATS compatibility</p>
                </div>
                
                {/* Connection Line */}
                <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></div>
              </div>
              
              {/* Step 3 */}
              <div className="relative group">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-300 hover:border-green-500/30 hover:shadow-2xl hover:shadow-green-500/10">
                  <div className="flex items-center gap-4 subsection-spacing">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-subsection text-white">Download & Apply</h3>
                      <div className="w-full bg-white/10 h-1 rounded-full mt-2">
                        <div className="w-full bg-green-400 h-1 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-body text-gray-300">Export your professional CV in multiple formats and start applying to your dream jobs</p>
                </div>
              </div>
            </div>
            
            {/* Call to Action Moderno */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full px-6 py-3">
                <span className="text-body text-white">Ready to get started?</span>
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 text-caption rounded-lg transition-all duration-300"
                >
                  <Link href="/sign-up">Create Your CV Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION - Tipografia Equilibrada */}
        <section id="features" className="section-spacing py-12">
          <div className="max-w-4xl mx-auto text-center subsection-spacing">
            <h2 className="text-section text-white element-spacing">
              Everything you need
            </h2>
            <p className="text-body text-gray-400">
              Professional tools designed for modern job seekers
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="mb-4">
                  <feature.icon className="h-8 w-8 text-blue-400 mb-3" />
                  <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                </div>
                
                <p className="text-gray-400 leading-relaxed mb-4">
                  {feature.description}
                </p>

                <Button asChild variant="ghost" className="text-blue-400 hover:text-blue-300 p-0 h-auto font-normal">
                  <Link href="/sign-up">
                    Try it free →
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING - Clean Minimal */}
        <section id="pricing" className="py-20">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Simple pricing
            </h2>
            <p className="text-lg text-gray-400">
              Transparent pricing for professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-lg border ${
                  plan.featured 
                    ? "border-blue-600 bg-blue-600/5" 
                    : "border-gray-800 hover:border-gray-700"
                } transition-colors`}
              >
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-2">{plan.name}</h3>
                  <div className="text-2xl font-semibold text-white mb-3">{plan.price}</div>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {plan.cta.type === "checkout" ? (
                  <CheckoutButton
                    planId={plan.cta.planId}
                    label={plan.cta.label}
                    intent={plan.featured ? "primary" : "secondary"}
                    className={
                      plan.name === "Enterprise" 
                        ? "w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg border-0"
                        : plan.featured 
                        ? "w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                        : "w-full"
                    }
                  />
                ) : (
                  <Button 
                    asChild 
                    className={`w-full ${
                      plan.featured 
                        ? "bg-blue-600 hover:bg-blue-700 text-white" 
                        : "bg-gray-800 hover:bg-gray-700 text-white"
                    }`}
                  >
                    <Link href={plan.cta.href}>{plan.cta.label}</Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS - Clean Minimal */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Trusted by professionals
            </h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-400">4.9/5 from 1,000+ reviews</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.author} 
                className="p-6 rounded-lg border border-gray-800"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{testimonial.author.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA - Clean Professional */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Ready to create your professional CV?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who've landed their dream jobs with CVLetterAI
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button 
                asChild 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4"
              >
                <Link href="/sign-up" className="flex items-center gap-2">
                  <span>Get started free</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              
              <span className="text-gray-500 text-sm">
                No credit card required
              </span>
            </div>
            
            {/* Simple trust indicators */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span>GDPR compliant</span>
              <span>•</span>
              <span>Secure & private</span>
              <span>•</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default async function MarketingPage({ searchParams }: MarketingPageProps) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <MarketingPageContent searchParams={resolvedSearchParams} />
  );
}
