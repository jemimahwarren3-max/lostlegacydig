import { useState } from "react";

export default function Submit() {
  const [kind, setKind] = useState("book");
  const [form, setForm] = useState({
    title: "",
    creatorName: "",
    creatorEmail: "",
    priceUSD: "",
    description: "",
    content: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="container">
        <div className="hero">
          <h1>Thank you — it's in the review queue</h1>
          <p className="sub">
            A reviewer checks every book and lesson before it goes live, so your catalog page will say
            "pending" until it's approved. We'll notify you at {form.creatorEmail} once it's verified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="hero" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">Share your work</p>
        <h1>Turn what you know into a book or a lesson</h1>
        <p className="sub">
          Every submission goes through a quick human review before it's shown publicly or sold, so
          buyers can trust the Verified badge.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <div>
          <label>What are you sharing?</label>
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="book">A heritage book</option>
            <option value="lesson">A Teach &amp; Earn lesson</option>
          </select>
        </div>
        <div>
          <label>Title</label>
          <input required value={form.title} onChange={(e) => update("title", e.target.value)} />
        </div>
        <div>
          <label>Your name</label>
          <input required value={form.creatorName} onChange={(e) => update("creatorName", e.target.value)} />
        </div>
        <div>
          <label>Your email</label>
          <input
            required
            type="email"
            value={form.creatorEmail}
            onChange={(e) => update("creatorEmail", e.target.value)}
          />
        </div>
        <div>
          <label>Price (USD){kind === "lesson" ? ", per month" : ""}</label>
          <input
            required
            type="number"
            min="0.5"
            step="0.5"
            value={form.priceUSD}
            onChange={(e) => update("priceUSD", e.target.value)}
          />
        </div>
        <div>
          <label>Short description (shown on the catalog page)</label>
          <textarea
            required
            style={{ minHeight: 80 }}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
        <div>
          <label>{kind === "book" ? "Full text" : "Lesson content (or a link to your video/PDF)"}</label>
          <textarea required value={form.content} onChange={(e) => update("content", e.target.value)} />
        </div>
        {error && <p className="notice">{error}</p>}
        <button className="btn" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting…" : "Submit for review"}
        </button>
      </form>
    </div>
  );
}
