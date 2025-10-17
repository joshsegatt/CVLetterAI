import { Shield, Lock, Database, Eye, FileCheck, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/Button";
import { Header } from "../../components/marketing/Header";

const complianceFeatures = [
  {
    title: "GDPR Compliance",
    description: "Full compliance with EU General Data Protection Regulation",
    icon: Shield,
    details: [
      "Data minimization principles",
      "Right to erasure (right to be forgotten)",
      "Data portability and access rights",
      "Explicit consent mechanisms",
      "Privacy by design architecture"
    ]
  },
  {
    title: "Data Encryption",
    description: "End-to-end encryption for all user data",
    icon: Lock,
    details: [
      "AES-256 encryption at rest",
      "TLS 1.3 for data in transit",
      "Encrypted database connections",
      "Secure API endpoints",
      "Regular security audits"
    ]
  },
  {
    title: "Secure Infrastructure",
    description: "Enterprise-grade hosting and monitoring",
    icon: Database,
    details: [
      "Neon Postgres with row-level security",
      "Vercel edge network deployment",
      "Real-time threat monitoring",
      "Automated backup systems",
      "99.9% uptime guarantee"
    ]
  },
  {
    title: "Privacy Controls",
    description: "Comprehensive user privacy protection",
    icon: Eye,
    details: [
      "No tracking or analytics cookies",
      "Optional data collection only",
      "Transparent privacy policy",
      "User data export tools",
      "Account deletion on request"
    ]
  },
  {
    title: "Content Security",
    description: "AI-generated content protection and validation",
    icon: FileCheck,
    details: [
      "Content moderation filters",
      "Bias detection algorithms",
      "Quality assurance checks",
      "Version control for documents",
      "Secure document storage"
    ]
  },
  {
    title: "Access Controls",
    description: "Secure authentication and authorization",
    icon: Users,
    details: [
      "OAuth 2.0 with Google",
      "JWT token-based sessions",
      "Role-based access control",
      "Session timeout protection",
      "Multi-factor authentication ready"
    ]
  }
];

const certifications = [
  {
    name: "GDPR Compliant",
    description: "Certified compliance with EU data protection regulations",
    status: "Active"
  },
  {
    name: "SOC 2 Type II",
    description: "Security, availability, and confidentiality controls",
    status: "In Progress"
  },
  {
    name: "ISO 27001",
    description: "Information security management standards",
    status: "Planned"
  }
];

export default function SecurityPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-500/10 rounded-2xl">
              <Shield className="h-12 w-12 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Security & Compliance
          </h1>
          <p className="text-xl text-neutral-300 leading-relaxed">
            Your data security and privacy are our top priorities. We implement 
            enterprise-grade security measures and comply with international 
            data protection standards.
          </p>
        </section>

        {/* Compliance Features */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-white text-center">
            Security Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {complianceFeatures.map((feature) => (
              <div
                key={feature.title}
                className="glass-panel border-white/10 p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <feature.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-neutral-300 mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-neutral-400">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-white text-center">
            Certifications & Standards
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="glass-panel border-white/10 p-6 text-center hover:border-white/20 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {cert.name}
                </h3>
                <p className="text-neutral-300 text-sm mb-4">
                  {cert.description}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    cert.status === "Active"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : cert.status === "In Progress"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {cert.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="glass-panel border-white/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Security Questions?
          </h2>
          <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
            If you have specific security or compliance questions, or need 
            additional documentation for your organization, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="mailto:security@cvletterai.com">Contact Security Team</a>
            </Button>
            <Button asChild intent="secondary">
              <Link href="/privacy">Privacy Policy</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}