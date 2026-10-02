import { markOrderPaid } from "../../../lib/db";
import { isPaynowConfigured } from "../../../lib/paynow";

// Demo-only: marks an order as paid without a real Paynow charge. This route
// only works while PAYNOW_INTEGRATION_ID/KEY are unset, so it can never be
// used to skip payment once the app is live with real credentials.
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (isPaynowConfigured()) {
    return res.status(403).json({ error: "Test confirmation disabled: live Paynow keys are set" });
  }
  const { orderId } = req.body;
  const order = markOrderPaid(orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });
  return res.status(200).json({ order });
}
