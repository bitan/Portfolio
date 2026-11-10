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
            { q: "SELECT * FROM certificates ORDER BY date DESC" }
          ],
        }),
      });

      const data = await response.json();
      const rows = data[0]?.results?.rows || [];
      const certificates = rows.map((row) => ({
        id: row[0],
        title: row[1],
        issuer: row[2],
        date: row[3],
        category: row[4],
        credentialUrl: row[5],
        imageUrl: row[6],
        createdAt: row[7],
      }));

      return res.status(200).json(certificates);
    }

    if (method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { id, title, issuer, date, category, credentialUrl, imageUrl } = body;

      if (!id || !title || !issuer || !date || !category) {
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
              q: `INSERT INTO certificates (id, title, issuer, date, category, credentialUrl, imageUrl, createdAt) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                  ON CONFLICT(id) DO UPDATE SET title = excluded.title, issuer = excluded.issuer, 
                  date = excluded.date, category = excluded.category, credentialUrl = excluded.credentialUrl,
                  imageUrl = excluded.imageUrl`,
              params: [id, title, issuer, date, category, credentialUrl || "", imageUrl || ""]
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
            { q: "DELETE FROM certificates WHERE id = ?", params: [id] }
          ],
        }),
      });

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Certificates error:", error);
    res.status(500).json({ error: String(error) });
  }
}
