import { z } from 'zod';

export const experienceSchema = z.object({
  title: z.string().min(2, 'Role is required'),
  company: z.string().min(2, 'Company is required'),
  summary: z
    .string()
    .min(10, 'Summary helps recruiters understand your impact')
    .max(800, 'Keep summaries concise for ATS optimisation')
});

export const cvBuilderSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  headline: z.string().min(4, 'Headline provides key positioning'),
  location: z.string().min(2, 'Location helps with UK right-to-work filters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(8, 'Include a reachable phone number'),
  summary: z.string().min(24, 'Provide a professional statement'),
  experience: z.array(experienceSchema).min(1, 'Add at least one experience entry'),
  skills: z.array(z.string().min(2)).min(3, 'List at least three core skills')
});

export type CvBuilderForm = z.infer<typeof cvBuilderSchema>;

export const defaultCvBuilderValues: CvBuilderForm = {
  id: undefined,
  userId: undefined,
  fullName: 'Jordan Baker',
  headline: 'Compliance-focused Property Manager',
  location: 'London, UK',
  email: 'jordan@cvletterai.com',
  phone: '+44 7700 900123',
  summary:
    'Seasoned property manager with 8+ years in UK PRS. Expertise in tenancy compliance, landlord relations, and AI-led operations.',
  experience: [
    {
      title: 'Senior Property Manager',
      company: 'Harbour Homes',
      summary:
        'Led a portfolio of 120+ units, introduced AI-powered reference letters, cut void periods by 18%.'
    }
  ],
  skills: ['Tenancy compliance', 'Stakeholder management', 'AI workflow design']
};
