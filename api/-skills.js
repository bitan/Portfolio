export default async function handler(req, res) {
  const { method } = req;

  try {
    let url = process.env.TURSO_CONNECTION_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    if (!url || !token) {
      return res.status(400).json({ error: "Missing Turso credentials" });
    }

    url = url.replace("libsql://", "https://");

    // GET - fetch all skills with items
    if (method === "GET") {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statements: [
            {
              q: `SELECT s.id, s.t, s.\`order\`, 
                 json_group_array(json_object('id', si.id, 'item', si.item, 'logoUrl', si.logoUrl, 'order', si.\`order\`)) as items
              FROM skills s
              LEFT JOIN skill_items si ON s.id = si.skillId
              GROUP BY s.id
              ORDER BY s.\`order\``
            }
          ],
        }),
      });

      const data = await response.json();
      const rows = data[0]?.results?.rows || [];
      const skills = rows.map((row) => {
        try {
          let items = [];
          if (row[3] && typeof row[3] === 'string' && row[3] !== 'null' && row[3].length > 2) {
            const parsed = JSON.parse(row[3]);
            if (Array.isArray(parsed)) {
              items = parsed.filter((i) => i && i.item).map((i) => i.item);
            }
          }
          return {
            id: row[0] || "",
            t: row[1] || "",
            order: row[2] !== undefined ? row[2] : 0,
            items: items || [],
            logos: {},
          };
        } catch (e) {
          console.error("Error parsing skill items:", e, "row:", row);
          return {
            id: row[0] || "",
            t: row[1] || "",
            order: row[2] !== undefined ? row[2] : 0,
            items: [],
            logos: {},
          };
        }
      });

      return res.status(200).json(skills || []);
    }

    // POST - create/update skill
    if (method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { id, t, order } = body;

      if (!id || !t) {
        return res.status(400).json({ error: "Missing required fields: id, t" });
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
              q: `INSERT INTO skills (id, t, \`order\`, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                  ON CONFLICT(id) DO UPDATE SET t = excluded.t, \`order\` = excluded.\`order\`, updatedAt = CURRENT_TIMESTAMP`,
              params: [id, t, order || 0]
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

    // DELETE - delete skill
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
            { q: "DELETE FROM skills WHERE id = ?", params: [id] }
          ],
        }),
      });

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Skills error:", error);
    res.status(500).json([]);
  }
}
