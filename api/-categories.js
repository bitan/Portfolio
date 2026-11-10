export default async function handler(req, res) {
  const { method } = req;

  try {
    let url = process.env.TURSO_CONNECTION_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    if (!url || !token) {
      return res.status(400).json({ error: "Missing Turso credentials" });
    }

    url = url.replace("libsql://", "https://");

    // GET - fetch all categories
    if (method === "GET") {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statements: [
            { q: "SELECT * FROM categories ORDER BY id" }
          ],
        }),
      });

      const data = await response.json();
      const rows = data[0]?.results?.rows || [];
      const categories = rows.map((row) => ({
        id: row[0],
        label: row[1],
        color: row[2],
      }));

      return res.status(200).json(categories);
    }

    // POST - create/update category
    if (method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { id, label, color } = body;

      if (!id || !label) {
        return res.status(400).json({ error: "Missing required fields: id, label" });
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
              q: `INSERT INTO categories (id, label, color, createdAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                  ON CONFLICT(id) DO UPDATE SET label = excluded.label, color = excluded.color`,
              params: [id, label, color || ""]
            }
          ],
        }),
      });

      const result = await response.json();
      if (result[0]?.error) {
        return res.status(500).json({ error: result[0].error });
      }

      return res.status(201).json({ success: true, id });
    }

    // DELETE - delete category
    if (method === "DELETE") {
      const id = req.url.split("id=")[1];
      if (!id) {
        return res.status(400).json({ error: "Missing id parameter" });
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statements: [
            { q: "DELETE FROM categories WHERE id = ?", params: [id] }
          ],
        }),
      });

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({ error: String(error) });
  }
}
