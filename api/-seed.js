export default async function handler(req, res) {
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
            {
              q: `INSERT INTO settings (
              id, name, tagline, location, email, github, linkedin, twitter,
              instagram, facebook, tiktok, bio, statProjects, statLanguages,
              statCloud, resumeUrl
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET name = excluded.name`,
              params: [
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
            },
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

    // Step 3: Seed projects and tags
    try {
      const projectsData = [
        {
          slug: "devpulse",
          n: "01",
          t: "DevPulse — AI Productivity Dashboard",
          lang: "TypeScript",
          tags: ["TypeScript", "Firebase", "Node.js", "React"],
          y: "2026",
          d: "A dual-purpose project: a Node.js CLI tool that tracks developer commands to Firebase Firestore, plus a React dashboard that visualizes that data.",
          url: "https://github.com/bitan/DevPulse-AI-Developer-Productivity-Dashboard",
          live: "https://dev-pulse-ai-developer-productivity.vercel.app/",
          category: "Web App",
          isPrivate: false,
          mediaUrl: "",
          mediaType: "",
          problem: "Developers have no passive way to see where their time actually goes. Most productivity tools require manual input — which defeats the purpose when you're deep in a flow state.",
          solution: "A CLI wrapper intercepts terminal commands and silently logs them to Firestore in real time. A React dashboard then visualises the data — commands run, time spent per tool, streaks, and productivity trends — without any manual effort from the developer.",
        },
        {
          slug: "road-app",
          n: "02",
          t: "Road App — Smart Transport System",
          lang: "TypeScript",
          tags: ["React", "Maps API", "TypeScript", "Routing"],
          y: "2026",
          d: "Solves traffic, transportation and road stress by revealing the best and most efficient routes to public transport users — real-time, intelligent navigation.",
          url: "https://github.com/bitan/road-app",
          live: "",
          category: "Web App",
          isPrivate: false,
          mediaUrl: "",
          mediaType: "",
          problem: "Public transport in Dire Dawa is opaque — users have no reliable way to know which route is fastest, how congested a road is, or when the next bus is coming.",
          solution: "A React web app that integrates a Maps API to surface optimal public transport routes in real time. The interface is designed mobile-first for low-bandwidth conditions, with clear route visualisation and estimated travel times.",
        },
        {
          slug: "haramaya-law-network",
          n: "03",
          t: "Haramaya Female Law Students Network",
          lang: "TypeScript",
          tags: ["TypeScript", "React", "UI/UX"],
          y: "2025",
          d: "An introductory website prototype built for the Haramaya Female Law Students & Legal Professionals Network club — clean, professional, and accessible.",
          url: "https://github.com/bitan/dignified-authority-network",
          live: "https://dignified-authority.vercel.app/",
          category: "Client Work",
          isPrivate: false,
          mediaUrl: "",
          mediaType: "",
          problem: "The club had no web presence — no way for prospective members, mentors, or partners to discover or contact them online.",
          solution: "A clean, professional static site that introduces the club, its mission, and its members. Designed in Figma first, then built in React with Tailwind CSS. Deployed to Vercel for zero-maintenance hosting.",
        },
        {
          slug: "bud-web",
          n: "04",
          t: "Budget Manager — bud-web",
          lang: "HTML/JS",
          tags: ["HTML", "CSS", "JavaScript"],
          y: "2025",
          d: "A company budget management website that tracks income, expenses, and financial summaries in a clean, accessible interface.",
          url: "https://github.com/bitan/bud-web",
          live: "",
          category: "Client Work",
          isPrivate: false,
          mediaUrl: "",
          mediaType: "",
          problem: "A small company was tracking its budget in spreadsheets — error-prone, hard to share, and impossible to visualise at a glance.",
          solution: "A vanilla HTML/CSS/JS web app with no framework overhead. Income and expenses are logged, categorised, and summarised. Financial totals update live as data is entered, keeping the UI snappy on low-end devices.",
        },
        {
          slug: "album-finder",
          n: "05",
          t: "Album Finder",
          lang: "JavaScript",
          tags: ["JavaScript", "Music API", "CSS"],
          y: "2025",
          d: "Search albums via a music API and save favorites to a personal collection. Clean UI with persistent local storage. Deployed on Railway.",
          url: "https://github.com/bitan/Album-Finder",
          live: "https://album-finder-production-fb96.up.railway.app/",
          category: "Personal",
          isPrivate: false,
          mediaUrl: "",
          mediaType: "",
          problem: "A personal itch — wanting a clean, minimal way to search for albums and keep a saved list without signing up for yet another service.",
          solution: "A JavaScript app that hits a music API, displays results with cover art and metadata, and lets you save favourites to local storage. Deployed on Railway for persistent uptime.",
        },
      ];

      const projectStatements = [];
      const projectArgs = [];

      for (const proj of projectsData) {
        projectStatements.push(
          `INSERT INTO projects (slug, n, t, lang, y, d, url, live, category, isPrivate, mediaUrl, mediaType, problem, solution)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(slug) DO UPDATE SET t = excluded.t, d = excluded.d`
        );
        projectArgs.push([
          proj.slug,
          proj.n,
          proj.t,
          proj.lang,
          proj.y,
          proj.d,
          proj.url,
          proj.live,
          proj.category,
          proj.isPrivate ? 1 : 0,
          proj.mediaUrl,
          proj.mediaType,
          proj.problem,
          proj.solution,
        ]);

        // Add tag insertions
        for (const tag of proj.tags) {
          projectStatements.push(
            `INSERT INTO project_tags (projectSlug, tag) VALUES (?, ?)
             ON CONFLICT(projectSlug, tag) DO NOTHING`
          );
          projectArgs.push([proj.slug, tag]);
        }
      }

      if (projectStatements.length > 0) {
        // Build request with proper Turso HTTP API format: { q, params }
        const requestStatements = [];
        for (let i = 0; i < projectStatements.length; i++) {
          requestStatements.push({
            q: projectStatements[i],
            params: projectArgs[i] || [],
          });
        }

        const projectsResponse = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            statements: requestStatements,
          }),
        });

        if (projectsResponse.ok) {
          console.log(`[SEED] ${projectsData.length} projects and ${projectArgs.length - projectsData.length} tags inserted`);
        } else {
          const error = await projectsResponse.text();
          console.warn("[SEED] Projects insert failed:", error.substring(0, 100));
        }
      }
    } catch (e) {
      console.warn("[SEED] Projects error:", String(e).substring(0, 100));
    }

    console.log("[SEED] Seed complete");
    return res.status(200).json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    console.error("[SEED] Fatal error:", error);
    return res.status(500).json({ success: false, error: String(error) });
  }
}
