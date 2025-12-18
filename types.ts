export type TemplateId = 'modern' | 'classic' | 'minimal' | 'creative';

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  location: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface CustomItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomItem[];
}

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    summary: string;
    jobTitle: string;
    photo?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  customSections: CustomSection[];
  themeColor: string;
  templateId: TemplateId;
}

export interface AnalysisResult {
  score: number;
  missingKeywords: string[];
  improvements: string[];
}

export const INITIAL_DATA: CVData = {
  personalInfo: {
    fullName: "Alex Morgan",
    jobTitle: "Senior Software Engineer",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "alexmorgan.dev",
    linkedin: "linkedin.com/in/alexmorgan",
    summary: "Passionate Senior Software Engineer with over 6 years of experience in building scalable web applications. Expert in React, TypeScript, and Cloud Architecture. Proven track record of leading teams and delivering high-impact projects.",
  },
  experience: [
    {
      id: '1',
      company: "TechNova Solutions",
      role: "Senior Frontend Developer",
      startDate: "2021-03",
      endDate: "",
      isCurrent: true,
      location: "San Francisco, CA",
      description: "• Led the migration of a legacy angular app to React 18, improving load times by 40%.\n• Mentored junior developers and established code quality standards.\n• Implemented a new design system using Tailwind CSS used across 5 different products."
    },
    {
      id: '2',
      company: "WebFlow Inc.",
      role: "Software Engineer",
      startDate: "2018-06",
      endDate: "2021-02",
      isCurrent: false,
      location: "Austin, TX",
      description: "• Developed and maintained customer-facing e-commerce platforms.\n• Integrated third-party payment gateways (Stripe, PayPal).\n• Collaborated with UX designers to implement responsive designs."
    }
  ],
  education: [
    {
      id: '1',
      school: "University of Texas at Austin",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2014-09",
      endDate: "2018-05",
      isCurrent: false,
      location: "Austin, TX"
    }
  ],
  skills: [
    { id: '1', name: "React", level: "Expert" },
    { id: '2', name: "TypeScript", level: "Expert" },
    { id: '3', name: "Node.js", level: "Intermediate" },
    { id: '4', name: "AWS", level: "Intermediate" },
  ],
  projects: [],
  customSections: [],
  themeColor: '#2563eb',
  templateId: 'modern'
};