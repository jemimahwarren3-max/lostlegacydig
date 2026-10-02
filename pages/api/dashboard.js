import { getCreatorSummary } from "../../lib/db";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });
  const summary = getCreatorSummary(email);
  return res.status(200).json({ summary });
}
