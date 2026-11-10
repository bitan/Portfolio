/**
 * Type definitions for the portfolio app
 * These types are used across the app but the data comes from Turso, not Firebase
 */

export interface Project {
  slug: string;
  n: string; // number
  t: string; // title
  d: string; // description
  lang: string;
  y: string; // year
  url: string;
  live: string;
  category: string;
  isPrivate: number;
  mediaUrl: string;
  mediaType: string;
  problem: string;
  solution: string;
  tags: string[];
  learned: string[];
  highlights: { label: string; value: string }[];
}

export interface SiteSettings {
  id?: string;
  name: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  bio: string;
  statProjects: string;
  statLanguages: string;
  statCloud: string;
  resumeUrl: string;
}

export interface Skill {
  id: string;
  t: string;
  order?: number;
  items: string[];
  logos?: Record<string, string>;
}

export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: number;
  createdAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  body: string;
  avatarUrl: string;
  order?: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  credentialUrl: string;
  imageUrl: string;
  order?: number;
}
