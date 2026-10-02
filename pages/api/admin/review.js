import { setItemStatus } from "../../../lib/db";
import { checkAdminPasscode } from "../../../lib/adminAuth";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { passcode, type, id, decision } = req.body;
  if (!checkAdminPasscode(passcode)) return res.status(401).json({ error: "Wrong passcode" });
  if (!["book", "lesson"].includes(type) || !["verified", "rejected"].includes(decision)) {
    return res.status(400).json({ error: "Invalid request" });
  }
  const item = setItemStatus(type, id, decision);
  if (!item) return res.status(404).json({ error: "Item not found" });
  return res.status(200).json({ item });
}
