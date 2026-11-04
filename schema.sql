-- Portfolio Database Schema for Turso/LibSQL
-- Run this to set up the database

-- Projects table
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

-- Project tags (normalized)
CREATE TABLE IF NOT EXISTS project_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projectSlug TEXT NOT NULL,
  tag TEXT NOT NULL,
  FOREIGN KEY (projectSlug) REFERENCES projects(slug) ON DELETE CASCADE,
  UNIQUE(projectSlug, tag)
);

-- Project learned items
CREATE TABLE IF NOT EXISTS project_learned (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projectSlug TEXT NOT NULL,
  item TEXT NOT NULL,
  `order` INTEGER DEFAULT 0,
  FOREIGN KEY (projectSlug) REFERENCES projects(slug) ON DELETE CASCADE
);

-- Project highlights
CREATE TABLE IF NOT EXISTS project_highlights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projectSlug TEXT NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  `order` INTEGER DEFAULT 0,
  FOREIGN KEY (projectSlug) REFERENCES projects(slug) ON DELETE CASCADE
);

-- Settings table
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
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  t TEXT NOT NULL,
  `order` INTEGER DEFAULT 0,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Skill items
CREATE TABLE IF NOT EXISTS skill_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  skillId TEXT NOT NULL,
  item TEXT NOT NULL,
  logoUrl TEXT DEFAULT '',
  `order` INTEGER DEFAULT 0,
  FOREIGN KEY (skillId) REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE(skillId, item)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  color TEXT DEFAULT '',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_project_tags_slug ON project_tags(projectSlug);
CREATE INDEX IF NOT EXISTS idx_project_learned_slug ON project_learned(projectSlug);
CREATE INDEX IF NOT EXISTS idx_project_highlights_slug ON project_highlights(projectSlug);
CREATE INDEX IF NOT EXISTS idx_skill_items_id ON skill_items(skillId);
