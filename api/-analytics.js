export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Return empty analytics data
    res.status(200).json({
      counts: {
        projects: 5,
        skills: 8,
        messages: 0,
        testimonials: 0,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: String(error) });
  }
}
