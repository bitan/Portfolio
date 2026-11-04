/**
 * Settings API routes
 * GET /api/settings - get site settings
 * POST /api/settings - update settings
 */

import { json } from "@tanstack/start";
import { db } from "@/lib/turso";
import type { SiteSettings } from "@/lib/firestore";

// GET /api/settings
export async function GET() {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM settings WHERE id = 'main'",
      args: [],
    });

    if (!result.rows.length) {
      // Return defaults if not found
      return json({
        id: "main",
        name: "",
        tagline: "",
        location: "",
        email: "",
        github: "",
        linkedin: "",
        twitter: "",
        instagram: "",
        facebook: "",
        tiktok: "",
        bio: "",
        statProjects: "",
        statLanguages: "",
        statCloud: "",
        resumeUrl: "",
        currentlyBuilding: [],
      });
    }

    const row = result.rows[0] as any;
    return json({
      id: row.id,
      name: row.name,
      tagline: row.tagline,
      location: row.location,
      email: row.email,
      github: row.github,
      linkedin: row.linkedin,
      twitter: row.twitter,
      instagram: row.instagram,
      facebook: row.facebook,
      tiktok: row.tiktok,
      bio: row.bio,
      statProjects: row.statProjects,
      statLanguages: row.statLanguages,
      statCloud: row.statCloud,
      resumeUrl: row.resumeUrl,
      currentlyBuilding: row.currentlyBuilding ? JSON.parse(row.currentlyBuilding) : [],
    });
  } catch (error) {
    return json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST /api/settings
export async function POST({ request }: { request: Request }) {
  try {
    const settings = (await request.json()) as SiteSettings;

    await db.execute({
      sql: `
        INSERT INTO settings (
          id, name, tagline, location, email, github, linkedin, twitter,
          instagram, facebook, tiktok, bio, statProjects, statLanguages,
          statCloud, resumeUrl, currentlyBuilding, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name, tagline = excluded.tagline,
          location = excluded.location, email = excluded.email,
          github = excluded.github, linkedin = excluded.linkedin,
          twitter = excluded.twitter, instagram = excluded.instagram,
          facebook = excluded.facebook, tiktok = excluded.tiktok,
          bio = excluded.bio, statProjects = excluded.statProjects,
          statLanguages = excluded.statLanguages, statCloud = excluded.statCloud,
          resumeUrl = excluded.resumeUrl, currentlyBuilding = excluded.currentlyBuilding,
          updatedAt = CURRENT_TIMESTAMP
      `,
      args: [
        "main",
        settings.name,
        settings.tagline,
        settings.location,
        settings.email,
        settings.github,
        settings.linkedin,
        settings.twitter,
        settings.instagram,
        settings.facebook,
        settings.tiktok,
        settings.bio,
        settings.statProjects,
        settings.statLanguages,
        settings.statCloud,
        settings.resumeUrl,
        JSON.stringify(settings.currentlyBuilding || []),
      ],
    });

    return json({ success: true });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Failed to save" },
      { status: 500 }
    );
  }
}
