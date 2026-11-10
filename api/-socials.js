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
            { q: "SELECT * FROM socials ORDER BY `order`" }
          ],
        }),
      });

      const data = await response.json();
      const rows = data[0]?.results?.rows || [];
      const socials = rows.map((row) => ({
        id: row[0],
        label: row[1],
        href: row[2],
      }));

      return res.status(200).json(socials);
    }

    if (method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { id, label, href } = body;

      if (!id || !label || !href) {
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
              q: `INSERT INTO socials (id, label, href, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                  ON CONFLICT(id) DO UPDATE SET label = excluded.label, href = excluded.href, updatedAt = CURRENT_TIMESTAMP`,
              params: [id, label, href]
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
            { q: "DELETE FROM socials WHERE id = ?", params: [id] }
          ],
        }),
      });

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Socials error:", error);
    res.status(500).json({ error: String(error) });
  }
}
