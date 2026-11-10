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
            { q: "SELECT * FROM messages ORDER BY createdAt DESC" }
          ],
        }),
      });

      const data = await response.json();
      const rows = data[0]?.results?.rows || [];
      const messages = rows.map((row) => ({
        id: row[0],
        name: row[1],
        email: row[2],
        message: row[3],
        read: row[4],
        createdAt: row[5],
      }));

      return res.status(200).json(messages);
    }

    if (method === "PATCH") {
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
            { q: "UPDATE messages SET `read` = 1 WHERE id = ?", params: [id] }
          ],
        }),
      });

      return res.status(200).json({ success: true });
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
            { q: "DELETE FROM messages WHERE id = ?", params: [id] }
          ],
        }),
      });

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Messages error:", error);
    res.status(500).json({ error: String(error) });
  }
}
