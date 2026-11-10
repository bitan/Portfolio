export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let url = process.env.TURSO_CONNECTION_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    if (!url || !token) {
      return res.status(400).json({ error: "Missing Turso credentials" });
    }

    url = url.replace("libsql://", "https://");

    // Fetch counts from database
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        statements: [
          { q: "SELECT COUNT(*) as count FROM projects" },
          { q: "SELECT COUNT(*) as count FROM skills" },
          { q: "SELECT COUNT(*) as count FROM messages" },
          { q: "SELECT COUNT(*) as count FROM messages WHERE `read` = 0" },
          { q: "SELECT COUNT(*) as count FROM certificates" },
          { q: "SELECT COUNT(*) as count FROM testimonials" },
          { q: "SELECT name, email, createdAt FROM messages ORDER BY createdAt DESC LIMIT 5" },
        ],
      }),
    });

    const data = await response.json();
    
    const projectCount = data[0]?.results?.rows?.[0]?.[0] || 0;
    const skillCount = data[1]?.results?.rows?.[0]?.[0] || 0;
    const messageCount = data[2]?.results?.rows?.[0]?.[0] || 0;
    const unreadCount = data[3]?.results?.rows?.[0]?.[0] || 0;
    const certificateCount = data[4]?.results?.rows?.[0]?.[0] || 0;
    const testimonialCount = data[5]?.results?.rows?.[0]?.[0] || 0;
    const recentMessagesRows = data[6]?.results?.rows || [];

    const recentMessages = recentMessagesRows.map((row) => ({
      name: row[0] || "Unknown",
      email: row[1] || "unknown@example.com",
      createdAt: row[2],
    }));

    res.status(200).json({
      counts: {
        projects: projectCount,
        skills: skillCount,
        messages: messageCount,
        unread: unreadCount,
        certificates: certificateCount,
        testimonials: testimonialCount,
      },
      recentMessages,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: String(error) });
  }
}
