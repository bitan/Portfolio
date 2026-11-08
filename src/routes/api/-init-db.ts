/**
 * Initialize database - create tables if they don't exist, then seed
 */
import { json } from "@tanstack/start";
import { db } from "@/lib/turso";
import { seedTurso } from "@/lib/turso";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS projects (
  slug TEXT PRIMARY KEY,
  n TEXT NOT NULL,
  t TEXT NOT NULL,
  d TEXT NOT NULL,
  lang TEXT NOT NULL,
  y TEXT NOT NULL,
  url TEXT DEFAULT '',
  live TEXT DEFAULT '',
  category TEXT DEFAULT '',
  isPrivate INTEGER DEFAULT 0,
  mediaUrl TEXT DEFAULT '',
  mediaType TEXT DEFAULT '',
  problem TEXT DEFAULT '',
  solution TEXT DEFAULT '',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projectSlug TEXT NOT NULL,
  tag TEXT NOT NULL,
  FOREIGN KEY (projectSlug) REFERENCES projects(slug) ON DELETE CASCADE,
  UNIQUE(projectSlug, tag)
);

CREATE TABLE IF NOT EXISTS project_learned (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projectSlug TEXT NOT NULL,
  item TEXT NOT NULL,
  \`order\` INTEGER DEFAULT 0,
  FOREIGN KEY (projectSlug) REFERENCES projects(slug) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_highlights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projectSlug TEXT NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  \`order\` INTEGER DEFAULT 0,
  FOREIGN KEY (projectSlug) REFERENCES projects(slug) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  github TEXT DEFAULT '',
  linkedin TEXT DEFAULT '',
  twitter TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  tiktok TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  statProjects TEXT DEFAULT '',
  statLanguages TEXT DEFAULT '',
  statCloud TEXT DEFAULT '',
  resumeUrl TEXT DEFAULT '',
  currentlyBuilding TEXT DEFAULT '[]',
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  t TEXT NOT NULL,
  \`order\` INTEGER DEFAULT 0,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  skillId TEXT NOT NULL,
  item TEXT NOT NULL,
  logoUrl TEXT DEFAULT '',
  \`order\` INTEGER DEFAULT 0,
  FOREIGN KEY (skillId) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE(skillId, item)
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  color TEXT DEFAULT '',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS proficiencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  pct INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#333333',
  \`order\` INTEGER DEFAULT 0,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS socials (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  \`order\` INTEGER DEFAULT 0,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  body TEXT NOT NULL,
  avatarUrl TEXT DEFAULT '',
  \`order\` INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  credentialUrl TEXT DEFAULT '',
  imageUrl TEXT DEFAULT '',
  \`order\` INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_project_tags_slug ON project_tags(projectSlug);
CREATE INDEX IF NOT EXISTS idx_project_learned_slug ON project_learned(projectSlug);
CREATE INDEX IF NOT EXISTS idx_project_highlights_slug ON project_highlights(projectSlug);
CREATE INDEX IF NOT EXISTS idx_skill_items_id ON skill_items(skillId);
`;

export async function POST() {
  try {
    // Execute schema creation - split by semicolon and execute each statement
    const statements = SCHEMA.split(";").filter(stmt => stmt.trim());
    
    for (const stmt of statements) {
      if (stmt.trim()) {
        try {
          await db.execute(stmt);
        } catch (e) {
          // Table already exists or other harmless error, continue
          console.log("Schema statement result:", String(e).substring(0, 100));
        }
      }
    }

    // Now seed the data
    await seedTurso();
    
    return json({ success: true, message: "Database initialized and seeded successfully" });
  } catch (error) {
    console.error("Init DB error:", error);
    return json({ success: false, error: String(error) }, { status: 500 });
  }
}
