export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, filename, buffer } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!type || !filename || !buffer) {
      return res.status(400).json({ error: "Missing type, filename, or buffer" });
    }

    // For simplicity, we'll store as a data URL
    // The buffer should be base64 encoded from the frontend
    // This works immediately without requiring Vercel Blob setup

    const dataUrl = `data:${type === "video" ? "video/mp4" : "image/png"};base64,${buffer}`;

    return res.status(200).json({
      success: true,
      url: dataUrl,
      filename: filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: String(error) });
  }
}
