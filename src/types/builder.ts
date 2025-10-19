// Types for CV data structure
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Native' | 'Conversational' | 'Basic' | 'Fluent';
  category: 'Technical' | 'Soft' | 'Language' | 'Tool';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate: string;
  endDate?: string;
}

export interface Language {
  id: string;
  name: string;
  level: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface CVData {
  personal: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages: Language[];
  certificates: Certificate[];
}

export type CVTemplate = 
  | 'modern'
  | 'elegant' 
  | 'minimal'
  | 'creative'
  | 'executive'
  | 'tech'
  | 'academic';

export interface CVConfig {
  template: CVTemplate;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'relaxed';
  showPhoto?: boolean;
  highlightSkills?: boolean;
  twoColumn?: boolean;
  sectionIcons?: boolean;
  sectionOrder?: string[];
}

// Letter types
export interface LetterData {
  senderInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  recipientInfo: {
    name: string;
    title?: string;
    company?: string;
    address: string;
  };
  letterInfo: {
    date: string;
    subject: string;
    salutation: string;
    body: string;
    closing: string;
    signature: string;
  };
}

export type LetterTemplate = 
  | 'formal'
  | 'polite'
  | 'firm'
  | 'legal-notice'
  | 'reference'
  | 'complaint'
  | 'thank-you';

export interface LetterConfig {
  template: LetterTemplate;
  tone: 'formal' | 'friendly' | 'assertive' | 'legal';
  letterhead: boolean;
}