module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const url = process.env.TURSO_CONNECTION_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    if (!url || !token) {
      console.error("[SEED] Missing env vars");
      return res.status(400).json({ success: false, error: "Missing Turso credentials" });
    }

    console.log("[SEED] Starting database seed...");

    // Step 1: Create tables one by one to avoid issues
    const tables = [
      `CREATE TABLE IF NOT EXISTS projects (
        slug TEXT PRIMARY KEY, n TEXT NOT NULL, t TEXT NOT NULL, d TEXT NOT NULL,
        lang TEXT NOT NULL, y TEXT NOT NULL, url TEXT DEFAULT '', live TEXT DEFAULT '',
        category TEXT DEFAULT '', isPrivate INTEGER DEFAULT 0, mediaUrl TEXT DEFAULT '',
        mediaType TEXT DEFAULT '', problem TEXT DEFAULT '', solution TEXT DEFAULT '',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS project_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT, projectSlug TEXT NOT NULL, tag TEXT NOT NULL,
        FOREIGN KEY (projectSlug) REFERENCES projects(slug) ON DELETE CASCADE,
        UNIQUE(projectSlug, tag)
      )`,
      `CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, tagline TEXT NOT NULL,
        location TEXT NOT NULL, email TEXT NOT NULL, github TEXT DEFAULT '', linkedin TEXT DEFAULT '',
        twitter TEXT DEFAULT '', instagram TEXT DEFAULT '', facebook TEXT DEFAULT '', tiktok TEXT DEFAULT '',
        bio TEXT DEFAULT '', statProjects TEXT DEFAULT '', statLanguages TEXT DEFAULT '',
        statCloud TEXT DEFAULT '', resumeUrl TEXT DEFAULT '',
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS skills (
        id TEXT PRIMARY KEY, t TEXT NOT NULL, \`order\` INTEGER DEFAULT 0,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS skill_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT, skillId TEXT NOT NULL, item TEXT NOT NULL,
        logoUrl TEXT DEFAULT '', \`order\` INTEGER DEFAULT 0,
        FOREIGN KEY (skillId) REFERENCES skills(id) ON DELETE CASCADE, UNIQUE(skillId, item)
      )`,
      `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY, label TEXT NOT NULL, color TEXT DEFAULT '',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS proficiencies (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, pct INTEGER NOT NULL DEFAULT 0,
        color TEXT DEFAULT '#333333', \`order\` INTEGER DEFAULT 0,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS socials (
        id TEXT PRIMARY KEY, label TEXT NOT NULL, href TEXT NOT NULL, \`order\` INTEGER DEFAULT 0,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL,
        read INTEGER DEFAULT 0, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, body TEXT NOT NULL,
        avatarUrl TEXT DEFAULT '', \`order\` INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS certificates (
        id TEXT PRIMARY KEY, title TEXT NOT NULL, issuer TEXT NOT NULL, date TEXT NOT NULL,
        category TEXT NOT NULL, credentialUrl TEXT DEFAULT '', imageUrl TEXT DEFAULT '',
        \`order\` INTEGER DEFAULT 0, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    ];

    let tablesCreated = 0;
    for (const sql of tables) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ statements: [sql] }),
        });

        if (response.ok) {
          tablesCreated++;
          console.log(`[SEED] Table ${tablesCreated}/${tables.length} created`);
        } else {
          const error = await response.text();
          console.warn(`[SEED] Table creation skipped (may already exist):`, error.substring(0, 100));
        }
      } catch (e) {
        console.warn(`[SEED] Table creation error (skipping):`, String(e).substring(0, 100));
      }
    }

    console.log(`[SEED] ${tablesCreated}/${tables.length} tables ready`);

    // Step 2: Seed default settings
    try {
      const settingsResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statements: [
            `INSERT INTO settings (
              id, name, tagline, location, email, github, linkedin, twitter,
              instagram, facebook, tiktok, bio, statProjects, statLanguages,
              statCloud, resumeUrl
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET name = excluded.name`,
          ],
          args: [
            [
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
              "I'm a self-taught full-stack developer based in Dire Dawa, Ethiopia.",
              "10+",
              "8+",
              "4+",
              "",
            ],
          ],
        }),
      });

      if (settingsResponse.ok) {
        console.log("[SEED] Default settings inserted");
      } else {
        const error = await settingsResponse.text();
        console.warn("[SEED] Settings insert failed:", error.substring(0, 100));
      }
    } catch (e) {
      console.warn("[SEED] Settings error:", String(e).substring(0, 100));
    }

    console.log("[SEED] Seed complete");
    return res.status(200).json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    console.error("[SEED] Fatal error:", error);
    return res.status(500).json({ success: false, error: String(error) });
  }
};
