/**
 * Turso database client
 * Connects to LibSQL database at turso.tech
 */

import { createClient } from "@libsql/client";

// Get credentials from environment
const tursoUrl = process.env.TURSO_CONNECTION_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
  throw new Error(
    "Missing Turso credentials. Set TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN in .env"
  );
}

export const db = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

// Type helpers
export type ExecuteResult = Awaited<ReturnType<typeof db.execute>>;
export type Row = ExecuteResult["rows"][number];

// Seed database with default data
export async function seedTurso(): Promise<void> {
  const { projects: staticProjects } = await import("@/data/projects");
  const { skills: staticSkills, proficiencies: staticProficiencies } = await import("@/data/static");

  // Seed projects
  for (let i = 0; i < staticProjects.length; i++) {
    const p = staticProjects[i];
    await db.execute({
      sql: `
        INSERT OR IGNORE INTO projects (
          slug, n, t, d, lang, y, url, live, category, isPrivate, mediaUrl, mediaType, problem, solution
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        p.slug,
        p.n,
        p.t,
        p.d,
        p.lang,
        p.y,
        p.url || "",
        p.live || "",
        p.category || "",
        p.isPrivate ? 1 : 0,
        p.mediaUrl || "",
        p.mediaType || "",
        p.problem || "",
        p.solution || "",
      ],
    });

    // Insert tags
    for (const tag of p.tags || []) {
      await db.execute({
        sql: "INSERT OR IGNORE INTO project_tags (projectSlug, tag) VALUES (?, ?)",
        args: [p.slug, tag],
      });
    }
  }

  // Seed categories
  const defaultCategories = [
    { label: "Web App", color: "#3b82f6", order: 0 },
    { label: "UI/UX", color: "#a855f7", order: 1 },
    { label: "Client Work", color: "#f59e0b", order: 2 },
    { label: "Open Source", color: "#22c55e", order: 3 },
    { label: "Personal", color: "#ec4899", order: 4 },
    { label: "Systems", color: "#ef4444", order: 5 },
  ];

  for (const c of defaultCategories) {
    const id = c.label.toLowerCase().replace(/[\s/]+/g, "-");
    await db.execute({
      sql: "INSERT OR IGNORE INTO categories (id, label, color) VALUES (?, ?, ?)",
      args: [id, c.label, c.color],
    });
  }

  // Seed skills
  for (let i = 0; i < staticSkills.length; i++) {
    const s = staticSkills[i];
    const id = s.t.toLowerCase().replace(/\s+/g, "-");
    await db.execute({
      sql: "INSERT OR IGNORE INTO skills (id, t, `order`) VALUES (?, ?, ?)",
      args: [id, s.t, i],
    });

    // Insert skill items
    for (let j = 0; j < (s.items || []).length; j++) {
      const item = s.items[j];
      await db.execute({
        sql: "INSERT OR IGNORE INTO skill_items (skillId, item, `order`) VALUES (?, ?, ?)",
        args: [id, item, j],
      });
    }
  }

  // Seed proficiencies
  for (let i = 0; i < staticProficiencies.length; i++) {
    const p = staticProficiencies[i];
    const id = p.name.toLowerCase().replace(/[\s/]+/g, "-");
    await db.execute({
      sql: "INSERT OR IGNORE INTO proficiencies (id, name, pct, color, `order`) VALUES (?, ?, ?, ?, ?)",
      args: [id, p.name, p.pct, p.color, i],
    });
  }

  // Seed settings
  await db.execute({
    sql: `
      INSERT OR IGNORE INTO settings (
        id, name, tagline, location, email, github, linkedin, twitter,
        instagram, facebook, tiktok, bio, statProjects, statLanguages,
        statCloud, resumeUrl
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      "main",
      "Bitanya Tigabe",
      "Full-Stack Developer",
      "Dire Dawa · Ethiopia",
      "btsarmybita95@gmail.com",
      "https://github.com/bitan",
      "https://linkedin.com/in/bitanya-tigabe",
      "https://x.com/@nabilara976",
      "https://instagram.com/nabilara24",
      "https://facebook.com/SuziBi",
      "https://tiktok.com/@bita186",
      "I'm a self-taught full-stack developer based in Dire Dawa, Ethiopia. I build web apps, tools, and experiences — from UI design to backend logic.",
      "10+",
      "8+",
      "4+",
      "",
    ],
  });
}
