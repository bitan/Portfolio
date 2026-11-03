import { z } from "zod";

// Project validation
export const ProjectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  n: z.string().trim().min(1, "Project number is required"),
  t: z.string().trim().min(1, "Title is required").max(200, "Title too long"),
  d: z.string().trim().min(1, "Description is required").max(500, "Description too long"),
  lang: z.string().trim().min(1, "Language is required"),
  tags: z.array(z.string()).min(0),
  y: z.string().regex(/^\d{4}$/, "Year must be YYYY format"),
  url: z.string().url("Invalid GitHub URL").or(z.literal("")),
  live: z.string().url("Invalid live URL").or(z.literal("")),
  category: z.string(),
  isPrivate: z.boolean(),
  mediaUrl: z.string(),
  mediaType: z.enum(["video", "image", ""]),
  problem: z.string(),
  solution: z.string(),
  learned: z.array(z.string()),
  highlights: z.array(z.object({ label: z.string(), value: z.string() })),
});

// Settings validation
export const SettingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  location: z.string().min(1, "Location is required"),
  email: z.string().email("Invalid email"),
  github: z.string().url("Invalid GitHub URL").or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").or(z.literal("")),
  instagram: z.string().url("Invalid Instagram URL").or(z.literal("")),
  facebook: z.string().url("Invalid Facebook URL").or(z.literal("")),
  tiktok: z.string().url("Invalid TikTok URL").or(z.literal("")),
  bio: z.string().max(1000, "Bio too long"),
  statProjects: z.string(),
  statLanguages: z.string(),
  statCloud: z.string(),
  resumeUrl: z.string().url("Invalid resume URL").or(z.literal("")),
  currentlyBuilding: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      tags: z.array(z.string()),
    })
  ),
});

// Skill validation
export const SkillSchema = z.object({
  id: z.string().min(1, "ID is required"),
  t: z.string().min(1, "Category name is required"),
  items: z.array(z.string().min(1, "Tool name cannot be empty")),
  logos: z.record(z.string()).optional(),
  order: z.number(),
});

export type ProjectValidation = z.infer<typeof ProjectSchema>;
export type SettingsValidation = z.infer<typeof SettingsSchema>;
export type SkillValidation = z.infer<typeof SkillSchema>;

export function validateProject(data: unknown) {
  return ProjectSchema.safeParse(data);
}

export function validateSettings(data: unknown) {
  return SettingsSchema.safeParse(data);
}

export function validateSkill(data: unknown) {
  return SkillSchema.safeParse(data);
}

export function getValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.errors.forEach((e) => {
    const path = e.path.join(".");
    errors[path] = e.message;
  });
  return errors;
}
