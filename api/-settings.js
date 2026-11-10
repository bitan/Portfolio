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
          { q: "SELECT * FROM settings WHERE id = 'main'" }
        ],
      }),
    });

    const data = await response.json();
    const settings = data[0]?.results?.rows?.[0] || {};
    res.status(200).json(settings);
  } catch (error) {
    console.error("Settings error:", error);
    res.status(500).json({ error: String(error) });
  }
}
