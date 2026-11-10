export default async function handler(req, res) {
  try {
    let url = process.env.TURSO_CONNECTION_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    if (!url || !token) {
      return res.status(400).json({ error: "Missing Turso credentials" });
    }

    // Convert libsql:// to https:// for HTTP API
    url = url.replace("libsql://", "https://");

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
    
    // Map rows to objects with proper field names
    // Column order from schema: slug, n, t, d, lang, y, url, live, category, isPrivate, mediaUrl, mediaType, problem, solution, createdAt, updatedAt
    const projects = rows.map((row) => {
      if (!Array.isArray(row) || row.length < 5) return null;
      return {
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
      };
    }).filter(Boolean);
    
    res.status(200).json(projects);
  } catch (error) {
    console.error("Projects error:", error);
    res.status(500).json({ error: String(error) });
  }
}
