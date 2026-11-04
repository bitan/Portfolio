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

  console.log(`🔄 API ${method} ${url}`, body ? body : "");

  const response = await fetch(url, options);

  console.log(`📊 API Response: ${response.status}`, response.ok);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("❌ API Error:", error);
    throw new Error(
      error.error || `API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log(`✅ API Success:`, data);
  return data;
}

// Projects
export async function fetchProjects(): Promise<Project[]> {
  return apiCall("/projects");
}

export async function saveProject(project: Project): Promise<void> {
  await apiCall("/projects", "POST", project);
}

export async function deleteProject(slug: string): Promise<void> {
  await apiCall(`/projects/${slug}`, "DELETE");
}

// Settings
export async function fetchSettings(): Promise<SiteSettings> {
  return apiCall("/settings");
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await apiCall("/settings", "POST", settings);
}

// Skills
export async function fetchSkills(): Promise<Skill[]> {
  return apiCall("/skills");
}

export async function saveSkill(skill: Skill): Promise<void> {
  await apiCall("/skills", "POST", skill);
}

export async function deleteSkill(id: string): Promise<void> {
  await apiCall(`/skills/${id}`, "DELETE");
}

// Stubs for compatibility
export async function fetchCategories() {
  return [];
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
