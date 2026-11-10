export default async function handler(req, res) {
  try {
    const url = process.env.TURSO_CONNECTION_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    if (!url || !token) {
      return res.status(400).json({ error: "Missing Turso credentials" });
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
    const skills = rows.map((row) => ({
      ...row,
      items: row.items ? JSON.parse(row.items).filter((i) => i.item) : [],
    }));
    res.status(200).json(skills);
  } catch (error) {
    console.error("Skills error:", error);
    res.status(500).json({ error: String(error) });
  }
}
