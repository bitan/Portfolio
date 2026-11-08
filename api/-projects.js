const { createClient } = require("@libsql/client");

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

module.exports = async function handler(req, res) {
  try {
    const result = await db.execute("SELECT * FROM projects ORDER BY y DESC");
    res.status(200).json(result.rows || []);
  } catch (error) {
    console.error("Projects error:", error);
    res.status(500).json({ error: String(error) });
  }
};
