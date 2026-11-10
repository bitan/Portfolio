export default async function handler(req, res) {
  const { method } = req;

  try {
    let url = process.env.TURSO_CONNECTION_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    if (!url || !token) {
      return res.status(400).json({ error: "Missing Turso credentials" });
    }

    url = url.replace("libsql://", "https://");

    if (method === "GET") {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statements: [
            { q: "SELECT * FROM testimonials ORDER BY `order`" }
          ],
        }),
      });

      const data = await response.json();
      const rows = data[0]?.results?.rows || [];
      const testimonials = rows.map((row) => ({
        id: row[0],
        name: row[1],
        role: row[2],
        body: row[3],
        avatarUrl: row[4],
        order: row[5],
        createdAt: row[6],
      }));

      return res.status(200).json(testimonials);
    }

    if (method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { id, name, role, body: testimonialBody, avatarUrl, order } = body;

      if (!id || !name || !role || !testimonialBody) {
        return res.status(400).json({ error: "Missing required fields" });
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
              q: `INSERT INTO testimonials (id, name, role, body, avatarUrl, \`order\`, createdAt) 
                  VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                  ON CONFLICT(id) DO UPDATE SET name = excluded.name, role = excluded.role, 
                  body = excluded.body, avatarUrl = excluded.avatarUrl, \`order\` = excluded.\`order\``,
              params: [id, name, role, testimonialBody, avatarUrl || "", order || 0]
            }
          ],
        }),
      });

      return res.status(201).json({ success: true, id });
    }

    if (method === "DELETE") {
      const id = req.url.split("id=")[1];
      if (!id) return res.status(400).json({ error: "Missing id" });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statements: [
            { q: "DELETE FROM testimonials WHERE id = ?", params: [id] }
          ],
        }),
      });

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Testimonials error:", error);
    res.status(500).json({ error: String(error) });
  }
}
