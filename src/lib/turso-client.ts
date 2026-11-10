/**
 * Turso client for the frontend (admin panel)
 * Makes HTTP requests to the backend API routes
 */

import type { Project, SiteSettings, Skill } from "@/lib/types";

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
  try {
    // Read file as base64
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          // Extract base64 from data URL (remove the "data:...;base64," prefix)
          const dataUrl = reader.result as string;
          const base64 = dataUrl.split(",")[1];

          const type = file.type.startsWith("video") ? "video" : "image";
          const filename = `${slug}-${Date.now()}-${file.name}`;

          onProgress(50);

          const response = await fetch("/api/-upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type,
              filename,
              buffer: base64,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Upload failed");
          }

          const result = await response.json();
          onProgress(100);
          resolve(result.url);
        } catch (error) {
          reject(new Error(`Media upload failed: ${error instanceof Error ? error.message : String(error)}`));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  } catch (error) {
    throw new Error(`Media upload failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function uploadSkillLogo(
  skillId: string,
  toolName: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  try {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const base64 = dataUrl.split(",")[1];

          const filename = `${skillId}-${toolName}-${Date.now()}-${file.name}`;

          onProgress(50);

          const response = await fetch("/api/-upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "logo",
              filename,
              buffer: base64,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Upload failed");
          }

          const result = await response.json();
          onProgress(100);
          resolve(result.url);
        } catch (error) {
          reject(new Error(`Logo upload failed: ${error instanceof Error ? error.message : String(error)}`));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  } catch (error) {
    throw new Error(`Logo upload failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function uploadCertificateImage(
  id: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  try {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const base64 = dataUrl.split(",")[1];

          const filename = `cert-${id}-${Date.now()}-${file.name}`;

          onProgress(50);

          const response = await fetch("/api/-upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "certificate",
              filename,
              buffer: base64,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Upload failed");
          }

          const result = await response.json();
          onProgress(100);
          resolve(result.url);
        } catch (error) {
          reject(new Error(`Certificate upload failed: ${error instanceof Error ? error.message : String(error)}`));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  } catch (error) {
    throw new Error(`Certificate upload failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
