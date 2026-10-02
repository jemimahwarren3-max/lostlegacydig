import { getPendingItems } from "../../../lib/db";
import { checkAdminPasscode } from "../../../lib/adminAuth";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { passcode } = req.body;
  if (!checkAdminPasscode(passcode)) return res.status(401).json({ error: "Wrong passcode" });
  return res.status(200).json({ items: getPendingItems() });
}
