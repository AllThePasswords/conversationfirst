// Vercel serverless proxy for Google Fonts metadata (avoids CORS)
export default async function handler(req, res) {
  try {
    const response = await fetch("https://fonts.google.com/metadata/fonts");
    const data = await response.json();
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
    res.status(200).json(data);
  } catch {
    res.status(502).json({ error: "Failed to fetch Google Fonts metadata" });
  }
}
