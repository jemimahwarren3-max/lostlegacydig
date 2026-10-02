import { createOrder, attachPaynowReference, getBookById, getLessonById } from "../../lib/db";
import { getPaynow, isPaynowConfigured } from "../../lib/paynow";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { itemType, itemId, buyerName, buyerPhone, amountUSD } = req.body;

  if (!["book", "lesson"].includes(itemType)) {
    return res.status(400).json({ error: "Invalid item type" });
  }
  const item = itemType === "book" ? getBookById(itemId) : getLessonById(itemId);
  if (!item || item.status !== "verified") {
    return res.status(404).json({ error: "Item not found or not yet verified" });
  }
  if (!buyerName || !buyerPhone) {
    return res.status(400).json({ error: "Name and EcoCash number are required" });
  }

  const order = createOrder({ itemType, itemId, buyerName, buyerPhone, amountUSD });

  // Fallback: no Paynow keys configured yet (this is the default before your
  // merchant account is approved). Front end marks the order paid via
  // /api/checkout/confirm-test so the full flow stays demoable.
  if (!isPaynowConfigured()) {
    return res.status(200).json({ mode: "test", orderId: order.id });
  }

  try {
    const paynow = getPaynow();
    const payment = paynow.createPayment(`LostLegacy-Order-${order.id}`, undefined);
    payment.add(item.title, Number(amountUSD));

    const response = await paynow.sendMobile(payment, buyerPhone, "ecocash");

    if (!response.success) {
      return res.status(502).json({ error: response.error || "Paynow rejected the request" });
    }

    attachPaynowReference(order.id, response.pollUrl, response.pollUrl);

    return res.status(200).json({
      mode: "live",
      orderId: order.id,
      instructions: response.instructions,
      pollUrl: response.pollUrl,
    });
  } catch (err) {
    return res.status(500).json({ error: "Paynow request failed: " + err.message });
  }
}
