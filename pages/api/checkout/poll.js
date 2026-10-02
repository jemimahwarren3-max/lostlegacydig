import { getOrderById, markOrderPaid } from "../../../lib/db";
import { getPaynow } from "../../../lib/paynow";

// Call this from the front end once the buyer confirms they approved the
// EcoCash prompt on their phone, to check real payment status with Paynow.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { orderId } = req.body;
  const order = getOrderById(orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (!order.pollUrl) return res.status(400).json({ error: "No Paynow poll URL on this order" });

  const paynow = getPaynow();
  if (!paynow) return res.status(400).json({ error: "Paynow not configured" });

  const status = await paynow.pollTransaction(order.pollUrl);
  if (status.paid()) {
    const updated = markOrderPaid(orderId);
    return res.status(200).json({ paid: true, order: updated });
  }
  return res.status(200).json({ paid: false });
}
