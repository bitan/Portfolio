export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, filename, buffer } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!type || !filename || !buffer) {
      return res.status(400).json({ error: "Missing type, filename, or buffer" });
    }

    // Determine MIME type based on type and filename
    let mimeType = "image/png";
    if (type === "video") {
      mimeType = "video/mp4";
    } else if (type === "logo" || type === "image") {
      // Detect from filename extension
      if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
        mimeType = "image/jpeg";
      } else if (filename.endsWith(".png")) {
        mimeType = "image/png";
      } else if (filename.endsWith(".svg")) {
        mimeType = "image/svg+xml";
      } else if (filename.endsWith(".gif")) {
        mimeType = "image/gif";
      } else if (filename.endsWith(".webp")) {
        mimeType = "image/webp";
      }
    }

    // For simplicity, we'll store as a data URL
    // The buffer should be base64 encoded from the frontend
    // This works immediately without requiring Vercel Blob setup

    const dataUrl = `data:${mimeType};base64,${buffer}`;

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
