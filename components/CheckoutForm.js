import { useState } from "react";

export default function CheckoutForm({ itemType, itemId, amountUSD, onPaid }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | awaiting | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, itemId, buyerName: name, buyerPhone: phone, amountUSD }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.mode === "test") {
        // No live Paynow keys configured yet: this is the fallback that still lets
        // you demo the full flow before the merchant account is approved.
        setStatus("awaiting");
        setMessage("Test mode: no live Paynow keys yet. Marking this as paid for demo purposes.");
        await fetch("/api/checkout/confirm-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderId }),
        });
        setStatus("idle");
        onPaid();
        return;
      }

      // Live mode: redirect to Paynow's EcoCash USSD prompt / payment page.
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      setStatus("awaiting");
      setMessage("Check your phone for the EcoCash prompt, then come back and refresh.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Your name</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chipo Ncube" />
      </div>
      <div>
        <label>EcoCash number</label>
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="07xxxxxxxx"
          pattern="0[0-9]{9}"
          title="10-digit Zimbabwean mobile number starting with 0"
        />
      </div>
      <button className="btn" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending prompt…" : `Pay $${amountUSD.toFixed(2)} by EcoCash`}
      </button>
      {message && <p className="notice">{message}</p>}
    </form>
  );
}
