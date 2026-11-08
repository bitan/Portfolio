import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export default async function handler(req, res) {
  try {
    const result = await db.execute("SELECT * FROM settings WHERE id = 'main'");
    const settings = result.rows[0] || {};
    res.status(200).json(settings);
  } catch (error) {
    console.error("Settings error:", error);
    res.status(500).json({ error: String(error) });
  }
}
