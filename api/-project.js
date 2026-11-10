export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let url = process.env.TURSO_CONNECTION_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    if (!url || !token) {
      return res.status(400).json({ error: "Missing Turso credentials" });
    }

    // Convert libsql:// to https:// for HTTP API
    url = url.replace("libsql://", "https://");

    // Extract slug from query parameter: /api/project?slug=devpulse
    let slug = req.query?.slug || req.url.split("slug=")[1];
    
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
          { q: "SELECT * FROM projects WHERE slug = ?", params: [slug] }
        ],
      }),
    });

    const data = await response.json();
    const rows = data[0]?.results?.rows || [];
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const row = rows[0];
    const project = {
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
      learned: [],
      highlights: [],
    };

    res.status(200).json(project);
  } catch (error) {
    console.error("Project detail error:", error);
    res.status(500).json({ error: String(error) });
  }
}
