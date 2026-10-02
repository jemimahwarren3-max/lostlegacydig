import { useState } from "react";

export default function Admin() {
  const [passcode, setPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  async function load(pc) {
    setError("");
    const res = await fetch("/api/admin/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: pc }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load");
      return false;
    }
    setItems(data.items);
    return true;
  }

  async function handleUnlock(e) {
    e.preventDefault();
    const ok = await load(passcode);
    if (ok) setUnlocked(true);
  }

  async function review(type, id, decision) {
    const res = await fetch("/api/admin/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode, type, id, decision }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed");
      return;
    }
    load(passcode);
  }

  if (!unlocked) {
    return (
      <div className="container">
        <div className="hero">
          <p className="eyebrow">Admin</p>
          <h1>Verification queue</h1>
          <p className="sub">Reviewer access only.</p>
        </div>
        <form onSubmit={handleUnlock}>
          <div>
            <label>Passcode</label>
            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} />
          </div>
          {error && <p className="notice">{error}</p>}
          <button className="btn" type="submit">
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="hero" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">Admin</p>
        <h1>Verification queue</h1>
        <p className="sub">{items.length} item(s) waiting for review.</p>
      </div>
      {error && <p className="notice">{error}</p>}
      {items.map((item) => (
        <div className="panel" key={`${item.type}-${item.id}`}>
          <span className="badge-pending">⏳ Pending</span>
          <h3>{item.title}</h3>
          <p className="meta">
            {item.type === "book" ? "Book" : "Lesson"} · by {item.authorName || item.teacherName} (
            {item.authorEmail || item.teacherEmail}) · ${Number(item.priceUSD).toFixed(2)}
          </p>
          <p className="desc">{item.description}</p>
          <details>
            <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Full content</summary>
            <div className="reader-text" style={{ marginTop: 10 }}>
              {item.content}
            </div>
          </details>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button className="btn" onClick={() => review(item.type, item.id, "verified")}>
              Approve &amp; Verify
            </button>
            <button className="btn btn-danger" onClick={() => review(item.type, item.id, "rejected")}>
              Reject
            </button>
          </div>
        </div>
      ))}
      {items.length === 0 && <p>Nothing waiting — queue is clear.</p>}
    </div>
  );
}
