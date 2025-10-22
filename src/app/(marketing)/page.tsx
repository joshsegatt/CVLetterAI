'use client';

import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle, 
  Download, 
  Globe, 
  Zap,
  Star,
  Lock,
  Database,
  PenTool,
  Brain,
  Shield,
  Trophy,
  Eye,
  MessageSquare,
  Linkedin,
  Upload,
  Sparkles,
  Copy
} from "lucide-react";
import Link from "next/link";
import { CheckoutButton } from "../../components/payments/CheckoutButton";
import { Button } from "../../components/ui/Button";
import { Header } from "../../components/marketing/Header";
import { CompanyLogos } from "../../components/marketing/CompanyLogos";
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



const plans: Plan[] = [
  {
    name: "Free",
    price: "£0",
    description: "Start creating your CV instantly without signup",
    highlights: [
      "Unlimited CV creation",
      "Basic templates",
      "Auto-save to browser",
      "No login required"
    ],
    cta: { type: "link", label: "Start Building Now", href: "/cv-builder" },
  },
  {
    name: "Pro",
    price: "£5.99",
    description: "One-time payment unlocks all premium features forever",
    highlights: [
      "🚀 Unlimited CV & Cover Letters",
      "🤖 AI Chat Assistant for optimization", 
      "✨ AI Content Suggestions",
      "🎨 Premium Templates (20+)",
      "📊 ATS Optimization",
      "📋 PDF Downloads & Exports",
      "🌍 Multi-language Support",
      "⚡ No monthly fees ever"
    ],
    featured: true,
    cta: {
      type: "checkout",
      label: "Unlock All Features - £5.99",
      planId: "price_one_time",
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



interface MarketingPageProps {
  searchParams: Promise<{
    purchase?: string;
  }>;
}

function MarketingPageContent({ searchParams }: { searchParams: any }) {
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
    <div className="min-h-screen bg-white">
      <Header />
      <main className="space-y-0">
        {/* Banner de confirmação */}
        {banner ? (
          <div className="container-lg py-4">
            <div
              role="status"
              aria-live="polite"
              className={`rounded-xl border px-4 py-3 text-sm flex items-center gap-2 ${
                banner.tone === "success"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-700"
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              {banner.message}
            </div>
          </div>
        ) : null}

        {/* HERO SECTION - Premium Minimalist */}
        <section className="section">
          <div className="container-lg">
            <div className="text-center">
              {/* Trust Indicator */}
              <div className="space-subsection">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>Trusted by professionals worldwide</span>
                </div>
                <CompanyLogos />
              </div>

              {/* Hero Headline */}
              <h1 className="text-display text-gray-900 mb-6 max-w-4xl mx-auto">
                AI-powered CVs that
                <span className="text-gradient block">get you hired</span>
              </h1>

              {/* Hero Subtitle */}
              <p className="text-body-lg text-gray-600 max-w-2xl mx-auto mb-12">
                Create professional CVs and cover letters in minutes with our intelligent AI assistant. Optimized for UK job market success.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Button 
                  asChild 
                  className="btn btn-primary btn-lg"
                >
                  <Link href="/cv-builder" className="flex items-center gap-2">
                    <span>Start Building Your CV</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  className="btn btn-ghost btn-lg"
                >
                  <Link href="/letter-builder">
                    Create Cover Letter
                  </Link>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-6 text-small text-subtle">
                <span>50,000+ CVs created</span>
                <span>•</span>
                <span>No login required</span>
                <span>•</span>
                <span>ATS-optimized</span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - Clean Premium Design */}
        <section id="how-it-works" className="section">
          <div className="container-md">
            {/* Section Header */}
            <div className="text-center space-subsection">
              <h2 className="text-heading text-gray-900 mb-4">
                How it works
              </h2>
              <p className="text-body text-gray-600 max-w-2xl mx-auto">
                Create your professional CV in three simple steps
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="card hover-lift">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-title text-gray-900">Enter Details</h3>
                      <div className="w-full bg-gray-200 h-1 rounded-full mt-2">
                        <div className="w-1/3 bg-blue-500 h-1 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-body text-gray-600">Add your work experience, education, and skills in minutes with our intuitive interface</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="card hover-lift">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-title text-gray-900">AI Optimization</h3>
                      <div className="w-full bg-gray-200 h-1 rounded-full mt-2">
                        <div className="w-2/3 bg-purple-500 h-1 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-body text-gray-600">Our AI analyzes and enhances your content for maximum impact and ATS compatibility</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="card hover-lift">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-title text-gray-900">Download & Apply</h3>
                      <div className="w-full bg-gray-200 h-1 rounded-full mt-2">
                        <div className="w-full bg-emerald-500 h-1 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-body text-gray-600">Export your professional CV in multiple formats and start applying to your dream jobs</p>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-2 glass rounded-full px-6 py-4">
                <span className="text-body text-gray-900">Ready to get started?</span>
                <Button 
                  asChild 
                  className="btn btn-primary text-sm"
                >
                  <Link href="/cv-builder">Start Building Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION - Clean Minimalist */}
        <section id="features" className="section bg-gradient-subtle">
          <div className="container-md">
            <div className="text-center space-subsection">
              <h2 className="text-heading text-gray-900 mb-4">
                Everything you need
              </h2>
              <p className="text-body text-gray-600">
                Professional tools designed for modern job seekers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="card interactive"
                >
                  <div className="card-body">
                    <div className="mb-6">
                      <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
                      <h3 className="text-title text-gray-900 mb-3">{feature.title}</h3>
                    </div>
                    
                    <p className="text-body text-gray-600 leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    <Button asChild className="btn btn-ghost text-blue-600 hover:text-blue-700 p-0 h-auto font-normal">
                      <Link href="/cv-builder">
                        Try it now →
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LINKEDIN BOOST - Featured Tool */}
        <section id="linkedin-boost" className="section">
          <div className="container-md">
            <div className="text-center space-subsection">
              <h2 className="text-heading text-gray-900 mb-4">
                LinkedIn Profile Boost
              </h2>
              <p className="text-body text-gray-600">
                Optimize your LinkedIn profile with AI - completely free
              </p>
            </div>

            <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="card-body text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Linkedin className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Transform Your LinkedIn Profile
                </h3>
                
                <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                  Get AI-powered optimization for your LinkedIn headline, about section, and experience highlights. 
                  No login required, completely free.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Upload CV</h4>
                    <p className="text-sm text-gray-600">Paste your existing CV and we'll extract the best content</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">AI Optimization</h4>
                    <p className="text-sm text-gray-600">Get unique, compelling content tailored to your industry</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Copy className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Copy & Use</h4>
                    <p className="text-sm text-gray-600">Copy the optimized content directly to your LinkedIn profile</p>
                  </div>
                </div>
                
                <Link
                  href="/linkedin-boost"
                  className="btn btn-primary btn-xl inline-flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                  Start LinkedIn Boost - Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                
                <p className="text-sm text-blue-600 mt-4 font-medium">
                  ✨ 100% Free • No Login Required • Instant Results
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS - Clean Minimalist */}
        <section className="section bg-gradient-subtle">
          <div className="container-md">
            <div className="text-center space-subsection">
              <h2 className="text-heading text-gray-900 mb-4">
                Trusted by professionals
              </h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">4.9/5 from 1,000+ reviews</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.author} 
                  className="card"
                >
                  <div className="card-body">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-body text-gray-700 mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">{testimonial.author.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{testimonial.author}</div>
                        <div className="text-small text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA - Premium Minimalist */}
        <section className="section">
          <div className="container-sm">
            <div className="text-center">
              <h2 className="text-heading text-gray-900 mb-4">
                Ready to create your professional CV?
              </h2>
              <p className="text-body text-gray-600 mb-12 max-w-2xl mx-auto">
                Join thousands of professionals who've landed their dream jobs with CVLetterAI
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Button 
                  asChild 
                  className="btn btn-primary btn-xl"
                >
                  <Link href="/cv-builder" className="flex items-center gap-2">
                    <span>Start building now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                
                <span className="text-gray-500 text-small">
                  No credit card required
                </span>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 text-small text-subtle">
                <span>GDPR compliant</span>
                <span>•</span>
                <span>Secure & private</span>
                <span>•</span>
                <span>Cancel anytime</span>
              </div>
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
