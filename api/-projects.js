export default async function handler(req, res) {
  const { method } = req;

  try {
    let url = process.env.TURSO_CONNECTION_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    if (!url || !token) {
      return res.status(400).json({ error: "Missing Turso credentials" });
    }

    url = url.replace("libsql://", "https://");

    // GET - fetch all projects
    if (method === "GET") {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statements: [
            { q: "SELECT * FROM projects ORDER BY y DESC" }
          ],
        }),
      });

      const data = await response.json();
      const rows = data[0]?.results?.rows || [];
      const projects = rows.map((row) => ({
        slug: row[0],
        n: row[1],
        t: row[2],
        d: row[3],
        lang: row[4],
        y: row[5],
        url: row[6] || "",
        live: row[7] || "",
        category: row[8] || "",
        isPrivate: row[9],
        mediaUrl: row[10] || "",
        mediaType: row[11] || "",
        problem: row[12] || "",
        solution: row[13] || "",
        tags: [],
      }));

      return res.status(200).json(projects);
    }

    // POST - create/update project
    if (method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { slug, n, t, d, lang, y, url: pUrl, live, category, isPrivate, mediaUrl, mediaType, problem, solution } = body;

      if (!slug || !t || !d) {
        return res.status(400).json({ error: "Missing required fields: slug, t, d" });
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statements: [
            {
              q: `INSERT INTO projects (slug, n, t, d, lang, y, url, live, category, isPrivate, mediaUrl, mediaType, problem, solution, updatedAt)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                  ON CONFLICT(slug) DO UPDATE SET 
                    n = excluded.n, t = excluded.t, d = excluded.d, lang = excluded.lang,
                    y = excluded.y, url = excluded.url, live = excluded.live,
                    category = excluded.category, isPrivate = excluded.isPrivate,
                    mediaUrl = excluded.mediaUrl, mediaType = excluded.mediaType,
                    problem = excluded.problem, solution = excluded.solution,
                    updatedAt = CURRENT_TIMESTAMP`,
              params: [slug, n, t, d, lang, y, pUrl || "", live || "", category || "", isPrivate ? 1 : 0, mediaUrl || "", mediaType || "", problem || "", solution || ""]
            }
          ],
        }),
      });

      const result = await response.json();
      if (result[0]?.error) {
        return res.status(500).json({ error: result[0].error });
      }

      return res.status(201).json({ success: true, slug });
    }

    // DELETE - delete project
    if (method === "DELETE") {
      const slug = req.url.split("slug=")[1];
      if (!slug) {
        return res.status(400).json({ error: "Missing slug parameter" });
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statements: [
            { q: "DELETE FROM projects WHERE slug = ?", params: [slug] }
          ],
        }),
      });

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Projects error:", error);
    res.status(500).json({ error: String(error) });
  }
}
