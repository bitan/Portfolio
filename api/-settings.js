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
          { q: "SELECT * FROM settings WHERE id = 'main'" }
        ],
      }),
    });

    const data = await response.json();
    const rows = data[0]?.results?.rows || [];
    const row = rows[0];
    
    // If no settings found, return defaults
    if (!row || !Array.isArray(row)) {
      return res.status(200).json({
        id: "main",
        name: "Bitanya Tigabe",
        tagline: "Full-Stack Developer",
        location: "Dire Dawa · Ethiopia",
        email: "btsarmybita95@gmail.com",
      });
    }
    
    // Map row to object (assuming column order from CREATE TABLE)
    const settings = {
      id: row[0],
      name: row[1],
      tagline: row[2],
      location: row[3],
      email: row[4],
      github: row[5],
      linkedin: row[6],
      twitter: row[7],
      instagram: row[8],
      facebook: row[9],
      tiktok: row[10],
      bio: row[11],
      statProjects: row[12],
      statLanguages: row[13],
      statCloud: row[14],
      resumeUrl: row[15],
    };
    
    res.status(200).json(settings);
  } catch (error) {
    console.error("Settings error:", error);
    res.status(500).json({ error: String(error) });
  }
}
