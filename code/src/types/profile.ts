export interface PersonalInfo {
  fullName: string;
  title: string;
  location: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  avatarUrl?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    other?: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft Skills' | 'Languages' | 'Tools' | 'Other';
  endorsements?: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  certificateUrl?: string;
  verified: boolean;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Document {
  id: string;
  name: string;
  fileUrl: string;
  fileType: string;
  uploadDate: string;
  size: number;
  version: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  technologies: string[];
  link?: string;
  imageUrl?: string;
  featured: boolean;
}

export interface ProfileData {
  personalInfo: PersonalInfo;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  documents: Document[];
  projects: Project[];
} 