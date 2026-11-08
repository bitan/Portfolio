/**
 * Turso client for the frontend (admin panel)
 * Makes HTTP requests to the backend API routes
 */

import type { Project, SiteSettings, Skill } from "@/lib/firestore";

const API_URL = import.meta.env.VITE_API_URL || "/api";

async function apiCall(
  endpoint: string,
  method: string = "GET",
  body?: unknown
) {
  const url = `${API_URL}${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error || `API error: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}

// Projects
export async function fetchProjects(): Promise<Project[]> {
  return apiCall("/-projects");
}

export async function saveProject(project: Project): Promise<void> {
  await apiCall("/-projects", "POST", project);
}

export async function deleteProject(slug: string): Promise<void> {
  await apiCall(`/-projects?slug=${slug}`, "DELETE");
}

// Settings
export async function fetchSettings(): Promise<SiteSettings> {
  return apiCall("/-settings");
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await apiCall("/-settings", "POST", settings);
}

// Skills
export async function fetchSkills(): Promise<Skill[]> {
  return apiCall("/-skills");
}

export async function saveSkill(skill: Skill): Promise<void> {
  await apiCall("/-skills", "POST", skill);
}

export async function deleteSkill(id: string): Promise<void> {
  await apiCall(`/-skills?id=${id}`, "DELETE");
}

// Proficiencies
export async function fetchProficiencies() {
  return apiCall("/-proficiencies");
}

export async function saveProficiency(proficiency: any): Promise<void> {
  await apiCall("/-proficiencies", "POST", proficiency);
}

export async function deleteProficiency(id: string): Promise<void> {
  await apiCall(`/-proficiencies?id=${id}`, "DELETE");
}

// Socials
export async function fetchSocials() {
  return apiCall("/-socials");
}

export async function saveSocial(social: any): Promise<void> {
  await apiCall("/-socials", "POST", social);
}

export async function deleteSocial(id: string): Promise<void> {
  await apiCall(`/-socials?id=${id}`, "DELETE");
}

// Testimonials
export async function fetchTestimonials() {
  return apiCall("/-testimonials");
}

export async function saveTestimonial(testimonial: any): Promise<void> {
  await apiCall("/-testimonials", "POST", testimonial);
}

export async function deleteTestimonial(id: string): Promise<void> {
  await apiCall(`/-testimonials?id=${id}`, "DELETE");
}

// Certificates
export async function fetchCertificates() {
  return apiCall("/-certificates");
}

export async function saveCertificate(certificate: any): Promise<void> {
  await apiCall("/-certificates", "POST", certificate);
}

export async function deleteCertificate(id: string): Promise<void> {
  await apiCall(`/-certificates?id=${id}`, "DELETE");
}

// Messages
export async function fetchMessages() {
  return apiCall("/-messages");
}

export async function saveMessage(message: any): Promise<void> {
  await apiCall("/-messages", "POST", message);
}

export async function deleteMessage(id: string): Promise<void> {
  await apiCall(`/-messages?id=${id}`, "DELETE");
}

export async function markMessageRead(id: string): Promise<void> {
  await apiCall(`/-messages?id=${id}`, "PATCH");
}

// Categories
export async function fetchCategories() {
  return apiCall("/-categories");
}

export async function saveCategory(category: any): Promise<void> {
  await apiCall("/-categories", "POST", category);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiCall(`/-categories?id=${id}`, "DELETE");
}

export async function uploadProjectMedia(
  slug: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  throw new Error("Media upload not yet implemented. Coming soon!");
}

export async function uploadSkillLogo(
  skillId: string,
  toolName: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  throw new Error("Logo upload not yet implemented. Coming soon!");
}

export async function uploadCertificateImage(
  id: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  throw new Error("Certificate image upload not yet implemented. Coming soon!");
}
