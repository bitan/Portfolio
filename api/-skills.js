const { createClient } = require("@libsql/client");

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

module.exports = async function handler(req, res) {
  try {
    const result = await db.execute(`
      SELECT s.id, s.t, s.\`order\`, 
             json_group_array(json_object('id', si.id, 'item', si.item, 'logoUrl', si.logoUrl, 'order', si.\`order\`)) as items
      FROM skills s
      LEFT JOIN skill_items si ON s.id = si.skillId
      GROUP BY s.id
      ORDER BY s.\`order\`
    `);
    const skills = (result.rows || []).map((row) => ({
      ...row,
      items: row.items ? JSON.parse(row.items).filter((i) => i.item) : [],
    }));
    res.status(200).json(skills);
  } catch (error) {
    console.error("Skills error:", error);
    res.status(500).json({ error: String(error) });
  }
};
