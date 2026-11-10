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
        // row[3] is the items JSON string
        if (row[3] && typeof row[3] === 'string' && row[3] !== 'null' && row[3].length > 2) {
          const parsed = JSON.parse(row[3]);
          if (Array.isArray(parsed)) {
            items = parsed.filter((i) => i && i.item);
          }
        }
        return {
          id: row[0] || "",
          t: row[1] || "",
          order: row[2] || 0,
          items: items,
          logos: {},
        };
      } catch (e) {
        // If parsing fails, return with empty items
        return {
          id: row[0] || "",
          t: row[1] || "",
          order: row[2] || 0,
          items: [],
          logos: {},
        };
      }
    });
    
    res.status(200).json(skills || []);
  } catch (error) {
    console.error("Skills error:", error);
    res.status(500).json([]);
  }
}
