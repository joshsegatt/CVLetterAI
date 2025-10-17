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
import { UKOrganizationLogos } from "../../components/marketing/UKOrganizationLogos";
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
      type: "link",
      label: "Unlock 48h pass",
      href: "https://buy.stripe.com/fZu00i69sc0O8sP1K74ow00",
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
      type: "link",
      label: "Subscribe now",
      href: "https://buy.stripe.com/cNicN47dw2qecJ5ewT4ow01",
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
      <div className="container mx-auto px-4 space-y-16 pb-16">
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

        {/* HERO SECTION - Premium UK Style */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Premium Background Elements */}
          <div className="absolute inset-0 -z-10">
            {/* Main gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-500/15 to-primary-600/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-luxury-500/15 to-luxury-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-accent-500/10 to-accent-600/5 rounded-full blur-3xl animate-pulse-glow" />
            
            {/* Subtle particles */}
            <div className="absolute top-20 right-20 w-2 h-2 bg-primary-400 rounded-full animate-pulse opacity-60" />
            <div className="absolute top-40 left-20 w-1 h-1 bg-luxury-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-accent-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-40 right-1/3 w-1 h-1 bg-primary-300 rounded-full animate-pulse opacity-30" style={{ animationDelay: '1.5s' }} />
          </div>

          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center max-w-5xl mx-auto">
              {/* Simple Trust Section */}
              <div className="mb-12">
                <div className="flex items-center justify-center gap-2 text-surface-400 text-sm mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>Trusted by thousands</span>
                </div>
                <UKOrganizationLogos />
              </div>

              {/* Premium Headline */}
              <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-5 text-white">
                Professional CVs & 
                <span className="text-gradient-brand block">Cover Letters</span>
              </h1>

              {/* Concise Subtitle */}
              <p className="text-xl text-surface-300 max-w-2xl mx-auto leading-relaxed mb-8">
                Create job-winning documents with AI in seconds. Simple, fast, effective.
              </p>

              {/* Premium CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Button 
                  asChild 
                  size="lg" 
                  className="relative group bg-gradient-brand hover:bg-white hover:shadow-2xl hover:shadow-primary-500/25 font-bold overflow-hidden transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/sign-up" className="relative z-10 flex items-center gap-2 text-white group-hover:text-black transition-colors duration-300">
                    <Sparkles className="h-5 w-5 animate-pulse text-white group-hover:text-black transition-colors duration-300" />
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-all duration-200 text-white group-hover:text-black" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="ghost" 
                  size="lg"
                  className="text-white/80 hover:text-white"
                >
                  <Link href="#pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>

              {/* Minimal Stats */}
              <div className="flex items-center justify-center gap-8 text-sm text-surface-400">
                <span>50K+ users</span>
                <span>•</span>
                <span>30s creation</span>
                <span>•</span>
                <span>ATS optimized</span>
              </div>
            </div>
          </div>


        </section>

        {/* BENEFITS SECTION - Premium UK Style */}
        <section className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              Why CVLetterAI Works
            </h2>
            <p className="text-lg text-surface-300 max-w-2xl mx-auto">
              Built for the modern UK job market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group text-center p-6 rounded-2xl glass hover:bg-white/5 transition-all duration-300 hover:scale-[1.02]">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl group-hover:shadow-primary-500/25 transition-all duration-300 group-hover:scale-110">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">Lightning Fast</h3>
              <p className="text-surface-400 group-hover:text-surface-300 transition-colors">Create documents in 30 seconds</p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl glass hover:bg-white/5 transition-all duration-300 hover:scale-[1.02]">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl group-hover:shadow-accent-500/25 transition-all duration-300 group-hover:scale-110">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-300 transition-colors">ATS Optimized</h3>
              <p className="text-surface-400 group-hover:text-surface-300 transition-colors">99% compatibility guaranteed</p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl glass hover:bg-white/5 transition-all duration-300 hover:scale-[1.02]">
              <div className="w-16 h-16 bg-gradient-to-br from-luxury-500 to-luxury-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl group-hover:shadow-luxury-500/25 transition-all duration-300 group-hover:scale-110">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-luxury-300 transition-colors">Proven Results</h3>
              <p className="text-surface-400 group-hover:text-surface-300 transition-colors">3x more interview callbacks</p>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION - Premium UK Market */}
        <section id="features" className="py-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white mb-3">Powerful Features</h2>
            <p className="text-xl text-surface-300">Everything you need to succeed in the UK job market</p>
          </div>

          <div className="grid gap-10">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group grid lg:grid-cols-2 gap-8 items-center glass rounded-3xl p-8 hover:bg-white/5 transition-all duration-500"
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-gradient-brand transition-all duration-300">{feature.title}</h3>
                  </div>
                  
                  <p className="text-lg text-surface-300 mb-6 leading-relaxed group-hover:text-surface-200 transition-colors">
                    {feature.description}
                  </p>

                  <Button asChild className="bg-gradient-brand hover:bg-white hover:scale-105 transition-all duration-300">
                    <Link href="/sign-up" className="text-white hover:text-black transition-colors duration-300">Get Started Free</Link>
                  </Button>
                </div>

                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="relative bg-gradient-to-br from-surface-800/50 to-surface-900/50 rounded-2xl p-8 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    <div className="h-48 bg-gradient-to-br from-surface-700/30 to-surface-800/30 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                      <feature.icon className={`h-16 w-16 ${feature.color} relative z-10 group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING - Premium UK Market */}
        <section id="pricing" className="py-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white mb-3">Choose Your Plan</h2>
            <p className="text-xl text-surface-300">Transparent pricing for UK professionals</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all ${
                  plan.featured ? "border-white/30 scale-105" : ""
                }`}
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-gradient-brand mb-2">{plan.price}</div>
                  <p className="text-sm text-surface-400">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-surface-200">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {plan.cta.type === "checkout" ? (
                  <CheckoutButton
                    planId={plan.cta.planId}
                    label={plan.cta.label}
                    intent={plan.featured ? "primary" : "secondary"}
                  />
                ) : (
                  <Button 
                    asChild 
                    variant={plan.featured ? "primary" : "ghost"}
                    className="w-full"
                  >
                    <Link href={plan.cta.href}>{plan.cta.label}</Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS - Premium UK Style */}
        <section className="py-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white mb-3">Loved by UK Professionals</h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <span className="text-surface-300 text-lg font-medium">4.9/5 from 1,000+ reviews</span>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.author} 
                className="group glass p-8 rounded-3xl hover:bg-white/5 transition-all duration-500 hover:scale-[1.02] border border-white/10 hover:border-white/20"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg text-white mb-6 leading-relaxed group-hover:text-surface-100 transition-colors">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{testimonial.author.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-primary-300 transition-colors">{testimonial.author}</div>
                    <div className="text-sm text-surface-400 group-hover:text-surface-300 transition-colors">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA - Premium UK Market */}
        <section className="py-16">
          <div className="relative overflow-hidden rounded-3xl">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-luxury-600" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
            
            {/* Content */}
            <div className="relative px-8 py-16 text-center">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of UK professionals who've transformed their careers with CVLetterAI
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  asChild 
                  size="xl"
                  className="bg-white text-primary-600 hover:bg-white/90 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Link href="/sign-up" className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    <span>Start Creating Now - Free</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Shield className="h-4 w-4" />
                  <span>No credit card required • Cancel anytime</span>
                </div>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-8 mt-8 text-white/60 text-sm">
                <span>✓ GDPR Compliant</span>
                <span>✓ UK Data Centers</span>
                <span>✓ 30-day Money Back</span>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-luxury-400/20 rounded-full blur-lg" />
          </div>
        </section>
      </div>
    </>
  );
}
