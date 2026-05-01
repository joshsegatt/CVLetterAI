export interface PhraseCategory {
  role: string;
  phrases: string[];
}

export const IMPACT_PHRASES: PhraseCategory[] = [
  {
    role: "Software Engineer",
    phrases: [
      "Architected and implemented a microservices-based system that handled 1M+ daily active users.",
      "Optimized database queries reducing average response time by 45%.",
      "Led a team of 5 engineers in delivering a high-priority financial module 2 weeks ahead of schedule.",
      "Integrated third-party APIs (Stripe, Twilio, SendGrid) to enhance platform functionality.",
      "Implemented automated CI/CD pipelines reducing deployment errors by 30%.",
      "Mentored junior developers and conducted rigorous code reviews to maintain high quality standards.",
    ]
  },
  {
    role: "Sales Manager",
    phrases: [
      "Consistently exceeded quarterly sales targets by 20%+, generating $2M in new revenue.",
      "Developed and executed a strategic territory plan that expanded market share by 15%.",
      "Negotiated high-value contracts with Enterprise clients, increasing average deal size by 25%.",
      "Managed and trained a sales team of 10, improving overall conversion rates by 12%.",
      "Leveraged CRM data to identify and capitalize on untapped market opportunities.",
    ]
  },
  {
    role: "Project Manager",
    phrases: [
      "Successfully delivered a $500k infrastructure project within budget and on time.",
      "Coordinated cross-functional teams (Design, Engineering, Product) to launch 3 major features.",
      "Identified and mitigated project risks, ensuring 99.9% uptime during major migrations.",
      "Improved project workflow by implementing Agile methodologies, increasing velocity by 20%.",
      "Communicated project status and milestones effectively to executive stakeholders.",
    ]
  },
  {
    role: "Marketing Executive",
    phrases: [
      "Developed and executed an integrated marketing campaign that increased lead generation by 40%.",
      "Managed a $100k monthly advertising budget with a focus on ROI and brand awareness.",
      "Optimized SEO strategy, resulting in a 50% increase in organic search traffic over 6 months.",
      "Produced high-quality content (blogs, whitepapers, videos) that drove 25% more engagement.",
      "Analyzed market trends and competitor activity to refine brand positioning.",
    ]
  },
  {
    role: "Customer Success",
    phrases: [
      "Maintained a 95%+ customer satisfaction (CSAT) score through proactive support and onboarding.",
      "Reduced churn rate by 15% through targeted retention programs and relationship management.",
      "Identified upselling opportunities that resulted in 10% increase in account revenue.",
      "Developed comprehensive training materials and knowledge base articles for clients.",
      "Advocated for customer needs internally, influencing the product roadmap.",
    ]
  }
];

export const getPhrasesByRole = (role: string) => {
  const normalizedRole = role.toLowerCase();
  const category = IMPACT_PHRASES.find(c => 
    normalizedRole.includes(c.role.toLowerCase()) || 
    c.role.toLowerCase().includes(normalizedRole)
  );
  return category?.phrases || IMPACT_PHRASES[0].phrases; // Default to software if not found for demo
};
